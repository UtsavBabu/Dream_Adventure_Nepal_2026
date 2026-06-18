import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, CheckCheck, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const [rows, setRows] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  async function load() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Message[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  const filtered = filter === "unread" ? rows.filter((r) => !r.is_read) : rows;
  const unreadCount = rows.filter((r) => !r.is_read).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Inbox
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Messages</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread / {rows.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              filter === "all"
                ? "bg-accent text-white"
                : "bg-surface text-muted-foreground hover:text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              filter === "unread"
                ? "bg-accent text-white"
                : "bg-surface text-muted-foreground hover:text-primary"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center text-muted-foreground">
            No messages yet.
          </div>
        )}
        {filtered.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl bg-white shadow-glass transition ${
              !r.is_read ? "ring-2 ring-accent/20" : ""
            }`}
          >
            <button
              onClick={() => {
                setExpanded(expanded === r.id ? null : r.id);
                if (!r.is_read) markRead(r.id);
              }}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  !r.is_read ? "bg-accent/10 text-accent" : "bg-surface text-muted-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`truncate font-medium ${!r.is_read ? "text-primary" : "text-muted-foreground"}`}>
                    {r.name}
                  </span>
                  {!r.is_read && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
                      New
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-sm text-muted-foreground">{r.email}</div>
              </div>
              <div className="hidden text-xs text-muted-foreground sm:block">
                {new Date(r.created_at).toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                {expanded === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
            {expanded === r.id && (
              <div className="border-t border-border px-5 pb-5 pt-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {r.email}
                  </span>
                  {r.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {r.phone}
                    </span>
                  )}
                  <span className="text-xs">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {r.message}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${r.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
                  >
                    <Mail className="h-3 w-3" /> Reply
                  </a>
                  {!r.is_read && (
                    <button
                      onClick={() => markRead(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
