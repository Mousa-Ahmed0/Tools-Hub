export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-right";

export type WatermarkOptions = {
  text: string;
  logoFile?: File | null;
  position: WatermarkPosition;
  opacity: number;
  textColor: string;
  fontSize: number;
};

type WatermarkBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image."));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function getBounds(
  position: WatermarkPosition,
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  margin: number
): WatermarkBounds {
  const positions: Record<WatermarkPosition, WatermarkBounds> = {
    "top-left": {
      x: margin,
      y: margin,
      width: watermarkWidth,
      height: watermarkHeight,
    },
    "top-right": {
      x: canvasWidth - watermarkWidth - margin,
      y: margin,
      width: watermarkWidth,
      height: watermarkHeight,
    },
    center: {
      x: (canvasWidth - watermarkWidth) / 2,
      y: (canvasHeight - watermarkHeight) / 2,
      width: watermarkWidth,
      height: watermarkHeight,
    },
    "bottom-left": {
      x: margin,
      y: canvasHeight - watermarkHeight - margin,
      width: watermarkWidth,
      height: watermarkHeight,
    },
    "bottom-right": {
      x: canvasWidth - watermarkWidth - margin,
      y: canvasHeight - watermarkHeight - margin,
      width: watermarkWidth,
      height: watermarkHeight,
    },
  };

  return positions[position];
}

export async function watermarkImage(
  imageFile: File,
  options: WatermarkOptions
): Promise<string> {
  const text = options.text.trim();
  const opacity = Math.min(Math.max(options.opacity, 0), 1);
  const fontSize = Math.max(8, options.fontSize);

  if (!text && !options.logoFile) {
    throw new Error("Add watermark text or upload a logo.");
  }

  const [image, logo] = await Promise.all([
    loadImage(imageFile),
    options.logoFile ? loadImage(options.logoFile) : Promise.resolve(null),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.drawImage(image, 0, 0);
  ctx.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;

  const gap = text && logo ? Math.max(8, Math.round(fontSize * 0.4)) : 0;
  const textHeight = text ? fontSize * 1.2 : 0;
  const textWidth = text ? ctx.measureText(text).width : 0;

  let logoWidth = 0;
  let logoHeight = 0;

  if (logo) {
    const maxLogoWidth = Math.min(canvas.width * 0.25, 180);
    const maxLogoHeight = Math.min(canvas.height * 0.18, 120);
    const logoScale = Math.min(
      maxLogoWidth / logo.width,
      maxLogoHeight / logo.height,
      1
    );

    logoWidth = Math.round(logo.width * logoScale);
    logoHeight = Math.round(logo.height * logoScale);
  }

  const watermarkWidth = Math.max(textWidth, logoWidth);
  const watermarkHeight = logoHeight + gap + textHeight;
  const margin = Math.max(16, Math.round(Math.min(canvas.width, canvas.height) * 0.04));
  const bounds = getBounds(
    options.position,
    canvas.width,
    canvas.height,
    watermarkWidth,
    watermarkHeight,
    margin
  );

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = Math.max(2, Math.round(fontSize * 0.1));
  ctx.shadowOffsetY = Math.max(1, Math.round(fontSize * 0.06));

  let currentY = bounds.y;

  if (logo) {
    const logoX = bounds.x + (bounds.width - logoWidth) / 2;
    ctx.drawImage(logo, logoX, currentY, logoWidth, logoHeight);
    currentY += logoHeight + gap;
  }

  if (text) {
    const textX = bounds.x + (bounds.width - textWidth) / 2;
    ctx.fillStyle = options.textColor;
    ctx.textBaseline = "top";
    ctx.fillText(text, textX, currentY);
  }

  ctx.restore();

  return canvas.toDataURL("image/png");
}
