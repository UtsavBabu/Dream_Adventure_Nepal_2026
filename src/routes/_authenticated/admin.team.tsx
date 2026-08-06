import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { clientUpload } from "@/lib/upload-helper";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamAdmin,
});

const empty: Partial<TeamMember> = {
  name: "",
  role: "",
  bio: "",
  avatar_url: "",
  sort_order: 0,
  is_published: true,
};

function TeamAdmin() {
  const [rows, setRows] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    setRows((data ?? []) as TeamMember[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    const { error } = editing.id
      ? await supabase
          .from("team_members")
          .update(editing as Record<string, unknown>)
          .eq("id", editing.id)
      : await supabase.from("team_members").insert(editing as Record<string, unknown>);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow">
            Content
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Team Members</h1>
        </div>
        <Button onClick={() => setEditing({ ...empty })} className="rounded-full btn-primary px-5">
          <Plus className="mr-2 h-4 w-4" /> New Member
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-6 shadow-glass">
            <div className="flex items-center gap-4">
              {r.avatar_url && (
                <img src={r.avatar_url} className="h-16 w-16 rounded-full object-cover" alt="" />
              )}
              <div className="flex-1">
                <div className="font-medium text-primary">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
              <div className="flex gap-1">
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
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{r.bio}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                {editing.id ? "Edit" : "New"} team member
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={editing.name ?? ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <Input
                  value={editing.role ?? ""}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <Textarea
                    rows={4}
                    value={editing.bio ?? ""}
                    onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <ImageUpload
                  value={editing.avatar_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, avatar_url: url })}
                  label="Avatar"
                  onUpload={clientUpload}
                />
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
