import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { datosCentro, horariosLibres } from "@/lib/disponibilidad";
import { haceServicio } from "@/lib/tipos";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const fecha = q.get("fecha") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  const sb = supabaseAdmin();
  const d = await datosCentro(sb, q.get("slug") ?? "");
  const servicio = d?.servicios.find((s) => s.id === q.get("servicio"));
  if (!d || !servicio) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const prof = q.get("prof");
  const ids = d.profesionales.filter((p) => haceServicio(p, servicio.id) && (!prof || p.id === prof)).map((p) => p.id);
  return NextResponse.json({ horarios: await horariosLibres(sb, d.centro, servicio, ids, fecha) });
}
