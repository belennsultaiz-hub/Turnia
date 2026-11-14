"use client";
import { useState } from "react";

export default function Acciones({ token, estado, futuro }: { token: string; estado: string; futuro: boolean }) {
  const [e, setE] = useState(estado);
  const [cargando, setCargando] = useState(false);
  if (!futuro || e === "cancelado") return null;
  async function hacer(accion: "confirmar" | "cancelar") {
    if (accion === "cancelar" && !confirm("¿Seguro que querés cancelar el turno?")) return;
    setCargando(true);
    const r = await fetch("/api/turno", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, accion }) });
    const j = await r.json();
    if (j.status) location.reload(); else { alert(j.error); setCargando(false); }
    setE(j.status ?? e);
  }
  return (
    <div className="acciones">
      {e !== "confirmado" && <button className="boton" disabled={cargando} onClick={() => hacer("confirmar")}>Confirmar asistencia</button>}
      <button className="boton secundario" disabled={cargando} onClick={() => hacer("cancelar")}>Cancelar turno</button>
    </div>
  );
}
