import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Helpful console hint during local setup.
  console.warn(
    "[brika] Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env"
  );
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key"
);

export const PRODUCT_BUCKET = "product-images";
