import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const sendContactNotification = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string(),
      message: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const key = process.env.WEB3FORMS_ACCESS_KEY;
    if (!key) {
      console.warn("[Email] WEB3FORMS_ACCESS_KEY not configured — skipping notification");
      return { ok: false, error: "Email service not configured" };
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `New Contact Message from ${data.name}`,
        from_name: data.name,
        email: data.email,
        phone: data.phone || "Not provided",
        message: data.message,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      console.error("[Email] Web3Forms error:", body);
      return { ok: false, error: body.message || "Web3Forms request failed" };
    }

    return { ok: true };
  });
