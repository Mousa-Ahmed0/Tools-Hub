# Image Tools Hub QA Report

Date: 2026-07-05

Scope: all current tool routes in `app/tools`.

Method:
- Reviewed each tool page for upload/input handling, processing trigger, preview rendering, result rendering, download behavior, reset behavior, and responsive layout.
- Reviewed shared tool UI components and the relevant image/PDF helper calls.
- Ran `npm.cmd run build` in `image-tools-app`; production build passed.
- This report is based on code-level QA and build verification. It does not include browser-based manual uploads with real sample files.

Global findings:
- Build status: Passed.
- Responsive behavior: Passed at code level. All audited tools use `ToolPageShell`, which stacks on mobile and uses a two-column controls/results layout on larger screens.
- Shared upload feedback: Passed for tools using `FileUploadBox`; selected files show name, size, type, and image thumbnail when applicable.
- Shared empty states: Passed for preview/result cards using the updated shared cards.
- Global bug: several tools create object URLs with `URL.createObjectURL` but do not revoke old URLs on replacement/reset/unmount. This can leak memory during long sessions.
- Global UX issue: primary action buttons are not consistently full width even though the latest UX requirement asks for full-width primary actions.
- Global reset inconsistency: newer tools generally clear uploaded file and input state, while older core tools often lack a reset button or reset only the result/controls.

## Image Resizer

Route: `/tools/image-resizer`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `resizeImage` with validated width and height.
- Result preview renders.
- Download uses a smart filename like `original-800x600.png`.
- Responsive layout uses shared tool shell.

Failed items:
- Reset is missing.

Bugs found:
- Selected preview object URL is not revoked.
- If image dimension loading fails, there is no visible error for the dimension read.

UX issues:
- No reset button for clearing upload, preview, controls, and result.
- Primary action is not full width.

Suggested fixes:
- Add a full reset handler that clears file, preview, dimensions, width/height, result, error, and file input.
- Revoke object URLs when replacing or clearing previews.
- Make primary action full width for consistency.

## Image Compressor

Route: `/tools/image-compressor`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `compressImage` with quality validation.
- Result preview renders.
- Download is available after compression.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset is missing.

Bugs found:
- Selected preview object URL is not revoked.
- Compressed download filename is always `compressed-image.jpg`, not based on the original filename.

UX issues:
- No reset button.
- Result may be larger than the original; the UI reports this, but the primary label still implies compression succeeded.
- Primary action is not full width.

Suggested fixes:
- Add reset behavior.
- Use smart filename like `original-compressed.jpg`.
- Revoke object URLs.
- Consider changing result status language when output is not smaller.

## Image Converter

Route: `/tools/image-converter`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `convertImage`.
- Result preview renders.
- Download extension matches selected output format.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset is missing.

Bugs found:
- Selected preview object URL is not revoked.
- Download filename is generic, e.g. `converted-image.png`, not based on the original filename.
- If the user changes output format after generating a result, the old result remains visible while the download filename changes to the new format.

UX issues:
- No reset button.
- Format changes should clear stale converted output.
- Primary action is not full width.

Suggested fixes:
- Add reset behavior.
- Clear `convertedImage` when `format` changes.
- Use smart filename like `original-converted.webp`.
- Revoke object URLs.

## Crop Image

Route: `/tools/crop-image`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Crop values are validated against image bounds.
- Processing calls `cropImage`.
- Result preview renders.
- Download uses a smart crop-size filename.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset does not clear uploaded file, upload card, original preview, or file input.

Bugs found:
- Selected preview object URL is not revoked.
- Reset does nothing before an image is loaded because it returns when dimensions are missing.

UX issues:
- Reset behaves as "reset crop controls" rather than full tool reset.
- No visual crop box or drag interaction, so users must guess numeric coordinates.
- Primary action is not full width.

Suggested fixes:
- Rename current reset to "Reset Crop" or make reset clear the whole tool.
- Add a separate full reset.
- Revoke object URLs.
- Consider adding an interactive crop overlay later.

## Rotate Image

Route: `/tools/rotate-image`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Rotation accumulates using `currentRotation`.
- Result preview updates after each rotate action.
- Download filename reflects latest rotation.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset does not clear uploaded file, upload card, original preview, or file input.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- Reset behaves as "clear rotation/result" rather than full tool reset.
- A 360-degree accumulated result is named `rotated-0.png`, which is technically correct but may surprise users.
- Primary action is not full width.

Suggested fixes:
- Decide whether reset should be full reset or rename to "Reset Rotation".
- Revoke object URLs.
- Consider displaying both current rotation and last applied step.

## Flip Image

Route: `/tools/flip-image`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `flipImage`.
- Result preview renders.
- Download uses a direction-specific filename.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset does not clear uploaded file, upload card, original preview, or file input.
- Repeated clicks do not accumulate flips. Clicking horizontal twice still processes the original image horizontally, not back to the original orientation.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- Reset behaves as "clear result/direction" rather than full tool reset.
- Flip behavior may be surprising if users expect each click to apply on top of the current result.
- Primary action is not full width.

