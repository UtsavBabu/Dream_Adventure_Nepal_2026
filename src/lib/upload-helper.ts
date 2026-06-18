import { uploadImage } from "@/lib/api/upload.functions";

export async function clientUpload(file: File, filePath: string): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const { publicUrl } = await uploadImage({
    data: { bucket: "images", filePath, base64, contentType: file.type },
  });
  return publicUrl;
}
