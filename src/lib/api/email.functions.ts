import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || "info@dreamadventurenepal.com";

export const sendContactNotification = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string(),
      message: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || "Not provided",
        message: data.message,
        _subject: `New Contact Message from ${data.name}`,
      };

      const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      console.log("[Email] FormSubmit response:", { status: res.status, body });

      if (!res.ok || !body.success) {
        return { ok: false, error: body.message || "FormSubmit request failed" };
      }

      return { ok: true };
    } catch (err) {
      console.error("[Email] FormSubmit error:", err);
      return { ok: false, error: "Could not send notification email" };
    }
  });
