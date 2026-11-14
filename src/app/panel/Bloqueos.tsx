"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import { aFecha, fechaAR, horaAR, hoyAR, lindaFecha } from "@/lib/tiempo";
import type { Ctx } from "./Panel";

type Bloqueo = { id: string; professional_id: string | null; starts_at: string; ends_at: string; reason: string | null };

export default function Bloqueos({ centro, profesionales }: Ctx) {
  const [lista, setLista] = useState<Bloqueo[]>([]);
  const [f, setF] = useState({ prof: "", d1: hoyAR(), h1: "09:00", d2: hoyAR(), h2: "18:00", motivo: "" });
  const [error, setError] = useState("");
  const cargar = () => sb().from("blocks").select("*").eq("center_id", centro.id).gte("ends_at", new Date().toISOString()).order("starts_at").then(({ data }) => setLista(data ?? []));
  useEffect(() => { cargar(); }, []); // eslint-disable-line
  async function agregar(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const ini = aFecha(f.d1, f.h1), fin = aFecha(f.d2, f.h2);
    if (fin <= ini) return setError("El final tiene que ser después del inicio.");
    await sb().from("blocks").insert({ center_id: centro.id, professional_id: f.prof || null, starts_at: ini.toISOString(), ends_at: fin.toISOString(), reason: f.motivo || null });
    setF({ ...f, motivo: "" }); cargar();
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const cuando = (x: string) => `${lindaFecha(fechaAR(x))} ${horaAR(x)}`;
  return (
    <div>
      <p className="gris">Vacaciones, feriados, trámites: en esos horarios no se pueden reservar turnos.</p>
      <form className="tarjeta form" onSubmit={agregar}>
        <label>¿Quién?<select value={f.prof} onChange={set("prof")}><option value="">Todo el centro</option>{profesionales.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <div className="fila"><label>Desde<input type="date" value={f.d1} onChange={set("d1")} /></label><label>Hora<input type="time" value={f.h1} onChange={set("h1")} /></label></div>
        <div className="fila"><label>Hasta<input type="date" value={f.d2} onChange={set("d2")} /></label><label>Hora<input type="time" value={f.h2} onChange={set("h2")} /></label></div>
        <label>Motivo (opcional)<input value={f.motivo} onChange={set("motivo")} /></label>
        {error && <p className="error">{error}</p>}
        <button className="boton">Bloquear</button>
      </form>
      {lista.map((b) => (
        <div key={b.id} className="tarjeta fila-lista">
          <div><b>{b.professional_id ? profesionales.find((p) => p.id === b.professional_id)?.name : "Todo el centro"}</b>
            <div className="gris">{cuando(b.starts_at)} → {cuando(b.ends_at)}{b.reason ? ` · ${b.reason}` : ""}</div></div>
          <button className="boton chico secundario" onClick={async () => { await sb().from("blocks").delete().eq("id", b.id); cargar(); }}>Quitar</button>
        </div>
      ))}
    </div>
  );
}
