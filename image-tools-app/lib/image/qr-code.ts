import QRCode from "qrcode";

export async function generateQrCode(value: string): Promise<string> {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error("QR code content is required.");
  }

  return QRCode.toDataURL(trimmedValue, {
    errorCorrectionLevel: "M",
    margin: 2,
    type: "image/png",
    width: 512,
  });
}
