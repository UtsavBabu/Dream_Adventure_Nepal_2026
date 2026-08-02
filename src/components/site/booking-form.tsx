import { Fragment, useState } from "react";
import {
  Check,
  Loader2,
  Calendar,
  Users,
  CreditCard,
  Banknote,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
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

const STEPS = [
  { n: 1, label: "Dates & group" },
  { n: 2, label: "Your details" },
  { n: 3, label: "Payment" },
];

const labelCls = "text-caption uppercase tracking-wider text-white/60";
const inputCls =
  "field-dark";

export function BookingForm({
  adventureId,
  adventureTitle,
  adventureSlug,
  price,
  esewaQrUrl,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
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

  function validateStep(s: number) {
    if (s === 1 && !startDate) {
      toast.error("Please choose a start date.");
      return false;
    }
    if (s === 2 && (!name.trim() || !email.trim() || !phone.trim())) {
      toast.error("Please fill in your name, email and phone.");
      return false;
    }
    return true;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(STEPS.length, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function doSubmit() {
    if (!validateStep(1) || !validateStep(2)) return;
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
      payment_status: "unpaid",
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

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < STEPS.length) {
      next();
      return;
    }
    doSubmit();
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h3 className="font-display text-h3 text-white">Booking request sent!</h3>
        <p className="max-w-sm text-white/60">
          We've received your request for <strong>{adventureTitle}</strong>. Our team will confirm
          availability within 24 hours.
        </p>
        <p className="max-w-sm text-small text-white/50">
          {sentMethod === "pay_later"
            ? "You chose Pay Later — we'll send payment details after confirmation. No upfront payment needed."
            : "You chose Pay Online — we'll send a secure payment link after confirming availability."}
        </p>
        <button
          onClick={() => {
            setSent(false);
            setStep(1);
            setName("");
            setEmail("");
            setPhone("");
            setStartDate("");
            setPeople("1");
            setMessage("");
          }}
          className="mt-2 text-small text-accent underline underline-offset-4 hover:text-accent/80"
        >
          Book another adventure
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onFormSubmit} className="text-left">
      {/* Progress */}
      <div className="mb-8 flex items-center">
        {STEPS.map((st, i) => {
          const done = step > st.n;
          const active = step === st.n;
          return (
            <Fragment key={st.n}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-small font-semibold transition ${
                    done
                      ? "bg-accent text-white"
                      : active
                        ? "bg-accent/20 text-accent ring-2 ring-accent"
                        : "bg-white/10 text-white/50"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : st.n}
                </div>
                <span
                  className={`hidden text-caption font-medium sm:inline ${
                    active || done ? "text-white" : "text-white/45"
                  }`}
                >
                  {st.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-3 h-px flex-1 bg-white/15">
                  <div
                    className={`h-px bg-accent transition-all duration-500 ${done ? "w-full" : "w-0"}`}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Step 1 — Dates & group */}
      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className={labelCls}>Start Date *</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={`${inputCls} [color-scheme:dark]`}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>Number of People</Label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className={labelCls}>Trip</Label>
            <div className="flex h-10 items-center rounded-md border border-white/20 bg-white/5 px-3 text-small text-white/70">
              {adventureTitle}
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Your details */}
      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className={labelCls}>Full Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className={labelCls}>Phone *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977 98..."
              required
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Step 3 — Payment & confirm */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-small">
            <div className="flex justify-between py-1">
              <span className="text-white/55">Trip</span>
              <span className="font-medium text-white">{adventureTitle}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-white/55">Start date</span>
              <span className="font-medium text-white">{startDate || "—"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-white/55">Travelers</span>
              <span className="font-medium text-white">{people}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2">
              <span className="text-white/55">From</span>
              <span className="font-display text-lg text-accent">{price}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className={labelCls}>Payment Preference</Label>
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
                  <div className="text-small font-medium">Pay Later</div>
                  <div className="text-caption opacity-60">No upfront payment</div>
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
                  <div className="text-small font-medium">Pay Online</div>
                  <div className="text-caption opacity-60">Secure payment link</div>
                </div>
              </button>
            </div>
            <p className="text-caption text-white/40">
              {paymentMethod === "pay_later"
                ? "No payment needed now. We'll send payment options after confirming your booking."
                : "We'll send a secure payment link after confirming availability. Deposit: 35% of total."}
            </p>
            {paymentMethod === "online" && esewaQrUrl && (
              <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="text-caption font-medium text-white/60">Scan to pay with eSewa</span>
                <img
                  src={esewaQrUrl}
                  alt="eSewa QR Code"
                  className="h-48 w-48 rounded-lg object-contain"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls}>Special Requests</Label>
            <Textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any special requirements, dietary needs, or questions..."
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-small font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full btn-primary px-6 py-3.5 text-small font-semibold sm:flex-none"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Button
            type="submit"
            disabled={sending}
            className="flex-1 rounded-full bg-accent py-6 text-small font-semibold text-primary hover:bg-accent/90"
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
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-caption text-white/40">
        <ShieldCheck className="h-4 w-4 text-accent" />
        No commitment · Free cancellation up to 5 days · We reply within 2 hours
      </div>
    </form>
  );
}
