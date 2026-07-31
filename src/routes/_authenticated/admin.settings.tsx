import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Lock } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { saveSiteSetting, uploadFile } from "@/lib/api/settings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

const EMPTY_FEATURE = { title: "", desc: "" };

type SettingsState = {
  nav: { logo_url: string; logo: string; cta: string };
  contact: { email: string; phone: string; address: string };
  cta: { title: string; subtitle: string };
  footer: { tagline: string; copyright: string };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    features: { title: string; desc: string }[];
  };
  esewa: { qr_url: string };
};

const DEFAULTS: SettingsState = {
  nav: { logo_url: "", logo: "Dream Adventure Nepal", cta: "Plan My Trip" },
  contact: {
    email: "info@dreamadventurenepal.com",
    phone: "+977-1-2345678",
    address: "Kathmandu, Nepal",
  },
  cta: {
    title: "Start Your Adventure",
    subtitle: "Get in touch with our team and let us plan your dream Himalayan experience.",
  },
  footer: {
    tagline: "Crafting unforgettable Himalayan adventures since 2005.",
    copyright: "© 2025 Dream Adventure Nepal. All rights reserved.",
  },
  about: {
    eyebrow: "Why Dream Adventure Nepal",
    title: "Crafting Himalayan Stories Since 2005",
    subtitle:
      "We don't just organise treks — we curate life-changing journeys through the world's greatest mountain range.",
    features: [
      {
        title: "Expert Local Guides",
        desc: "Every trip is led by certified Nepali guides with decades of high-altitude experience.",
      },
      {
        title: "Sustainable Tourism",
        desc: "We prioritise eco-friendly practices and give back to mountain communities.",
      },
      {
        title: "Fully Customisable",
        desc: "Your adventure, your way. Tailor every detail from routes to accommodation.",
      },
      {
        title: "Safety First",
        desc: "Comprehensive gear, altitude protocols, and 24/7 support ensure peace of mind.",
      },
      {
        title: "Best Price Guarantee",
        desc: "Direct, local pricing means you get the best value with no middleman markups.",
      },
      {
        title: "Lifetime Memories",
        desc: "From sunrise over Everest to dinner with Sherpa families — moments that stay forever.",
      },
    ],
  },
  esewa: { qr_url: "" },
};

