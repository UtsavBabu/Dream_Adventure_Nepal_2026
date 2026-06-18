import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { GalleryImage } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const [rows, setRows] = useState<GalleryImage[]>([]);
  const [adding, setAdding] = useState<{
    image_url: string;
    caption: string;
    sort_order: number;
  } | null>(null);

  async function load() {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    setRows((data ?? []) as GalleryImage[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!adding) return;
    const { error } = await supabase.from("gallery_images").insert(adding);
    if (error) return toast.error(error.message);
    setAdding(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Content
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Gallery</h1>
        </div>
        <Button
          onClick={() => setAdding({ image_url: "", caption: "", sort_order: rows.length })}
          className="rounded-full btn-hero px-5"
        >
          <Plus className="mr-2 h-4 w-4" /> Add image
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((r) => (
          <div
            key={r.id}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-glass"
          >
            <img src={r.image_url} alt={r.caption} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="line-clamp-1 text-sm text-primary">{r.caption}</div>
              <button
                onClick={() => remove(r.id)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">Add gallery image</h2>
              <button onClick={() => setAdding(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <ImageUpload
                value={adding.image_url}
                onChange={(url) => setAdding({ ...adding, image_url: url })}
                label="Image"
              />
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Caption
                </Label>
                <Input
                  value={adding.caption}
                  onChange={(e) => setAdding({ ...adding, caption: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sort order
                </Label>
                <Input
                  type="number"
                  value={adding.sort_order}
                  onChange={(e) => setAdding({ ...adding, sort_order: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAdding(null)}>
                Cancel
              </Button>
              <Button
                onClick={save}
                disabled={!adding.image_url}
                className="rounded-full btn-hero px-6"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
