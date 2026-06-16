import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "../store/cart";
import { useSettings } from "../context/SettingsContext";

const nav = [
  { label: "Shop", to: "/shop" },
  { label: "New in", to: "/shop?sort=new" },
  { label: "About", to: "/#story" },
];

export default function Header() {
  const { settings } = useSettings();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-azur ${
                  isActive ? "text-azur" : "text-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="display absolute left-1/2 -translate-x-1/2 text-2xl font-extrabold lowercase tracking-tight"
        >
          {settings.store_name}
          <span className="text-azur">.</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="hidden text-ink transition hover:text-azur sm:block"
            onClick={() => navigate("/shop")}
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Open cart"
            onClick={openCart}
            className="relative text-ink transition hover:text-azur"
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-azur px-1 text-[10px] font-bold text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="animate-slidein ml-auto flex h-full w-72 flex-col bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mb-8 self-end" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={22} />
            </button>
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line py-4 text-lg font-medium"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
