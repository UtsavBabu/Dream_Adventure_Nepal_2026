import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      bucket: z.string(),
      filePath: z.string(),
      base64: z.string(),
      contentType: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const buffer = Buffer.from(data.base64, "base64");
    const { error } = await supabaseAdmin.storage
      .from(data.bucket)
      .upload(data.filePath, buffer, { contentType: data.contentType, upsert: true });
    if (error) throw new Error(error.message);
    const { data: urlData } = await supabaseAdmin.storage
      .from(data.bucket)
      .getPublicUrl(data.filePath);
    return { publicUrl: urlData.publicUrl };
  });
