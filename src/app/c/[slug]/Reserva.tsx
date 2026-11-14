"use client";
import { useEffect, useMemo, useState } from "react";
import type { Centro, Profesional, Servicio } from "@/lib/tipos";
import { haceServicio } from "@/lib/tipos";
import { diaSemana, duracion, hoyAR, lindaFecha, pesos, sumarDias } from "@/lib/tiempo";

type Props = { centro: Centro; servicios: Servicio[]; profesionales: Profesional[]; dias: Record<string, number[]> };

export default function Reserva({ centro, servicios, profesionales, dias }: Props) {
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [prof, setProf] = useState<string | null>(null); // "" = cualquiera
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState<{ hora: string; profs: string[] }[] | null>(null);
  const [hora, setHora] = useState("");
  const [datos, setDatos] = useState({ nombre: "", telefono: "", email: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("");

  const aptas = useMemo(() => (servicio ? profesionales.filter((p) => haceServicio(p, servicio.id)) : []), [servicio, profesionales]);
  const elegidas = prof ? aptas.filter((p) => p.id === prof) : aptas;
  const proximos = useMemo(() => {
    const trabajan = new Set(elegidas.flatMap((p) => dias[p.id] ?? []));
    const hoy = hoyAR();
    return Array.from({ length: centro.max_days }, (_, i) => sumarDias(hoy, i)).filter((d) => trabajan.has(diaSemana(d)));
  }, [elegidas, dias, centro.max_days]);

  useEffect(() => {
    if (!servicio || prof === null || !fecha) return;
    setHorarios(null); setHora("");
    const q = new URLSearchParams({ slug: centro.slug, servicio: servicio.id, fecha, ...(prof ? { prof } : {}) });
    fetch(`/api/horarios?${q}`).then((r) => r.json()).then((j) => setHorarios(j.horarios ?? []));
  }, [servicio, prof, fecha, centro.slug]);

  const categorias = [...new Set(servicios.map((s) => s.category || "Servicios"))];
  const nombreProf = (id: string) => profesionales.find((p) => p.id === id)?.name;

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!servicio) return;
    setEnviando(true); setError("");
    const r = await fetch("/api/reservar", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: centro.slug, servicio: servicio.id, prof, fecha, hora, ...datos }),
    });
    const j = await r.json();
    if (j.token) { location.href = `/t/${j.token}?nuevo=1`; return; }
    setError(j.error || "Algo salió mal. Probá de nuevo.");
    setEnviando(false);
    if (r.status === 409) setFecha((f) => f); // recarga horarios
  }

  return (
    <main className="reserva" style={{ ["--c" as string]: centro.color || "#b5838d" }}>
      <div className="portada" />
      <header className="centro-cab">
        {centro.logo ? <img src={centro.logo} alt="" className="logo" /> : <div className="logo inicial">{centro.name[0]}</div>}
        <div>
          <h1>{centro.name}</h1>
          {centro.tagline && <p>{centro.tagline}</p>}
          {centro.address && <p className="gris">📍 {centro.address}</p>}
        </div>
      </header>

      <section className="paso">
        <h2><span>1</span> Elegí el servicio</h2>
        {categorias.length > 1 && (
          <div className="chips">
            <button className={cat === "" ? "chip sel" : "chip"} onClick={() => setCat("")}>Todos</button>
            {categorias.map((c) => <button key={c} className={cat === c ? "chip sel" : "chip"} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
        {categorias.filter((c) => !cat || c === cat).map((c) => (
          <div key={c}>
            <h3 className="cat">{c}</h3>
            {servicios.filter((s) => (s.category || "Servicios") === c).map((s) => (
              <button key={s.id} className={`opcion ${servicio?.id === s.id ? "sel" : ""}`}
                onClick={() => { setServicio(s); setProf(null); setFecha(""); setHora(""); }}>
                <div>
                  <b>{s.name}</b>
                  {s.description && <small>{s.description}</small>}
                  <small className="gris">⏱ {duracion(s.duration_min)}{s.deposit > 0 ? ` · Seña ${pesos(s.deposit)}` : ""}</small>
                </div>
                <strong>{pesos(s.price)}</strong>
              </button>
            ))}
          </div>
        ))}
      </section>

      {servicio && (
        <section className="paso">
          <h2><span>2</span> ¿Con quién?</h2>
          <div className="chips">
            {aptas.length > 1 && <button className={prof === "" ? "chip sel" : "chip"} onClick={() => { setProf(""); setFecha(""); }}>Me da igual</button>}
            {aptas.map((p) => (
              <button key={p.id} className={prof === p.id ? "chip sel" : "chip"} onClick={() => { setProf(p.id); setFecha(""); }}>
                {p.name}{p.role ? <small> · {p.role}</small> : null}
              </button>
            ))}
          </div>
        </section>
      )}

      {servicio && prof !== null && (
        <section className="paso">
          <h2><span>3</span> Día y horario</h2>
          <div className="dias">
            {proximos.map((d) => (
              <button key={d} className={fecha === d ? "dia sel" : "dia"} onClick={() => setFecha(d)}>
                {lindaFecha(d).split(" ").map((x, i) => <span key={i}>{x}</span>)}
              </button>
            ))}
            {!proximos.length && <p className="gris">No hay días disponibles.</p>}
          </div>
          {fecha && (horarios === null ? <p className="gris">Buscando horarios…</p> : horarios.length === 0 ? (
            <p className="gris">No quedan horarios libres ese día. Probá con otro.</p>
          ) : (
            <div className="horas">
              {horarios.map((h) => (
                <button key={h.hora} className={hora === h.hora ? "hora sel" : "hora"} onClick={() => setHora(h.hora)}>{h.hora}</button>
              ))}
            </div>
          ))}
        </section>
      )}

      {hora && servicio && (
        <section className="paso">
          <h2><span>4</span> Tus datos</h2>
          <div className="resumen">
            <b>{servicio.name}</b>
            <span>{lindaFecha(fecha)} a las {hora} h{prof ? ` con ${nombreProf(prof)}` : ""}</span>
            <span>Total {pesos(servicio.price)}{servicio.deposit > 0 ? ` · Seña ${pesos(servicio.deposit)}` : ""}</span>
          </div>
          <form onSubmit={reservar} className="form">
            <label>Nombre y apellido<input required value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} /></label>
            <label>WhatsApp<input required inputMode="tel" placeholder="11 1234-5678" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} /></label>
            <label>Mail (para el recordatorio)<input type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} /></label>
            {servicio.deposit > 0 && centro.deposit_note && <p className="nota">💳 {centro.deposit_note}</p>}
            {error && <p className="error">{error}</p>}
            <button className="boton" disabled={enviando}>{enviando ? "Reservando…" : "Reservar turno"}</button>
          </form>
        </section>
      )}

      <footer className="pie">Reservas con <a href="/">Turnia</a></footer>
    </main>
  );
}
