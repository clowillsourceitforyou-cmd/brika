import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { fetchProducts, fetchCategories } from "../lib/data";
import type { Product, Category } from "../lib/types";
import { useSettings } from "../context/SettingsContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { settings } = useSettings();
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

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const grid = (featured.length ? featured : products).slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div className="animate-rise">
            <p className="eyebrow mb-5">Tunis · Ready-to-wear</p>
            <h1 className="display text-[clamp(2.6rem,6vw,4.7rem)] font-extrabold">
              {settings.hero_title.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-base text-muted">{settings.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                {settings.hero_cta_label}
                <ArrowUpRight size={18} />
              </Link>
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  <MessageCircle size={17} /> Chat with us
                </a>
              )}
            </div>
          </div>

          <div className="relative animate-fade">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand lg:aspect-[5/6]">
              <img
                src={settings.hero_image_url}
                alt="brika collection"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl bg-azur px-5 py-4 text-paper shadow-lg sm:block">
              <p className="display text-2xl font-extrabold leading-none">limited</p>
              <p className="mt-1 text-xs tracking-wide opacity-90">runs only</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-line bg-sand/40">
        <div className="wrap grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Truck, t: "Delivery across Tunisia", s: "Fast, tracked shipping" },
            { icon: ShieldCheck, t: "Pay on delivery", s: "Cash when it arrives" },
            { icon: MessageCircle, t: "Order on WhatsApp", s: "Real people, quick replies" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3 py-5 sm:justify-center sm:px-4">
              <f.icon size={20} className="text-azur" />
              <div>
                <p className="text-sm font-semibold">{f.t}</p>
                <p className="text-xs text-muted">{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="wrap py-14">
          <div className="no-bar flex gap-3 overflow-x-auto pb-1">
            <Link to="/shop" className="shrink-0 rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-paper">
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.slug}`}
                className="shrink-0 rounded-full border border-line px-5 py-2 text-sm font-medium transition hover:border-azur hover:text-azur"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCT GRID */}
      <section className="wrap pb-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">The edit</p>
            <h2 className="display text-3xl font-bold sm:text-4xl">Pieces we love right now</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-azur hover:underline sm:block">
            View all
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : grid.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {grid.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* STORY */}
      <section id="story" className="wrap mt-20 scroll-mt-24">
        <div className="grid items-center gap-10 rounded-2xl bg-ink p-8 text-paper sm:p-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 text-azur">Our story</p>
            <h2 className="display text-3xl font-bold sm:text-4xl">{settings.story_title}</h2>
            <p className="mt-5 max-w-md text-paper/70">{settings.story_text}</p>
            <Link to="/shop" className="mt-7 inline-flex btn bg-paper text-ink hover:bg-azur hover:text-paper">
              Explore the collection
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => {
              const src = products[i]?.images?.[0] ?? settings.hero_image_url;
              return (
                <div key={i} className={`overflow-hidden rounded-xl bg-sand/20 ${i === 1 ? "mt-8" : ""}`}>
                  <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] rounded-xl bg-sand" />
          <div className="mt-3 h-3 w-2/3 rounded bg-sand" />
          <div className="mt-2 h-3 w-1/3 rounded bg-sand" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line py-20 text-center">
      <p className="display text-2xl font-bold">The collection is coming</p>
      <p className="mt-2 text-muted">
        Sign in to the <Link to="/admin" className="text-azur underline">owner panel</Link> to add your first pieces.
      </p>
    </div>
  );
}
