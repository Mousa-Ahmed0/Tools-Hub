# QA Fixes Summary

Date: 2026-07-05

This document summarizes fixes applied after `docs/qa-report.md`.

## Fixed

- Added safe object/blob URL cleanup using `lib/object-url.ts`.
- Added cleanup on preview/result URL replacement, reset, and component unmount across affected tool pages.
- Normalized full reset behavior for:
  - Image Resizer
  - Image Compressor
  - Image Converter
  - Crop Image
  - Rotate Image
  - Flip Image
  - Image to PDF
  - PDF to Image
  - Resize for Instagram
- Cleared stale results when options change for:
  - Image Converter output format
  - PDF to Image page number/output format
  - Resize for Instagram preset
  - Crop Image crop fields
  - Rotate Image angle
  - Flip Image direction
  - Background Color Remover color/tolerance
  - Passport Photo Maker preset
  - Image Watermark controls
- Made primary action buttons full width inside tool control panels.
- Improved smart filenames for:
  - Image Compressor: `original-compressed.jpg`
  - Image Converter: `original-converted.png/jpg/webp`
  - Image to PDF: based on the first selected image
- Implemented cumulative Flip Image behavior:
  - Horizontal twice returns to original horizontal state.
  - Vertical twice returns to original vertical state.
  - Mixed horizontal/vertical state is represented in the result filename.
- Improved PDF to Image cleanup:
  - Single result and ZIP blob URLs are revoked.
  - Stale results clear when page number or format changes.
- Improved Metadata Viewer:
  - Added loading state while reading metadata.
  - Clears partial file/preview state if metadata reading fails.
- Improved Favicon Generator:
  - Revokes generated ICO object URL.
  - Keeps auto-generation and adds a safe manual regenerate/retry button.

## Remaining Known Limitations

- OCR progress percentage was not added because the current shared OCR helper does not expose Tesseract progress callbacks. Existing loading state remains intact.
- Interactive crop overlay is still not implemented.
- Background Color Remover still uses manual color input; no image eyedropper yet.
- PDF to Image still does not show an original PDF page preview before conversion.
- Passport Photo Maker does not validate official passport compliance or face placement.
- Some outputs are still data URLs, which do not require `URL.revokeObjectURL`.

## Verification

- `npm.cmd run build` passed after the fixes.
- Manual browser QA is still recommended for the file-heavy routes listed in the original QA report.
