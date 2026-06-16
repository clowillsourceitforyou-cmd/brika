import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../store/cart";
import { useSettings } from "../context/SettingsContext";
import { money } from "../lib/format";

export default function CartDrawer() {
  const { settings } = useSettings();
  const { lines, isOpen, close, remove, setQty, subtotal } = useCart();
  const sub = subtotal();

  if (!isOpen) return null;
  const sym = settings.currency_symbol;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fade bg-ink/45 backdrop-blur-md" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slidein flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-xl font-bold">Your bag</h2>
          <button aria-label="Close cart" onClick={close} className="hover:text-azur">
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-line" />
            <p className="text-muted">Your bag is empty.</p>
            <button onClick={close} className="btn-ghost">Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {lines.map((l) => (
                <div key={l.key} className="flex gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {l.image && (
                      <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">{l.name}</p>
                      <button
                        onClick={() => remove(l.key)}
                        className="text-muted transition hover:text-azur"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {l.size && <p className="mt-0.5 text-xs text-muted">Size {l.size}</p>}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          className="grid h-8 w-8 place-items-center hover:text-azur active:scale-95"
                          onClick={() => setQty(l.key, l.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm">{l.quantity}</span>
                        <button
                          className="grid h-8 w-8 place-items-center hover:text-azur active:scale-95"
                          onClick={() => setQty(l.key, l.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{money(l.price * l.quantity, sym)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="display text-lg font-bold">{money(sub, sym)}</span>
              </div>
              <Link to="/checkout" onClick={close} className="btn-azur w-full">
                Checkout
              </Link>
              <p className="mt-3 text-center text-xs text-muted">
                Pay on delivery · Shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
