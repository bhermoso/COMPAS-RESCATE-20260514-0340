// IA Operativa v1: infraestructura de contexto para LLMs.
// El proveedor activo por defecto es 'simulado' (sin llamadas externas).
// Para conectar un LLM real: setActiveProvider('claude') tras registerProvider().
import { getActiveProvider, callAIProvider } from '../services/aiProvider.js';
import { normalizeAIResponse } from './normalizedResponse.js';
import { buildAliasMap } from './lexicon.js';

export const ENCARGO_ESTADOS = {
  creado: 'creado',
  contextualizado: 'contextualizado',
  simulado: 'simulado',
};

export const EXPEDIENTE_ESTADOS = {
  abierto: 'abierto',
  simulado: 'simulado',
};

const STOPWORDS = new Set([
  'arregla', 'ocupa', 'ocupate', 'ocúpate', 'quiero', 'entender', 'preparame',
  'prepárame', 'prepara', 'un', 'una', 'el', 'la', 'los', 'las', 'de', 'del',
  'sobre', 'para', 'por', 'con', 'y', 'o',
]);

// Fuente única de verdad léxica — ver src/data/lexicon.js para editar alias.
// Para añadir un sinónimo: modificar lexicon.js, no este archivo.
const aliasWorkObjects = buildAliasMap();

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function compactInstructionTitle(instruction) {
  const clean = instruction.trim().replace(/\s+/g, ' ');
  if (!clean) return 'Encargo sin instruccion';
  return clean.length > 68 ? `${clean.slice(0, 65)}...` : clean;
}

