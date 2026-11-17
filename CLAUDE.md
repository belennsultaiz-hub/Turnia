# Turnia: notas para Claude

Sistema de turnos online para centros de estética (se vende con abono mensual). Proyecto de Belén y su pareja.
Hablar en español rioplatense y paso a paso (Belén no programa; su pareja sí).

## Memoria (reglas fijas)
1. Al empezar: leé `BITACORA.md`.
2. Al terminar algo nuevo: entrada con fecha en `BITACORA.md`, actualizá "Pendiente", commit + push.
3. Nunca guardes tokens, claves ni contraseñas en el repo.

## Dónde está todo
- Supabase: proyecto `fduhzxhfiprpplkfjvqw` ("turnia", São Paulo), org de Belén. La URL y la clave anon (pública) están en `.env.production`.
  Desde el sandbox el host `*.supabase.co` está bloqueado: correr SQL con la Management API
  (`POST https://api.supabase.com/v1/projects/fduhzxhfiprpplkfjvqw/database/query`, `Authorization: Bearer proxy-injected`).
- Código: repo `belennsultaiz-hub/Turnia` (privado). Cada push a `main` lo publica Cloudflare Workers Builds solo (3-5 min).
- Web: **https://turnia-turnos.pages.dev** · centro de ejemplo `/c/demo` · panel `/panel`.
  Belén no quiere que aparezca "DecoBazar": la cuenta de Cloudflare tiene el subdominio `decobazar.workers.dev`, así que el worker
  tiene `workers_dev: false` y se publica a través del proyecto Pages `turnia-turnos` (carpeta `pages-proxy/`, `_worker.js` que pasa todo
  al worker `turnia` por service binding `TURNIA`). Las fotos del ejemplo usan direcciones relativas (`/demo/...`).
  Más adelante: dominio propio.
- Cloudflare: worker `turnia` (cuenta `8da1d04cd6946e24ec10eab2689e48f5`), trigger de builds (worker) `429d373d-fa28-40db-bda7-07bf14483afb`
  (para publicar a mano: `POST /accounts/<cuenta>/builds/triggers/<trigger>/builds` con `{"branch":"main"}`). Secretos: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
  Wrangler no puede subir assets desde el sandbox: publicar siempre con push.
- Contacto que aparece en la landing: WhatsApp 11 5422-9687 y el mail de Belén (`src/lib/config.ts`).

## Cómo está armado
- `/` landing de venta (planes en `src/lib/config.ts`, precios estimativos).
- `/c/[slug]` página pública de cada centro: servicio → profesional → día/horario → datos → turno.
- `/t/[token]` página del turno: confirmar / cancelar / WhatsApp al centro.
- `/panel` panel del centro (login Supabase): Agenda día/semana, Clientas (ficha + historial), Servicios (precio, duración, seña), Equipo (servicios y horarios), Bloqueos, Mi centro.
- Datos separados por centro con RLS (`center_users` + `mis_centros()`). El panel usa la clave pública; la página pública y las APIs usan service_role en el servidor.
- Horarios libres: `src/lib/disponibilidad.ts`. Hora Argentina fija UTC-3 (`src/lib/tiempo.ts`).
- La base no deja turnos superpuestos por profesional (constraint `sin_superponer`).

## Base de datos (supabase/)
`schema.sql` → `seed_demo.sql` (centro de ejemplo slug `demo`) → `02_no_superponer.sql` → `seed_demo_v2.sql` (18 servicios) → `seed_demo_turnos.sql` (turnos ficticios, fechas relativas a hoy) → `03_fotos_resenas.sql` (fotos, reseñas, bucket `fotos`) → `seed_demo_v3.sql` (textos y reseñas) → `seed_demo_fotos.sql` → `04_fotos_relativas.sql` → `centro_glow.sql` (Glow Alisados, slug `glow`) → `05_vista_previa.sql` → `centro_oasis.sql` (Oasis Estética, slug `oasis`; se cargó por REST).
Si la Management API falla, se puede escribir con la API REST (`$SUPABASE_URL/rest/v1/...`) usando la service role de `.dev.vars` (el host ya está permitido).
Usuario demo del panel: `demo@turnia.app` (centro demo).
Alta de un centro nuevo: insert en `centers` + usuaria en auth + fila en `center_users` (por ahora lo hacemos nosotros).
