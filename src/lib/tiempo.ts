// Argentina: UTC-3 todo el año
export const OFFSET = "-03:00";
const H = 3600e3;
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const hoyAR = () => new Date(Date.now() - 3 * H).toISOString().slice(0, 10);
export const aFecha = (d: string, hm: string) => new Date(`${d}T${hm.slice(0, 5)}:00${OFFSET}`);
export const diaSemana = (d: string) => new Date(`${d}T12:00:00${OFFSET}`).getUTCDay();
export function sumarDias(d: string, n: number) {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
}
export const horaAR = (x: string | Date) => new Date(new Date(x).getTime() - 3 * H).toISOString().slice(11, 16);
export const fechaAR = (x: string | Date) => new Date(new Date(x).getTime() - 3 * H).toISOString().slice(0, 10);
export const lindaFecha = (d: string) => `${DIAS[diaSemana(d)]} ${d.slice(8, 10)}/${d.slice(5, 7)}`;
export const lunesDe = (d: string) => sumarDias(d, -((diaSemana(d) + 6) % 7));

export const pesos = (n: number) => "$" + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const soloNumeros = (s: string) => (s || "").replace(/\D/g, "");
export function duracion(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`;
}
