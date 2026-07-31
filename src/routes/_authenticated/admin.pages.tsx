import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { saveSiteSetting } from "@/lib/api/settings.functions";
import { clientUpload } from "@/lib/upload-helper";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: PagesAdmin,
});

type PageData = {
  hero_image: string;
  badge: string;
  title: string;
  title_highlight: string;
  subtitle: string;
};

type PageKey = "tours_page" | "expeditions_page" | "treks_page";

type Section = {
  key: PageKey;
  label: string;
  defaults: PageData;
};

const SECTIONS: Section[] = [
  {
    key: "tours_page",
    label: "Tours",
    defaults: {
      hero_image:
        "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920",
      badge: "Cultural Tours",
      title: "Discover Nepal's",
      title_highlight: "soul",
      subtitle:
        "UNESCO heritage sites, wildlife safaris, sunrise flights, and lakeside relaxation — curated by local experts.",
    },
  },
  {
    key: "expeditions_page",
    label: "Expeditions",
    defaults: {
      hero_image:
        "https://images.pexels.com/photos/2108850/pexels-photo-2108850.jpeg?auto=compress&cs=tinysrgb&w=1920",
      badge: "Climbing Expeditions",
      title: "Summit your first",
      title_highlight: "6,000m peak",
      subtitle:
        "Technical climbs led by certified Sherpa guides. Island Peak, Mera Peak, Ama Dablam — your next milestone awaits.",
    },
  },
  {
    key: "treks_page",
    label: "Treks",
    defaults: {
      hero_image:
        "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1920",
      badge: "Himalayan Treks",
      title: "Walk among the",
      title_highlight: "giants",
      subtitle:
        "From Everest Base Camp to the Annapurna Circuit — our treks take you deep into the world's most dramatic mountain scenery.",
    },
  },
];

function PagesAdmin() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<Record<PageKey, PageData>>(() => {
    const initial = {} as Record<PageKey, PageData>;
    for (const s of SECTIONS) initial[s.key] = { ...s.defaults };
    return initial;
  });
  const [busy, setBusy] = useState<PageKey | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const keys: PageKey[] = ["tours_page", "expeditions_page", "treks_page"];
    const { data: rows } = await supabase.from("site_settings").select("key,value").in("key", keys);
    setData((prev) => {
      const next = { ...prev };
      for (const s of SECTIONS) {
        const row = rows?.find((r) => r.key === s.key);
        if (row?.value) {
          next[s.key] = { ...s.defaults, ...(row.value as Partial<PageData>) };
        }
      }
      return next;
    });
    setLoaded(true);
  }

  function patch(key: PageKey, partial: Partial<PageData>) {
    setData((prev) => ({ ...prev, [key]: { ...prev[key], ...partial } }));
  }

  async function save(key: PageKey) {
    setBusy(key);
    try {
      await saveSiteSetting({ data: { key, value: data[key] } });
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success(`${SECTIONS.find((s) => s.key === key)!.label} page saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  const selectedSection = (key: PageKey) => {
    const section = SECTIONS.find((s) => s.key === key)!;
    const page = data[key];
    const isBusy = busy === key;

    return (
      <div key={key} className="rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">{section.label}</Label>
            <p className="text-sm text-muted-foreground">
              Hero content for the /{section.label.toLowerCase()} page.
            </p>
          </div>
          <Button onClick={() => save(key)} disabled={isBusy} className="rounded-full" size="sm">
            {isBusy ? "Saving…" : "Save"}
          </Button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <Label className="text-xs text-muted-foreground">Hero Background Image</Label>
            <ImageUpload
              value={page.hero_image}
              onChange={(url) => patch(key, { hero_image: url })}
              label="Hero Image"
              onUpload={clientUpload}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Badge</Label>
            <Input
              value={page.badge}
              onChange={(e) => patch(key, { badge: e.target.value })}
              placeholder="Cultural Tours"
              className="mt-1"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Title (before highlight)</Label>
              <Input
                value={page.title}
                onChange={(e) => patch(key, { title: e.target.value })}
                placeholder="Discover Nepal's"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Highlight (italic)</Label>
              <Input
                value={page.title_highlight}
                onChange={(e) => patch(key, { title_highlight: e.target.value })}
                placeholder="soul"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Subtitle</Label>
            <Textarea
              rows={2}
              value={page.subtitle}
              onChange={(e) => patch(key, { subtitle: e.target.value })}
              placeholder="Description shown below the heading."
              className="mt-1"
            />
          </div>
        </div>
      </div>
    );
  };

  if (!loaded) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="eyebrow">Studio</div>
      <h1 className="mt-2 font-display text-3xl text-primary">Pages</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Customise the hero section of each category listing page — background image, badge,
        headings, and subtitle.
      </p>

      <div className="mt-8 space-y-8">{SECTIONS.map((s) => selectedSection(s.key))}</div>
    </div>
  );
}
