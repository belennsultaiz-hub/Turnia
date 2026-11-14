import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turnia · Turnos online para centros de estética",
  description: "Tus clientas reservan solas, 24 h, desde el celular. Agenda, recordatorios y ficha de cada clienta.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#b5838d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
