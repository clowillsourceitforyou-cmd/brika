import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { Shirt, Tags, ClipboardList, Settings, LogOut, ExternalLink } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";

const links = [
  { to: "/admin/products", label: "Products", icon: Shirt },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      navigate("/admin/login");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
      setSession(data.session);
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate("/admin/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (!checked || !session) {
    return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-white p-5 md:flex">
        <Link to="/" className="display mb-8 text-2xl font-extrabold lowercase">
          brika<span className="text-azur">.</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-ink text-paper" : "text-ink hover:bg-sand"
                }`
              }
            >
              <l.icon size={18} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-azur">
          <ExternalLink size={16} /> View store
        </a>
        <button onClick={signOut} className="mt-1 flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-azur">
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* mobile top bar */}
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:hidden">
          <Link to="/" className="display text-xl font-extrabold lowercase">brika<span className="text-azur">.</span></Link>
          <button onClick={signOut} className="text-sm text-muted">Sign out</button>
        </div>
        <div className="no-bar flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-ink text-paper" : "text-muted"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
