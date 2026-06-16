import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { SiteSettings } from "../lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  store_name: "brika",
  tagline: "Made for the Mediterranean light",
  announcement_text: "Free delivery across Tunisia on orders over 200 DT — pay on delivery.",
  announcement_active: true,
  hero_title: "Wardrobe staples,\nwoven for the sun.",
  hero_subtitle:
    "Contemporary ready-to-wear in natural fabrics. Designed in Tunis, made to be lived in.",
  hero_image_url:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  hero_cta_label: "Shop the collection",
  story_title: "A small label with a clear idea",
  story_text:
    "brika is built around a handful of pieces you actually reach for — clean cuts, honest fabrics, and a colour story drawn from the blue doors of Sidi Bou Saïd. Everything is made in limited runs.",
  whatsapp_number: "21600000000",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  contact_email: "hello@brika.store",
  shipping_fee: 8,
  free_shipping_threshold: 200,
  currency_symbol: "DT",
  footer_note: "Designed and made in Tunisia.",
};

interface Ctx {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<Ctx>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!isSupabaseConfigured) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
    if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
