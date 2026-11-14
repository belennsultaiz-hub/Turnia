import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { datosCentro, horariosLibres } from "@/lib/disponibilidad";
import { haceServicio } from "@/lib/tipos";
import { aFecha, soloNumeros } from "@/lib/tiempo";

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const nombre = String(b.nombre ?? "").trim().slice(0, 80);
  const telefono = soloNumeros(String(b.telefono ?? "")).slice(0, 15);
  const email = String(b.email ?? "").trim().slice(0, 120);
  const fecha = String(b.fecha ?? ""), hora = String(b.hora ?? "");
  if (nombre.length < 2) return err("Poné tu nombre.");
  if (telefono.length < 8) return err("Poné un teléfono válido.");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("El mail no parece válido.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) return err("Elegí día y horario.");

  const sb = supabaseAdmin();
  const d = await datosCentro(sb, String(b.slug ?? ""));
  const servicio = d?.servicios.find((s) => s.id === b.servicio);
  if (!d || !servicio) return err("Servicio no encontrado.", 404);
  const ids = d.profesionales.filter((p) => haceServicio(p, servicio.id) && (!b.prof || p.id === b.prof)).map((p) => p.id);
  const libre = (await horariosLibres(sb, d.centro, servicio, ids, fecha)).find((h) => h.hora === hora);
  if (!libre) return err("Ese horario se acaba de ocupar. Elegí otro, porfa.", 409);

  // Clienta: se identifica por teléfono dentro del centro
  const { data: existe } = await sb.from("clients").select("id,email").eq("center_id", d.centro.id).eq("phone", telefono).maybeSingle();
  let clientId = existe?.id as string | undefined;
  if (clientId) {
    await sb.from("clients").update({ name: nombre, ...(email ? { email } : {}) }).eq("id", clientId);
  } else {
    const { data, error } = await sb.from("clients").insert({ center_id: d.centro.id, name: nombre, phone: telefono, email: email || null }).select("id").single();
    if (error) return err("No pudimos guardar tus datos. Probá de nuevo.", 500);
    clientId = data.id;
  }

  const inicio = aFecha(fecha, hora);
  const { data: turno, error } = await sb.from("appointments").insert({
    center_id: d.centro.id, professional_id: libre.profs[0], service_id: servicio.id, client_id: clientId,
    service_name: servicio.name, starts_at: inicio.toISOString(),
    ends_at: new Date(inicio.getTime() + servicio.duration_min * 60e3).toISOString(),
    price: servicio.price, deposit: servicio.deposit, source: "online",
  }).select("token").single();
  if (error) return err("Ese horario se acaba de ocupar. Elegí otro, porfa.", 409);
  return NextResponse.json({ token: turno.token });
}

function err(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}
