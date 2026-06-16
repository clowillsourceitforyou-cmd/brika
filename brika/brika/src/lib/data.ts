import { supabase, isSupabaseConfigured } from "./supabase";
import type { Product, Category } from "./types";

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as Category[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return (data as Product) ?? null;
}
