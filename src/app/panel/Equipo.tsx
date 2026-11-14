"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Profesional } from "@/lib/tipos";
import { DIAS_LARGOS } from "@/lib/tiempo";
import type { Ctx } from "./Panel";

type Rango = { on: boolean; desde: string; hasta: string };
const ORDEN = [1, 2, 3, 4, 5, 6, 0];

export default function Equipo({ centro, servicios, profesionales, recargar }: Ctx) {
  return (
    <div>
      <p className="gris">Cada profesional con los servicios que hace y sus horarios de atención.</p>
      {profesionales.map((p) => <Prof key={p.id} p={p} servicios={servicios} recargar={recargar} />)}
      <button className="boton" onClick={async () => {
        await sb().from("professionals").insert({ center_id: centro.id, name: "Profesional nueva", sort: profesionales.length + 1 });
        recargar();
      }}>+ Agregar profesional</button>
    </div>
  );
}

function Prof({ p, servicios, recargar }: { p: Profesional; servicios: Ctx["servicios"]; recargar: () => Promise<void> }) {
  const [f, setF] = useState(p);
  const [todos, setTodos] = useState(!p.services);
  const [hs, setHs] = useState<Record<number, Rango>>({});
  const [estado, setEstado] = useState("");
  useEffect(() => {
    sb().from("hours").select("*").eq("professional_id", p.id).then(({ data }) => {
      const r: Record<number, Rango> = {};
      for (const d of ORDEN) r[d] = { on: false, desde: "09:00", hasta: "18:00" };
      for (const h of data ?? []) r[h.weekday] = { on: true, desde: h.start_time.slice(0, 5), hasta: h.end_time.slice(0, 5) };
      setHs(r);
    });
  }, [p.id]);
  const marcado = (id: string) => todos || (f.services ?? []).includes(id);
  function tocar(id: string) {
    const base = todos ? servicios.map((s) => s.id) : f.services ?? [];
    setTodos(false);
    setF({ ...f, services: base.includes(id) ? base.filter((x) => x !== id) : [...base, id] });
  }
  async function guardar() {
    await sb().from("professionals").update({ name: f.name, role: f.role || null, active: f.active, services: todos ? null : f.services }).eq("id", p.id);
    await sb().from("hours").delete().eq("professional_id", p.id);
    const filas = ORDEN.filter((d) => hs[d]?.on).map((d) => ({ center_id: p.center_id, professional_id: p.id, weekday: d, start_time: hs[d].desde, end_time: hs[d].hasta }));
    if (filas.length) await sb().from("hours").insert(filas);
    setEstado("¡Guardado!"); setTimeout(() => setEstado(""), 2000); recargar();
  }
  return (
    <div className={`tarjeta ${f.active ? "" : "apagada"}`}>
      <div className="fila">
        <label className="ancho">Nombre<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>Especialidad<input value={f.role ?? ""} onChange={(e) => setF({ ...f, role: e.target.value })} /></label>
      </div>
      <h4>Servicios que hace</h4>
      <div className="chips">
        <button className={todos ? "chip sel" : "chip"} onClick={() => setTodos(!todos)}>Todos</button>
        {servicios.map((s) => <button key={s.id} className={marcado(s.id) ? "chip sel" : "chip"} onClick={() => tocar(s.id)}>{s.name}</button>)}
      </div>
      <h4>Horarios</h4>
      <div className="horarios">
        {ORDEN.map((d) => hs[d] && (
          <div key={d} className="fila-hora">
            <label className="check"><input type="checkbox" checked={hs[d].on} onChange={(e) => setHs({ ...hs, [d]: { ...hs[d], on: e.target.checked } })} /> {DIAS_LARGOS[d]}</label>
            {hs[d].on && <>
              <input type="time" step={900} value={hs[d].desde} onChange={(e) => setHs({ ...hs, [d]: { ...hs[d], desde: e.target.value } })} />
              <span>a</span>
              <input type="time" step={900} value={hs[d].hasta} onChange={(e) => setHs({ ...hs, [d]: { ...hs[d], hasta: e.target.value } })} />
            </>}
          </div>
        ))}
      </div>
      <div className="acciones">
        <label className="check"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Activa</label>
        <button className="boton chico" onClick={guardar}>{estado || "Guardar"}</button>
      </div>
    </div>
  );
}
