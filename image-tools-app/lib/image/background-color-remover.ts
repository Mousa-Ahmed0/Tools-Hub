export type RgbColor = {
  r: number;
  g: number;
  b: number;
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

export function hexToRgb(hexColor: string): RgbColor {
  const normalizedHex = hexColor.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
    throw new Error("Invalid hex color.");
  }

  return {
    r: parseInt(normalizedHex.slice(0, 2), 16),
    g: parseInt(normalizedHex.slice(2, 4), 16),
    b: parseInt(normalizedHex.slice(4, 6), 16),
  };
}

export async function removeBackgroundColor(
  file: File,
  hexColor: string,
  tolerance: number
): Promise<string> {
  const selectedColor = hexToRgb(hexColor);
  const normalizedTolerance = Math.min(Math.max(tolerance, 0), 100);
  const maxDistance = Math.sqrt(255 * 255 * 3);
  const distanceLimit = (normalizedTolerance / 100) * maxDistance;
  const image = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const redDistance = data[index] - selectedColor.r;
    const greenDistance = data[index + 1] - selectedColor.g;
    const blueDistance = data[index + 2] - selectedColor.b;
    const colorDistance = Math.sqrt(
      redDistance * redDistance +
        greenDistance * greenDistance +
        blueDistance * blueDistance
    );

    if (colorDistance <= distanceLimit) {
      data[index + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
