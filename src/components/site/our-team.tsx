import type { TeamMember } from "@/lib/site-data";

export function OurTeam({ items }: { items: TeamMember[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Our Team
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium text-primary sm:text-5xl">
            Meet the experts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Local guides, global standards — every member of our team shares a deep love for the
            Himalayas.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((member) => (
            <div key={member.id} className="group text-center">
              <div className="mx-auto h-48 w-48 overflow-hidden rounded-full shadow-elegant transition group-hover:shadow-lg">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-xl text-primary">{member.name}</h3>
              <div className="mt-1 text-sm font-medium text-accent">{member.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
