"use client";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Clienta, Turno } from "@/lib/tipos";
import { fechaAR, horaAR, lindaFecha, pesos, soloNumeros } from "@/lib/tiempo";
import type { Ctx } from "./Panel";
import { ESTADOS } from "./Agenda";

export default function Clientas({ centro, profesionales }: Ctx) {
  const [lista, setLista] = useState<Clienta[]>([]);
  const [buscar, setBuscar] = useState("");
  const [sel, setSel] = useState<Clienta | null>(null);
  const cargar = () => sb().from("clients").select("*").eq("center_id", centro.id).order("name").then(({ data }) => setLista(data ?? []));
  useEffect(() => { cargar(); }, []); // eslint-disable-line

  const b = buscar.toLowerCase();
  const filtradas = lista.filter((c) => !b || c.name.toLowerCase().includes(b) || c.phone.includes(soloNumeros(b) || "@@"));
  if (sel) return <Ficha c={sel} profesionales={profesionales} volver={() => { setSel(null); cargar(); }} />;
  return (
    <div>
      <input className="buscar" placeholder="Buscar por nombre o teléfono" value={buscar} onChange={(e) => setBuscar(e.target.value)} />
      <p className="gris">{filtradas.length} clientas</p>
      <div className="lista">
        {filtradas.map((c) => (
          <button key={c.id} className="fila-lista" onClick={() => setSel(c)}>
            <b>{c.name}</b><span className="gris">{c.phone}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Ficha({ c, profesionales, volver }: { c: Clienta; profesionales: Ctx["profesionales"]; volver: () => void }) {
  const [f, setF] = useState({ name: c.name, phone: c.phone, email: c.email ?? "", notes: c.notes ?? "" });
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [guardado, setGuardado] = useState(false);
  useEffect(() => { sb().from("appointments").select("*").eq("client_id", c.id).order("starts_at", { ascending: false }).then(({ data }) => setTurnos(data ?? [])); }, [c.id]);
  async function guardar() {
    await sb().from("clients").update({ ...f, phone: soloNumeros(f.phone), email: f.email || null }).eq("id", c.id);
    setGuardado(true); setTimeout(() => setGuardado(false), 2000);
  }
  const asistio = turnos.filter((t) => t.status === "asistio");
  const tel = soloNumeros(f.phone);
  return (
    <div className="ficha">
      <button className="volver" onClick={volver}>‹ Volver</button>
      <h2>{f.name}</h2>
      <p className="gris">Clienta desde {lindaFecha(fechaAR(c.created_at))} · {turnos.length} turnos · {asistio.length} asistidos · gastó {pesos(asistio.reduce((a, t) => a + Number(t.price), 0))} · faltó {turnos.filter((t) => t.status === "ausente").length}</p>
      <div className="form">
        <div className="fila">
          <label>Nombre<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label>Teléfono<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        </div>
        <label>Mail<input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Notas (alergias, tipo de piel, preferencias…)<textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
        <div className="acciones">
          <button className="boton" onClick={guardar}>{guardado ? "¡Guardado!" : "Guardar"}</button>
          {tel && <a className="boton wa" target="_blank" href={`https://wa.me/${tel.startsWith("54") ? tel : "549" + tel}`}>WhatsApp</a>}
        </div>
      </div>
      <h3>Historial</h3>
      {!turnos.length && <p className="gris">Todavía no tiene turnos.</p>}
      {turnos.map((t) => (
        <div key={t.id} className={`hist ${t.status}`}>
          <b>{lindaFecha(fechaAR(t.starts_at))} {horaAR(t.starts_at)}</b>
          <span>{t.service_name} · {profesionales.find((p) => p.id === t.professional_id)?.name}</span>
          <span>{ESTADOS[t.status]} · {pesos(t.price)}</span>
          {t.notes && <small>{t.notes}</small>}
        </div>
      ))}
    </div>
  );
}
