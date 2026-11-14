import { PLANES, PRODUCTO } from "@/lib/config";
import { pesos } from "@/lib/tiempo";

const wa = (t: string) => `https://wa.me/${PRODUCTO.whatsapp}?text=${encodeURIComponent(t)}`;

const FUNCIONES = [
  ["📅", "Reservas las 24 h", "Tu página propia con servicios, precios y horarios libres. La clienta elige y reserva sola, sin escribirte."],
  ["💳", "Seña al reservar", "Definís la seña de cada servicio. Con Mercado Pago la plata va directo a tu cuenta.", "pronto"],
  ["🔔", "Recordatorios", "Mensaje antes del turno con botón para confirmar o cancelar. Menos faltazos, más agenda llena.", "pronto"],
  ["👩‍⚕️", "Varias profesionales", "Cada una con sus servicios y horarios. Agenda del día y de la semana."],
  ["⛔", "Bloqueo de horarios", "Vacaciones, feriados o un trámite: bloqueás y nadie reserva en ese rato."],
  ["🗂️", "Ficha de cada clienta", "Historial de turnos, cuánto gastó, si faltó, y notas (alergias, tipo de piel, preferencias)."],
];

const PREGUNTAS = [
  ["¿Necesito saber de computación?", "No. Te ayudamos a cargar tus servicios y horarios, y en un rato tenés tu link listo para compartir."],
  ["¿Mis clientas tienen que bajar una app?", "No. Entran a tu link desde Instagram o WhatsApp y reservan desde el navegador."],
  ["¿Puedo seguir anotando turnos que me piden por WhatsApp?", "Sí. Desde el panel cargás turnos a mano y quedan en la misma agenda."],
  ["¿Hay permanencia mínima?", "No. Pagás mes a mes y das de baja cuando quieras."],
];

export default function Landing() {
  return (
    <main className="landing">
      <nav className="nav">
        <b className="marca">{PRODUCTO.nombre}</b>
        <div><a href="#planes">Planes</a><a href="/panel">Ingresar</a></div>
      </nav>

      <header className="hero">
        <h1>Tu agenda llena,<br />sin contestar mensajes todo el día</h1>
        <p>Sistema de turnos online para centros de estética. Tus clientas reservan solas, desde el celu, a cualquier hora.</p>
        <div className="acciones centro">
          <a className="boton" href={wa(`Hola! Quiero probar ${PRODUCTO.nombre} en mi centro de estética.`)}>Quiero probarlo gratis</a>
          <a className="boton secundario" href="/c/demo">Ver un centro de ejemplo</a>
        </div>
        <p className="gris">14 días de prueba · Sin tarjeta · Te ayudamos a configurarlo</p>
      </header>

      <section className="seccion">
        <h2>Todo lo que tu centro necesita</h2>
        <div className="grilla">
          {FUNCIONES.map(([i, t, d, pronto]) => (
            <div key={t} className="func"><span className="ico">{i}</span><h3>{t} {pronto && <em className="pronto">pronto</em>}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section className="seccion">
        <h2>Así de simple</h2>
        <ol className="pasos">
          <li><b>Cargamos tus servicios</b> con precios, duración y seña.</li>
          <li><b>Compartís tu link</b> en Instagram, WhatsApp y Google.</li>
          <li><b>Las clientas reservan</b> y vos ves todo en tu agenda.</li>
        </ol>
      </section>

      <section className="seccion" id="planes">
        <h2>Planes</h2>
        <p className="gris centro">Precios por mes, finales. Sin comisión por turno.</p>
        <div className="planes">
          {PLANES.map((p) => (
            <div key={p.nombre} className={`plan ${p.destacado ? "destacado" : ""}`}>
              {p.destacado && <span className="etiqueta">Más elegido</span>}
              <h3>{p.nombre}</h3>
              <p className="gris">{p.detalle}</p>
              <p className="precio">{pesos(p.precio)}<small>/mes</small></p>
              <ul>{p.items.map((i) => <li key={i}>✓ {i}</li>)}</ul>
              <a className="boton" href={wa(`Hola! Me interesa el plan ${p.nombre} de ${PRODUCTO.nombre}.`)}>Empezar prueba</a>
            </div>
          ))}
        </div>
      </section>

      <section className="seccion">
        <h2>Preguntas frecuentes</h2>
        {PREGUNTAS.map(([q, r]) => <details key={q} className="faq"><summary>{q}</summary><p>{r}</p></details>)}
      </section>

      <section className="seccion contacto">
        <h2>¿Lo charlamos?</h2>
        <p>Escribinos y te mostramos cómo quedaría con tus servicios.</p>
        <div className="acciones centro">
          <a className="boton wa" href={wa(`Hola! Quiero saber más de ${PRODUCTO.nombre}.`)}>WhatsApp {PRODUCTO.whatsappLindo}</a>
          <a className="boton secundario" href={`mailto:${PRODUCTO.email}`}>{PRODUCTO.email}</a>
        </div>
      </section>
      <footer className="pie">{PRODUCTO.nombre} · Hecho en Argentina</footer>
    </main>
  );
}
