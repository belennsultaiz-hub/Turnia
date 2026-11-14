// Turnia en turnia.pages.dev: pasa cada visita al worker "turnia" (enlace interno, sin pasar por internet)
export default {
  fetch(request, env) {
    return env.TURNIA.fetch(request);
  },
};
