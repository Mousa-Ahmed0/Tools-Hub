export type ImageMetadata = {
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  imageType: string;
  lastModified: number;
};

export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        fileName: file.name,
        fileSize: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight,
        imageType: file.type || "Unknown",
        lastModified: file.lastModified,
      });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      reject(new Error("Could not read image metadata."));
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}
