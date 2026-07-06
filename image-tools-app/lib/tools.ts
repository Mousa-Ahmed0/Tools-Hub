import {
  Archive,
  Camera,
  Crop,
  Eraser,
  Expand,
  FileImage,
  FileOutput,
  FlipHorizontal,
  Globe,
  IdCard,
  ImageIcon,
  Info,
  Palette,
  Pipette,
  QrCode,
  RefreshCw,
  RotateCw,
  ScanText,
  ShieldOff,
  Sparkles,
  Stamp,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "Image Editing"
  | "PDF Tools"
  | "Color Tools"
  | "Utility Tools"
  | "AI Tools";

export type ToolItem = {
  i18nKey: string;
  name: string;
  href: string;
  category: ToolCategory;
  description: string;
  available: boolean;
  icon: LucideIcon;
  popular?: boolean;
};

export const toolCategories: ToolCategory[] = [
  "Image Editing",
  "PDF Tools",
  "Color Tools",
  "Utility Tools",
  "AI Tools",
];

export const tools: ToolItem[] = [
  { i18nKey: "tool.image-resizer", name: "Image Resizer", href: "/tools/image-resizer", category: "Image Editing", description: "Resize images to exact dimensions while keeping your workflow fast.", available: true, icon: Expand, popular: true },
  { i18nKey: "tool.image-compressor", name: "Image Compressor", href: "/tools/image-compressor", category: "Image Editing", description: "Reduce image file size directly in the browser.", available: true, icon: Archive, popular: true },
  { i18nKey: "tool.image-converter", name: "Image Converter", href: "/tools/image-converter", category: "Image Editing", description: "Convert image files between common browser-friendly formats.", available: true, icon: RefreshCw, popular: true },
  { i18nKey: "tool.crop-image", name: "Crop Image", href: "/tools/crop-image", category: "Image Editing", description: "Crop images to a focused region with a simple canvas workflow.", available: true, icon: Crop },
  { i18nKey: "tool.rotate-image", name: "Rotate Image", href: "/tools/rotate-image", category: "Image Editing", description: "Rotate images by preset or custom angles.", available: true, icon: RotateCw },
  { i18nKey: "tool.flip-image", name: "Flip Image", href: "/tools/flip-image", category: "Image Editing", description: "Flip images horizontally or vertically in seconds.", available: true, icon: FlipHorizontal },
  { i18nKey: "tool.resize-for-instagram", name: "Resize for Instagram", href: "/tools/resize-for-instagram", category: "Image Editing", description: "Fit images into common Instagram post and story sizes.", available: true, icon: Camera },
  { i18nKey: "tool.image-watermark", name: "Image Watermark", href: "/tools/image-watermark", category: "Image Editing", description: "Add a text or logo watermark and download a PNG.", available: true, icon: Stamp },
  { i18nKey: "tool.background-color-remover", name: "Background Color Remover", href: "/tools/background-color-remover", category: "Image Editing", description: "Remove a selected background color by making matching pixels transparent.", available: true, icon: Eraser },
  { i18nKey: "tool.ocr", name: "OCR Image to Text", href: "/tools/ocr", category: "Utility Tools", description: "Extract readable text from uploaded images.", available: true, icon: ScanText },
  { i18nKey: "tool.metadata-viewer", name: "Image Metadata Viewer", href: "/tools/metadata-viewer", category: "Utility Tools", description: "Inspect file name, size, dimensions, type, and modified date.", available: true, icon: Info },
  { i18nKey: "tool.exif-remover", name: "EXIF Remover", href: "/tools/exif-remover", category: "Utility Tools", description: "Create a clean PNG copy by redrawing the image without metadata.", available: true, icon: ShieldOff },
  { i18nKey: "tool.favicon-generator", name: "Favicon Generator", href: "/tools/favicon-generator", category: "Utility Tools", description: "Generate favicon previews and a downloadable favicon.ico file.", available: true, icon: Globe },
  { i18nKey: "tool.passport-photo-maker", name: "Passport Photo Maker", href: "/tools/passport-photo-maker", category: "Utility Tools", description: "Create white-background passport and ID photo sizes.", available: true, icon: IdCard },
  { i18nKey: "tool.qr-code-generator", name: "QR Code Generator", href: "/tools/qr-code-generator", category: "Utility Tools", description: "Generate a downloadable QR code from text or a URL.", available: true, icon: QrCode, popular: true },
  { i18nKey: "tool.color-palette", name: "Color Palette Extractor", href: "/tools/color-palette", category: "Color Tools", description: "Extract the top dominant colors from an uploaded image.", available: true, icon: Palette },
  { i18nKey: "tool.color-picker", name: "Color Picker", href: "/tools/color-picker", category: "Color Tools", description: "Click an image pixel and copy its HEX or RGB value.", available: true, icon: Pipette },
  { i18nKey: "tool.image-to-pdf", name: "Image to PDF", href: "/tools/image-to-pdf", category: "PDF Tools", description: "Combine uploaded images into a downloadable PDF.", available: true, icon: FileImage },
  { i18nKey: "tool.pdf-to-image", name: "PDF to Image", href: "/tools/pdf-to-image", category: "PDF Tools", description: "Render PDF pages as downloadable image files.", available: true, icon: FileOutput },
  { i18nKey: "tool.ai-image-caption-generator", name: "AI Image Caption Generator", href: "/tools/ai#ai-image-caption-generator", category: "AI Tools", description: "Generate short image captions with future browser-first AI support.", available: false, icon: Sparkles },
  { i18nKey: "tool.ai-alt-text-generator", name: "AI Alt Text Generator", href: "/tools/ai#ai-alt-text-generator", category: "AI Tools", description: "Draft accessible alt text for uploaded images.", available: false, icon: ImageIcon },
  { i18nKey: "tool.ai-image-description", name: "AI Image Description", href: "/tools/ai#ai-image-description", category: "AI Tools", description: "Create longer image descriptions for content workflows.", available: false, icon: FileImage },
  { i18nKey: "tool.ai-ocr-summary", name: "AI OCR Summary", href: "/tools/ai#ai-ocr-summary", category: "AI Tools", description: "Summarize extracted OCR text after browser-based recognition.", available: false, icon: ScanText },
  { i18nKey: "tool.ai-color-suggestions", name: "AI Color Suggestions", href: "/tools/ai#ai-color-suggestions", category: "AI Tools", description: "Suggest palette pairings and accessible color combinations.", available: false, icon: WandSparkles },
];
