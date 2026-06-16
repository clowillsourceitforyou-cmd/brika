import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchCategories } from "../../lib/data";
import { uploadImage } from "../../lib/upload";
import { slugify } from "../../lib/format";
import type { Category, Product } from "../../lib/types";

const blank = {
  name: "",
  description: "",
  price: "",
  compare_at_price: "",
  category_id: "",
  images: [] as string[],
  sizes: "",
  colors: "",
  in_stock: true,
  featured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({ ...blank });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then(setCats);
    if (editing && id) {
      supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
        if (!data) return;
        const p = data as Product;
        setForm({
          name: p.name,
          description: p.description ?? "",
          price: String(p.price),
          compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
          category_id: p.category_id ?? "",
          images: p.images ?? [],
          sizes: (p.sizes ?? []).join(", "),
          colors: (p.colors ?? []).join(", "),
          in_stock: p.in_stock,
          featured: p.featured,
        });
      });
    }
  }, [id, editing]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      set("images", [...form.images, ...urls]);
    } catch (e: any) {
      setError(e.message || "Image upload failed. Check that the storage bucket exists.");
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    set("images", form.images.filter((u) => u !== url));
  }

  async function save() {
    if (!form.name.trim() || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name) + "-" + Math.random().toString(36).slice(2, 6),
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id || null,
      images: form.images,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
      in_stock: form.in_stock,
      featured: form.featured,
    };

    let err;
    if (editing && id) {
      const { slug, ...rest } = payload; // keep existing slug on edit
      ({ error: err } = await supabase.from("products").update(rest).eq("id", id));
    } else {
      ({ error: err } = await supabase.from("products").insert(payload));
    }
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/admin/products");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate("/admin/products")} className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-azur">
        <ArrowLeft size={16} /> Back to products
      </button>
      <h1 className="display mb-6 text-2xl font-bold">{editing ? "Edit product" : "Add product"}</h1>

      <div className="space-y-5 rounded-2xl border border-line bg-white p-6">
        {/* images */}
        <div>
          <label className="label">Photos</label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url) => (
              <div key={url} className="relative h-24 w-20 overflow-hidden rounded-lg bg-sand">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/80 text-paper"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="grid h-24 w-20 cursor-pointer place-items-center rounded-lg border border-dashed border-line text-muted transition hover:border-azur hover:text-azur">
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </div>
          <p className="mt-1.5 text-xs text-muted">First photo is the main image. Hover shows the second.</p>
        </div>

        <div>
          <label className="label">Name</label>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Linen Sirocco Shirt" />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="field min-h-[100px] resize-none" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Fabric, fit, care…" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Price (DT)</label>
            <input className="field" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="120" />
          </div>
          <div>
            <label className="label">Compare-at price (optional)</label>
            <input className="field" inputMode="decimal" value={form.compare_at_price} onChange={(e) => set("compare_at_price", e.target.value)} placeholder="160" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="field" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">No category</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Sizes (comma separated)</label>
            <input className="field" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S, M, L, XL" />
          </div>
        </div>

        <div>
          <label className="label">Colours (comma separated, optional)</label>
          <input className="field" value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Sand, Azur, Ink" />
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-azur" checked={form.in_stock} onChange={(e) => set("in_stock", e.target.checked)} />
            In stock
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-azur" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            Feature on homepage
          </label>
        </div>

        {error && <p className="rounded-lg bg-azur/10 px-4 py-3 text-sm text-azur-dark">{error}</p>}

        <button onClick={save} disabled={saving || uploading} className="btn-primary w-full">
          {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
        </button>
      </div>
    </div>
  );
}
