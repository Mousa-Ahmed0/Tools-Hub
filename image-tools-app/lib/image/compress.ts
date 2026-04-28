export async function compressImage(
    file: File,
    quality: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const img = new Image();
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not create canvas context."));
            return;
          }
  
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
  
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        };
  
        img.onerror = () => reject(new Error("Could not load image."));
        img.src = reader.result as string;
      };
  
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }