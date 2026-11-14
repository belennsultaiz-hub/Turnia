"use client";
import { sb } from "./supabaseNavegador";

// Achica la foto en el celu (máx. 1400 px) y la sube a la carpeta del centro.
export async function subirFoto(centroId: string, archivo: File, max = 1400): Promise<string> {
  const img = await createImageBitmap(archivo);
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  const blob: Blob = await new Promise((ok) => c.toBlob((b) => ok(b!), "image/jpeg", 0.85));
  const ruta = `${centroId}/${crypto.randomUUID()}.jpg`;
  const { error } = await sb().storage.from("fotos").upload(ruta, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return sb().storage.from("fotos").getPublicUrl(ruta).data.publicUrl;
}
