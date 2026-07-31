import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

type Booking = {
  id: string;
  adventure_id: string;
  adventure_title: string;
  adventure_slug: string;
  name: string;
  email: string;
  phone: string;
  start_date: string;
  number_of_people: number;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  payment_method: "online" | "pay_later" | "bank_transfer";
  payment_status: "unpaid" | "partial" | "paid" | "refunded";
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsAdmin,
});

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function BookingsAdmin() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [changing, setChanging] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Booking[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setChanging(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    setChanging(null);
    if (error) return toast.error(error.message);
    toast.success(`Booking ${status}`);
    load();
  }

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.adventure_title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow">
            Management
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Bookings</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-2xl p-5 text-left transition ${
              filter === key
                ? "bg-accent text-white shadow-elegant"
                : "bg-white text-primary shadow-glass hover:shadow-elegant"
            }`}
          >
            <div className="text-2xl font-display font-medium">{counts[key]}</div>
            <div className="mt-1 text-sm capitalize opacity-70">{key}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or adventure..."
          className="h-12 w-full rounded-2xl border border-border bg-white pl-11 pr-4 text-sm outline-none focus:border-accent"
        />
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center text-muted-foreground">
            No bookings found.
          </div>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-6 shadow-glass">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-primary">{r.name}</h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${statusStyles[r.status] ?? ""}`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{r.email}</span>
                  <span>{r.phone}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {r.start_date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {r.number_of_people}{" "}
                    {r.number_of_people === 1 ? "person" : "people"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span
                      className={
                        r.payment_status === "paid"
                          ? "text-green-600"
                          : r.payment_status === "partial"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                      }
                    >
                      {r.payment_method === "online" ? "Online" : "Pay Later"} · {r.payment_status}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-accent">{r.adventure_title}</span>
                  <Link
                    to="/adventures/$slug"
                    params={{ slug: r.adventure_slug }}
                    className="text-muted-foreground hover:text-accent"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                {r.message && (
                  <p className="mt-2 rounded-xl bg-surface p-3 text-sm text-muted-foreground">
                    {r.message}
                  </p>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  Booked {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {r.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(r.id, "confirmed")}
                      disabled={changing === r.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {changing === r.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "cancelled")}
                      disabled={changing === r.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle className="h-3 w-3" />
                      Cancel
                    </button>
                  </>
                )}
                {r.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(r.id, "cancelled")}
                    disabled={changing === r.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle className="h-3 w-3" />
                    Cancel
                  </button>
                )}
                {r.status === "cancelled" && (
                  <button
                    onClick={() => updateStatus(r.id, "pending")}
                    disabled={changing === r.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
