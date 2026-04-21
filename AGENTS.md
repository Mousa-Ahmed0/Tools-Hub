# AGENTS.md

## Project Identity
Image Tools Hub is a scalable web platform for online image and file processing. The current goal is to build a clean MVP with a structure that is ready for future backend expansion.

## Main Goal
Build a production-minded MVP first, not the full 50-tool platform.

Priority:
1. Stable architecture
2. Reusable UI and processing logic
3. Fast delivery of core tools
4. Backend-ready structure for future scaling

## Current Product Direction
This project is **not frontend-only**.
Even if some MVP tools run fully in the browser, the codebase must stay ready for future:
- backend processing
- file storage
- authentication
- usage limits
- subscriptions
- analytics
- queues / background processing
- bulk operations

## Working Rule
When adding or editing code, always prefer:
- modular structure
- reusable components
- isolated feature logic
- clear TypeScript types
- easy migration from client-side processing to server-side processing

Avoid writing tool logic directly inside page files unless the code is very small and purely presentational.

## Official Architecture Rule
Use this separation of concerns:
- `app/` for routes and pages
- `components/` for reusable UI
- `features/` for tool-specific logic
- `lib/` for shared processing utilities
- `services/` for backend-facing or future server logic
- `types/` for shared TypeScript types
- `hooks/` for reusable hooks

## MVP Scope
Only focus on the MVP tools first.

### Priority 1 — Core Image Tools
- Image Resizer
- Image Compressor
- Image Converter
- Crop Image
- Rotate Image
- Flip Image

### Priority 2 — Utility Tools
- Image to PDF
- PDF to Image
- Resize for Instagram
- QR Code Generator
- Color Picker
- Passport Photo Maker

### Deferred for Later
Do not prioritize these unless explicitly requested:
- Background Remover
- AI Image Enhancer
- PNG to SVG
- Video to GIF
- Bulk tools
- other heavy server-dependent tools

## Definition of Done for Each Tool
A tool is not complete unless it has:
- file upload
- preview
- processing action
- download result
- responsive UI
- basic validation and error handling

## UI Expectations
Keep the interface simple and consistent across tools.
Every tool page should ideally include:
- tool title
- short description
- upload area
- controls panel
- preview area
- result / download action

Reuse shared components whenever possible.

## Engineering Expectations
When implementing features:
- use TypeScript cleanly
- keep components small
- extract shared utilities
- avoid duplication
- keep naming consistent
- avoid premature complexity, but preserve future extensibility

## SEO Expectations
This is an SEO-driven product.
Each tool should be treated as its own landing page.
Prefer adding support for:
- clear metadata
- descriptive headings
- useful static copy
- FAQ / related tools sections when appropriate

## Suggested File Structure
```txt
image-tools-hub/
├── app/
│   ├── (marketing)/
│   ├── tools/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── shared/
│   ├── tool-ui/
│   └── seo/
├── features/
├── lib/
├── services/
├── hooks/
├── types/
├── store/
├── public/
└── docs/
```

## Delivery Strategy
Work in this order unless a specific task overrides it:
1. Project setup and shared layout
2. Tools index page
3. Image Resizer
4. Image Compressor
5. Image Converter
6. Crop / Rotate / Flip
7. Utility tools
8. SEO and polish

## Important Constraint
Do not treat the project like a small static frontend demo.
All decisions should be compatible with future backend growth.
