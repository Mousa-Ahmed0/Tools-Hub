export async function resizeForCanvasFit(
    file: File,
    targetWidth: number,
    targetHeight: number,
    backgroundColor = "#ffffff"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const img = new Image();
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not create canvas context."));
            return;
          }
  
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
  
          const imageRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;
  
          let drawWidth = targetWidth;
          let drawHeight = targetHeight;
  
          if (imageRatio > targetRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / imageRatio;
          } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * imageRatio;
          }
  
          const x = (targetWidth - drawWidth) / 2;
          const y = (targetHeight - drawHeight) / 2;
  
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
  
          resolve(canvas.toDataURL("image/png"));
        };
  
        img.onerror = () => reject(new Error("Could not load image."));
        img.src = reader.result as string;
      };
  
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }