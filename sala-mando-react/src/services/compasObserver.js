// Lectura defensiva de window.COMPAS. Nunca lanza error.
// Si el contexto de COMPÁS no está disponible, todas las funciones
// devuelven null o noop sin interrumpir la Sala.

export function isAvailable() {
  return (
    typeof window !== 'undefined' &&
    window.COMPAS?.__estadoGlobal != null
  );
}

export function getMunicipioActivo() {
  if (typeof window === 'undefined') return null;
  // 1. Fuente modular canónica (puede estar null si el flujo real no la actualiza)
  try {
    const ct = window.COMPAS?.__contextoTerritorial;
    if (ct?.getAmbitoActivo) {
      const ambito = ct.getAmbitoActivo();
      if (ambito?.key) return ambito.key;
    }
  } catch { /* continúa */ }
  // 2. Selector DOM — fuente real observable confirmada con evidencia empírica
  try {
    const domVal = document.getElementById('municipio')?.value;
    if (domVal) return domVal;
  } catch { /* continúa */ }
  // 3. planLocalSalud — alternativa si el DOM no está disponible
  try {
    return window.planLocalSalud?.municipio ?? null;
  } catch {
    return null;
  }
}

export function getDatosMunicipioActual() {
  if (typeof window === 'undefined') return null;
  try {
    const d = window.datosMunicipioActual;
    if (!d || typeof d !== 'object') return null;
    if (Object.keys(d).length === 0) return null;
    return d;
  } catch {
    return null;
  }
}

export function getPlanLocalSalud() {
  if (typeof window === 'undefined') return null;
  try {
    const p = window.planLocalSalud;
    if (!p || !p.municipio) return null;
    return p;
  } catch {
    return null;
  }
}

// Devuelve siempre una función de cleanup.
// Usa window.COMPAS.__estadoGlobal.subscribe() con el campo validado.
export function subscribeToMunicipioChange(callback) {
  if (!isAvailable()) return () => {};
  try {
    const unsuscribe = window.COMPAS.__estadoGlobal.subscribe(
      'ambitoTerritorialActivo',
      callback
    );
    return typeof unsuscribe === 'function' ? unsuscribe : () => {};
  } catch {
    return () => {};
  }
}
