import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, Truck, RotateCcw } from "lucide-react";
import { fetchProductBySlug } from "../lib/data";
import type { Product } from "../lib/types";
import { useSettings } from "../context/SettingsContext";
import { useCart } from "../store/cart";
import { money } from "../lib/format";

export default function ProductDetail() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug).then((p) => {
      setProduct(p);
      setSize(p?.sizes?.length ? null : "one");
      setActive(0);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="wrap py-32 text-center text-muted">Loading…</div>;
  if (!product)
    return (
      <div className="wrap py-32 text-center">
        <p className="display text-2xl font-bold">Piece not found</p>
        <Link to="/shop" className="mt-4 inline-block text-azur underline">Back to shop</Link>
      </div>
    );

  const needsSize = product.sizes && product.sizes.length > 0;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const sym = settings.currency_symbol;

  function handleAdd() {
    if (!product) return;
    if (needsSize && !size) {
      setWarn(true);
      return;
    }
    add(product, needsSize ? size : null, 1);
  }

  function orderWhatsApp() {
    if (!product) return;
    const txt = `Hello ${settings.store_name}! I'd like to order:%0A• ${product.name}${
      size && size !== "one" ? ` (size ${size})` : ""
    } — ${money(product.price, sym)}`;
    window.open(`https://wa.me/${settings.whatsapp_number}?text=${txt}`, "_blank");
  }

  return (
    <div className="wrap py-8">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-azur">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
            {product.images?.[active] ? (
              <img src={product.images[active]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted">No image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 transition ${
                    active === i ? "border-azur" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="lg:pt-4">
          <h1 className="display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold">{money(product.price, sym)}</span>
            {onSale && (
              <span className="text-lg text-muted line-through">
                {money(product.compare_at_price!, sym)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-muted">{product.description}</p>
          )}

          {needsSize && (
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="label mb-0">Size</span>
                {warn && !size && <span className="text-xs text-azur">Please pick a size</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setWarn(false);
                    }}
                    className={`min-w-[3rem] rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              disabled={!product.in_stock}
              className="btn-primary flex-1"
            >
              {product.in_stock ? "Add to bag" : "Sold out"}
            </button>
            {settings.whatsapp_number && product.in_stock && (
              <button onClick={orderWhatsApp} className="btn-azur">
                <MessageCircle size={17} /> Order on WhatsApp
              </button>
            )}
          </div>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-muted">
            <li className="flex items-center gap-3"><Truck size={17} className="text-azur" /> Delivery across Tunisia · pay on delivery</li>
            <li className="flex items-center gap-3"><RotateCcw size={17} className="text-azur" /> Easy exchanges within 7 days</li>
            <li className="flex items-center gap-3"><Check size={17} className="text-azur" /> Made in limited runs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
