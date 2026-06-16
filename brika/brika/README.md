# brika — online clothing store

A beautiful, production-ready clothing store with a full owner admin panel.
Built with Vite + React + TypeScript + Tailwind, backed by Supabase, ready to
deploy on Netlify.

The design uses the iconic **Sidi Bou Saïd azure blue** as its signature accent
against warm paper and ink tones — bold and editorial, not the generic
cream-and-terracotta look most fashion templates default to.

---

## What you (the owner) can edit — no code needed

Everything below is editable from the admin panel at `/admin`:

- **Products** — add/edit/delete, multiple images per product (drag-upload),
  price + optional "compare at" sale price, sizes, colors, category, stock
  toggle, and a "featured" toggle for the homepage.
- **Categories** — create/rename/delete the collections shown in the shop.
- **Announcement banner** — the dismissible bar at the very top. Turn on/off
  and change the text.
- **Hero section** — the big homepage headline, subtext, button label, and the
  background image (upload your own).
- **Store identity** — store name, tagline, "about / our story" text.
- **Contact & delivery** — phone, email, address, delivery note.
- **Social links** — Instagram, Facebook, TikTok, and your WhatsApp number.
- **Shipping** — flat shipping fee and the free-shipping threshold.
- **Orders dashboard** — every order placed (cash on delivery) lands here with
  customer details; update status (new → confirmed → shipped → delivered) and
  message the customer on WhatsApp in one tap.

Checkout is built for Tunisia: **cash on delivery** (orders saved to your
database) plus a one-tap **"Order on WhatsApp"** option. Default currency shows
as **DT** (Tunisian Dinar) and is editable in Settings.

---

## Setup (about 20–30 minutes)

You'll do three things: set up Supabase (the backend), run the app once locally
to confirm it works, then deploy to Netlify.

### 1. Create the Supabase backend

1. Go to <https://supabase.com>, create a free account, and click **New project**.
   Pick a name and a strong database password, choose a region close to Tunisia
   (e.g. Frankfurt), and wait ~2 minutes for it to provision.
2. In the left sidebar open **SQL Editor** → **New query**.
3. Open the file `supabase/schema.sql` from this project, copy **all** of it,
   paste it into the editor, and click **Run**. This creates your tables
   (products, categories, orders, settings), security rules, the image storage
   bucket, and a few starter categories.
4. Create your owner login: left sidebar → **Authentication** → **Users** →
   **Add user** → **Create new user**. Enter the email and password you want to
   log into the admin panel with. (Turn off "send confirmation email" / mark as
   auto-confirm so you can log in immediately.)
5. Get your API keys: left sidebar → **Project Settings** → **API**. You'll need
   two values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key (a long string — the public one, *not* the secret
     service_role key).

### 2. Run it locally once (optional but recommended)

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
# in the project folder
cp .env.example .env
```

Open `.env` and paste your two values:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then:

```bash
npm install
npm run dev
```

Open the URL it prints (usually <http://localhost:5173>). Visit `/admin`, log in
with the user you created, and add your first product. The storefront is the
home page.

### 3. Deploy to Netlify

1. Push this project to a **GitHub** repository.
   (If you've never done this: create an empty repo on github.com, then in the
   project folder run `git init && git add . && git commit -m "brika" && git
   branch -M main && git remote add origin YOUR_REPO_URL && git push -u origin
   main`.) The included `.gitignore` keeps `node_modules` and `.env` out.
2. Go to <https://netlify.com> → **Add new site** → **Import an existing project**
   → connect GitHub → pick your repo.
3. Build settings are auto-detected from `netlify.toml`, but confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Important — add your environment variables** before deploying:
   Site configuration → **Environment variables** → add the same two keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. When it finishes you'll get a live URL. Your admin panel is
   at `your-site.netlify.app/admin`.

That's it — your store is live. Add products and tweak settings from `/admin`
and changes appear instantly on the site.

---

## Tech notes

- **Stack:** Vite, React 18, TypeScript, Tailwind CSS v3, React Router v6,
  Zustand (cart, persisted to localStorage), Supabase JS client.
- **Admin auth** uses Supabase email/password. Anyone with a Supabase user can
  reach the admin — only create accounts you trust. Add more owners via
  Supabase → Authentication → Users.
- **Images** are stored in the Supabase `product-images` storage bucket (public
  read). The schema sets this up for you.
- **Security:** Row Level Security is on. The public can read the catalog and
  settings and create orders; only logged-in owners can edit products/settings
  or view orders. Your anon key is safe to expose in the browser — that's what
  it's designed for.
- The site looks good **before** you add any data (sensible defaults), so you
  can deploy first and fill it in after.

## Project structure

```
src/
  components/   Header, Footer, CartDrawer, ProductCard, AnnouncementBar, Layout
  context/      SettingsContext (loads your store settings)
  lib/          supabase client, types, data fetching, image upload, formatting
  pages/        Home, Shop, ProductDetail, Checkout, OrderSuccess
  pages/admin/  Login, Products, ProductForm, Categories, Orders, Settings
  store/        cart (Zustand)
supabase/
  schema.sql    run this once in the Supabase SQL editor
```
