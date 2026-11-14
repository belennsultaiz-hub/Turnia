"use client";
import { useCallback, useEffect, useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Centro, Profesional, Servicio } from "@/lib/tipos";
import Agenda from "./Agenda";
import Clientas from "./Clientas";
import Servicios from "./Servicios";
import Equipo from "./Equipo";
import Bloqueos from "./Bloqueos";
import MiCentro from "./MiCentro";
import Resenas from "./Resenas";

const PESTANAS = ["Agenda", "Clientas", "Servicios", "Equipo", "Bloqueos", "Reseñas", "Mi centro"] as const;
type Pestana = (typeof PESTANAS)[number];
export type Ctx = { centro: Centro; servicios: Servicio[]; profesionales: Profesional[]; recargar: () => Promise<void> };

export default function Panel() {
  const [sesion, setSesion] = useState<"cargando" | "no" | "si">("cargando");
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [pestana, setPestana] = useState<Pestana>("Agenda");
  const [sinCentro, setSinCentro] = useState(false);

  const cargar = useCallback(async () => {
    const { data: m } = await sb().from("center_users").select("center_id").limit(1).maybeSingle();
    if (!m) { setSinCentro(true); return; }
    const [c, s, p] = await Promise.all([
      sb().from("centers").select("*").eq("id", m.center_id).single(),
      sb().from("services").select("*").eq("center_id", m.center_id).order("sort").order("name"),
      sb().from("professionals").select("*").eq("center_id", m.center_id).order("sort").order("name"),
    ]);
    setCtx({ centro: c.data, servicios: s.data ?? [], profesionales: p.data ?? [], recargar: cargar });
  }, []);

  useEffect(() => {
    sb().auth.getSession().then(({ data }) => setSesion(data.session ? "si" : "no"));
    const { data } = sb().auth.onAuthStateChange((_e, s) => setSesion(s ? "si" : "no"));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (sesion === "si") cargar(); }, [sesion, cargar]);

  if (sesion === "cargando") return <main className="centrado gris">Cargando…</main>;
  if (sesion === "no") return <Login />;
  if (sinCentro) return <main className="centrado"><p>Tu usuario todavía no tiene un centro asignado. Escribinos y lo activamos.</p><button className="boton secundario" onClick={() => sb().auth.signOut()}>Salir</button></main>;
  if (!ctx) return <main className="centrado gris">Cargando tu centro…</main>;

  return (
    <div className="panel" style={{ ["--c" as string]: ctx.centro.color || "#b5838d" }}>
      <header className="panel-cab">
        <b>{ctx.centro.name}</b>
        <a href={`/c/${ctx.centro.slug}`} target="_blank">Ver mi página ↗</a>
        <button onClick={() => sb().auth.signOut()}>Salir</button>
      </header>
      <nav className="pestanas">
        {PESTANAS.map((p) => <button key={p} className={p === pestana ? "sel" : ""} onClick={() => setPestana(p)}>{p}</button>)}
      </nav>
      <main className="panel-cuerpo">
        {pestana === "Agenda" && <Agenda {...ctx} />}
        {pestana === "Clientas" && <Clientas {...ctx} />}
        {pestana === "Servicios" && <Servicios {...ctx} />}
        {pestana === "Equipo" && <Equipo {...ctx} />}
        {pestana === "Bloqueos" && <Bloqueos {...ctx} />}
        {pestana === "Reseñas" && <Resenas {...ctx} />}
        {pestana === "Mi centro" && <MiCentro {...ctx} />}
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  async function entrar(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const { error } = await sb().auth.signInWithPassword({ email, password: clave });
    if (error) setError("Mail o contraseña incorrectos.");
  }
  return (
    <main className="centrado">
      <form className="form login" onSubmit={entrar}>
        <h1>Panel de tu centro</h1>
        <label>Mail<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Contraseña<input type="password" required value={clave} onChange={(e) => setClave(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button className="boton">Entrar</button>
      </form>
    </main>
  );
}
