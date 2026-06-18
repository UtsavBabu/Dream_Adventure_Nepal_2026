import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { saveSiteSetting } from "@/lib/api/settings.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/visibility")({
  component: VisibilityAdmin,
});

type SectionDef = {
  id: string;
  label: string;
};

type PageGroup = {
  title: string;
  sections: SectionDef[];
};

const GROUPS: PageGroup[] = [
  {
    title: "Global",
    sections: [
      { id: "navbar", label: "Navbar" },
      { id: "cta", label: "Get In Touch / CTA" },
      { id: "footer", label: "Site Footer" },
    ],
  },
  {
    title: "Homepage",
    sections: [
      { id: "home_hero", label: "Hero" },
      { id: "home_treks", label: "Treks Section" },
      { id: "home_expeditions", label: "Expeditions Section" },
      { id: "home_tours", label: "Tours Section" },
      { id: "home_why_us", label: "Why Us / About" },
      { id: "home_our_team", label: "Our Team" },
      { id: "home_guides", label: "Guides" },
      { id: "home_testimonials", label: "Testimonials" },
      { id: "home_gallery", label: "Gallery" },
    ],
  },
  {
    title: "Tours Page",
    sections: [
      { id: "tours_hero", label: "Hero" },
      { id: "tours_listing", label: "Tour Listing Grid" },
      { id: "tours_booking", label: "Booking Section" },
    ],
  },
  {
    title: "Expeditions Page",
    sections: [
      { id: "expeditions_hero", label: "Hero" },
      { id: "expeditions_listing", label: "Expedition Listing Grid" },
    ],
  },
  {
    title: "Treks Page",
    sections: [
      { id: "treks_hero", label: "Hero" },
      { id: "treks_listing", label: "Trek Listing Grid" },
    ],
  },
  {
    title: "Adventure Detail Page",
    sections: [
      { id: "adventure_overview", label: "Overview" },
      { id: "adventure_highlights", label: "Highlights" },
      { id: "adventure_itinerary", label: "Itinerary" },
      { id: "adventure_places", label: "Destinations / Places" },
      { id: "adventure_map", label: "Location Map" },
      { id: "adventure_includes", label: "Includes / Excludes" },
      { id: "adventure_booking", label: "Booking Section" },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.sections.map((s) => s.id));

function makeDefaults(): Record<string, boolean> {
  const d: Record<string, boolean> = {};
  for (const id of ALL_IDS) d[id] = true;
  return d;
}

function VisibilityAdmin() {
  const queryClient = useQueryClient();
  const [vis, setVis] = useState<Record<string, boolean>>(makeDefaults);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "section_visibility")
      .maybeSingle();
    if (data?.value) {
      setVis({ ...makeDefaults(), ...(data.value as Record<string, boolean>) });
    }
    setLoaded(true);
  }

  function toggle(id: string, checked: boolean) {
    setVis((prev) => ({ ...prev, [id]: checked }));
  }

  function enabledCount(): number {
    return Object.values(vis).filter(Boolean).length;
  }

  async function save() {
    setBusy(true);
    try {
      await saveSiteSetting({ data: { key: "section_visibility", value: vis } });
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Section visibility saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Studio
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Section Visibility</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Show or hide sections across the site ({enabledCount()} / {ALL_IDS.length} visible).
          </p>
        </div>
        <Button
          onClick={save}
          disabled={busy}
          className="rounded-full btn-hero px-8 py-6 text-sm font-semibold"
        >
          {busy ? "Saving…" : "Save Visibility"}
        </Button>
      </div>

      <div className="mt-8 space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="rounded-2xl bg-white p-6 shadow-glass">
            <Label className="font-display text-lg text-primary">{group.title}</Label>
            <div className="mt-4 space-y-1">
              {group.sections.map((section) => {
                const on = vis[section.id] ?? true;
                return (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      {on ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={`text-sm ${on ? "text-primary" : "text-muted-foreground line-through"}`}
                      >
                        {section.label}
                      </span>
                    </div>
                    <Switch checked={on} onCheckedChange={(c) => toggle(section.id, c)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
