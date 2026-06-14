// ── Adaptador de proveedores de IA — COMPÁS IA R1 ────────────────────────
//
// Punto único de sustitución para integrar LLMs reales.
// El proveedor activo por defecto es 'simulado'; toda la lógica de
// buildSimulatedResponse() en iaOperativa.js sigue funcionando sin cambios.
//
// Para conectar un LLM real:
//
//   1. Registrar el proveedor:
//        registerProvider('openai', async (aiContext) => { ... });
//   2. Activarlo:
//        setActiveProvider('openai');
//
// El proveedor recibe un AiContext (ver buildAIContext en iaOperativa.js)
// y debe devolver un NormalizedAIResponse (ver contrato al final del archivo).
//
// La Sala React no necesita modificarse: solo cambia el proveedor activo.

// ── Registro ─────────────────────────────────────────────────────────────

const _registry = {};
let _active = 'simulado';

export function registerProvider(id, fn) {
  _registry[id] = fn;
}

export function setActiveProvider(id) {
  if (!_registry[id]) {
    throw new Error(`[aiProvider] Proveedor "${id}" no registrado. Usa registerProvider() primero.`);
  }
  _active = id;
}

export function getActiveProvider() {
  return _active;
}

export function listProviders() {
  return Object.keys(_registry);
}

export function isProviderRegistered(id) {
  return !!_registry[id];
}

// ── Punto de llamada ──────────────────────────────────────────────────────

// Llama al proveedor activo con el contexto estructurado generado por COMPÁS.
// Solo se invoca cuando el proveedor activo NO es 'simulado'.
// Para el proveedor simulado, iaOperativa.js llama directamente a
// buildSimulatedResponse() sin pasar por aquí.
export async function callAIProvider(aiContext) {
  const fn = _registry[_active];
  if (!fn) {
    throw new Error(`[aiProvider] Proveedor activo "${_active}" no tiene implementación registrada.`);
  }
  return fn(aiContext);
}

// ── Utilidad: registrar un stub declarativo ───────────────────────────────
// Permite declarar un proveedor pendiente de configuración.
// Cuando se llame, lanzará un error descriptivo con las instrucciones.
export function registerStubProvider(id, { description, setupInstructions }) {
  registerProvider(id, async (aiContext) => {
    throw new Error(
      `[aiProvider] Proveedor "${id}" (${description}) no está configurado. ` +
      `${setupInstructions} ` +
      `Contexto preparado: intent="${aiContext.intent}", ` +
      `objeto="${aiContext.selectedObject?.name ?? 'sin resolver'}", ` +
      `${aiContext.cou.workObjects.length} objeto(s) en COU.`,
    );
  });
}

// ── Proveedor interno 'simulado' ─────────────────────────────────────────
// Registrado como marcador para que setActiveProvider('simulado') funcione.
// iaOperativa.js intercepta este caso ANTES de llamar a callAIProvider(),
// por lo que esta función nunca se ejecuta en condiciones normales.
registerProvider('simulado', () => {
  throw new Error(
    '[aiProvider] El proveedor "simulado" es interno de COMPÁS. ' +
    'No invocar directamente — iaOperativa.runOperationalAi() lo gestiona.',
  );
});

// ── Proveedor mock: valida el contrato sin llamadas de red ───────────────
//
// Recibe AiContext y genera una respuesta determinista que:
//   a) demuestra que el contrato AiContext → raw response funciona
//   b) es claramente distinta del motor simulado (marcada [MOCK])
//   c) pasa por normalizeAIResponse en runOperationalAi (no aquí)
//
// Activar: setActiveProvider('mock')
// Desactivar: setActiveProvider('simulado')

const MOCK_INTENT_VERBS = {
  comprension:  (name) => `Explicación de ${name}`,
  intervencion: (name) => `Plan de intervención para ${name}`,
  impacto:      (name) => `Análisis de impacto de ${name}`,
  localizacion: (name) => `Localización de ${name}`,
  prompt:       (name) => `Prompt operativo para ${name}`,
  analisis:     (name) => `Análisis de ${name}`,
};

