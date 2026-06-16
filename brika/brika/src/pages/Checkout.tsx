import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Lock } from "lucide-react";
import { useCart } from "../store/cart";
import { useSettings } from "../context/SettingsContext";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { money } from "../lib/format";
import type { OrderItem } from "../lib/types";

export default function Checkout() {
  const { settings } = useSettings();
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const sym = settings.currency_symbol;

  const sub = subtotal();
  const freeShip = settings.free_shipping_threshold > 0 && sub >= settings.free_shipping_threshold;
  const shipping = lines.length === 0 || freeShip ? 0 : settings.shipping_fee;
  const total = sub + shipping;

  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const items: OrderItem[] = lines.map((l) => ({
    product_id: l.productId,
    name: l.name,
    price: l.price,
    size: l.size,
    quantity: l.quantity,
    image: l.image,
  }));

  function validate() {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      setError("Please fill in your name, phone, city and address.");
      return false;
    }
    setError("");
    return true;
  }

  async function placeOrder() {
    if (lines.length === 0 || !validate()) return;
    if (!isSupabaseConfigured) {
      setError("Store is not connected to a database yet. Use WhatsApp to order for now.");
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        note: form.note || null,
        items,
        subtotal: sub,
        shipping,
        total,
        status: "new",
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (err) {
      setError("Something went wrong placing your order. Please try WhatsApp.");
      return;
    }
    clear();
    navigate(`/order/${data.id}`);
  }

  function orderWhatsApp() {
    if (lines.length === 0) return;
    const itemLines = lines
      .map((l) => `• ${l.name}${l.size && l.size !== "one" ? ` (${l.size})` : ""} x${l.quantity} — ${money(l.price * l.quantity, sym)}`)
      .join("%0A");
    const msg =
      `New order from ${form.name || "a customer"}%0A%0A${itemLines}%0A%0A` +
      `Subtotal: ${money(sub, sym)}%0AShipping: ${money(shipping, sym)}%0ATotal: ${money(total, sym)}` +
      (form.phone ? `%0A%0APhone: ${form.phone}` : "") +
      (form.city || form.address ? `%0AAddress: ${form.address}, ${form.city}` : "");
    window.open(`https://wa.me/${settings.whatsapp_number}?text=${msg}`, "_blank");
  }

  if (lines.length === 0) {
    return (
      <div className="wrap py-28 text-center">
        <h1 className="display text-3xl font-bold">Your bag is empty</h1>
        <Link to="/shop" className="mt-5 inline-block btn-primary">Browse clothing</Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <h1 className="display mb-8 text-3xl font-extrabold sm:text-4xl">Checkout</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* FORM */}
        <div>
          <h2 className="eyebrow mb-4">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Full name</label>
              <input className="field" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Amira Ben Salah" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+216 ..." />
            </div>
            <div>
              <label className="label">City</label>
              <input className="field" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Tunis" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address</label>
              <input className="field" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, building, etc." />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Order note (optional)</label>
              <textarea className="field min-h-[90px] resize-none" value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Anything we should know?" />
            </div>
          </div>

          {error && <p className="mt-4 rounded-lg bg-azur/10 px-4 py-3 text-sm text-azur-dark">{error}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={placeOrder} disabled={submitting} className="btn-primary flex-1">
              <Lock size={16} /> {submitting ? "Placing order…" : "Place order · pay on delivery"}
            </button>
            {settings.whatsapp_number && (
              <button onClick={orderWhatsApp} className="btn-azur">
                <MessageCircle size={17} /> WhatsApp
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            You'll pay in cash when your order is delivered. No card required.
          </p>
        </div>

        {/* SUMMARY */}
        <aside className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="eyebrow mb-4">Order summary</h2>
          <div className="space-y-4">
            {lines.map((l) => (
              <div key={l.key} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {l.image && <img src={l.image} alt="" className="h-full w-full object-cover" />}
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-paper">
                    {l.quantity}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium leading-snug">{l.name}</p>
                    {l.size && l.size !== "one" && <p className="text-xs text-muted">Size {l.size}</p>}
                  </div>
                  <p className="text-sm font-semibold">{money(l.price * l.quantity, sym)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <Row label="Subtotal" value={money(sub, sym)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : money(shipping, sym)} />
            <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
              <span className="font-semibold">Total</span>
              <span className="display text-xl font-bold">{money(total, sym)}</span>
            </div>
          </div>
          {!freeShip && settings.free_shipping_threshold > 0 && (
            <p className="mt-3 text-xs text-muted">
              Add {money(settings.free_shipping_threshold - sub, sym)} more for free delivery.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
