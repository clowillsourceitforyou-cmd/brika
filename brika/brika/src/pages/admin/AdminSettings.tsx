import { useEffect, useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { uploadImage } from "../../lib/upload";
import { useSettings, DEFAULT_SETTINGS } from "../../context/SettingsContext";
import type { SiteSettings } from "../../lib/types";

export default function AdminSettings() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  }

  async function handleHero(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      set("hero_image_url", url);
    } catch (e: any) {
      setError(e.message || "Upload failed.");
    }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    const { id, ...rest } = { ...DEFAULT_SETTINGS, ...form };
    const { error: err } = await supabase.from("settings").update(rest).eq("id", 1);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    await refresh();
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="display mb-1 text-2xl font-bold">Site settings</h1>
      <p className="mb-6 text-sm text-muted">Everything customers see — edit and save.</p>

      <div className="space-y-8">
        <Section title="Store identity">
          <Field label="Store name">
            <input className="field" value={form.store_name} onChange={(e) => set("store_name", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input className="field" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Currency symbol">
            <input className="field" value={form.currency_symbol} onChange={(e) => set("currency_symbol", e.target.value)} placeholder="DT" />
          </Field>
        </Section>

        <Section title="Announcement banner">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-azur" checked={form.announcement_active} onChange={(e) => set("announcement_active", e.target.checked)} />
            Show the banner at the top of the site
          </label>
          <Field label="Banner text">
            <input className="field" value={form.announcement_text} onChange={(e) => set("announcement_text", e.target.value)} />
          </Field>
        </Section>

        <Section title="Homepage hero">
          <Field label="Headline (use Enter for a line break)">
            <textarea className="field min-h-[80px] resize-none" value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <textarea className="field min-h-[70px] resize-none" value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} />
          </Field>
          <Field label="Button label">
            <input className="field" value={form.hero_cta_label} onChange={(e) => set("hero_cta_label", e.target.value)} />
          </Field>
          <Field label="Hero image">
            <div className="flex items-center gap-4">
              <div className="h-24 w-20 overflow-hidden rounded-lg bg-sand">
                {form.hero_image_url && <img src={form.hero_image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <label className="btn-ghost cursor-pointer">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleHero(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <input className="field mt-2" value={form.hero_image_url} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="…or paste an image URL" />
          </Field>
        </Section>

        <Section title="About section">
          <Field label="Title">
            <input className="field" value={form.story_title} onChange={(e) => set("story_title", e.target.value)} />
          </Field>
          <Field label="Text">
            <textarea className="field min-h-[90px] resize-none" value={form.story_text} onChange={(e) => set("story_text", e.target.value)} />
          </Field>
        </Section>

        <Section title="Contact & delivery">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp number (digits only, with country code)">
              <input className="field" value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="21612345678" />
            </Field>
            <Field label="Contact email">
              <input className="field" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
            </Field>
            <Field label="Instagram URL">
              <input className="field" value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
            </Field>
            <Field label="Facebook URL">
              <input className="field" value={form.facebook_url} onChange={(e) => set("facebook_url", e.target.value)} />
            </Field>
            <Field label="Shipping fee">
              <input className="field" inputMode="decimal" value={String(form.shipping_fee)} onChange={(e) => set("shipping_fee", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Free shipping over (0 to disable)">
              <input className="field" inputMode="decimal" value={String(form.free_shipping_threshold)} onChange={(e) => set("free_shipping_threshold", Number(e.target.value) || 0)} />
            </Field>
          </div>
          <Field label="Footer note">
            <input className="field" value={form.footer_note} onChange={(e) => set("footer_note", e.target.value)} />
          </Field>
        </Section>

        {error && <p className="rounded-lg bg-azur/10 px-4 py-3 text-sm text-azur-dark">{error}</p>}

        <div className="sticky bottom-4 flex items-center gap-3">
          <button onClick={save} disabled={saving || uploading} className="btn-primary">
            {saving ? "Saving…" : "Save all changes"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-azur-dark">
              <Check size={16} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="eyebrow mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
