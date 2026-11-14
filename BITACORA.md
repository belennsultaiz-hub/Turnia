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


## 14/11/2026 – Página del centro más linda
- Diseño en tonos pastel (Playfair Display + DM Sans): portada con foto, logo redondo, estrellas, botones a Instagram y WhatsApp, "Sobre nosotras".
- Servicios en tarjetas con foto grande (o emoji con color pastel si no hay foto), filtro por categoría y textos con más onda.
- Reseñas: carrusel en la página + formulario "Dejá tu reseña". Quedan pendientes hasta que el centro las publica (pestaña Reseñas del panel). Tabla `reviews`.
- Panel: subir foto de cada servicio, portada y logo desde el celu (bucket `fotos` de Supabase, cada centro en su carpeta).
- Centro de ejemplo con 18 fotos gratis de Pexels (licencia libre) guardadas en `public/demo/`, 5 reseñas de ejemplo.
  Unsplash no sirve desde acá (bloquea descargas automáticas); Pexels sí (`images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg`).


## 14/11/2026 – Chat estilo WhatsApp y dirección sin DecoBazar
- Botón verde de WhatsApp abajo a la derecha en la página del centro. Abre un chat (con la estética de WhatsApp) donde una asistente
  ayuda a reservar: servicio → profesional → día → horario → nombre y WhatsApp → confirma y reserva. También muestra precios,
  dirección y pasa con una persona por WhatsApp real. La seña todavía no se cobra (falta Mercado Pago).
- Nueva dirección: https://turnia-turnos.pages.dev (la vieja con "decobazar" quedó apagada). `turnia.pages.dev` ya estaba tomado.


## 14/11/2026 – Lista de estéticas y mensajes de venta
- `marketing/contactos.html`: 14 centros de CABA y Zona Norte con WhatsApp público (sacado de su web o Instagram, con link a la fuente),
  botón que abre WhatsApp con el mensaje ya escrito y personalizado, y casilla "Ya le escribí".
- Mensajes: A (centro sin turnos online), B (ya usa turnos online), C (insistir a los 3 días), D (si dicen que sí: qué datos pedirles).
- Consejos: 10-15 por día, desde WhatsApp Business, 10-12 h o 15-18 h.


## 14/11/2026 – Página de prueba para Glow Alisados (Banfield)
- https://turnia-turnos.pages.dev/c/glow (el ejemplo /c/demo sigue igual). Armada con la info pública de su Instagram (@glowcentrodebelleza.ok):
  12 servicios con sus precios 2026, seña $10.000, dirección, 7 reseñas de Google (nombre + inicial), logo, portada del local y fotos de sus trabajos (`public/glow/`).
- Inventado (confirmar con ellas): duración de cada servicio, horario lun-sáb 9 a 19, una sola agenda "Equipo Glow". Kids sin foto (no usamos fotos de nenas).
- Arriba dice "Vista previa armada por Turnia para Glow · todavía no es su página oficial" (`centers.preview`), para que ninguna clienta real reserve creyendo que es oficial.
- El WhatsApp del centro puede ser número o link `wa.me/message/...` (`waUrl()` en tipos.ts).


## 14/11/2026 – Más contactos (Capital, Lomas de Zamora, Lanús) con el mensaje de Belén
- `marketing/contactos.html` ahora tiene 30 centros (16 nuevos): Capital "los más fuertes" (cadenas y centros con notas en revistas),
  Lomas de Zamora (5) y Lanús (4), además de los 14 de antes. Todos los botones usan el mensaje que escribió Belén.
- Belén quiere mandar desde WhatsApp común (no Business): el botón usa `whatsapp://send?phone=...&text=...` y abajo hay un link de respaldo `wa.me`.
- La lista y el mensaje se editan en `marketing/contactos.py` (correr `python3 contactos.py` para regenerar el HTML).
- No pude confirmar puntajes ni seguidores de la mayoría: "fuertes" = cadenas con varias sedes o con notas/reseñas publicadas.

- Tanda 3: +12 contactos (Villa Devoto, Recoleta, Banfield, Wilde, Quilmes, Monte Grande). Total 42. Los de la última tanda llevan etiqueta "nuevo" y además salen solos en `marketing/contactos_nuevos.html` (Belén pidió recibir solo los nuevos, sin repetir).


## 14/11/2026 – Mails de las estéticas
- `marketing/mails.html`: 13 de los 42 centros tienen mail publicado (los demás solo WhatsApp). Botón "Escribir mail" abre el correo
  con asunto "Turnos online para su centro 💗" y el mismo mensaje de Belén + firma. Lista de mails juntos para copiar. Se genera con `contactos.py` (lista `MAILS`).

## Pendiente
- Cobro de seña con Mercado Pago (cada centro conecta su cuenta).
- Recordatorios automáticos por mail (y más adelante WhatsApp automático).
- Glow: si les gusta, crear su usuaria del panel, sacar `preview` y confirmar duraciones/horarios.
- Ampliar la lista de estéticas si Belén pide más zonas (ya hay CABA, Zona Norte, Lomas, Lanús).
- Definir nombre y precios finales. Con el nombre final, comprar dominio propio (ej. .com.ar) y conectarlo.
- WhatsApp real automático (API oficial de Meta) para el bot y los recordatorios.
