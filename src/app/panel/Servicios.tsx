"use client";
import { useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Servicio } from "@/lib/tipos";
import type { Ctx } from "./Panel";

export default function Servicios({ centro, servicios, recargar }: Ctx) {
  return (
    <div>
      <p className="gris">Acá cambiás precios, duración y la seña de cada servicio. Lo que guardes se ve al instante en tu página.</p>
      {servicios.map((s) => <Fila key={s.id} s={s} recargar={recargar} />)}
      <button className="boton" onClick={async () => {
        await sb().from("services").insert({ center_id: centro.id, name: "Servicio nuevo", duration_min: 60, price: 0, deposit: 0, sort: servicios.length + 1 });
        recargar();
      }}>+ Agregar servicio</button>
    </div>
  );
}

function Fila({ s, recargar }: { s: Servicio; recargar: () => Promise<void> }) {
  const [f, setF] = useState(s);
  const [estado, setEstado] = useState("");
  const set = (k: keyof Servicio, num = false) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value });
  async function guardar() {
    const { error } = await sb().from("services").update({
      name: f.name, category: f.category || null, description: f.description || null,
      duration_min: f.duration_min, price: f.price, deposit: f.deposit, active: f.active,
    }).eq("id", s.id);
    setEstado(error ? "Error" : "¡Guardado!"); setTimeout(() => setEstado(""), 2000); recargar();
  }
  return (
    <div className={`tarjeta ${f.active ? "" : "apagada"}`}>
      <div className="fila">
        <label className="ancho">Nombre<input value={f.name} onChange={set("name")} /></label>
        <label>Categoría<input value={f.category ?? ""} onChange={set("category")} /></label>
      </div>
      <label>Descripción<input value={f.description ?? ""} onChange={set("description")} /></label>
      <div className="fila">
        <label>Duración (min)<input type="number" min={5} step={5} value={f.duration_min} onChange={set("duration_min", true)} /></label>
        <label>Precio $<input type="number" min={0} value={f.price} onChange={set("price", true)} /></label>
        <label>Seña $<input type="number" min={0} value={f.deposit} onChange={set("deposit", true)} /></label>
      </div>
      <div className="acciones">
        <label className="check"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Visible en la página</label>
        <button className="boton chico" onClick={guardar}>{estado || "Guardar"}</button>
      </div>
    </div>
  );
}
