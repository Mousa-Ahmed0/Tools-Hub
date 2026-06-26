export type PickedColor = {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
};

export function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

export function getImageCanvas(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return { canvas, ctx };
}

export function getImagePixelColor(
  image: HTMLImageElement,
  clickX: number,
  clickY: number
): PickedColor {
  const rect = image.getBoundingClientRect();
  const scaleX = image.naturalWidth / rect.width;
  const scaleY = image.naturalHeight / rect.height;
  const pixelX = Math.min(
    image.naturalWidth - 1,
    Math.max(0, Math.floor((clickX - rect.left) * scaleX))
  );
  const pixelY = Math.min(
    image.naturalHeight - 1,
    Math.max(0, Math.floor((clickY - rect.top) * scaleY))
  );
  const { ctx } = getImageCanvas(image);
  const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;

  return {
    hex: rgbToHex(pixel[0], pixel[1], pixel[2]),
    rgb: {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
    },
  };
}
