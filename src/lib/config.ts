// Datos del producto (editar acá)
export const PRODUCTO = {
  nombre: "Turnia",
  lema: "Turnos online para centros de estética",
  whatsapp: "5491154229687",
  whatsappLindo: "11 5422-9687",
  email: "belennsultaiz@gmail.com",
};

// Precios ESTIMATIVOS (a confirmar). Referencia de mercado nov/2026:
// AgendaPro desde $13.900, Turnito $12.000 a $42.000, Gendu $14.400.
export const PLANES = [
  { nombre: "Profesional", precio: 12900, detalle: "1 profesional", items: ["Página de reservas propia", "Agenda online", "Ficha de clientas", "Recordatorios por mail"] },
  { nombre: "Centro", precio: 24900, detalle: "Hasta 5 profesionales", destacado: true, items: ["Todo lo del plan Profesional", "Agenda por profesional", "Bloqueo de horarios", "Seña con Mercado Pago"] },
  { nombre: "Centro Plus", precio: 39900, detalle: "Hasta 15 profesionales", items: ["Todo lo del plan Centro", "Varias usuarias en el panel", "Ayuda para cargar todo", "Atención prioritaria"] },
];
