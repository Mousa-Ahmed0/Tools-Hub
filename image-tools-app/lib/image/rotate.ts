export async function rotateImage(
    file: File,
    degrees: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const img = new Image();
  
        img.onload = () => {
          const radians = (degrees * Math.PI) / 180;
  
          const sin = Math.abs(Math.sin(radians));
          const cos = Math.abs(Math.cos(radians));
  
          const newWidth = Math.ceil(img.width * cos + img.height * sin);
          const newHeight = Math.ceil(img.width * sin + img.height * cos);
  
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not create canvas context."));
            return;
          }
  
          ctx.translate(newWidth / 2, newHeight / 2);
          ctx.rotate(radians);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
  
          resolve(canvas.toDataURL("image/png"));
        };
  
        img.onerror = () => reject(new Error("Could not load image."));
        img.src = reader.result as string;
      };
  
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }