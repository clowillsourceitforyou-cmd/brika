import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchProducts, fetchCategories } from "../../lib/data";
import type { Product, Category } from "../../lib/types";
import { useSettings } from "../../context/SettingsContext";
import { money } from "../../lib/format";

export default function AdminProducts() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(p);
    setCats(c);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggle(p: Product, field: "in_stock" | "featured") {
    await supabase.from("products").update({ [field]: !p[field] }).eq("id", p.id);
    load();
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    load();
  }

  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted">{products.length} in your store</p>
        </div>
        <Link to="/admin/products/new" className="btn-azur">
          <Plus size={17} /> Add product
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-16 text-center">
          <p className="font-semibold">No products yet</p>
          <p className="mt-1 text-sm text-muted">Add your first piece to fill the storefront.</p>
          <Link to="/admin/products/new" className="btn-primary mt-5 inline-flex">
            <Plus size={16} /> Add product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b border-line p-3 last:border-0">
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted">{catName(p.category_id)} · {money(p.price, settings.currency_symbol)}</p>
              </div>
              <button
                onClick={() => toggle(p, "featured")}
                title="Feature on homepage"
                className={`hidden rounded-full p-2 transition sm:block ${p.featured ? "text-azur" : "text-line hover:text-muted"}`}
              >
                <Star size={18} fill={p.featured ? "#1E55A0" : "none"} />
              </button>
              <button
                onClick={() => toggle(p, "in_stock")}
                className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:block ${
                  p.in_stock ? "bg-azur/10 text-azur-dark" : "bg-sand text-muted"
                }`}
              >
                {p.in_stock ? "In stock" : "Sold out"}
              </button>
              <Link to={`/admin/products/${p.id}`} className="rounded-lg p-2 text-muted hover:bg-sand hover:text-ink">
                <Pencil size={17} />
              </Link>
              <button onClick={() => remove(p)} className="rounded-lg p-2 text-muted hover:bg-sand hover:text-azur">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
