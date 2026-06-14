// IA Operativa v0: infraestructura local, simulada y sin llamadas externas.
// No duplica los objetos base; el COU se ensambla bajo demanda desde salaData.

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

const aliasWorkObjects = {
  'wo-agenda': ['agenda', 'agenda anual', 'acciones agenda', 'accionesagenda', 'kanban', 'implantacion', 'implantación'],
  'wo-firebase': ['firebase', 'persistencia', 'rehidratacion', 'rehidratación', 'guardar', 'recuperar'],
  'wo-ibse': ['ibse', 'bienestar socioemocional', 'iss emocional', 'ciudadania emocional'],
  'wo-estudios': ['estudios', 'estudios complementarios', 'determinantes', 'indicadores csv'],
  'wo-compilador': ['compilador', 'documento pls', 'pls', 'plan local de salud'],
  'wo-documento-pls': ['documento pls', 'plan local de salud', 'pleno municipal', 'documento final'],
  'wo-contextoia': ['contextoia', 'contexto ia', 'contexto operativo', 'cou'],
  'wo-motor-plan': ['propuesta ia', 'motor plan', 'motor propuesta', 'prompt'],
  'wo-municipio': ['municipio', 'municipio activo', 'cambio de municipio'],
  'wo-evaluacion': ['evaluacion', 'evaluación', 'fase 6'],
};

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

