export type ReadFileResult = {
  text?: string;
  dataUrl?: string;
  mimeType?: string;
};

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

const ext = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

/**
 * Reads the actual content of an uploaded file in the browser.
 * - txt: plain text
 * - docx: text extracted with mammoth
 * - pdf / images: base64 data URL, sent to a multimodal model server-side
 */
export async function readFileContent(file: File): Promise<ReadFileResult> {
  const extension = ext(file.name);
  const mimeType = file.type || undefined;

  if (extension === "txt" || mimeType?.startsWith("text/")) {
    return { text: await file.text() };
  }

  if (extension === "docx") {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    if (!value.trim()) throw new Error(`No readable text found in ${file.name}`);
    return { text: value };
  }

  if (extension === "pdf" || ["png", "jpg", "jpeg", "webp"].includes(extension)) {
    const fallback = extension === "pdf" ? "application/pdf" : `image/${extension === "jpg" ? "jpeg" : extension}`;
    return { dataUrl: await toDataUrl(file), mimeType: mimeType ?? fallback };
  }

  throw new Error(`${file.name} is not a supported file type.`);
}
