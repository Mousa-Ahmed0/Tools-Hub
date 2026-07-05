import { recognize } from "tesseract.js";

export async function extractTextFromImage(file: File): Promise<string> {
  const result = await recognize(file, "eng");
  return result.data.text.trim();
}