export function classifyWorkObjectRelevance(workObjectIds, { data, instruction = '', selected = null } = {}) {
  const ids = unique(workObjectIds);
  const normalized = normalizeText(instruction);
  const tokens = tokenize(instruction);
  const byId = Object.fromEntries(data.workObjects.map((item) => [item.id, item]));
  const coreIds = [];

  for (const id of ids) {
    const workObject = byId[id];
    if (!workObject) continue;
    if (!instruction || hasAliasHit(id, normalized) || normalized.includes(normalizeText(workObject.name))) {
      coreIds.push(id);
    }
  }

  if (coreIds.length === 0 && selected?.type === 'workObject' && ids.includes(selected.id)) {
    coreIds.push(selected.id);
  }

  if (coreIds.length === 0 && ids.length > 0) {
    coreIds.push(ids[0]);
  }

  const directSiblingIds = siblingIdsFromCore(coreIds, data);
  const buckets = { core: [], direct: [], extended: [], documentary: [] };

  for (const id of ids) {
    const workObject = byId[id];
    if (!workObject) continue;

    if (coreIds.includes(id)) {
      buckets.core.push(relevanceItem(workObject, 'core', 'coincidencia directa con el encargo'));
    } else if (directSiblingIds.has(id) || matchDirectIdentity(workObject, normalized, tokens)) {
      buckets.direct.push(relevanceItem(workObject, 'direct', 'contexto directo del nucleo'));
    } else if (matchExtendedEvidence(workObject, tokens)) {
      buckets.extended.push(relevanceItem(workObject, 'extended', 'contexto ampliado por evidencias del objeto'));
    } else {
      buckets.documentary.push(relevanceItem(workObject, 'documentary', 'contexto documental asociado'));
    }
  }

  return buckets;
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

function inferPerspective(instruction) {
  const normalized = normalizeText(instruction);
  if (/(arregla|repara|corrige|soluciona|ocupate|ocupa)/.test(normalized)) return 'preparacion_de_intervencion';
  if (/(prompt|instruccion|encargo)/.test(normalized)) return 'preparacion_de_prompt';
  if (/(entiendo|entender|explica|comprender)/.test(normalized)) return 'comprension_operativa';
  return 'analisis_operativo';
}

// ── Constructores de respuesta diferenciada por perspectiva ─────────────

function buildRespuestaIntervencion(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? cou.workObjects[0];
  const mainRisk = cou.risks[0];
  const riskLine = mainRisk
    ? mainRisk.title
    : (cou.riskNotes[0] ?? 'No se han detectado riesgos normalizados en el COU.');
  const cadena = [
    ...(coreObj?.consumes ?? []).slice(0, 2),
    ...(coreObj?.produces ?? []).slice(0, 2),
  ].filter(Boolean).join(' → ');
  return {
    declaracion: 'He localizado el componente responsable.',
    desarrollo: riskLine + (cadena ? ` Cadena implicada: ${cadena}.` : ''),
    accion: `Auditar ${coreObj?.name ?? 'el componente'} y sus dependencias directas antes de modificar código.`,
  };
}

function buildRespuestaComprension(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? cou.workObjects[0];
  const funcResumen = coreObj?.function?.split('.')[0] ?? `${coreObj?.name ?? 'El objeto'} es un componente de COMPÁS.`;
  const consumes = (coreObj?.consumes ?? []).slice(0, 3).join(', ');
  const produces = (coreObj?.produces ?? []).slice(0, 3).join(', ');
  return {
    declaracion: funcResumen,
    desarrollo: [
      consumes ? `Consume: ${consumes}.` : '',
      produces ? `Produce: ${produces}.` : '',
    ].filter(Boolean).join(' '),
    accion: coreObj?.breaksIfFails ?? 'Consulta las relaciones asociadas en la Vista Nodo para profundizar.',
  };
}

function buildRespuestaPrompt(encargo, cou) {
  const coreNames = (cou.relevance?.core ?? []).map((i) => i.name).join(', ') || 'el contexto activo';
  const riskSummary = cou.risks.slice(0, 2).map((r) => r.title).join('; ');
  const codePoints = cou.codeRefs.slice(0, 4)
    .map((r) => `${r.identifier}${r.line ? ` (l.${r.line})` : ''}`)
    .join(', ');
  const prompt = [
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
    declaracion: 'Prompt generado basado en el contexto operativo.',
    desarrollo: prompt,
    accion: 'Copia este prompt y úsalo con Claude Code para ejecutar la intervención.',
  };
}

function buildRespuestaAnalisis(cou) {
  const coreObj = cou.relevance?.core?.[0] ?? cou.workObjects[0];
  return {
    declaracion: `Análisis de estado: ${coreObj?.name ?? 'componente activo'}.`,
    desarrollo: coreObj?.function ?? 'Objeto identificado. Consulta el contexto técnico para más detalle.',
    accion: 'Revisa el expediente y decide si procede una intervención, ficha quirúrgica o estudio adicional.',
  };
}

export function buildSimulatedResponse(encargo, cou) {
  const perspective = inferPerspective(encargo.instruccionOriginal);
  const coreObj = cou.relevance?.core?.[0] ?? cou.workObjects[0] ?? null;

  let respuestaPrincipal;
  let promptGenerado = null;

  if (perspective === 'preparacion_de_intervencion') {
    respuestaPrincipal = buildRespuestaIntervencion(cou);
  } else if (perspective === 'comprension_operativa') {
    respuestaPrincipal = buildRespuestaComprension(cou);
  } else if (perspective === 'preparacion_de_prompt') {
    respuestaPrincipal = buildRespuestaPrompt(encargo, cou);
    promptGenerado = respuestaPrincipal.desarrollo;
  } else {
    respuestaPrincipal = buildRespuestaAnalisis(cou);
  }

  const codigoRelevante = cou.codeRefs.slice(0, 6).map(
    (r) => `${r.identifier}${r.line ? ` · ${r.file}:${r.line}` : ` · ${r.file}`}`,
  );

  const productos = [
    'Expediente IA local creado en memoria de sesión.',
    'COU ensamblado sin duplicar objetos base.',
    'Respuesta operativa generada según perspectiva.',
    ...(perspective === 'preparacion_de_prompt' ? ['Prompt base generado y disponible en el expediente.'] : []),
  ];

  return {
    provider: 'SIMULADO_LOCAL_V0',
    perspective,
    objetoNucleo: coreObj ? {
      name: coreObj.name,
      group: coreObj.group,
      criticality: coreObj.criticality ?? null,
      workObjectId: coreObj.id,
    } : null,
    respuestaPrincipal,
    codigoRelevante,
    promptGenerado,
    // Campos retrocompatibles para createExpediente
    resumen: respuestaPrincipal.declaracion,
    evidencias: [
      `${cou.workObjects.length} workObject(s) en COU`,
      `relevancia: ${cou.relevance?.core?.length ?? 0} core / ${cou.relevance?.direct?.length ?? 0} direct`,
      `${cou.codeRefs.length} codeRef(s) disponibles`,
      `${cou.risks.length} riesgo(s) normalizados`,
    ],
    riesgos: [
      ...cou.risks.map((r) => `${r.id}: ${r.title}`),
      ...cou.riskNotes.map((n) => `Nota: ${n}`),
    ],
    productos,
    siguienteAccionHumana: respuestaPrincipal.accion,
  };
}

export function createExpediente(encargo, cou, simulatedResponse) {
  return {
    id: encargo.expedienteId,
    objetivo: encargo.titulo,
    contexto: cou,
    evidencias: simulatedResponse.evidencias,
    riesgos: simulatedResponse.riesgos,
    productosGenerados: simulatedResponse.productos,
    historial: [
      {
        at: encargo.fecha,
        actor: 'operador',
        event: 'encargo_creado',
        text: encargo.instruccionOriginal,
      },
      {
        at: new Date().toISOString(),
        actor: 'ia-operativa-v0',
        event: 'respuesta_simulada',
        text: simulatedResponse.resumen,
      },
    ],
    estado: EXPEDIENTE_ESTADOS.simulado,
    respuesta: simulatedResponse,
  };
}

// Punto unico de sustitucion futura: aqui se conectara OpenAI u otro proveedor.
export async function runOperationalAi(encargo, cou) {
  return buildSimulatedResponse(encargo, cou);
}
