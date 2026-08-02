import type { TeamMember } from "@/lib/site-data";

export function OurTeam({ items }: { items: TeamMember[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">Our Team</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">Meet our Team</h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Local guides, global standards — every member of our team shares a deep love for the
            Himalayas. <span className="text-primary/60">Hover to read their story.</span>
          </p>
        </div>

        <div className="reveal stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((member) => (
            <div
              key={member.id}
              className="group card-elevate relative h-[22rem] overflow-hidden rounded-3xl bg-primary shadow-elegant"
            >
              <img
                src={member.avatar_url}
                alt={member.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />

              {/* Base label — fades as the glass panel rises */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-0">
                <h3 className="font-display text-xl font-medium">{member.name}</h3>
                <div className="mt-1 text-sm font-semibold text-accent">{member.role}</div>
              </div>

              {/* Glass reveal — bio on hover */}
              {member.bio && (
                <div className="absolute inset-x-3 bottom-3 translate-y-6 rounded-2xl glass p-5 text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="font-display text-lg font-medium">{member.name}</h3>
                  <div className="text-sm font-semibold text-accent">{member.role}</div>
                  <div className="mt-3 h-px w-10 bg-accent/40" />
                  <p className="mt-3 text-sm leading-relaxed text-white/85">{member.bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
