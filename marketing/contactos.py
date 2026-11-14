# Genera contactos.html. Editar la lista y el mensaje acá y correr: python3 contactos.py
import urllib.parse, html
DEMO = "https://turnia-turnos.pages.dev/c/demo"
MENSAJE = """¡Hola! ¿Cómo están? 😊 Soy Belén. Les escribo porque estamos lanzando Turnia, un sistema para que sus clientas reserven turno solas desde el celu, las 24 h, sin que ustedes tengan que estar contestando mensajes todo el día.

Armamos una página de ejemplo de un centro de estética para que vean cómo queda (¡tiene hasta un chat tipo WhatsApp que toma los turnos solo!):
https://turnia-turnos.pages.dev/c/demo

Si les gusta, armamos la de su centro con sus servicios, precios y fotos, 100% personalizada y funcional. ¿Les interesaría probarlo?"""

# (zona, nombre, barrio, whatsapp 549..., servicios, por qué está / nota, fuente)
C = [
 # --- Capital: centros con mucho movimiento (cadenas, varias sedes, notas en revistas) ---
 ("Capital · los más fuertes","Estética Funcional","Cadena · 13 sucursales","5491124076453","Tratamientos corporales y faciales","Cadena grande (13 barrios). El dato es de una nota vieja: el número puede haber cambiado.","https://caras.perfil.com/noticias/caras-like/estetica-funcional-lider-en-argentina.phtml"),
 ("Capital · los más fuertes","Depi Esthetic","Caballito (y Ramos Mejía)","5491167074265","Depilación láser","Dos sedes. Otro WhatsApp de Caballito: 11 4161-1449.","https://caras.perfil.com/noticias/caras-like/depi-esthetic.phtml"),
 ("Capital · los más fuertes","Mundo Depilación","Almagro (Corrientes y Á. Gallardo)","5491170050105","Depilación definitiva Soprano","","https://mundodepilacion.com.ar/"),
 ("Capital · los más fuertes","Rostro Perfecto","Retiro","5491128746493","Cejas y pestañas","","https://www.sensoria.com.ar/spa/rostro-perfecto/"),
 ("Capital · los más fuertes","Skinesthetic","Alberdi 1880","5491169505571","Estética","","https://www.facebook.com/skinesthetic2020/"),
 ("Capital · los más fuertes","Estética Buenos Aires","Belgrano","5491130593511","Centro médico estético","","https://www.esteticabuenosaires.com/"),
 ("Capital · los más fuertes","Mia Estética","CABA","5491149141917","Estética","El número parece de línea fija y la nota es vieja: si no tiene WhatsApp, saltealo.","https://caras.perfil.com/noticias/caras-like/mia-estetica-belleza-atencion-y-profesionalismo.phtml"),
 # --- Capital (lista anterior) ---
 ("Capital","Estética Bella Salud","Palermo","5491135771361","Depilación láser, faciales","","https://bellasalud.com.ar/"),
 ("Capital","Estética Bella Vita","Palermo · Caballito · Villa Urquiza","5491136682004","Láser, faciales, medicina estética","Cadena con 3 sedes. Ya tiene reserva online.","https://esteticabellavita.com/consultorio-palermo/"),
 ("Capital","Spa Belgrano","Belgrano · Núñez","5491165190212","Faciales, spa","Otra fuente dice 11 5037-6028.","https://spabelgrano.com/contacto/"),
 ("Capital","Alma Estética","Belgrano","5491161622471","Medicina estética, depilación","","https://www.almaestetica.com.ar/sede-belgrano-caba.html"),
 ("Capital","LAB Estética Profesional","Caballito","5491179823333","Estética profesional","Dice tener 153 reseñas en Google con 9,8/10.","https://labestetica.com/"),
 ("Capital","Donato Estética","Caballito","5491167195422","Estética","Ya tiene turnos online.","https://www.donatoestetica.com/"),
 ("Capital","AG Estética","(ver Instagram)","5491163701219","Estética","","https://www.instagram.com/ag_centrodeestetica/"),
 ("Capital","Minah Club","Recoleta","5491130002234","Manos, pies, pestañas","Ya tiene reserva online.","https://www.minahclub.com/book-online"),
 ("Capital","Cejas Prolijas & SkinCare","Recoleta","5491158681279","Cejas, pestañas, skincare","Otro número: 11 5739-8629.","https://www.cejasprolijas.com.ar/"),
 ("Capital","Rosé Urban Lab","Flores","5491134653165","Uñas esculpidas, kapping, semi","","https://www.roseurbanlab.com/"),
 ("Capital","Andrea Lucena Estética","Flores","5491126831928","Faciales, corporales, cejas y pestañas","Página de hace más de un año.","https://andrealucenaestetica.com/"),
 ("Capital","Manicuría CABA (a domicilio)","CABA","5491161859936","Manicura y semi a domicilio","","https://manicuriacaba.com.ar/manicuria"),
 # --- Lomas de Zamora ---
 ("Lomas de Zamora","Reina Mora Estética Integral","Molina Arrotea 773","5491162731489","Uñas, faciales, cejas y pestañas, depilación, maquillaje","","https://www.reinamoraesteticaintegral.com/"),
 ("Lomas de Zamora","Betty García Estética","Laprida 19, 1° (centro)","5491163072508","Depilación, uñas esculpidas, semi, pestañas","","http://www.bettygarciaestetica.com.ar/"),
 ("Lomas de Zamora","DepiHills","Acevedo 286","5491131207969","Depilación médica láser","","https://www.instagram.com/depihills/"),
 ("Lomas de Zamora","DG Estética Beauty Bar","Loria 402","5491156518306","Beauty bar","","https://dgbeautybar.com/"),
 ("Lomas de Zamora","AGP Estética","Antonio Sáenz 338","5491138571230","Manicuría, láser Soprano, lifting de pestañas","Ya usa AgendaPro (la competencia): contale lo del chat y que no cobramos comisión.","https://agpestetica.agendapro.com/ar"),
 # --- Lanús ---
 ("Lanús","Isabel Grimoldi Estética Avanzada","Lanús Oeste","5491123082096","Faciales, depilación láser","","https://isabelgrimoldi.com.ar/"),
 ("Lanús","Depilación láser Soprano Ice (Lizhere)","Valentín Alsina","5491165686059","Depilación láser","","https://lizherediasalon.com/depilacion-definitiva-laser/"),
 ("Lanús","Actual Nails","Lanús Oeste","5491161581235","Uñas, pestañas, cejas, depilación","","https://wandastore.com.ar/cosmetica/actual/"),
 ("Lanús","Estética Daniela Martínez","Lanús Oeste","5491131910651","Faciales, pestañas, manos, depilación","","https://caras.perfil.com/noticias/caras-like/estetica-daniela-martinez.phtml"),

 # --- Tanda 3 (14/11/2026) ---
 ("Capital","Ser Estética","Villa Devoto (Av. Beiró 4653)","5491134208765","Depilación láser y cera, manos y pies, masajes","","https://www.serestetica.ar/"),
 ("Capital","NIKI Beauty Bar Recoleta II","Recoleta","5491170659515","Manicura, pedicura, semipermanente","Cadena NIKI (varias sedes). Ya tiene reserva online.","https://www.sensoria.com.ar/spa/niki-beauty-bar-recoleta-ii/"),
 ("Banfield","ISAMORA Luxury Skin","Banfield","5491156260275","Depilación definitiva, faciales, corporales","","https://www.isamora.com.ar/"),
 ("Banfield","The Original Beauty Bar","Cochabamba 246","5491132864130","Manicuría, cejas, pestañas, depilación","Usa AgendaPro (la competencia).","https://beautybarbanfield.site.agendapro.com/ar/sucursal/87615"),
 ("Banfield","Harmonic Senses Estética","Hipólito Yrigoyen 7297","5491125534455","Estética integral","","https://www.instagram.com/harmonic.senses/"),
 ("Banfield","Plena Beauty & Spa","Banfield","5491157666050","Depilación definitiva, corporales, spa","Dato viejo: el número puede haber cambiado.","https://plenabeautyspa.com/"),
 ("Avellaneda y Wilde","Estética SM","Wilde (Las Flores 389)","5491157827975","Manos, pies, depilación, faciales, pestañas y cejas","Atiende sobre todo por WhatsApp.","https://wandastore.com.ar/cosmetica/estetica-sm/"),
 ("Avellaneda y Wilde","Estética Amore","Wilde (Mitre 6020)","5491162863037","Depilación láser","Usa AgendaPro (la competencia).","https://www.esteticaamore.com/"),
 ("Quilmes","Oasis Estética Quilmes","General Paz 420","5491167566341","Estética","","https://www.instagram.com/oasisesteticaquilmes/"),
 ("Monte Grande","Victoria's Beauty","Arana 288","5491161922802","Depilación definitiva, cejas, pestañas, semipermanente","","https://www.facebook.com/p/Victorias-Beauty-100042938840622/"),
 ("Monte Grande","Dra. Coria & Zulma Depilación","Las Heras 158, 3°","5491165902981","Faciales, depilación, masajes, spa","","https://wandastore.com.ar/cosmetica/estetica-medica-dra-coria-zulma-depilacion-monte-grande/"),
 ("Monte Grande","AC Centro de Medicina Estética","Av. Nuestras Malvinas 391","5491163645080","Faciales y corporales","Dato de hace más de 2 años.","https://consultorioac.com/contacto/"),
 # --- Zona Norte (lista anterior) ---
 ("Zona Norte","Beauty Infinit","Olivos","5491150501114","Depilación láser, estética","Cadena con sucursales.","https://beautyinfinit.com.ar/sucursales/vicente-lopez/"),
 ("Zona Norte","Siempre Bella","Vicente López","5491167184339","Láser, skincare, medicina estética","","https://siempre-bella.ar/"),
]
# Los de la última tanda (llevan la etiqueta "nuevo")
NUEVOS = {"Ser Estética","NIKI Beauty Bar Recoleta II","ISAMORA Luxury Skin","The Original Beauty Bar","Harmonic Senses Estética",
          "Plena Beauty & Spa","Estética SM","Estética Amore","Oasis Estética Quilmes","Victoria's Beauty",
          "Dra. Coria & Zulma Depilación","AC Centro de Medicina Estética"}
