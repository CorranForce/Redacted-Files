from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import base64
import re
import io
import uuid
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.chat import ImageContent
import PyPDF2

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def extract_pdf_text(file_bytes):
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    return "".join(page.extract_text() or "" for page in reader.pages)


def parse_json_safe(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'[\[{].*[\]}]', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
    return None


class GeneratePostRequest(BaseModel):
    session_id: str
    platform: str
    findings: List[str]


class GenerateImageRequest(BaseModel):
    post_id: str
    post_text: str
    platform: str


@api_router.get("/")
async def root():
    return {"message": "REDACTED API", "status": "operational"}


@api_router.post("/analyze")
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    doc_text = ""
    doc_name = "Pasted Text"

    if file:
        content = await file.read()
        doc_name = file.filename or "Uploaded File"
        if file.filename and file.filename.lower().endswith('.pdf'):
            doc_text = extract_pdf_text(content)
        else:
            doc_text = content.decode('utf-8', errors='ignore')
    elif text:
        doc_text = text

    if not doc_text or not doc_text.strip():
        raise HTTPException(400, "No text could be extracted from the document")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"analyze-{uuid.uuid4()}",
        system_message=(
            "You are an expert analyst of declassified government documents. "
            "Your job is to find the most shocking, mind-blowing revelations.\n\n"
            "Focus on: secret programs, cover-ups, surprising connections, "
            "conspiracy-worthy details that are real, anything that makes people say 'WAIT, WHAT?!'\n\n"
            "Return EXACTLY 5 findings as a JSON array of strings. "
            "Each should be 1-2 punchy sentences max. Make them viral-worthy.\n"
            "Return ONLY the JSON array, no markdown, no explanation."
        )
    ).with_model("openai", "gpt-5.2")

    truncated = doc_text[:15000]
    response = await chat.send_message(UserMessage(
        text=f"Analyze this declassified document and extract 5 mind-blowing revelations:\n\n{truncated}"
    ))

    parsed = parse_json_safe(response)
    findings = parsed if isinstance(parsed, list) else [response]
    findings = [str(f) for f in findings[:5]]

    session_id = str(uuid.uuid4())
    session_doc = {
        "id": session_id,
        "document_name": doc_name,
        "document_preview": doc_text[:500],
        "findings": findings,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.sessions.insert_one({**session_doc})

    return {"id": session_id, "document_name": doc_name, "findings": findings}


@api_router.post("/generate-post")
async def generate_post(req: GeneratePostRequest):
    session = await db.sessions.find_one({"id": req.session_id}, {"_id": 0})
    doc_context = session.get("document_preview", "") if session else ""

    platform_guides = {
        "facebook": (
            "Facebook post: Attention-grabbing hook, 2-3 paragraphs, "
            "thought-provoking question at end, sparse emojis, 3-5 hashtags, "
            "150-300 words, informative but shocking."
        ),
        "instagram": (
            "Instagram caption: Bold first line (shows in preview), line breaks, "
            "facts+commentary, CTA (save/share), emojis, 10-15 hashtags after "
            "a line break, 100-200 words, edgy and mysterious."
        ),
        "twitter": (
            "Twitter/X post: Hook that stops scrolling, short punchy sentences, "
            "most shocking fact first, under 280 characters for main tweet, "
            "2-3 inline hashtags, urgent and revelatory. Format as thread "
            "with 1/ 2/ 3/ if needed."
        )
    }

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"post-{uuid.uuid4()}",
        system_message=(
            f"You create viral social media posts about declassified government secrets.\n"
            f"Platform style: {platform_guides.get(req.platform, platform_guides['twitter'])}\n\n"
            f"Return JSON: {{\"post_text\": \"...\", \"hashtags\": [\"tag1\", \"tag2\"]}}\n"
            f"Return ONLY the JSON, no markdown."
        )
    ).with_model("openai", "gpt-5.2")

    findings_text = json.dumps(req.findings)
    response = await chat.send_message(UserMessage(
        text=f"Create a viral {req.platform} post from these declassified findings:\n{findings_text}\n\nDocument context: {doc_context}"
    ))

    parsed = parse_json_safe(response)
    if isinstance(parsed, dict):
        post_text = parsed.get("post_text", response)
        hashtags = parsed.get("hashtags", [])
    else:
        post_text = response
        hashtags = []

    post_id = str(uuid.uuid4())
    post_doc = {
        "id": post_id,
        "session_id": req.session_id,
        "platform": req.platform,
        "post_text": post_text,
        "hashtags": hashtags,
        "image_base64": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.posts.insert_one({**post_doc})

    return {
        "id": post_id,
        "platform": req.platform,
        "post_text": post_text,
        "hashtags": hashtags
    }


@api_router.post("/generate-image")
async def generate_image(req: GenerateImageRequest):
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"image-{uuid.uuid4()}",
        system_message="You are an expert visual designer creating social media graphics."
    ).with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])

    prompt = (
        f"Create a bold, cinematic social media visual card. "
        f"Dark mysterious government conspiracy aesthetic. "
        f"Redacted text effects, classified document stamps, dramatic lighting. "
        f"Dark background with green and amber accents. "
        f"Theme: {req.post_text[:250]}. "
        f"No social media logos. No readable text. Abstract and atmospheric."
    )

    msg = UserMessage(text=prompt)
    text_resp, images = await chat.send_message_multimodal_response(msg)

    if not images or len(images) == 0:
        raise HTTPException(500, "Image generation failed")

    img_b64 = images[0]['data']
    await db.posts.update_one(
        {"id": req.post_id},
        {"$set": {"image_base64": img_b64}}
    )

    return {"image_base64": img_b64, "post_id": req.post_id}


@api_router.get("/history")
async def get_history():
    sessions = await db.sessions.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(20)
    return {"sessions": sessions}


@api_router.get("/session/{session_id}")
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(404, "Session not found")
    posts = await db.posts.find(
        {"session_id": session_id}, {"_id": 0}
    ).to_list(10)
    return {"session": session, "posts": posts}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
