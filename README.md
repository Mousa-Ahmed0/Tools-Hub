# Image Tools Hub

Image Tools Hub is a scalable web platform for online image and file processing. The project starts with a focused MVP and is designed to grow into a larger product with backend services, premium features, analytics, and advanced processing tools.

## Project Goal

Build a fast, SEO-driven tools platform that helps users process images and files directly in the browser while keeping the architecture ready for future backend expansion.

## MVP Focus

The first release is centered on a clean and stable MVP instead of trying to launch dozens of tools at once.

### Priority 1 Tools
- Image Resizer
- Image Compressor
- Image Converter
- Crop Image
- Rotate Image
- Flip Image

### Priority 2 Tools
- Image to PDF
- PDF to Image
- Resize for Instagram
- QR Code Generator
- Color Picker
- Passport Photo Maker

### Deferred for Later Phases
- Background Remover
- AI Image Enhancer
- PNG to SVG
- Video to GIF
- Bulk Tools
- Other advanced server-heavy features

## Architecture Direction

This project is not being built as a frontend-only toy app. Even though the MVP may start with client-side processing for simpler tools, the codebase should remain ready for:

- API routes and backend services
- File storage
- Authentication
- Usage limits
- Premium plans
- Queued processing jobs
- Analytics
- Server-side and hybrid processing

## Core Development Rules

- Keep pages inside `app/`
- Keep reusable UI inside `components/`
- Keep tool-specific logic inside `features/`
- Keep shared processing logic inside `lib/`
- Keep backend-oriented logic inside `services/`
- Avoid putting large business logic directly inside page files
- Build each tool as an isolated feature with shared UI patterns

## Recommended Project Structure

```text
image-tools-hub/
├── app/
├── components/
├── features/
├── lib/
├── services/
├── hooks/
├── types/
├── store/
├── public/
├── tests/
├── AGENTS.md
└── docs/
```

## Suggested First Sprint

1. Initialize the project setup
2. Build the main layout
3. Create homepage and tools index page
4. Ship `image-resizer`
5. Ship `image-compressor`
6. Ship `image-converter`

## Documentation

- `AGENTS.md` → direct instructions for AI coding tools
- `docs/project-plan.md` → full project plan and execution direction
- `docs/project-plan.pdf` → presentation-style version for human reference

## Working Principle

Ship a stable MVP first. Keep the codebase clean. Design every decision so the platform can grow into a full backend-enabled product later.
