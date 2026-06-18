import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { saveSiteSetting } from "@/lib/api/settings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: HeroAdmin,
});

type Stat = { value: string; label: string };

type HeroData = {
  video_url: string;
  badge: string;
  title_pre: string;
  title_highlight: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  rated_text: string;
  footer_text: string;
  stats: Stat[];
};

const DEFAULTS: HeroData = {
  video_url: "",
  badge: "Premium Adventures Since 2005",
  title_pre: "Explore Nepal Beyond",
  title_highlight: "The Ordinary",
  subtitle:
    "From Everest Base Camp to the hidden valleys of Mustang — cinematic adventures in the Himalayas, crafted by local experts.",
  cta_primary: "Start Your Journey",
  cta_secondary: "Watch Our Story",
  rated_text: "Rated by 5,000+ travelers",
  footer_text: "Government-licensed · Sherpa-led · 100% local team",
  stats: [
    { value: "25+", label: "Years Experience" },
    { value: "5,000+", label: "Happy Travelers" },
    { value: "100%", label: "Local Team" },
    { value: "4.98", label: "Avg. Rating" },
  ],
};

function HeroAdmin() {
  const queryClient = useQueryClient();
  const [hero, setHero] = useState<HeroData>(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadHero();
  }, []);

  async function loadHero() {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero")
      .maybeSingle();
    if (data?.value) {
      setHero({ ...DEFAULTS, ...(data.value as Partial<HeroData>) });
    }
    setLoaded(true);
  }

  function patch(partial: Partial<HeroData>) {
    setHero((prev) => ({ ...prev, ...partial }));
  }

  function patchStat(i: number, partial: Partial<Stat>) {
    setHero((prev) => {
      const stats = [...prev.stats];
      stats[i] = { ...stats[i], ...partial };
      return { ...prev, stats };
    });
  }

  function addStat() {
    setHero((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "", label: "" }],
    }));
  }

  function removeStat(i: number) {
    setHero((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== i),
    }));
  }

  async function save() {
    setBusy(true);
    try {
      const payload: Record<string, unknown> = { ...hero };
      await saveSiteSetting({ data: { key: "hero", value: payload } });
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Hero section saved");
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
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Studio</div>
      <h1 className="mt-2 font-display text-3xl text-primary">Hero Section</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Customise the homepage hero — video background, headlines, buttons and stats.
      </p>

      <div className="mt-8 space-y-6">
        {/* Video */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Background Video</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            MP4 URL for the hero background video. Leave empty for gradient-only background.
          </p>
          <Input
            value={hero.video_url}
            onChange={(e) => patch({ video_url: e.target.value })}
            placeholder="https://example.com/hero.mp4"
          />
        </div>

        {/* Badge */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Badge</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Small label shown above the main heading.
          </p>
          <Input
            value={hero.badge}
            onChange={(e) => patch({ badge: e.target.value })}
            placeholder="Premium Adventures Since 2005"
          />
        </div>

        {/* Titles */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Headings</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            The main title is split into two parts — regular text and an italicised highlight.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Title (before highlight)</Label>
              <Input
                value={hero.title_pre}
                onChange={(e) => patch({ title_pre: e.target.value })}
                placeholder="Explore Nepal Beyond"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Highlight (italic)</Label>
              <Input
                value={hero.title_highlight}
                onChange={(e) => patch({ title_highlight: e.target.value })}
                placeholder="The Ordinary"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Subtitle</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Paragraph shown below the main heading.
          </p>
          <Textarea
            rows={3}
            value={hero.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="From Everest Base Camp to the hidden valleys of Mustang…"
          />
        </div>

        {/* Buttons */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Call-to-Action Buttons</Label>
          <p className="mb-4 text-sm text-muted-foreground">Text for the two hero buttons.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Primary button</Label>
              <Input
                value={hero.cta_primary}
                onChange={(e) => patch({ cta_primary: e.target.value })}
                placeholder="Start Your Journey"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Secondary button</Label>
              <Input
                value={hero.cta_secondary}
                onChange={(e) => patch({ cta_secondary: e.target.value })}
                placeholder="Watch Our Story"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-display text-lg text-primary">Stats Cards</Label>
              <p className="text-sm text-muted-foreground">
                Statistics shown in the floating card next to the hero.
              </p>
            </div>
            <Button onClick={addStat} variant="outline" className="rounded-full" size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Stat
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {hero.stats.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <GripVertical className="mt-2 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Value</Label>
                    <Input
                      value={s.value}
                      onChange={(e) => patchStat(i, { value: e.target.value })}
                      placeholder="25+"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Label</Label>
                    <Input
                      value={s.label}
                      onChange={(e) => patchStat(i, { label: e.target.value })}
                      placeholder="Years Experience"
                      className="mt-1"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeStat(i)}
                  className="mt-6 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Extra text fields */}
        <div className="rounded-2xl bg-white p-6 shadow-glass">
          <Label className="font-display text-lg text-primary">Extra Text</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Additional text shown inside the floating stats card.
          </p>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Rating line</Label>
              <Input
                value={hero.rated_text}
                onChange={(e) => patch({ rated_text: e.target.value })}
                placeholder="Rated by 5,000+ travelers"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Footer line</Label>
              <Input
                value={hero.footer_text}
                onChange={(e) => patch({ footer_text: e.target.value })}
                placeholder="Government-licensed · Sherpa-led · 100% local team"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={save}
          disabled={busy}
          className="rounded-full btn-hero px-8 py-6 text-sm font-semibold"
        >
          {busy ? "Saving…" : "Save Hero"}
        </Button>
      </div>

      <div className="mt-4 text-right text-xs text-muted-foreground">
        Changes apply immediately. Hard refresh the homepage to preview.
      </div>
    </div>
  );
}