function SettingsAdmin() {
  const queryClient = useQueryClient();
  const [s, setS] = useState<SettingsState>(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
  }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: rows } = await supabase
      .from("site_settings")
      .select("key,value")
      .in("key", ["nav", "contact", "cta", "footer", "about", "esewa"]);
    const obj: Partial<SettingsState> = {};
    for (const k of [
      "nav",
      "contact",
      "cta",
      "footer",
      "about",
      "esewa",
    ] as (keyof SettingsState)[]) {
      const row = rows?.find((r) => r.key === k);
      if (row?.value)
        obj[k] = {
          ...DEFAULTS[k],
          ...(row.value as Record<string, unknown>),
        } as unknown as SettingsState[typeof k];
    }
    setS((prev) => ({ ...prev, ...obj }));
    setLoaded(true);
  }

  function patch<K extends keyof SettingsState>(key: K, val: Partial<SettingsState[K]>) {
    setS((prev) => ({ ...prev, [key]: { ...prev[key], ...val } }));
  }

  function patchFeature(i: number, val: Partial<{ title: string; desc: string }>) {
    setS((prev) => {
      const features = [...prev.about.features];
      features[i] = { ...features[i], ...val };
      return { ...prev, about: { ...prev.about, features } };
    });
  }

  function addFeature() {
    setS((prev) => ({
      ...prev,
      about: { ...prev.about, features: [...prev.about.features, { ...EMPTY_FEATURE }] },
    }));
  }

  function removeFeature(i: number) {
    setS((prev) => ({
      ...prev,
      about: { ...prev.about, features: prev.about.features.filter((_, idx) => idx !== i) },
    }));
  }

  async function saveSection(key: keyof SettingsState) {
    setBusy(true);
    const { data: existing } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    const merged = {
      ...(existing?.value as Record<string, unknown>),
      ...(s[key] as Record<string, unknown>),
    };
    try {
      await saveSiteSetting({ data: { key, value: merged } });
      setBusy(false);
      await invalidate();
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} settings saved`);
    } catch (e) {
      setBusy(false);
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (!loaded) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="eyebrow">Studio</div>
      <h1 className="mt-2 font-display text-3xl text-primary">Site Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage your company branding, contact details, and site-wide content.
      </p>

      {/* ── Branding ── */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">Branding</Label>
            <p className="text-sm text-muted-foreground">Company logo and CTA button text.</p>
          </div>
          <Button
            onClick={() => saveSection("nav")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Site Logo</Label>
            <ImageUpload
              value={s.nav.logo_url}
              onUpload={async (file, filePath) => {
                const base64 = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(",")[1]);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                const { publicUrl } = await uploadFile({
                  data: { bucket: "logos", filePath, base64, contentType: file.type },
                });
                return publicUrl;
              }}
              onChange={async (url) => {
                patch("nav", { logo_url: url });
                setBusy(true);
                const { data: existing } = await supabase
                  .from("site_settings")
                  .select("value")
                  .eq("key", "nav")
                  .maybeSingle();
                const merged = { ...(existing?.value as Record<string, unknown>), logo_url: url };
                try {
                  await saveSiteSetting({ data: { key: "nav", value: merged } });
                  await invalidate();
                  toast.success("Logo uploaded");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Upload failed");
                } finally {
                  setBusy(false);
                }
              }}
              label="Logo Image"
              bucket="logos"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Company Name (footer)</Label>
              <Input
                value={s.nav.logo}
                onChange={(e) => patch("nav", { logo: e.target.value })}
                placeholder="Dream Adventure Nepal"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">CTA Button Text</Label>
              <Input
                value={s.nav.cta}
                onChange={(e) => patch("nav", { cta: e.target.value })}
                placeholder="Plan My Trip"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">Contact Info</Label>
            <p className="text-sm text-muted-foreground">
              Email, phone, and address shown across the site.
            </p>
          </div>
          <Button
            onClick={() => saveSection("contact")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              value={s.contact.email}
              onChange={(e) => patch("contact", { email: e.target.value })}
              placeholder="info@dreamadventurenepal.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input
              value={s.contact.phone}
              onChange={(e) => patch("contact", { phone: e.target.value })}
              placeholder="+977-1-2345678"
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input
              value={s.contact.address}
              onChange={(e) => patch("contact", { address: e.target.value })}
              placeholder="Kathmandu, Nepal"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">CTA Section</Label>
            <p className="text-sm text-muted-foreground">
              The "Get In Touch" call-to-action section above the footer.
            </p>
          </div>
          <Button
            onClick={() => saveSection("cta")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Headline</Label>
            <Input
              value={s.cta.title}
              onChange={(e) => patch("cta", { title: e.target.value })}
              placeholder="Start Your Adventure"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Subtitle</Label>
            <Textarea
              rows={2}
              value={s.cta.subtitle}
              onChange={(e) => patch("cta", { subtitle: e.target.value })}
              placeholder="Get in touch with our team…"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* ── About / Why Us ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">About / Why Us</Label>
            <p className="text-sm text-muted-foreground">
              Content for the "Why Dream Adventure Nepal" section.
            </p>
          </div>
          <Button
            onClick={() => saveSection("about")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground">Eyebrow</Label>
              <Input
                value={s.about.eyebrow}
                onChange={(e) => patch("about", { eyebrow: e.target.value })}
                placeholder="Why Dream Adventure Nepal"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                value={s.about.title}
                onChange={(e) => patch("about", { title: e.target.value })}
                placeholder="Crafting Himalayan Stories…"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Subtitle</Label>
              <Input
                value={s.about.subtitle}
                onChange={(e) => patch("about", { subtitle: e.target.value })}
                placeholder="We don't just organise treks…"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Feature Cards</Label>
              <Button onClick={addFeature} variant="outline" className="rounded-full" size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Feature
              </Button>
            </div>
            <div className="mt-3 space-y-3">
              {s.about.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <GripVertical className="mt-2 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <Input
                        value={f.title}
                        onChange={(e) => patchFeature(i, { title: e.target.value })}
                        placeholder="Expert Local Guides"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-[2]">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <Input
                        value={f.desc}
                        onChange={(e) => patchFeature(i, { desc: e.target.value })}
                        placeholder="Every trip is led by certified Nepali guides…"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFeature(i)}
                    className="mt-6 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Remove feature"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">Footer</Label>
            <p className="text-sm text-muted-foreground">Tagline and copyright notice.</p>
          </div>
          <Button
            onClick={() => saveSection("footer")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Tagline</Label>
            <Input
              value={s.footer.tagline}
              onChange={(e) => patch("footer", { tagline: e.target.value })}
              placeholder="Crafting unforgettable Himalayan adventures since 2005."
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Copyright</Label>
            <Input
              value={s.footer.copyright}
              onChange={(e) => patch("footer", { copyright: e.target.value })}
              placeholder="© 2025 Dream Adventure Nepal. All rights reserved."
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* ── eSewa ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-display text-lg text-primary">eSewa Payment</Label>
            <p className="text-sm text-muted-foreground">
              QR code image shown when customers choose "Pay Online".
            </p>
          </div>
          <Button
            onClick={() => saveSection("esewa")}
            disabled={busy}
            className="rounded-full btn-primary px-5"
            size="sm"
          >
            Save
          </Button>
        </div>
        <div className="mt-4">
          <ImageUpload
            value={s.esewa.qr_url}
            onUpload={async (file, filePath) => {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  resolve(result.split(",")[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
              const { publicUrl } = await uploadFile({
                data: { bucket: "images", filePath, base64, contentType: file.type },
              });
              return publicUrl;
            }}
            onChange={(url) => patch("esewa", { qr_url: url })}
            label="eSewa QR Image"
            bucket="images"
          />
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <Label className="font-display text-lg text-primary">Change Password</Label>
              <p className="text-sm text-muted-foreground">Update your admin account password.</p>
            </div>
          </div>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPass.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPass !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) throw error;
      toast.success("Password updated successfully");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Current Password</Label>
        <Input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Enter current password"
          className="mt-1"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-muted-foreground">New Password</Label>
            <Input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
              className="mt-1"
              required
            />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Confirm New Password</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter new password"
            className="mt-1"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={busy}
          className="rounded-full btn-primary px-5"
          size="sm"
        >
          {busy ? "Updating…" : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
