import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Order } from "../../lib/types";
import { useSettings } from "../../context/SettingsContext";
import { money } from "../../lib/format";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { settings } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  async function load() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(o: Order, status: string) {
    await supabase.from("orders").update({ status }).eq("id", o.id);
    load();
  }

  const sym = settings.currency_symbol;

  return (
    <div>
      <h1 className="display mb-1 text-2xl font-bold">Orders</h1>
      <p className="mb-6 text-sm text-muted">{orders.length} total · paid on delivery</p>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line py-16 text-center text-muted">
          No orders yet. They'll appear here the moment a customer checks out.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line bg-white">
              <button
                onClick={() => setOpen(open === o.id ? null : o.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.customer_name}</p>
                  <p className="text-xs text-muted">
                    {new Date(o.created_at).toLocaleString()} · {o.items.length} item(s) · {o.city}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="display font-bold">{money(o.total, sym)}</span>
                  <StatusPill status={o.status} />
                </div>
              </button>

              {open === o.id && (
                <div className="border-t border-line p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="eyebrow mb-2">Customer</h4>
                      <p className="text-sm">{o.customer_name}</p>
                      <p className="text-sm text-muted">{o.phone}</p>
                      <p className="text-sm text-muted">{o.address}, {o.city}</p>
                      {o.note && <p className="mt-2 text-sm italic text-muted">"{o.note}"</p>}
                      <a
                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm text-azur underline"
                      >
                        Message on WhatsApp
                      </a>
                    </div>
                    <div>
                      <h4 className="eyebrow mb-2">Items</h4>
                      <ul className="space-y-1.5 text-sm">
                        {o.items.map((it, i) => (
                          <li key={i} className="flex justify-between gap-2">
                            <span>{it.name}{it.size && it.size !== "one" ? ` (${it.size})` : ""} ×{it.quantity}</span>
                            <span>{money(it.price * it.quantity, sym)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 border-t border-line pt-2 text-sm">
                        <div className="flex justify-between text-muted"><span>Shipping</span><span>{o.shipping === 0 ? "Free" : money(o.shipping, sym)}</span></div>
                        <div className="flex justify-between font-semibold"><span>Total</span><span>{money(o.total, sym)}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(o, s)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                          o.status === s ? "bg-ink text-paper" : "border border-line text-muted hover:border-ink hover:text-ink"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    new: "bg-azur/15 text-azur-dark",
    confirmed: "bg-azur/15 text-azur-dark",
    shipped: "bg-sand text-ink",
    delivered: "bg-ink text-paper",
    cancelled: "bg-sand text-muted line-through",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone[status] ?? "bg-sand"}`}>
      {status}
    </span>
  );
}
