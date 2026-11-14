"use client";
import { useRef, useState } from "react";
import { subirFoto } from "@/lib/fotos";

// Botón para elegir/cambiar/quitar una foto
export default function CampoFoto({ centroId, valor, cambiar, texto = "Foto", redonda = false }: {
  centroId: string; valor: string | null; cambiar: (url: string | null) => void; texto?: string; redonda?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  async function elegir(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setSubiendo(true);
    try { cambiar(await subirFoto(centroId, f)); } catch { alert("No se pudo subir la foto. Probá con otra."); }
    setSubiendo(false); e.target.value = "";
  }
  return (
    <div className="campo-foto">
      <button type="button" className={`foto-prev ${redonda ? "redonda" : ""}`} onClick={() => input.current?.click()}
        style={valor ? { backgroundImage: `url(${valor})` } : undefined}>
        {!valor && <span>{subiendo ? "Subiendo…" : `📷 ${texto}`}</span>}
        {valor && subiendo && <span>Subiendo…</span>}
      </button>
      <div className="foto-acc">
        <button type="button" className="boton chico suave" onClick={() => input.current?.click()}>{valor ? "Cambiar" : "Subir foto"}</button>
        {valor && <button type="button" className="boton chico secundario" onClick={() => cambiar(null)}>Quitar</button>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={elegir} />
    </div>
  );
}
