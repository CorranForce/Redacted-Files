# REDACTED - Declassified Document to Social Media Post Generator

## Original Problem Statement
Build an app that takes any declassified government file, finds the most interesting mind-blowing points in the document, and puts them into Facebook, Instagram, or X (twitter) style posts.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (dark brutalist theme)
- **Backend**: FastAPI + MongoDB + OpenAI GPT-5.2 (text) + GPT Image 1 (images)
- **Database**: MongoDB (sessions, posts collections)

## User Personas
- Content creators, conspiracy researchers, history buffs, journalists, social media managers

## Core Requirements
- PDF upload and text paste input
- AI-powered document analysis (extract 5 mind-blowing findings)
- Platform-specific post generation (Twitter/X, Facebook, Instagram)
- AI-generated visual cards per post
- Copy text and download image functionality
- Session history

## What's Been Implemented (Feb 2026)
- Full backend API: /analyze, /generate-post, /generate-image, /history, /session/{id}
- Dark "Digital Brutalist" themed frontend with Oswald + JetBrains Mono fonts
- Document input (PDF upload + text paste with drag-and-drop)
- Platform selector with checkboxes + Select All
- Loading state with terminal-style animation
- Authentic social media post preview cards (Facebook, Instagram, Twitter/X)
- Calendar date picker, History dropdown, Copy text, Download image
- GPT-5.2 text analysis and post generation working
- GPT Image 1 visual card generation working

## Prioritized Backlog
- P1: Share directly to social media platforms
- P1: Batch processing of multiple documents
- P2: Post editing/customization before copy
- P2: Document OCR for scanned PDFs
- P3: User accounts and saved posts
- P3: Template selection for different post styles

## Next Tasks
- Add direct sharing to social platforms via their APIs
- Post text editing before copying
- Multiple document comparison mode
