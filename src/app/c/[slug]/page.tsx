import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { datosCentro } from "@/lib/disponibilidad";
import Reserva from "./Reserva";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await datosCentro(supabaseAdmin(), (await params).slug);
  return d ? { title: `${d.centro.name} · Reservá tu turno`, description: d.centro.tagline ?? undefined } : {};
}

export default async function Page({ params }: P) {
  const sb = supabaseAdmin();
  const d = await datosCentro(sb, (await params).slug);
  if (!d) notFound();
  const { data: h } = await sb.from("hours").select("professional_id,weekday").eq("center_id", d.centro.id);
  const dias: Record<string, number[]> = {};
  for (const r of h ?? []) (dias[r.professional_id] ??= []).push(r.weekday);
  return <Reserva centro={d.centro} servicios={d.servicios} profesionales={d.profesionales} dias={dias} />;
}
