export type PaletteColor = {
  hex: string;
  count: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
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

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function quantizeColor(value: number, step: number) {
  return Math.min(255, Math.round(value / step) * step);
}

export async function extractColorPalette(
  file: File,
  colorCount = 5
): Promise<PaletteColor[]> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const maxSize = 240;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);

  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const colorMap = new Map<string, PaletteColor>();
  const quantizeStep = 24;

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];

    if (alpha < 128) continue;

    const red = quantizeColor(imageData.data[index], quantizeStep);
    const green = quantizeColor(imageData.data[index + 1], quantizeStep);
    const blue = quantizeColor(imageData.data[index + 2], quantizeStep);
    const hex = rgbToHex(red, green, blue);
    const existingColor = colorMap.get(hex);

    if (existingColor) {
      existingColor.count += 1;
    } else {
      colorMap.set(hex, {
        hex,
        count: 1,
        rgb: {
          r: red,
          g: green,
          b: blue,
        },
      });
    }
  }

  return Array.from(colorMap.values())
    .sort((firstColor, secondColor) => secondColor.count - firstColor.count)
    .slice(0, colorCount);
}
