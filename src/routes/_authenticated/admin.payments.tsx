import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Ban, CheckCircle, CreditCard, ExternalLink, Loader2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  method: string;
  status: string;
  transaction_id: string;
  notes: string;
  paid_at: string | null;
  created_at: string;
};

type Booking = {
  id: string;
  adventure_title: string;
  name: string;
};

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsAdmin,
});

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
};

function PaymentsAdmin() {
  const [payments, setPayments] = useState<
    (Payment & { booking_name?: string; adventure_title?: string })[]
  >([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Payment> | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [p, b] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("id,adventure_title,name")
        .order("created_at", { ascending: false }),
    ]);
    const pData = (p.data ?? []) as Payment[];
    const bData = (b.data ?? []) as Booking[];
    setPayments(
      pData.map((pm) => {
        const bk = bData.find((b) => b.id === pm.booking_id);
        return { ...pm, booking_name: bk?.name, adventure_title: bk?.adventure_title };
      }),
    );
    setBookings(bData);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setBusy(true);
    const payload = {
      ...editing,
      paid_at:
        editing.status === "completed" && !editing.paid_at
          ? new Date().toISOString()
          : editing.paid_at,
    };
    const { error } = editing.id
      ? await supabase
          .from("payments")
          .update(payload as any)
          .eq("id", editing.id)
      : await supabase.from("payments").insert(payload as any);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Payment updated" : "Payment recorded");
    setShowForm(false);
    setEditing(null);
    load();
  }

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.booking_name?.toLowerCase().includes(q) ||
      p.adventure_title?.toLowerCase().includes(q) ||
      p.transaction_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="eyebrow">
            Finance
          </div>
          <h1 className="mt-2 font-display text-3xl text-primary">Payments</h1>
        </div>
        <Button
          onClick={() => {
            setEditing({
              booking_id: "",
              amount: 0,
              method: "online",
              status: "pending",
              transaction_id: "",
              notes: "",
            });
            setShowForm(true);
          }}
          className="rounded-full btn-primary px-5"
        >
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {(["all", "completed", "pending", "refunded"] as const).map((key) => {
          const count =
            key === "all" ? payments.length : payments.filter((p) => p.status === key).length;
          const total =
            key === "all"
              ? payments.reduce((s, p) => s + (p.status === "completed" ? p.amount : 0), 0)
              : key === "completed"
                ? payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0)
                : null;
          return (
            <div key={key} className="rounded-2xl bg-white p-5 shadow-glass">
              <div className="text-2xl font-display font-medium text-primary">{count}</div>
              <div className="mt-1 text-sm capitalize text-muted-foreground">{key}</div>
              {total !== null && (
                <div className="mt-1 text-xs font-medium text-green-600">
                  ${total.toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, adventure or transaction ID..."
          className="h-12 w-full rounded-2xl border border-border bg-white pl-11 pr-4 text-sm outline-none focus:border-accent"
        />
      </div>

      {/* Payments List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center text-muted-foreground">
            No payments found.
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-5 shadow-glass">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-accent" />
                  <span className="font-display text-xl font-medium text-primary">
                    ${p.amount.toLocaleString()}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${statusStyles[p.status] ?? ""}`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{p.booking_name ?? "Unknown"}</span>
                  <span>{p.adventure_title}</span>
                  <span className="capitalize">{p.method}</span>
                  {p.transaction_id && <span>TX: {p.transaction_id}</span>}
                </div>
                {p.notes && <p className="mt-2 text-sm text-muted-foreground">{p.notes}</p>}
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleString()}
                  {p.paid_at && ` · Paid: ${new Date(p.paid_at).toLocaleString()}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing({
                      id: p.id,
                      booking_id: p.booking_id,
                      amount: p.amount,
                      method: p.method,
                      status: p.status,
                      transaction_id: p.transaction_id,
                      notes: p.notes,
                    });
                    setShowForm(true);
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Form Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-primary">
                {editing.id ? "Edit" : "Record"} Payment
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Booking
                </Label>
                <select
                  className="mt-1 h-10 w-full rounded-md border border-input px-3"
                  value={editing.booking_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, booking_id: e.target.value })}
                >
                  <option value="">Select booking</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.adventure_title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Amount ($)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editing.amount ?? 0}
                    onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Method
                  </Label>
                  <select
                    className="mt-1 h-10 w-full rounded-md border border-input px-3"
                    value={editing.method ?? "online"}
                    onChange={(e) => setEditing({ ...editing, method: e.target.value })}
                  >
                    <option value="online">Online</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </Label>
                  <select
                    className="mt-1 h-10 w-full rounded-md border border-input px-3"
                    value={editing.status ?? "pending"}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Transaction ID
                  </Label>
                  <Input
                    value={editing.transaction_id ?? ""}
                    onChange={(e) => setEditing({ ...editing, transaction_id: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Notes
                </Label>
                <textarea
                  rows={2}
                  value={editing.notes ?? ""}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  placeholder="Payment notes..."
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={save} disabled={busy} className="rounded-full btn-primary px-6">
                {busy ? "Saving…" : editing.id ? "Update" : "Record Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