function tokenize(instruction) {
  return normalizeText(instruction)
    .split(' ')
    // normalizeText mantiene '.' para rutas/identificadores (index.html, wo-agenda).
    // Los tokens individuales con puntuación periférica ("vrelas.", "ibse.") se limpian aquí.
    .map((token) => token.replace(/^[._-]+|[._-]+$/g, ''))
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function matchWorkObjectByText(workObject, normalizedInstruction, tokens) {
  const searchable = normalizeText([
    workObject.id,
    workObject.name,
    workObject.group,
    workObject.function,
    workObject.location,
    ...(workObject.engines ?? []),
    ...(workObject.consumes ?? []),
    ...(workObject.produces ?? []),
    ...(workObject.risks ?? []),
  ].join(' '));

  if (normalizedInstruction.includes(normalizeText(workObject.name))) return true;
  return tokens.some((token) => searchable.includes(token));
}

function hasAliasHit(workObjectId, normalizedInstruction) {
  return (aliasWorkObjects[workObjectId] ?? []).some((alias) => normalizedInstruction.includes(normalizeText(alias)));
}

function matchDirectIdentity(workObject, normalizedInstruction, tokens) {
  const direct = normalizeText([
    workObject.id,
    workObject.name,
    workObject.group,
    workObject.location,
  ].join(' '));
  return normalizedInstruction.includes(normalizeText(workObject.name)) || tokens.some((token) => direct.includes(token));
}

function matchExtendedEvidence(workObject, tokens) {
  const extended = normalizeText([
    workObject.function,
    ...(workObject.consumes ?? []),
    ...(workObject.produces ?? []),
    ...(workObject.risks ?? []),
    ...(workObject.codeRefs ?? []).map((ref) => `${ref.identifier} ${ref.file}`),
  ].join(' '));
  return tokens.some((token) => extended.includes(token));
}

// Puntuación mínima para que un candidato sea promovido a núcleo.
// 12 pts ≈ una palabra del nombre que coincide con la instrucción.
// Por debajo → estado de baja confianza, sin selección silenciosa.
const CONFIDENCE_THRESHOLD = 12;

function scoreCandidate(workObject, normalizedInstruction, tokens) {
  let score = 0;

  // Alias directo (señal más fuerte: 40 pts)
  if ((aliasWorkObjects[workObject.id] ?? []).some((a) => normalizedInstruction.includes(normalizeText(a)))) {
    score += 40;
  }

  // Nombre completo en la instrucción (35 pts)
  const woName = normalizeText(workObject.name);
  if (normalizedInstruction.includes(woName)) {
    score += 35;
  } else {
    // Cada palabra del nombre que aparece como token (15 pts c/u, tope 30). Dedup para
    // evitar sobreconteo en nombres con repetición como "Motor propuesta IA (Motor 2)".
    const nameWords = [...new Set(woName.split(' ').filter((w) => w.length > 2))];
    const nameHits = nameWords.filter((w) => tokens.includes(w)).length;
    score += Math.min(nameHits * 15, 30);
  }

  // Identidad directa — id, grupo, ubicación — excluyendo lo ya contado (5 pts c/u, tope 10)
  const woNameWords = new Set(woName.split(' ').filter((w) => w.length > 2));
  const direct = normalizeText([workObject.id, workObject.group, workObject.location].join(' '));
  const directHits = tokens.filter((t) => direct.includes(t) && !woNameWords.has(t)).length;
  score += Math.min(directHits * 5, 10);

  // Evidencia ampliada — función, consume, produce, motores, riesgos, codeRefs (2 pts c/u, tope 8)
  const extended = normalizeText([
    workObject.function,
    ...(workObject.consumes ?? []),
    ...(workObject.produces ?? []),
    ...(workObject.engines ?? []),
    ...(workObject.risks ?? []),
    ...(workObject.codeRefs ?? []).map((r) => `${r.identifier} ${r.file}`),
  ].join(' '));
  const extHits = tokens.filter((t) => extended.includes(t) && !direct.includes(t) && !woNameWords.has(t)).length;
  score += Math.min(extHits * 2, 8);

  return score;
}

function siblingIdsFromCore(coreIds, data) {
  const siblings = new Set();
  for (const domain of data.territoryData.domains) {
    if (domain.workObjectIds?.some((id) => coreIds.includes(id))) {
      domain.workObjectIds.forEach((id) => siblings.add(id));
    }
  }
  return siblings;
}

function relevanceItem(workObject, level, reason) {
  return {
    ...workObject,
    relevanceLevel: level,
    relevanceReason: reason,
  };
}

// Si el segundo candidato supera este ratio del primero → ambigüedad.
const AMBIGUITY_RATIO = 0.8;

export function classifyWorkObjectRelevance(workObjectIds, { data, instruction = '', selected = null } = {}) {
  const ids = unique(workObjectIds);
  const byId = Object.fromEntries(data.workObjects.map((item) => [item.id, item]));

  // ── Modo contexto: sin instrucción, todos los objetos son núcleo ──────────
  if (!instruction) {
    const buckets = { core: [], direct: [], extended: [], documentary: [] };
    const candidatos = [];
    for (const id of ids) {
      const wo = byId[id];
      if (!wo) continue;
      buckets.core.push(relevanceItem(wo, 'core', 'contexto activo'));
      candidatos.push({ id, name: wo.name, group: wo.group, score: 0 });
    }
    return { ...buckets, lowConfidence: false, ambiguous: false, alternativeIds: [], candidatos };
  }

  const normalized = normalizeText(instruction);
  const tokens = tokenize(instruction);

  // ── Candidatos ponderados — evaluación unificada ──────────────────────────
  const candidatos = ids
    .map((id) => {
      const wo = byId[id];
      if (!wo) return null;
      return { id, name: wo.name, group: wo.group, score: scoreCandidate(wo, normalized, tokens) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // ── Política de ganador único ─────────────────────────────────────────────
  // 1. Sin candidato que alcance CONFIDENCE_THRESHOLD → baja confianza.
  // 2. Segundo candidato dentro del 80% del primero → ambigüedad declarada.
  // 3. En caso contrario → ganador único, sin núcleos secundarios.
  const top = candidatos[0];
  const second = candidatos[1];
  let coreIds = [];
  let ambiguous = false;
  let alternativeIds = [];

  if (top && top.score >= CONFIDENCE_THRESHOLD) {
    coreIds = [top.id];
    if (second && second.score >= top.score * AMBIGUITY_RATIO) {
      ambiguous = true;
      alternativeIds = candidatos
        .slice(1)
        .filter((c) => c.score >= top.score * AMBIGUITY_RATIO)
        .map((c) => c.id);
    }
  } else if (selected?.type === 'workObject' && ids.includes(selected.id)) {
    // Fallback explícito: el operador tiene un objeto seleccionado → usarlo como núcleo
    coreIds = [selected.id];
  }

  const lowConfidence = coreIds.length === 0 && ids.length > 0;

  // ── Clasificación en buckets ──────────────────────────────────────────────
  const directSiblingIds = siblingIdsFromCore(coreIds, data);
  const buckets = { core: [], direct: [], extended: [], documentary: [] };

  for (const id of ids) {
    const workObject = byId[id];
    if (!workObject) continue;
    if (coreIds.includes(id)) {
      buckets.core.push(relevanceItem(workObject, 'core', 'candidato principal del encargo'));
    } else if (alternativeIds.includes(id)) {
      buckets.direct.push(relevanceItem(workObject, 'direct', 'alternativa semantica proxima'));
    } else if (directSiblingIds.has(id) || matchDirectIdentity(workObject, normalized, tokens)) {
      buckets.direct.push(relevanceItem(workObject, 'direct', 'contexto directo del nucleo'));
    } else if (matchExtendedEvidence(workObject, tokens)) {
      buckets.extended.push(relevanceItem(workObject, 'extended', 'contexto ampliado por evidencias del objeto'));
    } else {
      buckets.documentary.push(relevanceItem(workObject, 'documentary', 'contexto documental asociado'));
    }
  }

  return { ...buckets, lowConfidence, ambiguous, alternativeIds, candidatos };
}

export function detectWorkObjectIds(instruction, data, selected) {
  const normalized = normalizeText(instruction);
  const tokens = tokenize(instruction);
  const matches = [];

  for (const [workObjectId, aliases] of Object.entries(aliasWorkObjects)) {
    if (aliases.some((alias) => normalized.includes(normalizeText(alias)))) {
      matches.push(workObjectId);
    }
  }

  for (const workObject of data.workObjects) {
    if (matchWorkObjectByText(workObject, normalized, tokens)) {
      matches.push(workObject.id);
    }
  }

  if (matches.length === 0 && selected?.type === 'workObject') {
    matches.push(selected.id);
  }

  if (matches.length === 0 && selected?.type === 'panopticoNode') {
    const node = data.panopticoNodes.find((item) => item.id === selected.id);
    matches.push(...(node?.workObjectIds ?? []));
  }

  return unique(matches);
}

export function createEncargo(instruction, workObjectIds) {
  const id = makeId('encargo');
  return {
    id,
    titulo: compactInstructionTitle(instruction),
    instruccionOriginal: instruction,
    fecha: new Date().toISOString(),
    estado: ENCARGO_ESTADOS.contextualizado,
    workObjectsDetectados: workObjectIds,
    expedienteId: `exp-${id}`,
  };
}

function resolveDomainContext(workObjectIds, data) {
  return data.territoryData.domains
    .filter((domain) => domain.workObjectIds?.some((id) => workObjectIds.includes(id)))
    .map((domain) => ({
      id: domain.id,
      label: domain.label,
      subtitle: domain.subtitle,
      source: data.territoryData.source,
    }));
}

function resolvePanopticoNodes(workObjectIds, data) {
  return data.panopticoNodes
    .filter((node) => node.workObjectIds?.some((id) => workObjectIds.includes(id)))
    .map((node) => ({
      id: node.id,
      name: node.name,
      summary: node.summary,
      riskIds: node.riskIds ?? [],
    }));
}

function resolveCodeRefs(workObjects) {
  return workObjects.flatMap((workObject) =>
    (workObject.codeRefs ?? []).map((ref) => ({
      ...ref,
      workObjectId: workObject.id,
      workObjectName: workObject.name,
    })),
  );
}

function resolveRelations(workObjects, data) {
  const ids = unique(workObjects.flatMap((workObject) => workObject.associatedRel ?? []));
  return ids.map((id) => data.relations.find((relation) => relation.id === id) ?? {
    id,
    status: 'REFERENCIADA_NO_EXPANDIDA',
    source: 'workObject.associatedRel',
  });
}

function resolveRisks(workObjects, nodes, domains, data) {
  const ids = unique([
    ...workObjects.flatMap((workObject) => workObject.risks ?? []),
    ...nodes.flatMap((node) => node.riskIds ?? []),
    ...domains.flatMap((domain) => domain.riskIds ?? []),
  ]);

  const known = [];
  const notes = [];
  for (const id of ids) {
    const risk = data.risks.find((item) => item.id === id);
    if (risk) known.push(risk);
    else notes.push(id);
  }
  return { known, notes };
}

function resolveRuntime(workObjects, domains, data) {
  const byDomain = domains.flatMap((domain) => {
    const source = data.territoryData.domains.find((item) => item.id === domain.id);
    return source?.runtimeIds ?? [];
  });
  const byText = data.runtimeObjects
    .filter((runtime) => {
      const needle = normalizeText(runtime.id);
      return workObjects.some((workObject) => normalizeText(JSON.stringify(workObject)).includes(needle));
    })
    .map((runtime) => runtime.id);

  const ids = unique([...byDomain, ...byText]);
  return ids.map((id) => data.runtimeObjects.find((runtime) => runtime.id === id)).filter(Boolean);
}

function resolveChecklist(workObjectIds, runtimeObjects, risks, checklistItems) {
  const lookup = new Set([
    ...workObjectIds.map((id) => `workObject:${id}`),
    ...runtimeObjects.map((runtime) => `runtimeObject:${runtime.id}`),
    ...risks.map((risk) => `risk:${risk.id}`),
  ]);

  return checklistItems.filter((item) => lookup.has(`${item.sourceType}:${item.sourceId}`));
}

function compactLiveData(liveData) {
  if (!liveData) return { estado: 'NO_DISPONIBLE' };
  return {
    estado: 'DISPONIBLE_SI_LA_SALA_LO_PROVEE',
    source: liveData.source ?? null,
    municipio: liveData.municipio ?? liveData.municipioActivo ?? null,
    updatedAt: liveData.updatedAt ?? null,
    keys: typeof liveData === 'object' ? Object.keys(liveData).slice(0, 12) : [],
  };
}

export function resolveContext(workObjectIds, { data, checklistItems = [], liveData = null, instruction = '', selected = null } = {}) {
  const ids = unique(workObjectIds);
  const workObjects = ids.map((id) => data.workObjects.find((item) => item.id === id)).filter(Boolean);
  const domains = resolveDomainContext(ids, data);
  const panopticoNodes = resolvePanopticoNodes(ids, data);
  const codeRefs = resolveCodeRefs(workObjects);
  const relations = resolveRelations(workObjects, data);
  const riskBundle = resolveRisks(workObjects, panopticoNodes, domains, data);
  const runtimeObjects = resolveRuntime(workObjects, domains, data);
  const checklist = resolveChecklist(ids, runtimeObjects, riskBundle.known, checklistItems);
  const relevance = classifyWorkObjectRelevance(ids, { data, instruction, selected });

  return {
    generatedAt: new Date().toISOString(),
    workObjectIds: ids,
    workObjects,
    relevance,
    domains,
    panopticoNodes,
    codeRefs,
    relations,
    risks: riskBundle.known,
    riskNotes: riskBundle.notes,
    runtimeObjects,
    checklist,
    liveData: compactLiveData(liveData),
    source: 'COU ensamblado bajo demanda desde salaData + checklist + liveData',
  };
}

// Clasificador de intención — 6 categorías en orden de prioridad.
// El orden importa: "prompt para reparar" debe activar prompt, no intervencion.
const INTENT_PATTERNS = [
  ['prompt',       /(prompt|genera.*prompt|prepara.*prompt|instruccion.*para.*reparar)/],
  ['impacto',      /(rompe|romperse|romper|eliminar|borrar|quitar|quito|depende|dependencias|consumidores|impacto|afecta|afectaria|consecuencias|que.*pasa.*si|riesgos.*si|riesgo.*eliminar|que.*rompe)/],
  ['localizacion', /(donde|se.*guarda|se.*guarda|ubicacion|muéstrame|muestrame|localiza)/],
  ['intervencion', /(arregla|repara|corrige|soluciona|ocupate|ocupa|arreglar|reparar|corregir|solucionar)/],
  ['comprension',  /(entender|entiendo|explica|explicame|comprender|que.*es\b|que.*hace\b|que.*produce|que.*genera|como.*funciona|para que sirve)/],
];

function inferIntent(instruction) {
  const n = normalizeText(instruction);
  for (const [intent, pattern] of INTENT_PATTERNS) {
    if (pattern.test(n)) return intent;
  }
  return 'analisis';
}

// ── Estado del sistema (semáforo operativo desde el COU) ─────────────────

function computeEstadoSistema(cou) {
  const hasCritico = cou.risks.some((r) => r.severity === 'CRITICO');
  const hasRuntime = cou.runtimeObjects.length > 0;
  const hasPersistencia = cou.runtimeObjects.some(
    (r) => r.persistence && r.persistence !== 'No aplica' && r.persistence !== 'No gobernada por la Sala',
  );
  const hasRehidratacion = cou.runtimeObjects.some(
    (r) => r.rehydration && !r.rehydration.toLowerCase().startsWith('no'),
  );
  const hasConsumidores = cou.relations.length > 0;
  return [
    { id: 'riesgo_critico',  label: 'Riesgo crítico detectado',            active: hasCritico },
    { id: 'persistencia',    label: 'Persistencia afectada',               active: hasPersistencia },
    { id: 'runtime',         label: 'Runtime implicado',                   active: hasRuntime },
    { id: 'rehidratacion',   label: 'Rehidratación implicada',             active: hasRehidratacion },
    { id: 'consumidores',    label: 'Consumidores potencialmente afectados', active: hasConsumidores },
  ];
}

// ── Constructores de respuesta — uno por intención ───────────────────────

function buildRespuestaIntervencion(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreName = coreObj?.name ?? 'el componente';
  const mainRisk = cou.risks.find((r) => r.severity === 'CRITICO') ?? cou.risks[0];
  const mainRef = cou.codeRefs[0];
  const directNames = (cou.relevance?.direct ?? []).slice(0, 3).map((i) => i.name).filter(Boolean);
  const hasFirebase = cou.runtimeObjects.some((r) =>
    (r.persistence ?? '').toLowerCase().includes('firebase') ||
    (r.classification ?? '').toLowerCase().includes('firebase'),
  );

  const dependencias = (coreObj?.consumes ?? []).slice(0, 4).join(', ');
  const runtimeInfo = cou.runtimeObjects.slice(0, 2)
    .map((r) => `${r.id} — ${r.persistence ?? 'sin persistencia documentada'}`)
    .join('; ');

  const seccionesAdicionales = [];
  if (dependencias) seccionesAdicionales.push({ titulo: 'Dependencias (consume)', contenido: dependencias });
  if (runtimeInfo) seccionesAdicionales.push({ titulo: 'Runtime / Persistencia', contenido: runtimeInfo });
  if (directNames.length) seccionesAdicionales.push({ titulo: 'Verificar regresiones en', contenido: directNames.join(', ') });

  const plan = [
    mainRef ? `Localizar punto de código: ${mainRef.identifier}${mainRef.line ? ` en ${mainRef.file}:${mainRef.line}` : ''}.` : `Abrir la ficha de "${coreName}" en Vista Nodo.`,
    hasFirebase ? 'Comprobar Firebase antes y después del cambio.' : null,
    mainRisk ? `Validar que el riesgo "${mainRisk.id}" queda mitigado tras la intervención.` : null,
    directNames.length ? `Verificar regresiones en: ${directNames.join(', ')}.` : null,
  ].filter(Boolean);

  return {
    declaracion: `He localizado el punto de intervención en ${coreName} y preparado el contexto técnico para actuar.`,
    diagnostico: `${coreName}: ${coreObj?.function?.split('.')[0] ?? 'componente operativo de COMPÁS'}.`,
    riesgoPrincipal: mainRisk?.title ?? cou.riskNotes[0] ?? 'Sin riesgos críticos documentados en este COU.',
    planActuacion: plan,
    proximoPaso: `Abre la ficha de ${coreName} en la Sala y verifica Firebase antes de cualquier modificación.`,
    mostrarEstadoSistema: true,
    seccionesAdicionales,
  };
}

function buildRespuestaComprension(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreName = coreObj?.name ?? 'el objeto consultado';
  const domain = coreObj?.group ?? cou.domains[0]?.label ?? 'COMPÁS';

  const entradas = (coreObj?.consumes ?? []).slice(0, 4).join(', ');
  const salidas = (coreObj?.produces ?? []).slice(0, 4).join(', ');
  const nodosRelacionados = cou.panopticoNodes.slice(0, 2).map((n) => n.name).join(', ');
  const impactoSiFalla = coreObj?.breaksIfFails;

  const seccionesAdicionales = [];
  if (entradas) seccionesAdicionales.push({ titulo: 'Entradas (consume)', contenido: entradas });
  if (salidas) seccionesAdicionales.push({ titulo: 'Salidas (produce)', contenido: salidas });
  if (nodosRelacionados) seccionesAdicionales.push({ titulo: 'Contexto en COMPÁS', contenido: `Nodo semántico: ${nodosRelacionados}` });
  if (impactoSiFalla) seccionesAdicionales.push({ titulo: 'Impacto si falla', contenido: impactoSiFalla });

  return {
    declaracion: `${coreName} es un componente del dominio ${domain}. Te explico qué es, qué hace y cómo encaja en COMPÁS.`,
    diagnostico: coreObj?.function ?? `${coreName} es un componente de COMPÁS sin descripción funcional disponible en el COU.`,
    riesgoPrincipal: null,
    planActuacion: [
      entradas ? `Consume: ${entradas}.` : null,
      salidas ? `Produce: ${salidas}.` : null,
      `Abre la Vista Nodo de ${coreName} para explorar sus relaciones ENT completas.`,
    ].filter(Boolean),
    proximoPaso: `Si quieres ver cómo ${coreName} se integra con el resto del sistema, navega a Vista Nodo → ${coreName}.`,
    mostrarEstadoSistema: false,
    seccionesAdicionales,
  };
}

function buildRespuestaPrompt(encargo, cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreNames = (cou.relevance?.core ?? []).map((i) => i.name).join(', ') || 'el contexto activo';
  const riskSummary = cou.risks.slice(0, 2).map((r) => r.title).join('; ');
  const codePoints = cou.codeRefs.slice(0, 4)
    .map((r) => `${r.identifier}${r.line ? ` (l.${r.line})` : ''}`)
    .join(', ');
  const promptText = [
    'Actúa como auditor técnico experto en COMPÁS (Sistema de Planificación Local en Salud).',
    '',
    `Objeto de análisis: ${coreNames}.`,
    riskSummary ? `Riesgos documentados: ${riskSummary}.` : '',
    codePoints ? `Puntos de código relevantes: ${codePoints}.` : '',
    '',
    `Instrucción del operador: "${encargo.instruccionOriginal}"`,
    '',
    'Responde con: (1) diagnóstico del estado, (2) pasos mínimos de intervención,',
    '(3) verificaciones antes y después.',
    'Basa tu respuesta exclusivamente en las evidencias del contexto. No inventes dependencias.',
  ].filter((s) => s !== undefined).join('\n');
  return {
    declaracion: `He generado un prompt operativo basado en el contexto de ${coreNames}.`,
    diagnostico: promptText,
    riesgoPrincipal: 'El prompt usa evidencias del COU. Si el contexto es insuficiente, el resultado puede ser parcial.',
    planActuacion: [
      'Copiar el prompt del bloque diagnóstico a continuación.',
      'Pegarlo en Claude Code como instrucción directa.',
      'Revisar la propuesta antes de ejecutar cualquier intervención.',
    ],
    proximoPaso: 'Copia el prompt y úsalo en Claude Code para ejecutar la intervención.',
    mostrarEstadoSistema: false,
    seccionesAdicionales: [],
  };
}

function buildRespuestaAnalisis(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreName = coreObj?.name ?? 'componente activo';
  return {
    declaracion: `He analizado el estado de ${coreName} en el sistema.`,
    diagnostico: coreObj?.function ?? 'Objeto identificado. Consulta el contexto técnico para más detalle.',
    riesgoPrincipal: cou.risks[0]?.title ?? cou.riskNotes[0] ?? 'No se detectaron riesgos críticos en el COU actual.',
    planActuacion: [
      `Revisar el Checklist de gobierno para ver la valoración actual de ${coreName}.`,
      'Decidir si procede intervención, documentación o cierre.',
    ],
    proximoPaso: `Abre el expediente de ${coreName}, revisa los riesgos y decide la próxima acción.`,
    mostrarEstadoSistema: true,
    seccionesAdicionales: [],
  };
}

function buildRespuestaImpacto(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreName = coreObj?.name ?? 'el objeto consultado';

  const directDeps = (cou.relevance?.direct ?? []).slice(0, 5).map((d) => d.name).filter(Boolean);
  const consumidores = cou.relations.slice(0, 4)
    .map((r) => `${r.relationType ?? 'relacionado'} → ${r.target ?? r.id}`)
    .join('; ');
  const runtimeAfectado = cou.runtimeObjects
    .filter((r) => r.persistence && r.persistence !== 'No aplica' && r.persistence !== 'No gobernada por la Sala')
    .map((r) => `${r.id}: ${r.persistence}`)
    .join('; ');
  const mainRisk = cou.risks.find((r) => r.severity === 'CRITICO') ?? cou.risks[0];

  const seccionesAdicionales = [];
  if (directDeps.length) seccionesAdicionales.push({ titulo: 'Objetos directamente afectados', contenido: directDeps.join(', ') });
  if (consumidores) seccionesAdicionales.push({ titulo: 'Consumidores documentados', contenido: consumidores });
  if (runtimeAfectado) seccionesAdicionales.push({ titulo: 'Persistencia afectada', contenido: runtimeAfectado });

  return {
    declaracion: `He analizado el impacto de modificar o eliminar ${coreName}. Aquí están las consecuencias documentadas en el COU.`,
    diagnostico: coreObj?.breaksIfFails
      ? `Si ${coreName} falla o se elimina: ${coreObj.breaksIfFails}`
      : `La eliminación de ${coreName} afectaría a los componentes relacionados documentados en este COU.`,
    riesgoPrincipal: mainRisk?.title ?? 'Sin riesgos críticos explícitos documentados para este objeto.',
    planActuacion: [
      `Revisar quién consume ${coreName} antes de cualquier cambio.`,
      directDeps.length ? `Comprobar el estado de: ${directDeps.slice(0, 3).join(', ')}.` : null,
      cou.runtimeObjects.length ? 'Auditar los runtime objects asociados antes de proceder.' : null,
      'Evaluar si los consumidores tienen fallback o degradación controlada.',
      'Documentar la decisión antes de proceder.',
    ].filter(Boolean),
    proximoPaso: `Revisa los consumidores y relaciones de ${coreName} en Vista Relaciones antes de actuar.`,
    mostrarEstadoSistema: true,
    seccionesAdicionales,
  };
}

function buildRespuestaLocalizacion(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const coreName = coreObj?.name ?? 'el objeto consultado';
  const ubicacion = coreObj?.location ?? 'Sin ubicación funcional documentada';

  const codeRefLines = cou.codeRefs.slice(0, 5)
    .map((r) => `${r.identifier}${r.line ? ` — ${r.file}:${r.line}` : ` — ${r.file}`}`)
    .join('\n');
  const persistenciaInfo = cou.runtimeObjects
    .filter((r) => r.persistence && r.persistence !== 'No aplica')
    .map((r) => `${r.id}: ${r.persistence}`)
    .join('; ');

  const seccionesAdicionales = [];
  seccionesAdicionales.push({ titulo: 'Ubicación funcional', contenido: ubicacion });
  if (codeRefLines) seccionesAdicionales.push({ titulo: 'Puntos de código', contenido: codeRefLines });
  if (persistenciaInfo) seccionesAdicionales.push({ titulo: 'Dónde persiste', contenido: persistenciaInfo });

  return {
    declaracion: `He localizado ${coreName} en el sistema. Aquí están sus referencias, ubicación y puntos de acceso.`,
    diagnostico: `${coreName} se encuentra en: ${ubicacion}. ${coreObj?.function?.split('.')[0] ?? ''}`.trim().replace(/\.$/, '') + '.',
    riesgoPrincipal: null,
    planActuacion: [
      `Ubicación en la interfaz: ${ubicacion}.`,
      cou.codeRefs[0] ? `Punto de código principal: ${cou.codeRefs[0].identifier}.` : null,
      persistenciaInfo ? `Persistencia documentada: ${cou.runtimeObjects[0]?.persistence ?? 'ver sección Persistencia'}.` : 'Sin persistencia directa documentada.',
    ].filter(Boolean),
    proximoPaso: `Navega a "${ubicacion}" en la aplicación para acceder directamente a ${coreName}.`,
    mostrarEstadoSistema: false,
    seccionesAdicionales,
  };
}

function buildRespuestaBajaConfianza(encargo, cou) {
  const candidatos = cou.relevance?.candidatos ?? [];
  const listaStr = candidatos.length
    ? candidatos.slice(0, 5).map((c) => `"${c.name}" (${c.score} pts)`).join(', ')
    : 'ninguno detectado';
  return {
    declaracion: `No he podido identificar con confianza el componente al que te refieres en "${encargo.instruccionOriginal}".`,
    diagnostico: `Candidatos detectados por puntuación: ${listaStr}. Ninguno supera el umbral de confianza (${CONFIDENCE_THRESHOLD} pts).`,
    riesgoPrincipal: 'Sin objeto identificado no es posible construir un diagnóstico fiable ni un plan de actuación.',
    planActuacion: [
      'Reformula la consulta usando el nombre exacto del componente (p.ej. "Agenda Kanban", "Firebase", "Compilador PLS").',
      'O selecciona primero el objeto en el Explorador o en Vista Nodo y vuelve a lanzar el encargo.',
      'Candidatos cercanos disponibles en el acordeón "Contexto".',
    ],
    proximoPaso: 'Reformula o selecciona el objeto antes de crear el expediente.',
    mostrarEstadoSistema: false,
    seccionesAdicionales: [],
  };
}

export function buildSimulatedResponse(encargo, cou) {
  const isLowConfidence = !!(cou.relevance?.lowConfidence && (cou.relevance?.core?.length ?? 0) === 0);
  const ambiguous = cou.relevance?.ambiguous ?? false;
  const alternativeIds = cou.relevance?.alternativeIds ?? [];
  const perspective = isLowConfidence ? 'baja_confianza' : inferIntent(encargo.instruccionOriginal);
  const coreObj = cou.relevance?.core?.[0] ?? null;

  let respuesta;
  if (perspective === 'baja_confianza') respuesta = buildRespuestaBajaConfianza(encargo, cou);
  else if (perspective === 'prompt')      respuesta = buildRespuestaPrompt(encargo, cou);
  else if (perspective === 'impacto')     respuesta = buildRespuestaImpacto(cou);
  else if (perspective === 'localizacion') respuesta = buildRespuestaLocalizacion(cou);
  else if (perspective === 'intervencion') respuesta = buildRespuestaIntervencion(cou);
  else if (perspective === 'comprension')  respuesta = buildRespuestaComprension(cou);
  else                                     respuesta = buildRespuestaAnalisis(cou);

  // Si hay ambigüedad, añadir nota en la declaración sin alterar el diagnóstico
  if (ambiguous && alternativeIds.length > 0) {
    const altNames = alternativeIds
      .map((id) => cou.workObjects.find((w) => w.id === id)?.name ?? id)
      .join(', ');
    respuesta.declaracion = `${respuesta.declaracion} (Alternativas cercanas detectadas: ${altNames} — consulta el panel de candidatos para aclarar.)`;
  }

  const isPrompt = perspective === 'prompt';
  const codigoRelevante = cou.codeRefs.slice(0, 6).map(
    (r) => `${r.identifier}${r.line ? ` · ${r.file}:${r.line}` : ` · ${r.file}`}`,
  );
  const productos = [
    'Expediente IA local creado en memoria de sesión.',
    'COU ensamblado sin duplicar objetos base.',
    'Respuesta operativa generada según perspectiva.',
    ...(isPrompt ? ['Prompt base generado y disponible en el expediente.'] : []),
  ];

  return {
    provider: 'SIMULADO_LOCAL_V0',
    perspective,
    // Respuesta estructurada
    declaracion:      respuesta.declaracion,
    diagnostico:      respuesta.diagnostico,
    riesgoPrincipal:  respuesta.riesgoPrincipal,
    planActuacion:    respuesta.planActuacion,
    proximoPaso:      respuesta.proximoPaso,
    estadoSistema:    computeEstadoSistema(cou),
    // Objeto núcleo para navegación
    objetoNucleo: coreObj ? {
      name: coreObj.name, group: coreObj.group,
      criticality: coreObj.criticality ?? null, workObjectId: coreObj.id,
    } : null,
    codigoRelevante,
    promptGenerado: isPrompt ? respuesta.diagnostico : null,
    // Retrocompatibles
    resumen: respuesta.declaracion,
    evidencias: [
      `${cou.workObjects.length} workObject(s) en COU`,
      `relevancia: ${cou.relevance?.core?.length ?? 0} core / ${cou.relevance?.direct?.length ?? 0} direct`,
      `${cou.codeRefs.length} codeRef(s)`,
      `${cou.risks.length} riesgo(s)`,
    ],
    riesgos: [
      ...cou.risks.map((r) => `${r.id}: ${r.title}`),
      ...cou.riskNotes.map((n) => `Nota: ${n}`),
    ],
    productos,
    siguienteAccionHumana: respuesta.proximoPaso,
    // Campos de resolución semántica
    ambiguous,
    alternativeIds,
    // Campos de intención adaptativa
    seccionesAdicionales: respuesta.seccionesAdicionales ?? [],
    mostrarEstadoSistema: respuesta.mostrarEstadoSistema ?? true,
  };
}

export function createExpediente(encargo, cou, simulatedResponse) {
  return {
    id: encargo.expedienteId,
    objetivo: encargo.titulo,
    estado: EXPEDIENTE_ESTADOS.simulado,
    // Unidad de trabajo enriquecida
    hipotesis: simulatedResponse.diagnostico ?? simulatedResponse.declaracion,
    planIntervencion: simulatedResponse.planActuacion ?? [],
    verificacionesPendientes: [],
    verificacionesCompletadas: [],
    riesgosIdentificados: cou.risks.map((r) => ({ id: r.id, title: r.title, severity: r.severity })),
    decisionesTomadas: [],
    // Datos de soporte
    contexto: cou,
    evidencias: simulatedResponse.evidencias,
    riesgos: simulatedResponse.riesgos,
    productosGenerados: simulatedResponse.productos,
    historial: [
      { at: encargo.fecha, actor: 'operador', event: 'encargo_creado', text: encargo.instruccionOriginal },
      { at: new Date().toISOString(), actor: 'ia-operativa-v0', event: 'respuesta_generada', text: simulatedResponse.declaracion },
    ],
    respuesta: simulatedResponse,
  };
}

// ── Contrato de contexto para IA (AiContext) ─────────────────────────────
//
// Serializa todo lo que COMPÁS sabe sobre el encargo en una estructura
// autocontenida que un LLM puede consumir sin conocer las APIs de la Sala.
//
// Responsabilidades de COMPÁS (aquí): localizar, verificar, estructurar.
// Responsabilidades del LLM (en el proveedor): interpretar, explicar, razonar.
export function buildAIContext(encargo, cou) {
  const coreObj = cou.relevance?.core?.[0] ?? null;
  const intent = inferIntent(encargo.instruccionOriginal);
  const topScore = cou.relevance?.candidatos?.[0]?.score ?? 0;
  const confidenceState = cou.relevance?.lowConfidence
    ? 'baja_confianza'
    : (cou.relevance?.ambiguous ? 'ambiguo' : (coreObj ? 'resuelto' : 'sin_objeto'));

  return {
    // ── Encargo ───────────────────────────────────────────────────────────
    instruction: encargo.instruccionOriginal,
    intent,

    // ── Resolución semántica ──────────────────────────────────────────────
    selectedObject: coreObj ? {
      id:           coreObj.id,
      name:         coreObj.name,
      group:        coreObj.group,
      criticality:  coreObj.criticality  ?? null,
      function:     coreObj.function     ?? null,
      location:     coreObj.location     ?? null,
      consumes:     coreObj.consumes     ?? [],
      produces:     coreObj.produces     ?? [],
      breaksIfFails:coreObj.breaksIfFails ?? null,
    } : null,
    confidence: {
      score:     topScore,
      threshold: CONFIDENCE_THRESHOLD,
      state:     confidenceState,
    },
    ambiguous:      cou.relevance?.ambiguous      ?? false,
    candidates:    (cou.relevance?.candidatos     ?? []).slice(0, 5).map((c) => ({
      id: c.id, name: c.name, group: c.group, score: c.score,
    })),
    alternativeIds: cou.relevance?.alternativeIds ?? [],

    // ── COU compacto ──────────────────────────────────────────────────────
    cou: {
      workObjects: cou.workObjects.map((wo) => ({
        id:           wo.id,
        name:         wo.name,
        group:        wo.group,
        function:     wo.function     ?? null,
        location:     wo.location     ?? null,
        consumes:     wo.consumes     ?? [],
        produces:     wo.produces     ?? [],
        engines:      wo.engines      ?? [],
        breaksIfFails:wo.breaksIfFails ?? null,
        criticality:  wo.criticality  ?? null,
      })),
      domains: cou.domains.map((d) => ({ id: d.id, label: d.label })),
      panopticoNodes: cou.panopticoNodes.map((n) => ({
        id: n.id, name: n.name, summary: n.summary ?? null,
      })),
      relations: cou.relations.slice(0, 12).map((r) => ({
        id: r.id, relationType: r.relationType ?? null,
        target: r.target ?? null, status: r.status ?? null,
      })),
    },

    // ── Técnico ───────────────────────────────────────────────────────────
    risks: cou.risks.map((r) => ({
      id: r.id, title: r.title, severity: r.severity, status: r.status ?? null,
    })),
    riskNotes: cou.riskNotes,
    codeRefs: cou.codeRefs.map((r) => ({
      identifier: r.identifier, file: r.file,
      line: r.line ?? null, workObjectName: r.workObjectName ?? null,
    })),
    runtimeObjects: cou.runtimeObjects.map((r) => ({
      id: r.id, classification: r.classification ?? null,
      persistence: r.persistence ?? null, rehydration: r.rehydration ?? null,
    })),
    checklist: cou.checklist.slice(0, 20).map((item) => ({
      id: item.id, sourceId: item.sourceId,
      assessment: item.assessment, notes: item.notes ?? null,
    })),

    // ── Contexto vivo ─────────────────────────────────────────────────────
    liveData:     cou.liveData     ?? null,
    municipality: cou.liveData?.municipio ?? null,

    // ── Metadatos ─────────────────────────────────────────────────────────
    metadata: {
      generatedAt:       new Date().toISOString(),
      systemVersion:     'COMPAS-IA-R1',
      couSource:         cou.source ?? 'COU generado bajo demanda desde salaData',
      totalWorkObjects:  cou.workObjects.length,
      totalRelations:    cou.relations.length,
      totalRisks:        cou.risks.length,
      totalCodeRefs:     cou.codeRefs.length,
    },
  };
}

// ── Punto único de sustitución de proveedor ───────────────────────────────
//
// Si el proveedor activo es 'simulado' (defecto) → buildSimulatedResponse().
// Si el proveedor activo es cualquier otro → buildAIContext() + callAIProvider().
//
// Para activar un LLM real:
//   1. Registrar: registerProvider('claude', myFn)  [en aiProvider.js o en App.jsx]
//   2. Activar:   setActiveProvider('claude')       [antes de crear el primer encargo]
export async function runOperationalAi(encargo, cou) {
  const provider = getActiveProvider();
  let raw;

  if (provider === 'simulado') {
    // Ruta simulada: motor de plantillas local (sin red)
    raw = buildSimulatedResponse(encargo, cou);
  } else {
    // Ruta real: cualquier proveedor registrado recibe el AiContext estructurado
    const aiContext = buildAIContext(encargo, cou);
    raw = await callAIProvider(aiContext);
  }

  // SIEMPRE normalizar: garantiza que la UI nunca recibe un campo undefined
  return normalizeAIResponse(raw, {
    source:    provider,
    simulated: provider === 'simulado',
  });
}
