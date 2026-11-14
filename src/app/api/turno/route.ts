import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// La clienta confirma o cancela con el link de su turno
export async function POST(req: NextRequest) {
  const { token, accion } = await req.json().catch(() => ({}));
  if (typeof token !== "string" || !["confirmar", "cancelar"].includes(accion)) return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  const sb = supabaseAdmin();
  const { data: t } = await sb.from("appointments").select("id,status,starts_at").eq("token", token).maybeSingle();
  if (!t) return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
  if (new Date(t.starts_at).getTime() < Date.now()) return NextResponse.json({ error: "El turno ya pasó." }, { status: 400 });
  if (t.status === "cancelado") return NextResponse.json({ error: "El turno ya estaba cancelado." }, { status: 400 });
  const status = accion === "confirmar" ? "confirmado" : "cancelado";
  await sb.from("appointments").update({ status }).eq("id", t.id);
  return NextResponse.json({ status });
}
