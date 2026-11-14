export type Centro = {
  id: string; slug: string; name: string; tagline: string | null; address: string | null;
  whatsapp: string | null; instagram: string | null; email: string | null; color: string | null; logo: string | null;
  slot_min: number; min_notice_h: number; max_days: number; deposit_note: string | null;
  cover: string | null; about: string | null; preview?: boolean | null;
};
export type Servicio = {
  id: string; center_id: string; name: string; description: string | null; category: string | null;
  duration_min: number; price: number; deposit: number; active: boolean; sort: number | null; image: string | null;
};
export type Profesional = {
  id: string; center_id: string; name: string; role: string | null; photo: string | null;
  services: string[] | null; active: boolean; sort: number | null;
};
export type Turno = {
  id: string; center_id: string; professional_id: string; service_id: string | null; client_id: string | null;
  service_name: string | null; starts_at: string; ends_at: string; status: string; price: number;
  deposit: number; deposit_paid: boolean; notes: string | null; source: string; token: string;
};
export type Clienta = { id: string; center_id: string; name: string; phone: string; email: string | null; notes: string | null; created_at: string };

export const haceServicio = (p: Profesional, servicioId: string) => p.active && (!p.services || p.services.includes(servicioId));
export type Resena = { id: string; center_id: string; name: string; rating: number; body: string | null; service: string | null; approved: boolean; created_at: string };

// Emoji y color pastel según la categoría (cuando el servicio no tiene foto)
const ESTILOS: [RegExp, string, string][] = [
  [/kids|teens|niñ/i, "🎀", "#fde2ea"],
  [/maquill|peinad/i, "💄", "#fbd3e0"],
  [/alisad|capilar|cabell|pelo|laminad|keratin|keractiv|nutritiv|tratamiento/i, "💇‍♀️", "#f9d5e5"],
  [/uñ|manic|pedic|pies/i, "💅", "#f9d5e5"],
  [/depil|láser|laser|cera/i, "🌸", "#e6dcf7"],
  [/facial|piel|peeling|dermap/i, "🌿", "#d4f0e4"],
  [/ceja|pesta|mirada/i, "👁️", "#fde2cf"],
  [/corpor|masaj|drenaj|spa/i, "💆‍♀️", "#d6e8f7"],
];
export function estiloCategoria(cat: string | null) {
  const e = ESTILOS.find(([r]) => r.test(cat ?? ""));
  return { emoji: e?.[1] ?? "✨", color: e?.[2] ?? "#f6e3ea" };
}

// Link de WhatsApp del centro: acepta número (549...) o un link wa.me/message/...
export function waUrl(whatsapp: string | null, texto?: string) {
  if (!whatsapp) return null;
  if (/^https?:\/\//.test(whatsapp)) return whatsapp;
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}
