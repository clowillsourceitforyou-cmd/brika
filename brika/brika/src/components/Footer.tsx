import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="mt-24 border-t border-line bg-sand/50">
      <div className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="display text-3xl font-extrabold lowercase">
            {settings.store_name}
            <span className="text-azur">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{settings.tagline}</p>
          <div className="mt-6 flex gap-3">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-azur hover:text-azur"
              >
                <Instagram size={18} />
              </a>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-azur hover:text-azur"
              >
                <Facebook size={18} />
              </a>
            )}
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-azur hover:text-azur"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link to="/shop" className="hover:text-ink">All clothing</Link></li>
            <li><Link to="/shop?sort=new" className="hover:text-ink">New in</Link></li>
            <li><Link to="/shop" className="hover:text-ink">Best sellers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>Cash on delivery</li>
            <li>Delivery across Tunisia</li>
            {settings.whatsapp_number && (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink"
                >
                  Order on WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.store_name}. {settings.footer_note}</p>
          <Link to="/admin" className="hover:text-azur">Owner login</Link>
        </div>
      </div>
    </footer>
  );
}
