"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Centro, Profesional, Servicio } from "@/lib/tipos";
import { estiloCategoria, haceServicio } from "@/lib/tipos";
import { diaSemana, duracion, hoyAR, lindaFecha, pesos, sumarDias } from "@/lib/tiempo";

// Asistente de reservas con estilo WhatsApp, dentro de la página del centro.
type Opcion = { texto: string; accion: () => void };
type Msj = { de: "bot" | "yo"; texto: string; link?: { texto: string; href: string } };
type Espera = null | "nombre" | "telefono";

const hora = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

export default function Chat({ centro, servicios, profesionales, dias }: {
  centro: Centro; servicios: Servicio[]; profesionales: Profesional[]; dias: Record<string, number[]>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [msjs, setMsjs] = useState<(Msj & { h: string })[]>([]);
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [espera, setEspera] = useState<Espera>(null);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState(false);
  const fin = useRef<HTMLDivElement>(null);
  const r = useRef({ servicio: null as Servicio | null, prof: "", fecha: "", hora: "", nombre: "" });
  const categorias = useMemo(() => [...new Set(servicios.map((s) => s.category || "Servicios"))], [servicios]);

  useEffect(() => { const t = setTimeout(() => setAviso(true), 4000); return () => clearTimeout(t); }, []);
  useEffect(() => { fin.current?.scrollIntoView({ behavior: "smooth" }); }, [msjs, escribiendo, opciones]);
  useEffect(() => { if (abierto && !msjs.length) inicio(); }, [abierto]); // eslint-disable-line

  const yo = (t: string) => setMsjs((m) => [...m, { de: "yo", texto: t, h: hora() }]);
  function bot(lineas: (string | Msj)[], ops: Opcion[] = [], esp: Espera = null) {
    setOpciones([]); setEspera(null); setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMsjs((m) => [...m, ...lineas.map((l) => ({ ...(typeof l === "string" ? { de: "bot" as const, texto: l } : l), h: hora() }))]);
      setOpciones(ops); setEspera(esp);
    }, 650);
  }
  const op = (t: string, f: () => void): Opcion => ({ texto: t, accion: () => { yo(t); f(); } });
  const volver = op("↩️ Volver al inicio", () => menu());

  function inicio() {
    bot([`¡Hola! 👋 Soy la asistente virtual de ${centro.name}.`, "Te ayudo a reservar tu turno en un minuto. ¿Qué querés hacer?"], opsMenu());
  }
  function opsMenu() {
    return [
      op("📅 Reservar un turno", () => elegirCategoria()),
      op("💲 Ver precios", () => precios()),
      ...(centro.address ? [op("📍 ¿Dónde están?", () => donde())] : []),
      ...(centro.whatsapp ? [op("💬 Hablar con una persona", () => persona())] : []),
    ];
  }
  const menu = () => bot(["¿En qué más te puedo ayudar? 💗"], opsMenu());

  function precios() {
    const lineas = categorias.map((c) => `${estiloCategoria(c).emoji} *${c}*\n` + servicios.filter((s) => (s.category || "Servicios") === c).map((s) => `• ${s.name}: ${pesos(s.price)}`).join("\n"));
    bot([...lineas, "¿Querés reservar alguno?"], [op("📅 Sí, reservar", () => elegirCategoria()), volver]);
  }
  function donde() {
    bot([{ de: "bot", texto: `Estamos en ${centro.address} 📍`, link: { texto: "Ver en el mapa", href: `https://maps.google.com/?q=${encodeURIComponent(centro.address ?? "")}` } }], [op("📅 Reservar un turno", () => elegirCategoria()), volver]);
  }
  function persona() {
    bot([{ de: "bot", texto: "¡Dale! Te paso con alguien del equipo por WhatsApp 😊", link: { texto: "Abrir WhatsApp", href: `https://wa.me/${centro.whatsapp}?text=${encodeURIComponent("Hola! Tengo una consulta.")}` } }], [volver]);
  }

  function elegirCategoria() {
    if (categorias.length === 1) return elegirServicio(categorias[0]);
    bot(["¡Genial! ✨ ¿Qué te querés hacer?"], [...categorias.map((c) => op(`${estiloCategoria(c).emoji} ${c}`, () => elegirServicio(c))), volver]);
  }
  function elegirServicio(cat: string) {
    const lista = servicios.filter((s) => (s.category || "Servicios") === cat);
    bot(["Elegí el servicio 👇"], [...lista.map((s) => op(`${s.name} · ${pesos(s.price)}`, () => servicioElegido(s))), op("↩️ Otra categoría", () => elegirCategoria())]);
  }
  function servicioElegido(s: Servicio) {
    r.current.servicio = s;
    const aptas = profesionales.filter((p) => haceServicio(p, s.id));
    const info = `${s.name}: ${duracion(s.duration_min)}, ${pesos(s.price)}${s.deposit > 0 ? ` (seña ${pesos(s.deposit)})` : ""}.`;
    if (aptas.length <= 1) { r.current.prof = aptas[0]?.id ?? ""; return elegirDia([info]); }
    bot([info, "¿Con quién te querés atender?"], [op("✨ Me da igual", () => { r.current.prof = ""; elegirDia(); }), ...aptas.map((p) => op(`${p.name}${p.role ? ` · ${p.role}` : ""}`, () => { r.current.prof = p.id; elegirDia(); }))]);
  }
  function elegirDia(antes: string[] = [], desde = 0) {
    const s = r.current.servicio!;
    const aptas = profesionales.filter((p) => haceServicio(p, s.id) && (!r.current.prof || p.id === r.current.prof));
    const trabajan = new Set(aptas.flatMap((p) => dias[p.id] ?? []));
    const hoy = hoyAR();
    const todos = Array.from({ length: centro.max_days }, (_, i) => sumarDias(hoy, i)).filter((d) => trabajan.has(diaSemana(d)));
    const tanda = todos.slice(desde, desde + 6);
    if (!tanda.length) return bot(["Uy, no encontré días disponibles 😕"], [volver]);
    bot([...antes, "¿Qué día te queda bien? 📅"], [
      ...tanda.map((d) => op(d === hoy ? `Hoy (${lindaFecha(d)})` : lindaFecha(d), () => elegirHora(d))),
      ...(todos.length > desde + 6 ? [op("Más días ➡️", () => elegirDia([], desde + 6))] : []),
    ]);
  }
  async function elegirHora(fecha: string) {
    r.current.fecha = fecha;
    setOpciones([]); setEscribiendo(true);
    const q = new URLSearchParams({ slug: centro.slug, servicio: r.current.servicio!.id, fecha, ...(r.current.prof ? { prof: r.current.prof } : {}) });
    const j = await fetch(`/api/horarios?${q}`).then((x) => x.json()).catch(() => ({ horarios: [] }));
    const hs: { hora: string }[] = j.horarios ?? [];
    if (!hs.length) return bot(["Ese día ya está completo 😕 Probá con otro."], [op("📅 Elegir otro día", () => elegirDia())]);
    bot([`Estos son los horarios libres del ${lindaFecha(fecha)} ⏰`], [...hs.slice(0, 18).map((h) => op(h.hora, () => { r.current.hora = h.hora; pedirNombre(); })), op("📅 Otro día", () => elegirDia())]);
  }
  const pedirNombre = () => bot(["¡Perfecto! ¿Me decís tu nombre y apellido? ✍️"], [], "nombre");
  const pedirTel = () => bot([`Gracias, ${r.current.nombre.split(" ")[0]} 😊 ¿Y tu número de WhatsApp?`], [], "telefono");

  function confirmar(tel: string) {
    const { servicio: s, fecha, hora: h, prof } = r.current;
    const nombreProf = profesionales.find((p) => p.id === prof)?.name;
    bot([`Te confirmo los datos:\n💆‍♀️ ${s!.name}\n📅 ${lindaFecha(fecha)} a las ${h} h${nombreProf ? `\n👩 Con ${nombreProf}` : ""}\n💲 Total ${pesos(s!.price)}${s!.deposit > 0 ? `\n💳 Seña ${pesos(s!.deposit)}` : ""}`, "¿Lo reservo?"],
      [op("✅ Sí, reservar", () => reservar(tel)), op("✏️ Cambiar algo", () => elegirCategoria())]);
  }
  async function reservar(tel: string) {
    const { servicio: s, fecha, hora: h, prof, nombre } = r.current;
    setOpciones([]); setEscribiendo(true);
    const res = await fetch("/api/reservar", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: centro.slug, servicio: s!.id, prof, fecha, hora: h, nombre, telefono: tel }) });
    const j = await res.json().catch(() => ({}));
    if (!j.token) return bot([j.error || "No pude reservar 😕 Probá de nuevo."], [op("📅 Elegir otro horario", () => elegirHora(fecha)), volver]);
    const link = { texto: "Ver mi turno", href: `/t/${j.token}` };
    bot([
      { de: "bot", texto: `¡Listo, ${nombre.split(" ")[0]}! 🎉 Tu turno quedó reservado.`, link },
      ...(s!.deposit > 0 ? [centro.deposit_note ? `💳 Seña de ${pesos(s!.deposit)}. ${centro.deposit_note}` : `💳 Para asegurar tu lugar te pedimos una seña de ${pesos(s!.deposit)}.`] : []),
      "Te vamos a mandar un recordatorio antes del turno. ¡Te esperamos! 💗",
    ], [op("📅 Reservar otro turno", () => elegirCategoria()), volver]);
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const t = texto.trim(); if (!t) return;
    setTexto(""); yo(t);
    if (espera === "nombre") {
      if (t.length < 2) return bot(["¿Me lo repetís? 🙏"], [], "nombre");
      r.current.nombre = t; return pedirTel();
    }
    if (espera === "telefono") {
      if (t.replace(/\D/g, "").length < 8) return bot(["Ese número no parece válido. Escribilo con característica, ej: 11 1234-5678 📱"], [], "telefono");
      return confirmar(t);
    }
    bot(["Para ayudarte más rápido, elegí una opción 👇"], opsMenu());
  }

  return (
    <>
      {!abierto && (
        <div className="chat-flotante">
          {aviso && <button className="chat-globo" onClick={() => setAbierto(true)}>¡Hola! 👋 ¿Reservamos tu turno?</button>}
          <button className="chat-boton" onClick={() => setAbierto(true)} aria-label="Abrir chat de consultas">
            <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff"><path d="M16 3C8.8 3 3 8.6 3 15.6c0 2.5.7 4.8 2 6.8L3.6 28.5l6.3-1.6c1.9 1 4 1.5 6.1 1.5 7.2 0 13-5.6 13-12.6S23.2 3 16 3zm0 23c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a10.3 10.3 0 0 1-1.7-5.7C5.6 10 10.3 5.4 16 5.4S26.4 10 26.4 15.6 21.7 26 16 26zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.5 8.5 0 0 1-4.2-3.7c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" /></svg>
          </button>
        </div>
      )}
      {abierto && (
        <div className="chat">
          <header className="chat-cab">
            <button onClick={() => setAbierto(false)} aria-label="Cerrar">←</button>
            {centro.logo ? <img src={centro.logo} alt="" /> : <span className="chat-av">{centro.name[0]}</span>}
            <div><b>{centro.name}</b><small>{escribiendo ? "escribiendo…" : "en línea"}</small></div>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar" className="chat-x">✕</button>
          </header>
          <div className="chat-cuerpo">
            <div className="chat-fecha">Hoy</div>
            {msjs.map((m, i) => (
              <div key={i} className={`burbuja-chat ${m.de}`}>
                <span className="txt">{m.texto.split(/(\*[^*]+\*)/).map((p, k) => p.startsWith("*") ? <b key={k}>{p.slice(1, -1)}</b> : p)}</span>
                {m.link && <a href={m.link.href} target={m.link.href.startsWith("http") ? "_blank" : undefined} className="chat-link">{m.link.texto} ›</a>}
                <small>{m.h}{m.de === "yo" && <i className="tildes">✓✓</i>}</small>
              </div>
            ))}
            {escribiendo && <div className="burbuja-chat bot puntos"><i /><i /><i /></div>}
            {opciones.length > 0 && <div className="chat-ops">{opciones.map((o, i) => <button key={i} onClick={o.accion}>{o.texto}</button>)}</div>}
            <div ref={fin} />
          </div>
          <form className="chat-pie" onSubmit={enviar}>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} inputMode={espera === "telefono" ? "tel" : "text"}
              placeholder={espera === "nombre" ? "Escribí tu nombre…" : espera === "telefono" ? "Tu WhatsApp…" : "Escribí un mensaje"} />
            <button aria-label="Enviar">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
