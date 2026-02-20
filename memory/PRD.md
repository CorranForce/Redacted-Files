# REDACTED - Declassified Document Viral Post Generator

## Problem Statement
Build an app that takes any declassified government file, finds the most interesting mind-blowing points in the document, and puts them into a Facebook, Instagram, or X (Twitter) style post.

## Architecture
- **Frontend:** React + TailwindCSS + shadcn/ui
- **Backend:** FastAPI + Python
- **Database:** MongoDB
- **Auth:** JWT + Google OAuth (Emergent)
- **AI:** GPT-5.2 (analysis), Gemini Nano Banana (images), Sora 2 (videos)
- **Email:** Resend (password reset)

## Core Requirements
- Upload declassified documents (PDF/text)
- AI analysis extracts top 5 mind-blowing revelations
- Generate platform-optimized posts for X, Facebook, Instagram
- Generate AI images (Nano Banana) and videos (Sora 2)
- JWT + Google auth with signup/login
- Forgot password via email (Resend)
- Profile section to update password
- Downloadable images and videos
- User-specific session history
- Landing page with platform previews and demo

## Implemented Features (as of Feb 20, 2026)
- [x] Document upload & AI analysis (GPT-5.2)
- [x] Social media post generation (X, Facebook, Instagram)
- [x] AI image generation (Gemini Nano Banana)
- [x] AI video generation (Sora 2)
- [x] JWT authentication (register/login)
- [x] Google OAuth via Emergent
- [x] Forgot password flow (Resend email)
- [x] Reset password page
- [x] Profile page with password update
- [x] User-specific session history
- [x] Downloadable images and videos
- [x] Download captions
- [x] Landing page (hero, how-it-works, previews, demo, video, CTA)
- [x] Typewriter demo animation

## Key API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google-session
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/change-password
- GET /api/auth/me
- POST /api/analyze
- POST /api/generate-post
- POST /api/generate-image
- POST /api/generate-video
- GET /api/video-status/{video_id}
- GET /api/videos/{video_id}
- GET /api/history
- GET /api/session/{session_id}
- GET /api/demo/images
- GET /api/demo/video
- POST /api/demo/generate-video

## DB Collections
- users: {user_id, email, name, password_hash, picture, auth_provider, created_at}
- sessions: {id, document_name, document_preview, findings, user_id, created_at}
- posts: {id, session_id, platform, post_text, hashtags, image_base64, created_at}
- videos: {video_id, session_id, status, created_at}
- reset_tokens: {token, email, expires_at, used, created_at}
- demo_cache: {type, images/video_id, created_at}

## Backlog
- P2: Dynamic landing page images from Nano Banana (backend endpoint exists)
- P2: Landing page demo video caching (backend endpoint exists)
