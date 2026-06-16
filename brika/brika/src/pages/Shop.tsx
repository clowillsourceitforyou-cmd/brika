import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../lib/data";
import type { Product, Category } from "../lib/types";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const sort = params.get("sort");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const activeCat = categories.find((c) => c.slug === slug) || null;

  const list = useMemo(() => {
    let l = [...products];
    if (activeCat) l = l.filter((p) => p.category_id === activeCat.id);
    if (sort === "new")
      l.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return l;
  }, [products, activeCat, sort]);

  return (
    <div className="wrap py-10">
      <header className="mb-8">
        <p className="eyebrow mb-2">{list.length} {list.length === 1 ? "piece" : "pieces"}</p>
        <h1 className="display text-4xl font-extrabold sm:text-5xl">
          {activeCat ? activeCat.name : sort === "new" ? "New in" : "All clothing"}
        </h1>
      </header>

      <div className="no-bar mb-10 flex gap-3 overflow-x-auto pb-1">
        <Link
          to="/shop"
          className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
            !activeCat ? "border-ink bg-ink text-paper" : "border-line hover:border-azur hover:text-azur"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/shop/${c.slug}`}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
              activeCat?.id === c.id
                ? "border-ink bg-ink text-paper"
                : "border-line hover:border-azur hover:text-azur"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-xl bg-sand" />
              <div className="mt-3 h-3 w-2/3 rounded bg-sand" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-20 text-center text-muted">
          Nothing here yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
