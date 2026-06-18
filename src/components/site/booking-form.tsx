import { useState } from "react";
import { Send, Check, Loader2, Calendar, Users, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookingFormProps = {
  adventureId: string;
  adventureTitle: string;
  adventureSlug: string;
  price: string;
  esewaQrUrl?: string;
};

export function BookingForm({
  adventureId,
  adventureTitle,
  adventureSlug,
  price,
  esewaQrUrl,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [people, setPeople] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "pay_later">("pay_later");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentMethod, setSentMethod] = useState<"online" | "pay_later">("pay_later");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !startDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("bookings").insert({
      adventure_id: adventureId,
      adventure_title: adventureTitle,
      adventure_slug: adventureSlug,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      start_date: startDate,
      number_of_people: Number(people),
      payment_method: paymentMethod,
      payment_status: paymentMethod === "online" ? "unpaid" : "unpaid",
      message: message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Failed to submit booking. Please try again.");
      return;
    }
    toast.success("Booking request sent! We'll confirm availability within 24 hours.");
    setSent(true);
    setSentMethod(paymentMethod);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="font-display text-2xl text-white">Booking Request Sent!</h3>
        <p className="max-w-sm text-white/60">
          We've received your request for <strong>{adventureTitle}</strong>. Our team will confirm
          availability within 24 hours.
        </p>
        {sentMethod === "pay_later" && (
          <p className="max-w-sm text-sm text-white/50">
            You chose <strong>Pay Later</strong> — we'll send payment details after confirmation. No
            upfront payment needed.
          </p>
        )}
        {sentMethod === "online" && (
          <p className="max-w-sm text-sm text-white/50">
            You chose <strong>Pay Online</strong> — we'll send a secure payment link after
            confirming availability.
          </p>
        )}
        <button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setPhone("");
            setStartDate("");
            setPeople("1");
            setMessage("");
          }}
          className="mt-2 text-sm text-accent underline underline-offset-4 hover:text-accent/80"
        >
          Book another adventure
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Full Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:border-accent"
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
            className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:border-accent"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Phone *</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+977 98..."
            required
            className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:border-accent"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Start Date *</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border-white/20 bg-white/5 text-white [color-scheme:dark] focus:border-accent"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Number of People</Label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              type="number"
              min={1}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="border-white/20 bg-white/5 pl-10 text-white focus:border-accent"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-white/60">Trip</Label>
          <div className="flex h-10 items-center rounded-md border border-white/20 bg-white/5 px-3 text-sm text-white/70">
            {adventureTitle}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-white/60">Payment Preference</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("pay_later")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
              paymentMethod === "pay_later"
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/20 text-white/60 hover:border-white/40"
            }`}
          >
            <Banknote className="h-6 w-6" />
            <div>
              <div className="text-sm font-medium">Pay Later</div>
              <div className="text-xs opacity-60">No upfront payment</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("online")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
              paymentMethod === "online"
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/20 text-white/60 hover:border-white/40"
            }`}
          >
            <CreditCard className="h-6 w-6" />
            <div>
              <div className="text-sm font-medium">Pay Online</div>
              <div className="text-xs opacity-60">Secure payment link</div>
            </div>
          </button>
        </div>
        <p className="text-xs text-white/40">
          {paymentMethod === "pay_later"
            ? "No payment needed now. We'll send payment options after confirming your booking."
            : "We'll send a secure payment link after confirming availability. Deposit: 20% of total."}
        </p>
        {paymentMethod === "online" && esewaQrUrl && (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="text-xs font-medium text-white/60">Scan to pay with eSewa</span>
            <img
              src={esewaQrUrl}
              alt="eSewa QR Code"
              className="h-48 w-48 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-white/60">Special Requests</Label>
        <Textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any special requirements, dietary needs, or questions..."
          className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus:border-accent"
        />
      </div>
      <Button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-accent py-6 text-sm font-semibold text-white hover:bg-accent/90"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" /> Request Booking
          </>
        )}
      </Button>
    </form>
  );
}
