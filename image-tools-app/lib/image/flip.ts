export async function flipImage(
    file: File,
    direction: "horizontal" | "vertical"
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
  
          ctx.save();
  
          if (direction === "horizontal") {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          } else {
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
          }
  
          ctx.drawImage(img, 0, 0);
          ctx.restore();
  
          resolve(canvas.toDataURL("image/png"));
        };
  
        img.onerror = () => reject(new Error("Could not load image."));
        img.src = reader.result as string;
      };
  
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }