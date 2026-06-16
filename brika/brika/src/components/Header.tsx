import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, MessageCircle, ArrowUpRight } from "lucide-react";
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

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <button
          className="-ml-1 grid h-10 w-10 place-items-center rounded-full transition active:scale-95 md:hidden"
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

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            className="hidden h-10 w-10 place-items-center text-ink transition hover:text-azur sm:grid"
            onClick={() => navigate("/shop")}
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Open cart"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center text-ink transition hover:text-azur active:scale-95"
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-azur px-1 text-[10px] font-bold text-paper">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* frosted, dimmed backdrop — blurs the page behind */}
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="animate-fade absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-md"
          />
          {/* solid panel */}
          <div className="animate-slideleft absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="display text-2xl font-extrabold lowercase tracking-tight"
              >
                {settings.store_name}
                <span className="text-azur">.</span>
              </Link>
              <button
                className="grid h-10 w-10 place-items-center rounded-full text-ink transition active:scale-95"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col px-3 py-4">
              {nav.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-3 py-4 text-lg font-medium transition active:bg-sand"
                >
                  {n.label}
                  <ArrowUpRight
                    size={18}
                    className="text-muted transition group-active:text-azur"
                  />
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-line px-6 py-5">
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="btn-azur w-full"
                >
                  <MessageCircle size={17} /> Chat with us
                </a>
              )}
              <p className="mt-4 text-center text-xs text-muted">
                Delivery across Tunisia · Pay on delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
