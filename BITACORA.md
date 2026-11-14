# Bitácora de Turnia

## 14/11/2026 – Primera versión (formato para mostrar)
- Nombre provisorio: **Turnia**. Rubro inicial: estética.
- Precios estimativos según el mercado (nov/2026: AgendaPro desde $13.900, Turnito $12.000 a $42.000, Gendu $14.400):
  Profesional $12.900 · Centro (hasta 5) $24.900 · Centro Plus (hasta 15) $39.900. 14 días gratis.
- Proyecto de Supabase nuevo `turnia` con tablas, seguridad por centro y un centro de ejemplo (Estética Aurora, slug `demo`).
- App: landing, página pública de reservas, página del turno (confirmar/cancelar) y panel completo.
- La seña es editable por servicio desde el panel; por ahora se marca a mano como pagada.

- Centro de ejemplo más completo: 18 servicios ficticios en Uñas, Depilación definitiva, Faciales, Cejas y pestañas y Corporales (`seed_demo_v2.sql`). Portada de color y filtro por categoría en la página del centro.

- Belén creó el repo `Turnia` en GitHub; subimos el código y lo conectamos a Cloudflare (worker `turnia`, se publica solo con cada push a `main`).

- Publicado en https://turnia.decobazar.workers.dev (probado de punta a punta: reserva, página del turno y panel).
- Turnos y clientas ficticios en el centro de ejemplo para que el panel tenga movimiento (`seed_demo_turnos.sql`; fechas relativas a hoy, volver a correrlo para "refrescarlos").

## Pendiente
- Cobro de seña con Mercado Pago (cada centro conecta su cuenta).
- Recordatorios automáticos por mail (y más adelante WhatsApp automático).
- Lista de centros de estética para contactar + mensaje de venta.
- Definir nombre y precios finales.
