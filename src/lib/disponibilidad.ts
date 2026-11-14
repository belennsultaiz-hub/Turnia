import type { SupabaseClient } from "@supabase/supabase-js";
import type { Centro, Resena, Servicio } from "./tipos";
import { aFecha, diaSemana, horaAR, sumarDias } from "./tiempo";

type Ocupado = { professional_id: string | null; starts_at: string; ends_at: string };

// Horarios libres de un día para un servicio, entre las profesionales indicadas.
export async function horariosLibres(sb: SupabaseClient, centro: Centro, servicio: Servicio, profIds: string[], fecha: string) {
  if (!profIds.length) return [];
  const desde = aFecha(fecha, "00:00").toISOString();
  const hasta = aFecha(sumarDias(fecha, 1), "00:00").toISOString();
  const [h, b, a] = await Promise.all([
    sb.from("hours").select("professional_id,start_time,end_time").eq("center_id", centro.id).eq("weekday", diaSemana(fecha)).in("professional_id", profIds),
    sb.from("blocks").select("professional_id,starts_at,ends_at").eq("center_id", centro.id).lt("starts_at", hasta).gt("ends_at", desde),
    sb.from("appointments").select("professional_id,starts_at,ends_at").eq("center_id", centro.id).neq("status", "cancelado").lt("starts_at", hasta).gt("ends_at", desde),
  ]);
  const ocupados: Ocupado[] = [...(b.data ?? []), ...(a.data ?? [])];
  const limite = Date.now() + centro.min_notice_h * 3600e3;
  const dur = servicio.duration_min * 60e3;
  const paso = Math.max(5, centro.slot_min) * 60e3;
  const libres = new Map<string, string[]>();
  for (const r of h.data ?? []) {
    const fin = aFecha(fecha, r.start_time > r.end_time ? "23:59" : r.end_time).getTime();
    for (let t = aFecha(fecha, r.start_time).getTime(); t + dur <= fin; t += paso) {
      if (t < limite) continue;
      const choca = ocupados.some(
        (x) => (x.professional_id === null || x.professional_id === r.professional_id) &&
          new Date(x.starts_at).getTime() < t + dur && new Date(x.ends_at).getTime() > t,
      );
      if (choca) continue;
      const k = horaAR(new Date(t));
      const lista = libres.get(k) ?? [];
      if (!lista.includes(r.professional_id)) lista.push(r.professional_id);
      libres.set(k, lista);
    }
  }
  return [...libres.entries()].sort(([x], [y]) => x.localeCompare(y)).map(([hora, profs]) => ({ hora, profs }));
}

export async function datosCentro(sb: SupabaseClient, slug: string) {
  const { data: centro } = await sb.from("centers").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  if (!centro) return null;
  const [s, p, r] = await Promise.all([
    sb.from("services").select("*").eq("center_id", centro.id).eq("active", true).order("sort").order("name"),
    sb.from("professionals").select("*").eq("center_id", centro.id).eq("active", true).order("sort").order("name"),
    sb.from("reviews").select("*").eq("center_id", centro.id).eq("approved", true).order("created_at", { ascending: false }).limit(30),
  ]);
  return { centro: centro as Centro, servicios: (s.data ?? []) as Servicio[], profesionales: p.data ?? [], resenas: (r.data ?? []) as Resena[] };
}
