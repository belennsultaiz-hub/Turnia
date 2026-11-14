"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Resena } from "@/lib/tipos";
import { fechaAR, lindaFecha } from "@/lib/tiempo";
import type { Ctx } from "./Panel";

export default function Resenas({ centro }: Ctx) {
  const [lista, setLista] = useState<Resena[]>([]);
  const cargar = () => sb().from("reviews").select("*").eq("center_id", centro.id).order("approved").order("created_at", { ascending: false }).then(({ data }) => setLista(data ?? []));
  useEffect(() => { cargar(); }, []); // eslint-disable-line
  const cambiar = async (id: string, approved: boolean) => { await sb().from("reviews").update({ approved }).eq("id", id); cargar(); };
  const borrar = async (id: string) => { if (confirm("¿Borrar esta reseña?")) { await sb().from("reviews").delete().eq("id", id); cargar(); } };
  const pendientes = lista.filter((r) => !r.approved).length;
  return (
    <div>
      <p className="gris">Las reseñas nuevas quedan pendientes hasta que las publiques. {pendientes > 0 && <b>Tenés {pendientes} para revisar.</b>}</p>
      {!lista.length && <p className="gris">Todavía no hay reseñas.</p>}
      {lista.map((r) => (
        <div key={r.id} className={`tarjeta ${r.approved ? "" : "pendiente"}`}>
          <div><span className="estrellas">{"★".repeat(r.rating)}<span>{"★".repeat(5 - r.rating)}</span></span> <b>{r.name}</b> <span className="gris">· {lindaFecha(fechaAR(r.created_at))}{r.service ? ` · ${r.service}` : ""}</span></div>
          {r.body && <p style={{ margin: 0 }}>{r.body}</p>}
          <div className="acciones">
            {r.approved
              ? <button className="boton chico secundario" onClick={() => cambiar(r.id, false)}>Ocultar</button>
              : <button className="boton chico" onClick={() => cambiar(r.id, true)}>Publicar</button>}
            <button className="boton chico secundario" onClick={() => borrar(r.id)}>Borrar</button>
            {!r.approved && <span className="gris">Pendiente</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
