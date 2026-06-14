// ── NormalizedAIResponse — COMPÁS IA R1 ──────────────────────────────────
//
// Contrato estable entre cualquier proveedor de IA (simulado, mock, LLM real)
// y la Sala React (VistaIAOperativa).
//
// REGLA: La UI renderiza ÚNICAMENTE este contrato.
//        Ningún campo raw de un LLM llega directamente a la UI.
//
// Para integrar un nuevo proveedor, devuelve un objeto con estos campos.
// normalizeAIResponse() rellenará los ausentes con valores por defecto seguros.
//
// ── Shape del contrato ────────────────────────────────────────────────────
//
// {
//   // Versión del contrato (para detección de incompatibilidades)
//   _version: string,               // '1.0'
//   _normalized: true,
//
//   // Campos de presentación (renderizados por ResponseCard)
//   perspective: string,            // intent: comprension | intervencion | ...
//   declaracion: string,            // Frase de apertura. Primera persona.
//   diagnostico: string,            // Cuerpo principal de la respuesta.
//   riesgoPrincipal: string | null, // null → no se renderiza
//   planActuacion: string[],        // Pasos ordenados
//   proximoPaso: string,            // Siguiente acción recomendada
//   estadoSistema: [                // Semáforo operativo
//     { id: string, label: string, active: boolean }
//   ],
//   objetoNucleo: {                 // Para el botón "Abrir en Sala"
//     name: string,
//     group: string,
//     criticality: number | null,
//     workObjectId: string,
//   } | null,
//   promptGenerado: string | null,  // Solo para intent=prompt
//   seccionesAdicionales: [         // Secciones adaptadas al intent
//     { titulo: string, contenido: string }
//   ],
//   mostrarEstadoSistema: boolean,  // false oculta el semáforo
//   ambiguous: boolean,
//   alternativeIds: string[],
//
//   // Retrocompat para createExpediente (no renderizados por la UI)
//   resumen: string,
//   evidencias: string[],
//   riesgos: string[],
//   productos: string[],
//   codigoRelevante: string[],
//   siguienteAccionHumana: string,
//
//   // Metadatos del proveedor
//   provider: string,
//   simulated: boolean,
// }

export const RESPONSE_VERSION = '1.0';

// ── normalizeAIResponse ───────────────────────────────────────────────────
//
// Recibe cualquier objeto raw de un proveedor de IA y devuelve un
// NormalizedAIResponse garantizando:
//   - Todos los campos existen (sin undefined)
//   - Los tipos son los esperados por la UI
//   - Los valores inválidos se sustituyen por defaults seguros
//
// Opciones:
//   source   — id del proveedor (para el campo provider)
//   simulated — true si es el motor simulado local

export function normalizeAIResponse(raw, { source = 'desconocido', simulated = false } = {}) {
  if (!raw || typeof raw !== 'object') raw = {};

  const perspective = str(raw.perspective, 'analisis');
  const declaracion = str(raw.declaracion, 'Respuesta generada.');
  const proximoPaso = str(raw.proximoPaso, '');

  return {
    // ── Identificación del contrato ───────────────────────────────────────
    _version:    RESPONSE_VERSION,
    _normalized: true,

    // ── Presentación ──────────────────────────────────────────────────────
    perspective,
    declaracion,
    diagnostico:          str(raw.diagnostico, 'Sin diagnóstico disponible.'),
    riesgoPrincipal:      strOrNull(raw.riesgoPrincipal),
    planActuacion:        strArr(raw.planActuacion),
    proximoPaso,
    estadoSistema:        normalizeEstadoSistema(raw.estadoSistema),
    objetoNucleo:         normalizeObjetoNucleo(raw.objetoNucleo),
    promptGenerado:       strOrNull(raw.promptGenerado),
    seccionesAdicionales: normalizeSecciones(raw.seccionesAdicionales),
    mostrarEstadoSistema: bool(raw.mostrarEstadoSistema, true),
    ambiguous:            bool(raw.ambiguous, false),
    alternativeIds:       strArr(raw.alternativeIds),

    // ── Retrocompat para createExpediente ─────────────────────────────────
    resumen:               str(raw.resumen ?? raw.declaracion, declaracion),
    evidencias:            strArr(raw.evidencias),
    riesgos:               strArr(raw.riesgos),
    productos:             strArr(raw.productos),
    codigoRelevante:       strArr(raw.codigoRelevante),
    siguienteAccionHumana: str(raw.siguienteAccionHumana ?? raw.proximoPaso, proximoPaso),

    // ── Metadatos ─────────────────────────────────────────────────────────
    provider:  str(raw.provider, source),
    simulated,
  };
}

// ── Helpers internos ──────────────────────────────────────────────────────

function str(v, fallback = '') {
  return (typeof v === 'string' && v.length > 0) ? v : fallback;
}

function strOrNull(v) {
  return (typeof v === 'string' && v.length > 0) ? v : null;
}

function strArr(v) {
  if (!Array.isArray(v)) return [];
  return v.filter((item) => typeof item === 'string');
}

function bool(v, fallback) {
  return typeof v === 'boolean' ? v : fallback;
}

function normalizeEstadoSistema(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({
      id:     str(s.id, 'unknown'),
      label:  str(s.label, ''),
      active: bool(s.active, false),
    }));
}

function normalizeObjetoNucleo(v) {
  if (!v || typeof v !== 'object') return null;
  const name = str(v.name, '');
  const workObjectId = str(v.workObjectId, '');
  if (!name || !workObjectId) return null;
  return {
    name,
    group:        str(v.group, ''),
    criticality:  typeof v.criticality === 'number' ? v.criticality : null,
    workObjectId,
  };
}

function normalizeSecciones(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({
      titulo:    str(s.titulo, 'Sección'),
      contenido: str(s.contenido, ''),
    }));
}
