import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Reseña nueva: queda pendiente hasta que el centro la apruebe en el panel
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.nombre ?? "").trim().slice(0, 60);
  const body = String(b.texto ?? "").trim().slice(0, 600);
  const rating = Math.round(Number(b.estrellas));
  if (name.length < 2 || !(rating >= 1 && rating <= 5)) return NextResponse.json({ error: "Poné tu nombre y las estrellas." }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: c } = await sb.from("centers").select("id").eq("slug", String(b.slug ?? "")).eq("active", true).maybeSingle();
  if (!c) return NextResponse.json({ error: "Centro no encontrado" }, { status: 404 });
  await sb.from("reviews").insert({ center_id: c.id, name, rating, body: body || null, service: String(b.servicio ?? "").slice(0, 80) || null });
  return NextResponse.json({ ok: true });
}
