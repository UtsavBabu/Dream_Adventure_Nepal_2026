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
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Meet our Team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Local guides, global standards — every member of our team shares a deep love for the
            Himalayas.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl border bg-card p-6 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto h-44 w-44 overflow-hidden rounded-full shadow-elegant transition duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-display text-xl font-medium text-primary">
                  {member.name}
                </h3>
                <div className="mt-1 text-sm font-semibold text-accent">{member.role}</div>
                <div className="mx-auto mt-4 h-px w-10 bg-accent/20" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
