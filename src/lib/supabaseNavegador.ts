"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;
// Para el panel: usa la clave pública; la base solo deja ver los datos del propio centro.
export function sb() {
  if (!cliente) cliente = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return cliente;
}
