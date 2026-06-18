import { Phone, Mail, MessageCircle } from "lucide-react";
import { BookingForm } from "@/components/site/booking-form";

type Adventure = {
  id: string;
  title: string;
  slug: string;
  price: string;
};

export function AdventureBooking({
  adventure,
  contact,
  esewaQrUrl,
}: {
  adventure: Adventure;
  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  esewaQrUrl?: string;
}) {
  const whatsappUrl = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in the ${adventure.title} (${adventure.price}). Can you share more details?`)}`
    : null;

  return (
    <section id="booking" className="bg-primary py-28 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Book This Adventure
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
            Ready for the {adventure.title}?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Fill out the form below and we'll confirm your booking within 24 hours.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
              <BookingForm
                adventureId={adventure.id}
                adventureTitle={adventure.title}
                adventureSlug={adventure.slug}
                price={adventure.price}
                esewaQrUrl={esewaQrUrl}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-display text-lg text-white">Quick Contact</h3>
                <p className="mt-2 text-sm text-white/50">
                  Prefer to reach out directly? We're here to help.
                </p>
                <div className="mt-5 space-y-3">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-green-500/20 p-3 text-sm font-medium text-green-300 transition hover:bg-green-500/30"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-white/70 transition hover:bg-white/10"
                    >
                      <Phone className="h-5 w-5" />
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-white/70 transition hover:bg-white/10"
                    >
                      <Mail className="h-5 w-5" />
                      {contact.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="font-display text-lg text-white">{adventure.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-medium text-accent">{adventure.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit required</span>
                    <span className="font-medium text-white">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation</span>
                    <span className="font-medium text-white">Free 14 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-10 text-center text-sm text-white/40">
          We reply within 2 hours. No commitment, no pressure — just honest answers.
        </div>
      </div>
    </section>
  );
}
