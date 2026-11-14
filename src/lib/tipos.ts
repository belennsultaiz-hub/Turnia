export type Centro = {
  id: string; slug: string; name: string; tagline: string | null; address: string | null;
  whatsapp: string | null; instagram: string | null; email: string | null; color: string | null; logo: string | null;
  slot_min: number; min_notice_h: number; max_days: number; deposit_note: string | null;
};
export type Servicio = {
  id: string; center_id: string; name: string; description: string | null; category: string | null;
  duration_min: number; price: number; deposit: number; active: boolean; sort: number | null;
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
