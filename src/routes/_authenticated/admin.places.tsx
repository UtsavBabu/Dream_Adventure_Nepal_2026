import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Place } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";

export const Route = createFileRoute("/_authenticated/admin/places")({
  component: PlacesAdmin,
});

const empty: Partial<Place> = {
  name: "",
  description: "",
  image_url: "",
  lat: null,
  lng: null,
  type: "expedition",
  sort_order: 0,
  is_published: true,
};

const typeOptions = [
  { value: "expedition", label: "Expedition" },
  { value: "tour", label: "Tour" },
  { value: "trek", label: "Trek" },
];

function PlacesAdmin() {
  const [rows, setRows] = useState<Place[]>([]);
  const [editing, setEditing] = useState<Partial<Place> | null>(null);
  const [busy, setBusy] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  async function load() {
    const { data } = await supabase.from("places").select("*").order("sort_order");
    setRows((data ?? []) as Place[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing || !editing.name?.trim()) return toast.error("Name is required");
    setBusy(true);
    const payload = { ...editing };
    const { error } = editing.id
      ? await supabase.from("places").update(payload as any).eq("id", editing.id)
      : await supabase.from("places").insert(payload as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Place updated" : "Place created");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this place?")) return;
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Destinations
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Places</h1>
        </div>
        <Button onClick={() => setEditing({ ...empty })} className="rounded-full btn-hero px-5">
          <Plus className="mr-2 h-4 w-4" /> New place
        </Button>
      </div>

      {/* Type filter tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-2">
        {["all", ...typeOptions.map((t) => t.value)].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
              filterType === type
                ? "bg-accent text-white"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.length === 0 && (
          <div className="col-span-full rounded-2xl bg-white p-12 text-center text-muted-foreground">
            No places yet. Click "New place" to add one.
          </div>
        )}
        {rows
          .filter((p) => filterType === "all" || p.type === filterType)
          .map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-glass">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="h-40 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10 text-3xl font-display text-primary/20">
                {p.name.charAt(0)}
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-primary">{p.name}</h3>
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                    {p.type}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
                {p.lat && p.lng && <span>{p.lat.toFixed(3)}, {p.lng.toFixed(3)}</span>}
                <span>Order: {p.sort_order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                {editing.id ? "Edit" : "New"} place
              </h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Name">
                  <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <ImageUpload value={editing.image_url ?? ""} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Place Image" />
              </div>
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                <Field label="Latitude">
                  <Input type="number" step="any" value={editing.lat ?? ""} onChange={(e) => setEditing({ ...editing, lat: e.target.value ? Number(e.target.value) : null })} placeholder="27.7172" />
                </Field>
                <Field label="Longitude">
                  <Input type="number" step="any" value={editing.lng ?? ""} onChange={(e) => setEditing({ ...editing, lng: e.target.value ? Number(e.target.value) : null })} placeholder="85.3240" />
                </Field>
              </div>
              <Field label="Type">
                <select className="h-10 w-full rounded-md border border-input px-3" value={editing.type ?? "expedition"} onChange={(e) => setEditing({ ...editing, type: e.target.value as Place["type"] })}>
                  {typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Sort order">
                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </Field>
              <Field label="Published">
                <select className="h-10 w-full rounded-md border border-input px-3" value={editing.is_published ? "1" : "0"} onChange={(e) => setEditing({ ...editing, is_published: e.target.value === "1" })}>
                  <option value="1">Yes</option>
                  <option value="0">No (hidden)</option>
                </select>
              </Field>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
