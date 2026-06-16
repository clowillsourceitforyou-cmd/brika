import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchCategories } from "../../lib/data";
import { slugify } from "../../lib/format";
import type { Category } from "../../lib/types";

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setCats(await fetchCategories());
  }
  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!name.trim()) return;
    setError("");
    const { error: err } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slugify(name),
      sort: cats.length,
    });
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    load();
  }

  async function remove(c: Category) {
    if (!confirm(`Delete category "${c.name}"? Products keep existing but lose this category.`)) return;
    await supabase.from("categories").delete().eq("id", c.id);
    load();
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="display mb-1 text-2xl font-bold">Categories</h1>
      <p className="mb-6 text-sm text-muted">Group your clothing — e.g. Dresses, Shirts, Knitwear.</p>

      <div className="mb-6 flex gap-2">
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New category name"
        />
        <button onClick={add} className="btn-azur shrink-0">
          <Plus size={17} /> Add
        </button>
      </div>
      {error && <p className="mb-4 text-sm text-azur-dark">{error}</p>}

      {cats.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line py-10 text-center text-muted">
          No categories yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b border-line px-4 py-3 last:border-0">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted">/{c.slug}</p>
              </div>
              <button onClick={() => remove(c)} className="rounded-lg p-2 text-muted hover:bg-sand hover:text-azur">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