registerProvider('mock', async (aiContext) => {
  const { intent, selectedObject: obj, instruction, confidence, risks, codeRefs, runtimeObjects, candidates } = aiContext;

  const name    = obj?.name  ?? 'objeto no identificado';
  const group   = obj?.group ?? 'COMPÁS';
  const isLowC  = confidence.state === 'baja_confianza';
  const verb    = (MOCK_INTENT_VERBS[intent] ?? ((n) => `Respuesta para ${n}`))(name);

  const declaracion = isLowC
    ? `[MOCK] No puedo identificar el componente con confianza para: "${instruction}"`
    : `[MOCK] ${verb}.`;

  const diagnostico = isLowC
    ? `Candidatos con puntuación más alta: ${candidates.slice(0, 3).map((c) => `${c.name} (${c.score} pts)`).join(', ')}.`
    : (obj?.function ?? `${name} es un componente operativo de COMPÁS.`);

  const planActuacion = isLowC
    ? [
        'Reformular la consulta con el nombre exacto del componente.',
        'Seleccionar el objeto en el Explorador antes de lanzar el encargo.',
      ]
    : [
        `Verificar el estado de ${name} en Vista Nodo.`,
        risks.length   ? `Revisar riesgo principal: ${risks[0].id} — ${risks[0].title}.` : 'Sin riesgos críticos documentados.',
        codeRefs.length ? `Localizar punto de código: ${codeRefs[0].identifier}.` : null,
        'Documentar la decisión antes de proceder.',
      ].filter(Boolean);

  const seccionesAdicionales = [];
  if (obj?.consumes?.length) {
    seccionesAdicionales.push({ titulo: 'Entradas (consume)', contenido: obj.consumes.slice(0, 4).join(', ') });
  }
  if (obj?.produces?.length) {
    seccionesAdicionales.push({ titulo: 'Salidas (produce)', contenido: obj.produces.slice(0, 4).join(', ') });
  }
  if (runtimeObjects.length) {
    seccionesAdicionales.push({
      titulo: 'Runtime / Persistencia',
      contenido: runtimeObjects.slice(0, 3).map((r) => `${r.id}: ${r.persistence ?? 'no documentada'}`).join('; '),
    });
  }

  return {
    provider:   'MOCK_V1',
    perspective: intent,
    declaracion,
    diagnostico,
    riesgoPrincipal: risks[0]?.title ?? null,
    planActuacion,
    proximoPaso: obj ? `Abre ${name} en Vista Nodo para continuar.` : 'Reformula la consulta y vuelve a intentarlo.',
    estadoSistema: [],
    objetoNucleo: obj ? {
      name: obj.name, group: obj.group,
      criticality: obj.criticality ?? null, workObjectId: obj.id,
    } : null,
    promptGenerado: intent === 'prompt'
      ? `[MOCK PROMPT]\nActúa como auditor técnico experto en COMPÁS.\nObjeto: ${name}.\nInstrucción: "${instruction}"`
      : null,
    seccionesAdicionales,
    mostrarEstadoSistema: ['intervencion', 'impacto', 'analisis'].includes(intent),
    ambiguous:      aiContext.ambiguous,
    alternativeIds: aiContext.alternativeIds,
    evidencias: [
      `${aiContext.cou.workObjects.length} workObject(s) en COU`,
      `confianza: ${confidence.state} (${confidence.score} pts)`,
      `proveedor: MOCK_V1`,
    ],
    riesgos:         risks.map((r) => `${r.id}: ${r.title}`),
    productos:       ['Respuesta MOCK generada desde AiContext sin llamadas externas.'],
    codigoRelevante: codeRefs.slice(0, 4).map((r) => `${r.identifier} · ${r.file}`),
    resumen:         declaracion,
    siguienteAccionHumana: obj ? `Abre ${name} en Vista Nodo.` : 'Reformula la consulta.',
  };
});

// ── Stubs declarativos para LLMs futuros ─────────────────────────────────
// Registrados pero no activos. Para activar:
//   setActiveProvider('claude') o setActiveProvider('openai')

registerStubProvider('claude', {
  description: 'Claude (Anthropic)',
  setupInstructions:
    'Configura VITE_ANTHROPIC_API_KEY en tu .env y registra el proveedor con tu implementación.',
});

registerStubProvider('openai', {
  description: 'GPT (OpenAI)',
  setupInstructions:
    'Configura VITE_OPENAI_API_KEY en tu .env y registra el proveedor con tu implementación.',
});

// ── Contrato de respuesta normalizada (NormalizedAIResponse) ─────────────
//
// Un proveedor real debe devolver un objeto con este shape.
// Los campos marcados [requeridos] son necesarios para que la Sala funcione.
// Los marcados [opcional] mejoran la experiencia si están disponibles.
//
// {
//   provider: string,               // [requerido] Identificador del proveedor
//   perspective: string,            // [requerido] intent: comprension | intervencion | ...
//   declaracion: string,            // [requerido] Frase de apertura (primera persona)
//   diagnostico: string,            // [requerido] Cuerpo principal de la respuesta
//   riesgoPrincipal: string | null, // [opcional]  null para ocultar en la UI
//   planActuacion: string[],        // [requerido] Lista de pasos
//   proximoPaso: string,            // [requerido] Siguiente acción recomendada
//   seccionesAdicionales: [         // [opcional]  Secciones adaptadas a la intención
//     { titulo: string, contenido: string }
//   ],
//   mostrarEstadoSistema: boolean,  // [opcional]  true por defecto
//   // Campos retrocompatibles (pueden copiarse del AiContext si el LLM no los genera):
//   estadoSistema: [...],
//   objetoNucleo: { name, group, criticality, workObjectId } | null,
//   codigoRelevante: string[],
//   ambiguous: boolean,
//   alternativeIds: string[],
// }
