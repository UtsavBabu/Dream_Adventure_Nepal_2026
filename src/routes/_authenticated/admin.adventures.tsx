import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Adventure, Place, AdventurePlace } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { clientUpload } from "@/lib/upload-helper";
import { ArrayEditor, ItineraryEditor } from "@/components/ui/array-editor";

export const Route = createFileRoute("/_authenticated/admin/adventures")({
  component: AdventuresAdmin,
});

const empty: Partial<Adventure> = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  image_url: "",
  duration: "",
  difficulty: "Moderate",
  price: "",
  category: "Trek",
  sort_order: 0,
  is_published: true,
  itinerary: [],
  map_embed_url: "",
  includes: [],
  excludes: [],
  highlights: [],
};

const CATEGORIES = ["Trek", "Expedition", "Tour"];

function AdventuresAdmin() {
  const [rows, setRows] = useState<Adventure[]>([]);
  const [editing, setEditing] = useState<Partial<Adventure> | null>(null);
  const [busy, setBusy] = useState(false);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");

  async function load() {
    const { data } = await supabase.from("adventures").select("*").order("sort_order");
    setRows((data ?? []) as Adventure[]);
  }
  async function loadPlaces() {
    const { data } = await supabase.from("places").select("*").order("sort_order");
    setAllPlaces((data ?? []) as Place[]);
  }
  useEffect(() => {
    load();
    loadPlaces();
  }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    const payload: Record<string, unknown> = { ...editing };
    if (!payload.slug) payload.slug = (payload.title ?? "").toLowerCase().replace(/\s+/g, "-");

    let adventureId = editing.id;
    if (adventureId) {
      const { error } = await supabase.from("adventures").update(payload).eq("id", adventureId);
      if (error) {
        setBusy(false);
        return toast.error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("adventures")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setBusy(false);
        return toast.error(error.message);
      }
      adventureId = data.id;
    }

    // Sync adventure_places
    const { data: existing } = await supabase
      .from("adventure_places")
      .select("place_id")
      .eq("adventure_id", adventureId);
    const existingIds = new Set((existing ?? []).map((r: { place_id: string }) => r.place_id));
    const toAdd = [...selectedPlaceIds].filter((id) => !existingIds.has(id));
    const toRemove = [...existingIds].filter((id) => !selectedPlaceIds.has(id));
    if (toRemove.length > 0)
      await supabase
        .from("adventure_places")
        .delete()
        .eq("adventure_id", adventureId)
        .in("place_id", toRemove);
    if (toAdd.length > 0)
      await supabase
        .from("adventure_places")
        .insert(
          toAdd.map((placeId, i) => ({
            adventure_id: adventureId,
            place_id: placeId,
            day_number: 1,
            sort_order: i,
          })),
        );

    setBusy(false);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  function onEdit(adventure: Adventure) {
    setEditing(adventure);
    setSelectedPlaceIds(new Set());
    loadAdventurePlaces(adventure.id);
  }

  function onNew() {
    setEditing({ ...empty });
    setSelectedPlaceIds(new Set());
  }

  async function loadAdventurePlaces(adventureId: string) {
    const { data } = await supabase
      .from("adventure_places")
      .select("place_id")
      .eq("adventure_id", adventureId);
    setSelectedPlaceIds(new Set((data ?? []).map((r: { place_id: string }) => r.place_id)));
  }

  function togglePlace(placeId: string) {
    setSelectedPlaceIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this adventure?")) return;
    const { error } = await supabase.from("adventures").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow">
            Content
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Adventures</h1>
        </div>
        <Button onClick={onNew} className="rounded-full btn-primary px-5">
          <Plus className="mr-2 h-4 w-4" /> New adventure
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`rounded-full px-5 py-1.5 text-xs font-medium capitalize transition ${
            filterCategory === "all"
              ? "bg-accent text-white"
              : "text-muted-foreground hover:bg-surface"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-5 py-1.5 text-xs font-medium capitalize transition ${
              filterCategory === cat
                ? "bg-accent text-white"
                : "text-muted-foreground hover:bg-surface"
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-glass">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((r) => filterCategory === "all" || r.category === filterCategory)
              .map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {r.image_url && (
                        <img src={r.image_url} className="h-10 w-14 rounded object-cover" alt="" />
                      )}
                      <div>
                        <div className="font-medium text-primary">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {r.category}
                    </span>
                  </td>
                  <td className="p-4">{r.duration}</td>
                  <td className="p-4">{r.price}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onEdit(r)}
                      className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                {editing.id ? "Edit" : "New"} adventure
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </Field>
              <Field label="Slug (URL)">
                <Input
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  className="h-10 w-full rounded-md border border-input px-3"
                  value={editing.category ?? "Trek"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  <option value="Trek">Trek</option>
                  <option value="Expedition">Expedition</option>
                  <option value="Tour">Tour</option>
                </select>
              </Field>
              <Field label="Difficulty">
                <Input
                  value={editing.difficulty ?? ""}
                  onChange={(e) => setEditing({ ...editing, difficulty: e.target.value })}
                />
              </Field>
              <Field label="Duration">
                <Input
                  value={editing.duration ?? ""}
                  onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                />
              </Field>
              <Field label="Price">
                <Input
                  value={editing.price ?? ""}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <ImageUpload
                  value={editing.image_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  label="Image"
                  onUpload={clientUpload}
                />
              </div>
              <div className="sm:col-span-2">
                <Field label="Short description">
                  <Textarea
                    rows={2}
                    value={editing.description ?? ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Long description">
                  <Textarea
                    rows={5}
                    value={editing.long_description ?? ""}
                    onChange={(e) => setEditing({ ...editing, long_description: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Highlights">
                  <ArrayEditor
                    items={editing.highlights ?? []}
                    onChange={(items) => setEditing({ ...editing, highlights: items })}
                    placeholder="e.g. Summit views of Everest"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <ItineraryEditor
                  days={editing.itinerary ?? []}
                  onChange={(days) => setEditing({ ...editing, itinerary: days })}
                />
              </div>
              <div className="sm:col-span-2">
                <Field label="Map embed URL (Google Maps iframe src)">
                  <Input
                    value={editing.map_embed_url ?? ""}
                    onChange={(e) => setEditing({ ...editing, map_embed_url: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Includes">
                  <ArrayEditor
                    items={editing.includes ?? []}
                    onChange={(items) => setEditing({ ...editing, includes: items })}
                    placeholder="e.g. All airport transfers"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Excludes">
                  <ArrayEditor
                    items={editing.excludes ?? []}
                    onChange={(items) => setEditing({ ...editing, excludes: items })}
                    placeholder="e.g. International flights"
                  />
                </Field>
              </div>
              <Field label="Sort order">
                <Input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                />
              </Field>
              <Field label="Published">
                <select
                  className="h-10 w-full rounded-md border border-input px-3"
                  value={editing.is_published ? "1" : "0"}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.value === "1" })}
                >
                  <option value="1">Yes</option>
                  <option value="0">No (draft)</option>
                </select>
              </Field>
            </div>
            {/* Places Selector */}
            <div className="mt-8 border-t border-border pt-8">
              <Label className="font-display text-lg text-primary">Places / Destinations</Label>
              <p className="mb-4 text-sm text-muted-foreground">
                Select which places are part of this adventure.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allPlaces
                  .filter((p) => p.type === (editing.category?.toLowerCase() ?? "trek"))
                  .map((p) => {
                    const isSelected = selectedPlaceIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlace(p.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/30"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            isSelected ? "bg-accent text-white" : "bg-surface text-muted-foreground"
                          }`}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-primary">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground">{p.type}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
              {selectedPlaceIds.size > 0 && (
                <div className="mt-4 rounded-xl bg-surface p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Selected places ({selectedPlaceIds.size})
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[...selectedPlaceIds].map((placeId) => {
                      const place = allPlaces.find((p) => p.id === placeId);
                      return (
                        <span
                          key={placeId}
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                        >
                          {place?.name ?? "Unknown"}
                          <button type="button" onClick={() => togglePlace(placeId)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={busy} className="rounded-full btn-primary px-6">
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
