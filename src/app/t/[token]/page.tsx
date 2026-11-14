import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { fechaAR, horaAR, lindaFecha, pesos } from "@/lib/tiempo";
import Acciones from "./Acciones";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tu turno", robots: { index: false } };

export default async function Page({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ nuevo?: string }> }) {
  const { token } = await params;
  const nuevo = (await searchParams).nuevo;
  const sb = supabaseAdmin();
  const { data: t } = await sb.from("appointments")
    .select("status,starts_at,service_name,price,deposit,deposit_paid,centers(name,slug,address,whatsapp,color,deposit_note),professionals(name)")
    .eq("token", token).maybeSingle();
  if (!t) notFound();
  const c = t.centers as unknown as { name: string; slug: string; address: string | null; whatsapp: string | null; color: string | null; deposit_note: string | null };
  const p = t.professionals as unknown as { name: string } | null;
  const cuando = `${lindaFecha(fechaAR(t.starts_at))} a las ${horaAR(t.starts_at)} h`;
  const msj = encodeURIComponent(`Hola! Tengo turno de ${t.service_name} el ${cuando}.`);
  return (
    <main className="reserva" style={{ ["--c" as string]: c.color || "#b5838d" }}>
      <div className="tarjeta-turno">
        {nuevo && t.status === "reservado" && <p className="ok">✅ ¡Listo! Tu turno quedó reservado.</p>}
        <h1>{c.name}</h1>
        <p className="grande">{t.service_name}</p>
        <p>📅 {cuando}</p>
        {p && <p>💆‍♀️ Con {p.name}</p>}
        {c.address && <p>📍 {c.address}</p>}
        <p>💲 Total {pesos(t.price)}{t.deposit > 0 ? ` · Seña ${pesos(t.deposit)} ${t.deposit_paid ? "(pagada)" : "(pendiente)"}` : ""}</p>
        {t.deposit > 0 && !t.deposit_paid && c.deposit_note && <p className="nota">{c.deposit_note}</p>}
        <p className={`estado ${t.status}`}>Estado: {t.status}</p>
        <Acciones token={token} estado={t.status} futuro={new Date(t.starts_at).getTime() > Date.now()} />
        {c.whatsapp && <a className="boton wa" href={`https://wa.me/${c.whatsapp}?text=${msj}`}>Escribir al centro por WhatsApp</a>}
        <p><a href={`/c/${c.slug}`}>Reservar otro turno</a></p>
      </div>
    </main>
  );
}
