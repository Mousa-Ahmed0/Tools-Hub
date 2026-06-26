export type PassportPhotoPresetKey = "us-passport" | "standard-id" | "square-profile";

export type PassportPhotoPreset = {
  key: PassportPhotoPresetKey;
  label: string;
  description: string;
  width: number;
  height: number;
};

export const passportPhotoPresets: PassportPhotoPreset[] = [
  {
    key: "us-passport",
    label: "US Passport Photo",
    description: "2 x 2 inch",
    width: 600,
    height: 600,
  },
  {
    key: "standard-id",
    label: "Standard ID Photo",
    description: "35 x 45 mm",
    width: 413,
    height: 531,
  },
  {
    key: "square-profile",
    label: "Square Profile Photo",
    description: "600 x 600 px",
    width: 600,
    height: 600,
  },
];

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

export async function createPassportPhoto(
  file: File,
  preset: PassportPhotoPreset
): Promise<string> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageRatio = image.width / image.height;
  const targetRatio = preset.width / preset.height;
  let drawWidth = preset.width;
  let drawHeight = preset.height;

  if (imageRatio > targetRatio) {
    drawWidth = preset.width;
    drawHeight = preset.width / imageRatio;
  } else {
    drawHeight = preset.height;
    drawWidth = preset.height * imageRatio;
  }

  const x = (preset.width - drawWidth) / 2;
  const y = (preset.height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  return canvas.toDataURL("image/png");
}
