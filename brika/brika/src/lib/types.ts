export interface Category {
  id: string;
  name: string;
  slug: string;
  sort: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  sort: number;
  created_at?: string;
}

export interface SiteSettings {
  id: number;
  store_name: string;
  tagline: string;
  announcement_text: string;
  announcement_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_cta_label: string;
  story_title: string;
  story_text: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  contact_email: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  currency_symbol: string;
  footer_note: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
  image: string | null;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
}