# Botón principal: abre la app WhatsApp común (whatsapp://). Respaldo: wa.me (el celu elige la app).
link = "whatsapp://send?phone={}&text=" + urllib.parse.quote(MENSAJE)
respaldo = "https://wa.me/{}?text=" + urllib.parse.quote(MENSAJE)
ORDEN = ["Capital · los más fuertes","Capital","Lomas de Zamora","Banfield","Lanús","Avellaneda y Wilde","Quilmes","Monte Grande","Zona Norte"]
def armar(C, titulo, archivo):
  zonas = [z for z in ORDEN if any(c[0]==z for c in C)]
  for c in C:
      if c[0] not in zonas: zonas.append(c[0])
  cuerpo = ""
  for z in zonas:
      items = [c for c in C if c[0] == z]
      cuerpo += f"<h2>{html.escape(z)} <span class='n'>{len(items)}</span></h2><ul>"
      for _, n, b, num, s, nota, f in items:
          lindo = f"{num[3:5]} {num[5:9]}-{num[9:]}"
          nuevo = "<em class='nuevo'>nuevo</em>" if n in NUEVOS else ""
          cuerpo += f"""<li><div class="cab"><b>{html.escape(n)} {nuevo}</b><span>{html.escape(b)}</span></div>
  <small>{html.escape(s)} · 📱 {lindo} · <a href="{f}" target="_blank">fuente</a></small>
  {f'<p class="nota">⚠️ {html.escape(nota)}</p>' if nota else ''}
  <a class="wa" href="{link.format(num)}">Enviar por WhatsApp</a>
  <a class="respaldo" href="{respaldo.format(num)}" target="_blank">¿No abre? Probá con este otro link</a>
  <label class="hecho"><input type="checkbox" data-id="{num}"> Ya le escribí</label></li>"""
      cuerpo += "</ul>"
  page = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{titulo}</title><style>
  body{{margin:0;font-family:system-ui,sans-serif;background:#fdf7f6;color:#2d2424;line-height:1.45}}
  main{{max-width:640px;margin:0 auto;padding:16px}} h1{{font-size:1.5rem;margin:.2em 0}} h2{{font-size:1.2rem;margin-top:28px}}
  .n{{background:#c98ba0;color:#fff;border-radius:999px;font-size:.8rem;padding:2px 9px;vertical-align:middle}}
  .tips,pre{{background:#fff;border-radius:14px;padding:12px 16px;font-size:.92rem}}
  pre{{white-space:pre-wrap;font-family:inherit}}
  ul{{list-style:none;padding:0}} li{{background:#fff;border-radius:16px;padding:14px;margin-bottom:12px;box-shadow:0 2px 10px #c98ba01a}}
  .cab{{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}} .cab span{{color:#c98ba0;font-size:.9rem}}
  .nuevo{{font-style:normal;font-size:.7rem;background:#d4f0e4;color:#1e7b45;border-radius:999px;padding:2px 8px;vertical-align:middle}}
  small{{color:#7a6e6e;display:block;margin:4px 0 8px}} .nota{{background:#fff6e6;border-radius:10px;padding:6px 10px;font-size:.85rem;margin:6px 0}}
  .wa{{display:block;text-align:center;background:#25d366;color:#fff;text-decoration:none;font-weight:700;border-radius:999px;padding:11px}}
  .respaldo{{display:block;text-align:center;font-size:.8rem;color:#7a6e6e;margin-top:6px}}
  .hecho{{display:block;margin-top:8px;font-size:.9rem;color:#7a6e6e}} li.ok{{opacity:.5}}
  </style></head><body><main>
  <h1>💗 {titulo}</h1>
  <p>{len(C)} centros. Tocá el botón verde: se abre la app <b>WhatsApp común</b> (no la Business) con tu mensaje ya escrito. Después marcá “Ya le escribí”.</p>
  <div class="tips"><b>Para que WhatsApp no te bloquee:</b><br>• 10 a 15 por día, no todos juntos.<br>• Poné foto y tu nombre en el perfil, así ven quién les escribe.<br>• De lunes a viernes, 10 a 12 h o 15 a 18 h.<br>• Si no contestan, insistí una sola vez a los 3 días.</div>
  <details><summary style="margin-top:12px;cursor:pointer"><b>Ver el mensaje que se manda</b></summary><pre>{html.escape(MENSAJE)}</pre></details>
  <p style="font-size:.85rem;color:#7a6e6e">Los números salen de la web, Instagram o notas de cada centro (link “fuente”). No los probé uno por uno: alguno puede estar viejo.</p>
  {cuerpo}
  <h2>Si te contestan que sí</h2>
  <pre>¡Genial! 🙌 Para armarles su página necesito:
  1. La lista de servicios con precio y duración (puede ser una foto de la lista de precios).
  2. Quiénes atienden y qué días/horarios.
  3. Logo y algunas fotos del lugar o de sus trabajos.
  4. Cuánto cobran de seña (si cobran).</pre>
  <h2>Si no contestan (a los 3 días)</h2>
  <pre>Hola! 😊 Les escribo de nuevo por si se les pasó. Si quieren les muestro en 5 minutos por videollamada cómo quedaría su página de turnos 💗</pre>
  </main><script>
  document.querySelectorAll('input[data-id]').forEach(c=>{{const k='hecho-'+c.dataset.id;try{{c.checked=localStorage.getItem(k)==='1'}}catch(e){{}}
  const pinta=()=>c.closest('li').classList.toggle('ok',c.checked);pinta();c.onchange=()=>{{try{{localStorage.setItem(k,c.checked?'1':'0')}}catch(e){{}};pinta()}}}});
  </script></body></html>"""
  open(archivo, "w").write(page)
  print(archivo, len(C), "centros")

armar(C, "Estéticas para contactar", "contactos.html")
armar([c for c in C if c[1] in NUEVOS], "Estéticas nuevas para contactar", "contactos_nuevos.html")

# ---------------- Mails ----------------
# (nombre como en C, mail, nota)
MAILS = [
 ("Estética Buenos Aires", "turnos@esteticabuenosaires.com", "Sale de su página. Otro: recepcion@esteticabuenosaires.com"),
 ("Minah Club", "minahspaclub@gmail.com", ""),
 ("Cejas Prolijas & SkinCare", "info@cejasprolijas.com.ar", ""),
 ("Depi Esthetic", "depiesthetics@hotmail.com", "Sale de un directorio: puede estar viejo."),
 ("Ser Estética", "seresteticavilladevoto@gmail.com", ""),
 ("Betty García Estética", "bettygarciaestetica@gmail.com", "Su página es vieja: puede no usarlo más."),
 ("Isabel Grimoldi Estética Avanzada", "info@isabelgrimoldi.com.ar", ""),
 ("Depilación láser Soprano Ice (Lizhere)", "info@lizherediasalon.com", "Es el mail de Liz Heredia Salón."),
 ("Plena Beauty & Spa", "info@plenabeautyspa.com", ""),
 ("Estética Amore", "esteticaamore@gmail.com", ""),
 ("AC Centro de Medicina Estética", "hola@consultorioac.com", "Página de hace más de 2 años."),
 ("Beauty Infinit", "vicentelopez@beautyinfinit.com.ar", "Sucursal Olivos/Vicente López."),
 ("Siempre Bella", "info@siempre-bella.com.ar", "Sale de su Facebook: verificar."),
]
ASUNTO = "Turnos online para su centro 💗"
CUERPO = MENSAJE + "\n\nBelén · Turnia\nWhatsApp 11 5422-9687"
porNombre = {c[1]: c for c in C}
filas = ""
for n, mail, nota in MAILS:
    c = porNombre[n]
    href = "mailto:" + mail + "?subject=" + urllib.parse.quote(ASUNTO) + "&body=" + urllib.parse.quote(CUERPO)
    filas += f"""<li><div class="cab"><b>{html.escape(n)}</b><span>{html.escape(c[2])}</span></div>
<small>✉️ <span class="mail">{mail}</span> · <a href="{c[6]}" target="_blank">fuente</a></small>
{f'<p class="nota">⚠️ {html.escape(nota)}</p>' if nota else ''}
<a class="wa mailbtn" href="{href}">Escribir mail</a>
<label class="hecho"><input type="checkbox" data-id="mail-{mail}"> Ya le mandé el mail</label></li>"""
todos = ", ".join(m[1] for m in MAILS)
pagina = open("contactos_nuevos.html").read().split("<body>")[0].replace("<title>Estéticas nuevas para contactar</title>", "<title>Mails de estéticas</title>")
pagina += f"""<body><main>
<h1>✉️ Mails de estéticas</h1>
<p>{len(MAILS)} centros con mail. Tocá “Escribir mail”: se abre tu correo con el asunto y tu mensaje ya escritos.</p>
<div class="tips"><b>Consejos:</b><br>• Mandalos de a uno (no todos juntos en el mismo mail, así no parece publicidad masiva).<br>• Si alguno rebota, ese mail ya no existe: pasá al siguiente.<br>• Revisá la carpeta de spam por si contestan desde ahí.</div>
<details><summary style="margin-top:12px;cursor:pointer"><b>Ver el mail que se manda</b></summary><pre><b>Asunto:</b> {html.escape(ASUNTO)}

{html.escape(CUERPO)}</pre></details>
<ul>{filas}</ul>
<h2>Todos los mails juntos (para copiar)</h2>
<pre>{todos}</pre>
<p style="font-size:.85rem;color:#7a6e6e">Los otros centros de la lista no publican mail: con ellos, WhatsApp.</p>
</main><script>
document.querySelectorAll('input[data-id]').forEach(c=>{{const k='hecho-'+c.dataset.id;try{{c.checked=localStorage.getItem(k)==='1'}}catch(e){{}}
const pinta=()=>c.closest('li').classList.toggle('ok',c.checked);pinta();c.onchange=()=>{{try{{localStorage.setItem(k,c.checked?'1':'0')}}catch(e){{}};pinta()}}}});
</script></body></html>"""
pagina = pagina.replace("</style>", ".mailbtn{background:#c98ba0}\n</style>")
open("mails.html", "w").write(pagina)
print("mails.html", len(MAILS), "mails")
