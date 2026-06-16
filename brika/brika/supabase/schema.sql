-- ============================================================
--  brika · Supabase schema
--  Run this whole file in:
--  Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================

-- ---------- TABLES ----------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort int not null default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null default 0,
  compare_at_price numeric,
  category_id uuid references categories(id) on delete set null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  sort int not null default 0,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  note text,
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'new',
  created_at timestamptz default now()
);

create table if not exists settings (
  id int primary key default 1,
  store_name text default 'brika',
  tagline text default 'Made for the Mediterranean light',
  announcement_text text default 'Free delivery across Tunisia on orders over 200 DT - pay on delivery.',
  announcement_active boolean default true,
  hero_title text default E'Wardrobe staples,\nwoven for the sun.',
  hero_subtitle text default 'Contemporary ready-to-wear in natural fabrics. Designed in Tunis, made to be lived in.',
  hero_image_url text default 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
  hero_cta_label text default 'Shop the collection',
  story_title text default 'A small label with a clear idea',
  story_text text default 'brika is built around a handful of pieces you actually reach for - clean cuts, honest fabrics, and a colour story drawn from the blue doors of Sidi Bou Said. Everything is made in limited runs.',
  whatsapp_number text default '21600000000',
  instagram_url text default 'https://instagram.com',
  facebook_url text default 'https://facebook.com',
  contact_email text default 'hello@brika.store',
  shipping_fee numeric default 8,
  free_shipping_threshold numeric default 200,
  currency_symbol text default 'DT',
  footer_note text default 'Designed and made in Tunisia.'
);

-- one settings row, id = 1
insert into settings (id) values (1) on conflict (id) do nothing;

-- ---------- ROW LEVEL SECURITY ----------
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

-- Public can READ catalog + settings
create policy "public read categories" on categories for select using (true);
create policy "public read products"   on products   for select using (true);
create policy "public read settings"   on settings   for select using (true);

-- Only the signed-in owner can WRITE catalog + settings
create policy "owner write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Customers can CREATE an order at checkout. Only the owner reads/updates them.
create policy "anyone create orders" on orders for insert with check (true);
create policy "owner read orders"    on orders for select using (auth.role() = 'authenticated');
create policy "owner update orders"  on orders for update using (auth.role() = 'authenticated');

-- ---------- STORAGE (product & hero images) ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "owner upload images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "owner update images" on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "owner delete images" on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ---------- OPTIONAL: starter categories so the store is not empty ----------
insert into categories (name, slug, sort) values
  ('Dresses', 'dresses', 0),
  ('Shirts', 'shirts', 1),
  ('Knitwear', 'knitwear', 2)
on conflict (slug) do nothing;
