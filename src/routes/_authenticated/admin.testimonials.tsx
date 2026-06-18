import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Testimonial } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: TestimonialsAdmin,
});

const empty: Partial<Testimonial> = {
  name: "",
  country: "",
  avatar_url: "",
  review: "",
  rating: 5,
  sort_order: 0,
  is_published: true,
};

function TestimonialsAdmin() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setRows((data ?? []) as Testimonial[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    const { error } = editing.id
      ? await supabase
          .from("testimonials")
          .update(editing as Record<string, unknown>)
          .eq("id", editing.id)
      : await supabase.from("testimonials").insert(editing as Record<string, unknown>);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Content
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Testimonials</h1>
        </div>
        <Button onClick={() => setEditing({ ...empty })} className="rounded-full btn-hero px-5">
          <Plus className="mr-2 h-4 w-4" /> New
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-6 shadow-glass">
            <div className="flex items-center gap-4">
              {r.avatar_url && (
                <img src={r.avatar_url} className="h-14 w-14 rounded-full object-cover" alt="" />
              )}
              <div className="flex-1">
                <div className="font-medium text-primary">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.country}</div>
              </div>
              <div className="flex text-accent">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">"{r.review}"</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditing(r)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(r.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                {editing.id ? "Edit" : "New"} testimonial
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <F label="Name">
                <Input
                  value={editing.name ?? ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </F>
              <F label="Country">
                <Input
                  value={editing.country ?? ""}
                  onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                />
              </F>
              <div className="sm:col-span-2">
                <ImageUpload
                  value={editing.avatar_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                  label="Avatar"
                />
              </div>
              <div className="sm:col-span-2">
                <F label="Review">
                  <Textarea
                    rows={5}
                    value={editing.review ?? ""}
                    onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                  />
                </F>
              </div>
              <F label="Rating (1-5)">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={editing.rating ?? 5}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                />
              </F>
              <F label="Sort order">
                <Input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                />
              </F>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={busy} className="rounded-full btn-hero px-6">
                {busy ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
