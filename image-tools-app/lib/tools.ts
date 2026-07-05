export type ToolCategory =
  | "Image Editing"
  | "PDF Tools"
  | "Color Tools"
  | "Utility Tools";

export type ToolItem = {
  name: string;
  href: string;
  category: ToolCategory;
  description: string;
  available: boolean;
  popular?: boolean;
};

export const toolCategories: ToolCategory[] = [
  "Image Editing",
  "PDF Tools",
  "Color Tools",
  "Utility Tools",
];

export const tools: ToolItem[] = [
  { name: "Image Resizer", href: "/tools/image-resizer", category: "Image Editing", description: "Resize images to exact dimensions while keeping your workflow fast.", available: true, popular: true },
  { name: "Image Compressor", href: "/tools/image-compressor", category: "Image Editing", description: "Reduce image file size directly in the browser.", available: true, popular: true },
  { name: "Image Converter", href: "/tools/image-converter", category: "Image Editing", description: "Convert image files between common browser-friendly formats.", available: true, popular: true },
  { name: "Crop Image", href: "/tools/crop-image", category: "Image Editing", description: "Crop images to a focused region with a simple canvas workflow.", available: true },
  { name: "Rotate Image", href: "/tools/rotate-image", category: "Image Editing", description: "Rotate images by preset or custom angles.", available: true },
  { name: "Flip Image", href: "/tools/flip-image", category: "Image Editing", description: "Flip images horizontally or vertically in seconds.", available: true },
  { name: "Resize for Instagram", href: "/tools/resize-for-instagram", category: "Image Editing", description: "Fit images into common Instagram post and story sizes.", available: true },
  { name: "Image Watermark", href: "/tools/image-watermark", category: "Image Editing", description: "Add a text or logo watermark and download a PNG.", available: true },
  { name: "Background Color Remover", href: "/tools/background-color-remover", category: "Image Editing", description: "Remove a selected background color by making matching pixels transparent.", available: true },
  { name: "OCR Image to Text", href: "/tools/ocr", category: "Utility Tools", description: "Extract readable text from uploaded images.", available: true },
  { name: "Image Metadata Viewer", href: "/tools/metadata-viewer", category: "Utility Tools", description: "Inspect file name, size, dimensions, type, and modified date.", available: true },
  { name: "EXIF Remover", href: "/tools/exif-remover", category: "Utility Tools", description: "Create a clean PNG copy by redrawing the image without metadata.", available: true },
  { name: "Favicon Generator", href: "/tools/favicon-generator", category: "Utility Tools", description: "Generate favicon previews and a downloadable favicon.ico file.", available: true },
  { name: "Passport Photo Maker", href: "/tools/passport-photo-maker", category: "Utility Tools", description: "Create white-background passport and ID photo sizes.", available: true },
  { name: "QR Code Generator", href: "/tools/qr-code-generator", category: "Utility Tools", description: "Generate a downloadable QR code from text or a URL.", available: true, popular: true },
  { name: "Color Palette Extractor", href: "/tools/color-palette", category: "Color Tools", description: "Extract the top dominant colors from an uploaded image.", available: true },
  { name: "Color Picker", href: "/tools/color-picker", category: "Color Tools", description: "Click an image pixel and copy its HEX or RGB value.", available: true },
  { name: "Image to PDF", href: "/tools/image-to-pdf", category: "PDF Tools", description: "Combine uploaded images into a downloadable PDF.", available: true },
  { name: "PDF to Image", href: "/tools/pdf-to-image", category: "PDF Tools", description: "Render PDF pages as downloadable image files.", available: true },
];
