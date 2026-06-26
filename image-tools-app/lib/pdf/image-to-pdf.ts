import jsPDF from "jspdf";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));

    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));

    img.src = src;
  });
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
  if (!files.length) {
    throw new Error("No images selected.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imageRatio = img.width / img.height;
    const pageRatio = pageWidth / pageHeight;

    let renderWidth = pageWidth;
    let renderHeight = pageHeight;

    if (imageRatio > pageRatio) {
      renderWidth = pageWidth;
      renderHeight = pageWidth / imageRatio;
    } else {
      renderHeight = pageHeight;
      renderWidth = pageHeight * imageRatio;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    if (index > 0) {
      pdf.addPage();
    }

    pdf.addImage(dataUrl, "JPEG", x, y, renderWidth, renderHeight);
  }

  return pdf.output("blob");
}