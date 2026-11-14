"use client";
import { useState } from "react";
import { sb } from "@/lib/supabaseNavegador";
import type { Centro } from "@/lib/tipos";
import type { Ctx } from "./Panel";
import CampoFoto from "./CampoFoto";

export default function MiCentro({ centro, recargar }: Ctx) {
  const [f, setF] = useState<Centro>(centro);
  const [estado, setEstado] = useState("");
  const link = typeof window !== "undefined" ? `${location.origin}/c/${centro.slug}` : "";
  const set = (k: keyof Centro, num = false) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value });
  async function guardar() {
    const { error } = await sb().from("centers").update({
      name: f.name, tagline: f.tagline, address: f.address, whatsapp: f.whatsapp, instagram: f.instagram, color: f.color,
      cover: f.cover, logo: f.logo, about: f.about, slot_min: f.slot_min, min_notice_h: f.min_notice_h, max_days: f.max_days, deposit_note: f.deposit_note,
    }).eq("id", centro.id);
    setEstado(error ? "Error al guardar" : "¡Guardado!"); setTimeout(() => setEstado(""), 2000); recargar();
  }
  return (
    <div className="form">
      <div className="tarjeta">
        <b>Tu link de reservas</b>
        <p><a href={link} target="_blank">{link}</a></p>
        <button className="boton chico" onClick={() => navigator.clipboard.writeText(link)}>Copiar link</button>
        <p className="gris">Ponelo en la bio de Instagram y en el mensaje automático de WhatsApp.</p>
      </div>
      <div className="fila fotos-centro">
        <div><b>Portada</b><CampoFoto centroId={centro.id} valor={f.cover} cambiar={(cover) => setF({ ...f, cover })} texto="Portada" /></div>
        <div><b>Logo</b><CampoFoto centroId={centro.id} valor={f.logo} cambiar={(logo) => setF({ ...f, logo })} texto="Logo" redonda /></div>
      </div>
      <label>Nombre del centro<input value={f.name} onChange={set("name")} /></label>
      <label>Frase corta<input value={f.tagline ?? ""} onChange={set("tagline")} /></label>
      <label>Sobre nosotras (aparece en tu página)<textarea value={f.about ?? ""} onChange={set("about")} /></label>
      <label>Dirección<input value={f.address ?? ""} onChange={set("address")} /></label>
      <div className="fila">
        <label>WhatsApp (con 549)<input value={f.whatsapp ?? ""} onChange={set("whatsapp")} /></label>
        <label>Instagram<input value={f.instagram ?? ""} onChange={set("instagram")} /></label>
        <label>Color<input type="color" value={f.color ?? "#b5838d"} onChange={set("color")} /></label>
      </div>
      <div className="fila">
        <label>Horarios cada (min)<input type="number" min={5} step={5} value={f.slot_min} onChange={set("slot_min", true)} /></label>
        <label>Anticipación mínima (h)<input type="number" min={0} value={f.min_notice_h} onChange={set("min_notice_h", true)} /></label>
        <label>Reservas hasta (días)<input type="number" min={1} max={180} value={f.max_days} onChange={set("max_days", true)} /></label>
      </div>
      <label>Texto sobre la seña<textarea value={f.deposit_note ?? ""} onChange={set("deposit_note")} /></label>
      <button className="boton" onClick={guardar}>{estado || "Guardar cambios"}</button>
    </div>
  );
}
