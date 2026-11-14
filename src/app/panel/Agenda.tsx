"use client";
import { useCallback, useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Turno } from "@/lib/tipos";
import { aFecha, fechaAR, horaAR, hoyAR, lindaFecha, lunesDe, pesos, soloNumeros, sumarDias } from "@/lib/tiempo";
import type { Ctx } from "./Panel";

type TurnoC = Turno & { clients: { name: string; phone: string } | null };
export const ESTADOS: Record<string, string> = { reservado: "Reservado", confirmado: "Confirmado", asistio: "Asistió", ausente: "No vino", cancelado: "Cancelado" };

export default function Agenda({ centro, servicios, profesionales }: Ctx) {
  const [vista, setVista] = useState<"dia" | "semana">("dia");
  const [fecha, setFecha] = useState(hoyAR());
  const [filtro, setFiltro] = useState("");
  const [turnos, setTurnos] = useState<TurnoC[]>([]);
  const [abierto, setAbierto] = useState<TurnoC | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const desde = vista === "dia" ? fecha : lunesDe(fecha);
  const dias = vista === "dia" ? [fecha] : Array.from({ length: 7 }, (_, i) => sumarDias(desde, i));
  const cargar = useCallback(async () => {
    const { data } = await sb().from("appointments").select("*,clients(name,phone)").eq("center_id", centro.id)
      .gte("starts_at", aFecha(desde, "00:00").toISOString()).lt("starts_at", aFecha(sumarDias(desde, vista === "dia" ? 1 : 7), "00:00").toISOString())
      .order("starts_at");
    setTurnos((data ?? []) as TurnoC[]);
  }, [centro.id, desde, vista]);
  useEffect(() => { cargar(); }, [cargar]);

  const prof = (id: string) => profesionales.find((p) => p.id === id);
  const color = (id: string) => `hsl(${(profesionales.findIndex((p) => p.id === id) * 77) % 360} 55% 92%)`;
  const visibles = turnos.filter((t) => !filtro || t.professional_id === filtro);
  const mover = (n: number) => setFecha(sumarDias(fecha, vista === "dia" ? n : 7 * n));

  return (
    <div>
      <div className="barra">
        <div className="seg">
          <button className={vista === "dia" ? "sel" : ""} onClick={() => setVista("dia")}>Día</button>
          <button className={vista === "semana" ? "sel" : ""} onClick={() => setVista("semana")}>Semana</button>
        </div>
        <button onClick={() => mover(-1)}>‹</button>
        <input type="date" value={fecha} onChange={(e) => e.target.value && setFecha(e.target.value)} />
        <button onClick={() => mover(1)}>›</button>
        <button onClick={() => setFecha(hoyAR())}>Hoy</button>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas las profesionales</option>
          {profesionales.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="boton chico" onClick={() => setNuevo(true)}>+ Nuevo turno</button>
      </div>

      <div className={vista === "semana" ? "semana" : ""}>
        {dias.map((d) => {
          const delDia = visibles.filter((t) => fechaAR(t.starts_at) === d);
          return (
            <div key={d} className="columna">
              <h3>{lindaFecha(d)} {d === hoyAR() && <small>(hoy)</small>}</h3>
              {!delDia.length && <p className="gris">Sin turnos</p>}
              {delDia.map((t) => (
                <button key={t.id} className={`turno ${t.status}`} style={{ background: color(t.professional_id) }} onClick={() => setAbierto(t)}>
                  <b>{horaAR(t.starts_at)}–{horaAR(t.ends_at)}</b>
                  <span>{t.clients?.name ?? "Sin nombre"}</span>
                  <small>{t.service_name} · {prof(t.professional_id)?.name}</small>
                  <small>{ESTADOS[t.status]}{t.deposit > 0 ? (t.deposit_paid ? " · seña ✓" : " · seña pendiente") : ""}</small>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {abierto && <Detalle t={abierto} centroNombre={centro.name} profNombre={prof(abierto.professional_id)?.name ?? ""} cerrar={() => { setAbierto(null); cargar(); }} />}
      {nuevo && <NuevoTurno ctx={{ centro, servicios, profesionales }} fecha={fecha} cerrar={() => { setNuevo(false); cargar(); }} />}
    </div>
  );
}

function Detalle({ t, centroNombre, profNombre, cerrar }: { t: TurnoC; centroNombre: string; profNombre: string; cerrar: () => void }) {
  const [notas, setNotas] = useState(t.notes ?? "");
  const guardar = async (cambios: Partial<Turno>) => { await sb().from("appointments").update(cambios).eq("id", t.id); cerrar(); };
  const link = `${location.origin}/t/${t.token}`;
  const tel = soloNumeros(t.clients?.phone ?? "");
  const wa = tel.startsWith("54") ? tel : `549${tel}`;
  const msj = encodeURIComponent(`Hola ${t.clients?.name?.split(" ")[0] ?? ""}! Te recordamos tu turno en ${centroNombre}: ${t.service_name} el ${lindaFecha(fechaAR(t.starts_at))} a las ${horaAR(t.starts_at)} h. Confirmá o cancelá acá: ${link}`);
  return (
    <div className="modal" onClick={cerrar}>
      <div className="caja" onClick={(e) => e.stopPropagation()}>
        <h2>{t.clients?.name}</h2>
        <p>{t.service_name} con {profNombre}</p>
        <p>{lindaFecha(fechaAR(t.starts_at))} · {horaAR(t.starts_at)}–{horaAR(t.ends_at)} h</p>
        <p>📱 {t.clients?.phone} · Total {pesos(t.price)}</p>
        <p className="gris">Origen: {t.source === "online" ? "reserva online" : "cargado en el panel"}</p>
        <div className="chips">
          {Object.entries(ESTADOS).map(([k, v]) => (
            <button key={k} className={t.status === k ? "chip sel" : "chip"} onClick={() => guardar({ status: k })}>{v}</button>
          ))}
        </div>
        {t.deposit > 0 && (
          <label className="check"><input type="checkbox" checked={t.deposit_paid} onChange={(e) => guardar({ deposit_paid: e.target.checked })} /> Seña de {pesos(t.deposit)} pagada</label>
        )}
        <label>Notas del turno<textarea value={notas} onChange={(e) => setNotas(e.target.value)} /></label>
        <div className="acciones">
          <button className="boton" onClick={() => guardar({ notes: notas })}>Guardar notas</button>
          {tel && <a className="boton wa" target="_blank" href={`https://wa.me/${wa}?text=${msj}`}>Recordatorio por WhatsApp</a>}
          <button className="boton secundario" onClick={cerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function NuevoTurno({ ctx, fecha, cerrar }: { ctx: Pick<Ctx, "centro" | "servicios" | "profesionales">; fecha: string; cerrar: () => void }) {
  const { centro, servicios, profesionales } = ctx;
  const [f, setF] = useState({ nombre: "", telefono: "", servicio: servicios[0]?.id ?? "", prof: profesionales[0]?.id ?? "", fecha, hora: "10:00" });
  const [error, setError] = useState("");
  async function guardar(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const s = servicios.find((x) => x.id === f.servicio);
    const tel = soloNumeros(f.telefono);
    if (!s || tel.length < 8) return setError("Completá servicio y un teléfono válido.");
    const { data: existe } = await sb().from("clients").select("id").eq("center_id", centro.id).eq("phone", tel).maybeSingle();
    let clientId = existe?.id;
    if (!clientId) {
      const r = await sb().from("clients").insert({ center_id: centro.id, name: f.nombre || "Sin nombre", phone: tel }).select("id").single();
      clientId = r.data?.id;
    }
    const inicio = aFecha(f.fecha, f.hora);
    const { error } = await sb().from("appointments").insert({
      center_id: centro.id, professional_id: f.prof, service_id: s.id, client_id: clientId, service_name: s.name,
      starts_at: inicio.toISOString(), ends_at: new Date(inicio.getTime() + s.duration_min * 60e3).toISOString(),
      price: s.price, deposit: s.deposit, status: "confirmado", source: "panel",
    });
    if (error) return setError(error.message.includes("sin_superponer") ? "Esa profesional ya tiene un turno en ese horario." : "No se pudo guardar.");
    cerrar();
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="modal" onClick={cerrar}>
      <form className="caja form" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
        <h2>Nuevo turno</h2>
        <label>Clienta<input required value={f.nombre} onChange={set("nombre")} /></label>
        <label>Teléfono<input required inputMode="tel" value={f.telefono} onChange={set("telefono")} /></label>
        <label>Servicio<select value={f.servicio} onChange={set("servicio")}>{servicios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label>Profesional<select value={f.prof} onChange={set("prof")}>{profesionales.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <div className="fila"><label>Día<input type="date" required value={f.fecha} onChange={set("fecha")} /></label>
          <label>Hora<input type="time" required step={300} value={f.hora} onChange={set("hora")} /></label></div>
        {error && <p className="error">{error}</p>}
        <div className="acciones"><button className="boton">Guardar</button><button type="button" className="boton secundario" onClick={cerrar}>Cancelar</button></div>
      </form>
    </div>
  );
}
