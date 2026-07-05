import type { Metadata } from "next";

export const siteName = "Image Tools Hub";
export const defaultSiteUrl = "https://image-tools-hub.com";

export const siteDescription =
  "Free browser-first image, PDF, color, and utility tools.";

export const siteKeywords = [
  "image tools",
  "image resizer",
  "image compressor",
  "image converter",
  "pdf tools",
  "qr code generator",
  "ocr",
  "color picker",
];

export type RouteSeo = {
  path: string;
  title: string;
  description: string;
  priority?: number;
};

export const homeSeo: RouteSeo = {
  path: "/",
  title: "Free Online Image Tools | Image Tools Hub",
  description:
    "Edit, convert, compress, resize, and enhance images with free browser-first tools.",
  priority: 1,
};

export const toolsSeo: RouteSeo = {
  path: "/tools",
  title: "All Tools | Image Tools Hub",
  description:
    "Browse free online tools for images, PDFs, colors, QR codes, OCR, metadata, and more.",
  priority: 0.9,
};

export const toolSeo: RouteSeo[] = [
  {
    path: "/tools/image-resizer",
    title: "Free Image Resizer Online | Image Tools Hub",
    description: "Resize JPG, PNG, and WebP images online in your browser.",
  },
  {
    path: "/tools/image-compressor",
    title: "Free Image Compressor Online | Image Tools Hub",
    description:
      "Compress images online and reduce file size directly in your browser.",
  },
  {
    path: "/tools/image-converter",
    title: "Free Image Converter Online | Image Tools Hub",
    description: "Convert images between JPG, PNG, and WebP online.",
  },
  {
    path: "/tools/crop-image",
    title: "Crop Image Online Free | Image Tools Hub",
    description: "Crop JPG, PNG, and WebP images online with a browser-first crop tool.",
  },
  {
    path: "/tools/rotate-image",
    title: "Rotate Image Online Free | Image Tools Hub",
    description: "Rotate images by preset or custom angles directly in your browser.",
  },
  {
    path: "/tools/flip-image",
    title: "Flip Image Online Free | Image Tools Hub",
    description: "Flip images horizontally or vertically online without uploading to a server.",
  },
  {
    path: "/tools/image-to-pdf",
    title: "Image to PDF Converter Online | Image Tools Hub",
    description: "Combine uploaded images into a downloadable PDF file.",
  },
  {
    path: "/tools/pdf-to-image",
    title: "PDF to Image Converter Online | Image Tools Hub",
    description: "Convert PDF pages to downloadable images online.",
  },
  {
    path: "/tools/resize-for-instagram",
    title: "Resize Image for Instagram Online | Image Tools Hub",
    description:
      "Resize images for Instagram posts, portraits, landscapes, and stories online.",
  },
  {
    path: "/tools/qr-code-generator",
    title: "Free QR Code Generator Online | Image Tools Hub",
    description: "Generate downloadable PNG QR codes from text or URLs online.",
  },
  {
    path: "/tools/image-watermark",
    title: "Add Watermark to Image Online | Image Tools Hub",
    description: "Add text or logo watermarks to images and download a PNG result.",
  },
  {
    path: "/tools/color-picker",
    title: "Image Color Picker Online | Image Tools Hub",
    description: "Pick HEX and RGB colors from any uploaded image in your browser.",
  },
  {
    path: "/tools/color-palette",
    title: "Color Palette Extractor Online | Image Tools Hub",
    description: "Extract dominant colors and download a JSON palette from an image.",
  },
  {
    path: "/tools/background-color-remover",
    title: "Background Color Remover Online | Image Tools Hub",
    description:
      "Remove a selected background color from an image by making matching pixels transparent.",
  },
  {
    path: "/tools/passport-photo-maker",
    title: "Passport Photo Maker Online | Image Tools Hub",
    description: "Create passport-style and ID photo PNGs with a white background online.",
  },
  {
    path: "/tools/ocr",
    title: "OCR Image to Text Online | Image Tools Hub",
    description: "Extract text from images online using browser-first OCR tools.",
  },
  {
    path: "/tools/metadata-viewer",
    title: "Image Metadata Viewer Online | Image Tools Hub",
    description: "View image file name, size, dimensions, type, and modified date online.",
  },
  {
    path: "/tools/exif-remover",
    title: "EXIF Remover Online | Image Tools Hub",
    description: "Remove image metadata by creating a clean PNG copy in your browser.",
  },
  {
    path: "/tools/favicon-generator",
    title: "Favicon Generator Online | Image Tools Hub",
    description: "Generate favicon PNG previews and a downloadable favicon.ico file online.",
  },
].map((route) => ({ priority: 0.8, ...route }));

export const allSeoRoutes = [homeSeo, toolsSeo, ...toolSeo];

type SeoMetadataInput = {
  title: string;
  description: string;
  path?: string;
};

function normalizeSiteUrl(url: string) {
  return url.replace(/\/$/, "");
}

export function getConfiguredSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_URL;

  return siteUrl ? normalizeSiteUrl(siteUrl) : undefined;
}

export function getSiteUrl() {
  return getConfiguredSiteUrl() ?? defaultSiteUrl;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
}: SeoMetadataInput): Metadata {
  const configuredSiteUrl = getConfiguredSiteUrl();
  const url = absoluteUrl(path);

  return {
    title,
    description,
    applicationName: siteName,
    keywords: siteKeywords,
    metadataBase: configuredSiteUrl ? new URL(configuredSiteUrl) : undefined,
    alternates: configuredSiteUrl
      ? {
          canonical: path,
        }
      : undefined,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName,
      locale: "en_US",
      alternateLocale: ["ar"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getSeoByPath(path: string) {
  return allSeoRoutes.find((route) => route.path === path);
}
