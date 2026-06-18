import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ArrayEditorProps = {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
};

export function ArrayEditor({ items, onChange, label, placeholder }: ArrayEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="space-y-2">
        {(items ?? []).map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
              {i + 1}
            </span>
            <Input
              value={item}
              onChange={(e) => {
                const next = [...(items ?? [])];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onChange((items ?? []).filter((_, j) => j !== i))}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...(items ?? []), ""])}
        className="mt-1 w-full"
      >
        <Plus className="mr-2 h-3 w-3" /> Add item
      </Button>
    </div>
  );
}

type ItineraryDay = { day: number; title: string; description: string };

type ItineraryEditorProps = {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
};

export function ItineraryEditor({ days, onChange }: ItineraryEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">Itinerary</label>
      <div className="space-y-4">
        {(days ?? []).map((d, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-accent">Day {d.day || i + 1}</span>
              <button
                type="button"
                onClick={() => onChange((days ?? []).filter((_, j) => j !== i))}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Day #</label>
                <Input
                  type="number"
                  value={d.day || i + 1}
                  onChange={(e) => {
                    const next = [...(days ?? [])];
                    next[i] = { ...next[i], day: Number(e.target.value) };
                    onChange(next);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</label>
                <Input
                  value={d.title ?? ""}
                  onChange={(e) => {
                    const next = [...(days ?? [])];
                    next[i] = { ...next[i], title: e.target.value };
                    onChange(next);
                  }}
                  placeholder="Arrive in Kathmandu"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  rows={2}
                  value={d.description ?? ""}
                  onChange={(e) => {
                    const next = [...(days ?? [])];
                    next[i] = { ...next[i], description: e.target.value };
                    onChange(next);
                  }}
                  placeholder="Description of the day's activities..."
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...(days ?? []), { day: (days?.length ?? 0) + 1, title: "", description: "" }])}
        className="mt-2 w-full"
      >
        <Plus className="mr-2 h-3 w-3" /> Add day
      </Button>
    </div>
  );
}