Suggested fixes:
- Define expected flip behavior. If cumulative, track current flip state or use the previous result as input.
- Add full reset or rename current reset.
- Revoke object URLs.

## Image to PDF

Route: `/tools/image-to-pdf`

Passed items:
- Upload accepts multiple images.
- Selected image previews render.
- Processing calls `imagesToPdf`.
- PDF result state renders.
- Download button appears after conversion.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset is missing.

Bugs found:
- Preview object URLs are created in `useMemo` without cleanup, causing memory leaks.
- Download filename is always `images.pdf`, not based on selected files.

UX issues:
- No way to clear selected files except selecting new ones or reloading.
- No reordering of images before PDF creation.
- Primary action is not full width.

Suggested fixes:
- Add reset behavior.
- Revoke preview object URLs.
- Consider drag/drop reorder or at least display conversion order clearly.
- Use a smarter filename.

## PDF to Image

Route: `/tools/pdf-to-image`

Passed items:
- Upload accepts PDF files.
- Page count is read after upload.
- Single-page conversion calls `pdfPageToImage`.
- All-pages conversion calls `pdfAllPagesToZip`.
- Converted page preview renders.
- Single image and ZIP downloads are available.
- Loading states disable relevant buttons.
- Responsive layout uses shared tool shell.

Failed items:
- No original PDF preview.
- Reset does not clear uploaded file, upload card, page count, or file input.

Bugs found:
- Generated image and ZIP object URLs are not revoked.
- If output format changes after a result exists, existing result remains visible until reconversion.

UX issues:
- Reset behaves as "clear conversion options/results" rather than full tool reset.
- There are two result panels but no original preview panel, which makes this route less consistent.
- Large PDFs may take a long time with limited progress feedback.

Suggested fixes:
- Add full reset or rename current reset.
- Clear stale results when output format changes.
- Revoke generated object URLs.
- Consider lightweight PDF file summary or first-page preview.

## Resize for Instagram

Route: `/tools/resize-for-instagram`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Presets are available.
- Processing calls `resizeForCanvasFit`.
- Result preview renders.
- Download uses output dimensions in filename.
- Loading state disables the action button.
- Responsive layout uses shared tool shell.

Failed items:
- Reset does not clear uploaded file, upload card, original preview, or file input.

Bugs found:
- Selected preview object URL is not revoked.
- Changing preset after generating a result does not clear stale result preview.

UX issues:
- Reset behaves as "reset preset/result" rather than full tool reset.
- Primary action is not full width.

Suggested fixes:
- Clear result when preset changes.
- Add full reset or rename current reset.
- Revoke object URLs.

## QR Code Generator

Route: `/tools/qr-code-generator`

Passed items:
- Text/URL input is available.
- Empty input validation works.
- Processing calls `generateQrCode`.
- QR preview renders.
- Download filename is `qr-code.png`.
- Reset clears input, result, and error.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- No upload flow applies to this tool.

Bugs found:
- None found in code-level QA.

UX issues:
- Primary action is not full width.
- Very long text has no character count or warning.

Suggested fixes:
- Add optional character count or QR density warning.
- Make primary action full width for consistency.

## Image Watermark

Route: `/tools/image-watermark`

Passed items:
- Main image upload works.
- Optional logo upload works.
- Original preview renders.
- Text, position, opacity, color, and font size controls exist.
- Processing calls `watermarkImage`.
- Result preview renders.
- Download uses smart filename.
- Reset clears upload, logo, controls, result, and input fields.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Preview object URLs for main image and logo upload card are not explicitly revoked.

UX issues:
- No live preview before clicking "Add Watermark".
- Logo watermark has no size control.
- Primary action is not full width.

Suggested fixes:
- Revoke object URLs.
- Add logo scale control.
- Consider debounced live preview.

## Color Picker

Route: `/tools/color-picker`

Passed items:
- Upload accepts images and stores selected file.
- Image preview renders.
- Clicking image reads pixel color through Canvas API.
- HEX and RGB values render.
- Copy HEX and Copy RGB actions exist.
- Reset clears file, preview, selected color, copied state, and input field.
- Responsive layout uses shared tool shell.

Failed items:
- Download is not applicable for this tool.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- No magnifier or cursor pixel indicator for precise picking.
- Copy buttons do not disable when clipboard is unavailable.

Suggested fixes:
- Revoke object URLs.
- Add zoom/magnifier support later.
- Add fallback copy guidance for browsers blocking clipboard access.

## Color Palette Extractor

Route: `/tools/color-palette`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `extractColorPalette`.
- Top colors render with swatches and HEX/RGB values.
- Copy HEX action exists.
- JSON download is available after extraction.
- Reset clears file, preview, palette, copied state, error, and input field.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Preview object URL and generated JSON blob URL are not revoked.

UX issues:
- Palette extraction is quantized and may miss visually dominant but less frequent colors.
- Primary action is not full width.

Suggested fixes:
- Revoke object/blob URLs.
- Add a note that extraction is approximate.
- Consider palette count control later.

## Background Color Remover

