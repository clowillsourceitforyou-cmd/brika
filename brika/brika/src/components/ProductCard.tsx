import { Link } from "react-router-dom";
import type { Product } from "../lib/types";
import { useSettings } from "../context/SettingsContext";
import { money } from "../lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings();
  const img = product.images?.[0];
  const second = product.images?.[1];
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand">
        {img ? (
          <>
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="card-hover h-full w-full object-cover group-hover:scale-[1.04]"
            />
            {second && (
              <img
                src={second}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">No image</div>
        )}

        {!product.in_stock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper">
            Sold out
          </span>
        )}
        {onSale && product.in_stock && (
          <span className="absolute left-3 top-3 rounded-full bg-azur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium leading-snug group-hover:text-azur">{product.name}</h3>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold">{money(product.price, settings.currency_symbol)}</p>
          {onSale && (
            <p className="text-xs text-muted line-through">
              {money(product.compare_at_price!, settings.currency_symbol)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
