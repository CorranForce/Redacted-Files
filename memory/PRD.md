# REDACTED - Declassified Document to Social Media Post Generator

## Original Problem Statement
Build an app that takes any declassified government file, finds the most interesting mind-blowing points in the document, and puts them into Facebook, Instagram, or X (twitter) style posts.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (dark brutalist theme)
- **Backend**: FastAPI + MongoDB + OpenAI GPT-5.2 (text) + Gemini Nano Banana (images)
- **Auth**: JWT (email/password) + Emergent-managed Google OAuth
- **Database**: MongoDB (sessions, posts, users collections)

## User Personas
- Content creators, conspiracy researchers, history buffs, journalists, social media managers

## Core Requirements
- PDF upload and text paste input
- AI-powered document analysis (extract 5 mind-blowing findings)
- Platform-specific post generation (Twitter/X, Facebook, Instagram)
- AI-generated visual cards per post (Nano Banana)
- Copy text and download image functionality
- Session history
- User authentication (email/password + Google OAuth)
- Marketing landing page

## What's Been Implemented (Feb 2026)
### Phase 1: MVP
- Full backend API: /analyze, /generate-post, /generate-image, /history, /session/{id}
- Dark "Digital Brutalist" themed UI with Oswald + JetBrains Mono fonts
- Document input (PDF upload + text paste), Platform selector, Loading state
- Authentic social media post preview cards (Facebook, Instagram, Twitter/X)
- GPT-5.2 text analysis and post generation

### Phase 2: Auth + Landing Page
- JWT authentication (register/login with bcrypt hashing)
- Emergent-managed Google OAuth
- Marketing landing page with hero, "How It Works", platform previews (MKUltra samples), live X/Twitter typewriter demo, CTA
- Protected dashboard behind auth
- User management (name, email, picture, auth provider)

### Phase 3: Image Generator Update
- Switched from GPT Image 1 to Gemini Nano Banana for visual card generation

## Prioritized Backlog
- P1: Share directly to social media platforms
- P1: Batch processing of multiple documents
- P2: Post editing/customization before copy
- P2: Document OCR for scanned PDFs
- P3: User history per account
- P3: Template selection for different post styles
