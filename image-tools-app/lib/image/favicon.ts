export type FaviconSize = 16 | 32 | 48;

export type GeneratedFaviconImage = {
  size: FaviconSize;
  dataUrl: string;
  blob: Blob;
};

export type GeneratedFavicons = {
  images: GeneratedFaviconImage[];
  icoBlob: Blob;
};

const faviconSizes: FaviconSize[] = [16, 32, 48];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not load image."));
      image.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create PNG blob."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

async function createFaviconImage(
  image: HTMLImageElement,
  size: FaviconSize
): Promise<GeneratedFaviconImage> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  ctx.clearRect(0, 0, size, size);

  const imageRatio = image.width / image.height;
  let drawWidth = size;
  let drawHeight = size;

  if (imageRatio > 1) {
    drawWidth = size;
    drawHeight = size / imageRatio;
  } else {
    drawHeight = size;
    drawWidth = size * imageRatio;
  }

  const x = (size - drawWidth) / 2;
  const y = (size - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  const blob = await canvasToPngBlob(canvas);

  return {
    size,
    dataUrl: canvas.toDataURL("image/png"),
    blob,
  };
}

async function createIcoBlob(images: GeneratedFaviconImage[]): Promise<Blob> {
  const imageBuffers = await Promise.all(
    images.map((image) => image.blob.arrayBuffer())
  );
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + images.length * entrySize;
  const imageDataSize = imageBuffers.reduce(
    (total, buffer) => total + buffer.byteLength,
    0
  );
  const icoBuffer = new ArrayBuffer(directorySize + imageDataSize);
  const view = new DataView(icoBuffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  let imageOffset = directorySize;

  images.forEach((image, index) => {
    const entryOffset = headerSize + index * entrySize;
    const imageBuffer = imageBuffers[index];

    view.setUint8(entryOffset, image.size);
    view.setUint8(entryOffset + 1, image.size);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, imageBuffer.byteLength, true);
    view.setUint32(entryOffset + 12, imageOffset, true);

    new Uint8Array(icoBuffer, imageOffset, imageBuffer.byteLength).set(
      new Uint8Array(imageBuffer)
    );

    imageOffset += imageBuffer.byteLength;
  });

  return new Blob([icoBuffer], { type: "image/x-icon" });
}

export async function generateFavicons(file: File): Promise<GeneratedFavicons> {
  const image = await loadImage(file);
  const images = await Promise.all(
    faviconSizes.map((size) => createFaviconImage(image, size))
  );
  const icoBlob = await createIcoBlob(images);

  return {
    images,
    icoBlob,
  };
}
