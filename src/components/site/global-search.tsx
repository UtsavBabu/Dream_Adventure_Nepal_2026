import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { adventuresQuery } from "@/lib/site-data";

/**
 * Global adventure search — a command-palette overlay reachable from the navbar
 * on every page. Filters published adventures by title / category / difficulty
 * and links straight to the detail page.
 */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { data: items = [] } = useQuery(adventuresQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
    setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Cmd/Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    return items
      .filter((a) => `${a.title} ${a.category} ${a.difficulty}`.toLowerCase().includes(query))
      .slice(0, 7);
  }, [items, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search adventures"
        className="grid h-10 w-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[120]">
          <div
            className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-24">
            <div className="overflow-hidden rounded-3xl bg-white shadow-elegant">
              <div className="flex items-center gap-3 px-4">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search treks, expeditions, tours…"
                  className="w-full bg-transparent py-4 text-primary outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {query && (
                <div className="max-h-[60vh] overflow-auto border-t border-border p-2">
                  {results.length === 0 ? (
                    <p className="px-3 py-8 text-center text-small text-muted-foreground">
                      No adventures match “{q}”.
                    </p>
                  ) : (
                    results.map((a) => (
                      <Link
                        key={a.id}
                        to="/adventures/$slug"
                        params={{ slug: a.slug }}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-surface"
                      >
                        <img
                          src={a.image_url || undefined}
                          alt=""
                          loading="lazy"
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-primary">{a.title}</div>
                          <div className="mt-0.5 flex items-center gap-2 text-caption text-muted-foreground">
                            <span>{a.category}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {a.duration}
                            </span>
                            <span>·</span>
                            <span className="text-accent">{a.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="mt-3 text-center text-caption text-white/60">
              Press <kbd className="rounded bg-white/15 px-1.5 py-0.5">Esc</kbd> to close ·{" "}
              <kbd className="rounded bg-white/15 px-1.5 py-0.5">⌘K</kbd> to search
            </p>
          </div>
        </div>
      )}
    </>
  );
}
