"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Centro, Profesional, Resena, Servicio } from "@/lib/tipos";
import { estiloCategoria, haceServicio } from "@/lib/tipos";
import { diaSemana, duracion, hoyAR, lindaFecha, pesos, sumarDias } from "@/lib/tiempo";

type Props = { centro: Centro; servicios: Servicio[]; profesionales: Profesional[]; dias: Record<string, number[]>; resenas: Resena[] };

const Estrellas = ({ n }: { n: number }) => <span className="estrellas" aria-label={`${n} de 5`}>{"★★★★★".slice(0, n)}<span>{"★★★★★".slice(n)}</span></span>;

export default function Reserva({ centro, servicios, profesionales, dias, resenas }: Props) {
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [prof, setProf] = useState<string | null>(null); // "" = cualquiera
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState<{ hora: string; profs: string[] }[] | null>(null);
  const [hora, setHora] = useState("");
  const [datos, setDatos] = useState({ nombre: "", telefono: "", email: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("");
  const pasoProf = useRef<HTMLElement>(null);
  const pasoDia = useRef<HTMLElement>(null);
  const pasoDatos = useRef<HTMLElement>(null);
  const ir = (r: React.RefObject<HTMLElement | null>) => setTimeout(() => r.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

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
  const promedio = resenas.length ? resenas.reduce((a, r) => a + r.rating, 0) / resenas.length : 0;

  function elegirServicio(s: Servicio) {
    setServicio(s); setFecha(""); setHora("");
    const ap = profesionales.filter((p) => haceServicio(p, s.id));
    setProf(ap.length === 1 ? ap[0].id : null);
    ir(ap.length === 1 ? pasoDia : pasoProf);
  }

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
  }

  const wa = centro.whatsapp ? `https://wa.me/${centro.whatsapp}?text=${encodeURIComponent("Hola! Quería hacer una consulta.")}` : null;

  return (
    <main className="reserva" style={{ ["--c" as string]: centro.color || "#c98ba0" }}>
      <div className="portada" style={centro.cover ? { backgroundImage: `url(${centro.cover})` } : undefined}>
        {!centro.cover && <><i className="burbuja b1" /><i className="burbuja b2" /><i className="burbuja b3" /></>}
      </div>
      <header className="centro-cab">
        {centro.logo ? <img src={centro.logo} alt="" className="logo" /> : <div className="logo inicial">{centro.name[0]}</div>}
        <h1>{centro.name}</h1>
        {centro.tagline && <p className="lema">{centro.tagline}</p>}
        <div className="datos-centro">
          {resenas.length > 0 && <a href="#resenas"><Estrellas n={Math.round(promedio)} /> {promedio.toFixed(1)} · {resenas.length} reseñas</a>}
          {centro.address && <span>📍 {centro.address}</span>}
        </div>
        <div className="acciones centro">
          <button className="boton" onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}>Reservar turno</button>
          {centro.instagram && <a className="boton suave" href={`https://instagram.com/${centro.instagram.replace("@", "")}`} target="_blank">Instagram</a>}
          {wa && <a className="boton suave" href={wa} target="_blank">WhatsApp</a>}
        </div>
      </header>

      {centro.about && <p className="sobre">{centro.about}</p>}

      <section className="paso" id="servicios">
        <h2><span>1</span> Elegí tu servicio</h2>
        {categorias.length > 1 && (
          <div className="chips deslizar">
            <button className={cat === "" ? "chip sel" : "chip"} onClick={() => setCat("")}>✨ Todos</button>
            {categorias.map((c) => (
              <button key={c} className={cat === c ? "chip sel" : "chip"} onClick={() => setCat(c)}>{estiloCategoria(c).emoji} {c}</button>
            ))}
          </div>
        )}
        {categorias.filter((c) => !cat || c === cat).map((c) => {
          const est = estiloCategoria(c);
          return (
            <div key={c}>
              <h3 className="cat">{est.emoji} {c}</h3>
              <div className="grilla-serv">
                {servicios.filter((s) => (s.category || "Servicios") === c).map((s) => (
                  <button key={s.id} className={`serv ${servicio?.id === s.id ? "sel" : ""}`} onClick={() => elegirServicio(s)}>
                    <div className="serv-foto" style={{ background: s.image ? `center/cover url(${s.image})` : `linear-gradient(135deg, ${est.color}, #fff)` }}>
                      {!s.image && <span>{est.emoji}</span>}
                      {servicio?.id === s.id && <em className="tilde">✓</em>}
                    </div>
                    <div className="serv-txt">
                      <b>{s.name}</b>
                      {s.description && <small>{s.description}</small>}
                      <div className="serv-pie"><strong>{pesos(s.price)}</strong><small>⏱ {duracion(s.duration_min)}</small></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {servicio && aptas.length > 1 && (
        <section className="paso" ref={pasoProf}>
          <h2><span>2</span> ¿Con quién?</h2>
          <div className="profs">
            <button className={prof === "" ? "prof sel" : "prof"} onClick={() => { setProf(""); setFecha(""); ir(pasoDia); }}>
              <span className="avatar">✨</span><b>Me da igual</b><small>La primera libre</small>
            </button>
            {aptas.map((p) => (
              <button key={p.id} className={prof === p.id ? "prof sel" : "prof"} onClick={() => { setProf(p.id); setFecha(""); ir(pasoDia); }}>
                {p.photo ? <img className="avatar" src={p.photo} alt="" /> : <span className="avatar">{p.name[0]}</span>}
                <b>{p.name}</b>{p.role && <small>{p.role}</small>}
              </button>
            ))}
          </div>
        </section>
      )}

      {servicio && prof !== null && (
        <section className="paso" ref={pasoDia}>
          <h2><span>{aptas.length > 1 ? 3 : 2}</span> Día y horario</h2>
          <div className="dias deslizar">
            {proximos.map((d) => (
              <button key={d} className={fecha === d ? "dia sel" : "dia"} onClick={() => setFecha(d)}>
                {lindaFecha(d).split(" ").map((x, i) => <span key={i}>{x}</span>)}
              </button>
            ))}
            {!proximos.length && <p className="gris">No hay días disponibles.</p>}
          </div>
          {fecha && (horarios === null ? <p className="gris">Buscando horarios…</p> : horarios.length === 0 ? (
            <p className="gris">No quedan horarios libres ese día. Probá con otro 💗</p>
          ) : (
            <div className="horas">
              {horarios.map((h) => (
                <button key={h.hora} className={hora === h.hora ? "hora sel" : "hora"} onClick={() => { setHora(h.hora); ir(pasoDatos); }}>{h.hora}</button>
              ))}
            </div>
          ))}
        </section>
      )}

      {hora && servicio && (
        <section className="paso" ref={pasoDatos}>
          <h2><span>{aptas.length > 1 ? 4 : 3}</span> Tus datos</h2>
          <div className="resumen">
            <b>{servicio.name}</b>
            <span>📅 {lindaFecha(fecha)} a las {hora} h{prof ? ` con ${nombreProf(prof)}` : ""}</span>
            <span>💗 Total {pesos(servicio.price)}{servicio.deposit > 0 ? ` · Seña ${pesos(servicio.deposit)}` : ""}</span>
          </div>
          <form onSubmit={reservar} className="form">
            <label>Nombre y apellido<input required value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} /></label>
            <label>WhatsApp<input required inputMode="tel" placeholder="11 1234-5678" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} /></label>
            <label>Mail (para el recordatorio)<input type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} /></label>
            {servicio.deposit > 0 && centro.deposit_note && <p className="nota">💳 {centro.deposit_note}</p>}
            {error && <p className="error">{error}</p>}
            <button className="boton grande" disabled={enviando}>{enviando ? "Reservando…" : "Reservar mi turno ✨"}</button>
          </form>
        </section>
      )}

      <Resenas centro={centro} resenas={resenas} promedio={promedio} servicios={servicios} />

      <footer className="pie">Reservas con <a href="/">Turnia</a></footer>
    </main>
  );
}

function Resenas({ centro, resenas, promedio, servicios }: { centro: Centro; resenas: Resena[]; promedio: number; servicios: Servicio[] }) {
  const [abierto, setAbierto] = useState(false);
  const [f, setF] = useState({ nombre: "", estrellas: 5, texto: "", servicio: "" });
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | string>("");
  async function enviar(e: React.FormEvent) {
    e.preventDefault(); setEstado("enviando");
    const r = await fetch("/api/resena", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: centro.slug, ...f }) });
    const j = await r.json();
    setEstado(j.ok ? "ok" : j.error || "No se pudo enviar.");
  }
  return (
    <section className="resenas" id="resenas">
      <h2>Lo que dicen nuestras clientas</h2>
      {resenas.length > 0 && <p className="promedio"><Estrellas n={Math.round(promedio)} /> <b>{promedio.toFixed(1)}</b> de 5 · {resenas.length} reseñas</p>}
      <div className="carrusel deslizar">
        {resenas.map((r) => (
          <div key={r.id} className="resena">
            <Estrellas n={r.rating} />
            {r.body && <p>“{r.body}”</p>}
            <small><b>{r.name}</b>{r.service ? ` · ${r.service}` : ""}</small>
          </div>
        ))}
      </div>
      {estado === "ok" ? <p className="ok">¡Gracias por tu reseña! 💗 La vamos a publicar en breve.</p> : !abierto ? (
        <button className="boton suave" onClick={() => setAbierto(true)}>Dejá tu reseña</button>
      ) : (
        <form className="form tarjeta" onSubmit={enviar}>
          <div className="elegir-estrellas">
            {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} className={n <= f.estrellas ? "on" : ""} onClick={() => setF({ ...f, estrellas: n })}>★</button>)}
          </div>
          <label>Tu nombre<input required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></label>
          <label>¿Qué te hiciste?<select value={f.servicio} onChange={(e) => setF({ ...f, servicio: e.target.value })}>
            <option value="">Elegí (opcional)</option>{servicios.map((s) => <option key={s.id}>{s.name}</option>)}</select></label>
          <label>Contanos tu experiencia<textarea value={f.texto} onChange={(e) => setF({ ...f, texto: e.target.value })} /></label>
          {estado && estado !== "enviando" && <p className="error">{estado}</p>}
          <button className="boton" disabled={estado === "enviando"}>Enviar reseña</button>
        </form>
      )}
    </section>
  );
}