Route: `/tools/background-color-remover`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Background color and tolerance controls exist.
- Processing calls `removeBackgroundColor`.
- Transparent PNG preview renders on a checkerboard background.
- Download uses smart filename.
- Reset clears file, preview, result, controls, error, and input field.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- No eyedropper from image; users must manually choose a color.
- No before/after zoom for transparency edge checking.
- Primary action is not full width.

Suggested fixes:
- Revoke object URLs.
- Add image click-to-pick background color using existing color picker logic.
- Add guidance that this is color-based, not AI background removal.

## Passport Photo Maker

Route: `/tools/passport-photo-maker`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Preset size controls exist.
- Processing calls `createPassportPhoto`.
- Generated preview renders.
- Download uses smart filename.
- Reset clears file, preview, result, preset, error, and input field.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- Tool does not validate passport compliance beyond canvas size and white background.
- No crop/position controls for face placement.
- Primary action is not full width.

Suggested fixes:
- Revoke object URLs.
- Add clear disclaimer that compliance is not guaranteed.
- Add positioning/crop controls later.

## OCR Image to Text

Route: `/tools/ocr`

Passed items:
- Upload accepts images and stores selected file.
- Image preview renders.
- Processing calls `extractTextFromImage`.
- Extracted text renders.
- Copy text action exists.
- Reset clears file, preview, text, copied state, error, and input field.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- Download is not applicable.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- OCR can be slow and has no progress percentage.
- No language selection.
- Primary action is not full width.

Suggested fixes:
- Revoke object URLs.
- Expose Tesseract progress if available.
- Add language selection later.

## Image Metadata Viewer

Route: `/tools/metadata-viewer`

Passed items:
- Upload accepts images and stores selected file.
- Image preview renders.
- Metadata is read after upload.
- File name, size, dimensions, type, and last modified date render.
- Reset clears file, preview, metadata, error, and input field.
- Responsive layout uses shared tool shell.

Failed items:
- Download is not applicable.
- Processing action is automatic, so there is no separate process button.

Bugs found:
- If metadata reading fails, `file` and `preview` may remain set because the catch only sets an error.
- Selected preview object URL is not revoked.

UX issues:
- No loading state while metadata is being read.
- Does not display embedded EXIF fields, only basic file/image metadata.

Suggested fixes:
- Clear file/preview on metadata read failure or keep preview with a more specific partial-failure message.
- Add loading state for metadata read.
- Revoke object URLs.

## EXIF Remover

Route: `/tools/exif-remover`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing calls `removeImageExif`.
- Cleaned preview renders.
- Download uses smart filename.
- Reset clears file, preview, result, error, filename, and input field.
- Loading state disables action button.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Selected preview object URL is not revoked.

UX issues:
- Result is always PNG, which can increase file size and change format.
- Tool does not verify or display whether metadata existed before removal.
- Primary action is not full width.

Suggested fixes:
- Revoke object URLs.
- Add note that output is PNG.
- Optionally show original/cleaned file size.

## Favicon Generator

Route: `/tools/favicon-generator`

Passed items:
- Upload accepts images and stores selected file.
- Original preview renders.
- Processing runs automatically after upload.
- 16x16, 32x32, and 48x48 previews render.
- `favicon.ico` download is available.
- Reset clears file, preview, generated images, icon blob, error, and input field.
- Loading state is visible.
- Responsive layout uses shared tool shell.

Failed items:
- None found in code-level QA.

Bugs found:
- Selected preview object URL and generated ICO object URL are not revoked.
- There is no manual retry/generate button if automatic generation fails.

UX issues:
- Auto-generation on upload is convenient but may surprise users expecting an explicit action.
- Does not provide separate PNG downloads for individual favicon sizes.

Suggested fixes:
- Revoke object/blob URLs.
- Add a manual "Generate Favicons" or "Retry" button after failure.
- Add optional PNG downloads for each size.

## Priority Fix List

High priority:
- Add or normalize full reset behavior for Image Resizer, Image Compressor, Image Converter, Image to PDF, Crop Image, Rotate Image, Flip Image, PDF to Image, and Resize for Instagram.
- Clear stale results when options change after processing, especially Image Converter, PDF to Image, and Resize for Instagram.
- Revoke object URLs and blob URLs throughout the app.

Medium priority:
- Make primary action buttons full width and labels more action-specific.
- Add smarter filenames for Image Compressor, Image Converter, and Image to PDF.
- Add loading feedback for Metadata Viewer.

Low priority:
- Add interactive crop overlay.
- Add click-to-pick background color.
- Add OCR progress/language selection.
- Add PDF preview and conversion progress for large PDFs.

## Test Instructions

Recommended manual QA pass:
1. Run `npm run dev`.
2. Open `/tools`.
3. Visit each tool route.
4. For upload-based tools, upload a small JPG, PNG with transparency, and a larger image.
5. For PDF tools, upload a one-page and multi-page PDF.
6. Verify upload card, preview, controls, action loading, result rendering, download filename, and reset behavior.
7. Repeat on a narrow mobile viewport and a desktop viewport.

Build verification:
- Command: `npm.cmd run build`
- Result: Passed.
