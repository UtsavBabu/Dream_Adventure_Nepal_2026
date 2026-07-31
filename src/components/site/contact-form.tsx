import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const RECIPIENT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "info@dreamadventurenepal.com";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.trim() || "Not provided");
      fd.append("message", message.trim());
      fd.append("_subject", `New Contact Message from ${name.trim()}`);
      fd.append("_captcha", "false");
      fd.append("_next", "/thank-you");

      const res = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: "POST",
        body: fd,
      });

      const body = await res.json();

      if (!res.ok || !body.success) {
        throw new Error(body.message || "FormSubmit request failed");
      }

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setSent(true);
    } catch (err) {
      console.error("[ContactForm] FormSubmit error:", err);
      toast.error("Failed to send. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="font-display text-2xl text-white">Thank you!</h3>
        <p className="max-w-sm text-white/60">
          Your message has been received. We'll reply within 24 hours.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
          }}
          className="mt-2 text-sm text-accent underline underline-offset-4 hover:text-accent/80"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="field-dark"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Email *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="field-dark"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/60">Phone (optional)</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+977 ..."
          className="field-dark"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/60">Message *</Label>
        <Textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your adventure plans..."
          required
          className="field-dark"
        />
      </div>
      <Button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-accent py-6 text-sm font-semibold text-primary hover:bg-accent/90"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}
