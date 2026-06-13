import rawDataset from './compas-dataset-r2.json';

// ── FAZE LOOKUP (derivado de rawDataset.fazes, sin inventar) ─────────────
const bloqueAFaze = {};
for (const faze of rawDataset.fazes) {
  for (const bloque of faze.bloques) {
    bloqueAFaze[bloque] = faze;
  }
}
const FAZE_INFRA = { id: 'INFRA', nombre: 'Infraestructura / Gobierno / Contexto' };
const FAZE_SHORT = {
  FASE_1: 'F1 Navegación',
  FASE_2: 'F2 Perfil Salud',
  FASE_3: 'F3 Plan Acción',
  FASE_4: 'F4 Compilador PLS',
  FASE_5: 'F5 Implantación',
  FASE_6: 'F6 Evaluación',
  INFRA:  'Infraestructura',
};

// ── GUARDRAILS (sin cambio) ───────────────────────────────────────────────
export const guardrails = [
  'Solo lectura',
  'Integrada en COMPÁS — solo lectura',
  'No modifica index.html',
  'No gobierna runtime',
  'No declara Control Total',
];

// ── ARTEFACTOS BASE (sin cambio) ─────────────────────────────────────────
export const artifacts = [
  { id: 'CORPUS-PAN001-R3', type: 'CORPUS', status: 'PRODUCIDO', authority: 'Identidad documental ENT/REL', evidence: 'CORPUS-PAN001-R3.md: ENT-001..ENT-914 / REL-001..REL-576' },
  { id: 'GRAFO-MAESTRO-PAN001-R2', type: 'GRAFO', status: 'PRODUCIDO', authority: 'Topologia, arcos y navegacion', evidence: 'GRAFO-MAESTRO-PAN001-R2.md: nodos, arcos, subgrafos y limites' },
  { id: 'SALA-DE-MANDO-N2', type: 'SALA', status: 'ESPECIFICADA', authority: 'Uso humano, vistas, roles y limites', evidence: 'ESPECIFICACION-DE-SALA-DE-MANDO-N2.md' },
  { id: 'CHK-GLOBAL-002', type: 'CHK', status: 'PRODUCIDO', authority: 'Cobertura global T-2', evidence: 'Cobertura l.1-l.98712, ENT-001/914, REL-001/576' },
  { id: 'ARB-GLOBAL-R3', type: 'ARB', status: 'PRODUCIDO', authority: 'Sintesis global T-3', evidence: 'Integracion BLOQUE-006..025 y REL inter-FASE' },
  { id: 'compas-dataset-r2.json', type: 'DATASET', status: 'PRODUCIDO', authority: 'Fuente de datos real derivada de Corpus + Grafo', evidence: '914 ENT, 576 REL, 25 bloques, 7 subgrafos, 6 FAZEs, 12 limites' },
];

// ── ENTIDADES — 914 nodos reales del dataset con faze derivada ───────────
export const entities = rawDataset.nodos.map((n) => {
  const faze = bloqueAFaze[n.bloque] ?? FAZE_INFRA;
  const fazeShort = FAZE_SHORT[faze.id] ?? faze.id;
  return {
    id: n.id,
    name: `${n.id} · ${fazeShort}`,
    block: n.bloque,
    range: n.lineas,
    source: 'CORPUS-PAN001-R3 / GRAFO-MAESTRO-PAN001-R2',
    type: n.tipo,
    status: n.calificador,
    risks: [],
    regimen: n.regimen,
    faze: faze.id,
    fazeNombre: faze.nombre,
  };
});

// ── RELACIONES — 576 arcos reales del dataset ─────────────────────────────
export const relations = rawDataset.arcos.map((a) => ({
  id: a.id,
  origin: a.source_raw || 'DETALLE_EN_FUENTE',
  relationType: a.tipo_rel || 'RELACION_DOCUMENTADA',
  target: a.target_raw || 'DETALLE_EN_FUENTE',
  source: a.fuente,
  status: a.completo ? 'OBSERVABLE' : 'DOCUMENTAL_EN_FUENTE',
  risks: [],
  modo: a.modo,
  evidencia: a.evidencia,
}));

// ── RIESGOS (sin cambio — contienen severity, title y affects requeridos por las vistas)
export const risks = [
  { id: 'ZC-002', kind: 'ZC', title: 'Limite runtime no resuelto por corpus ni grafo', severity: 'CRITICO', source: 'GRAFO-MAESTRO-PAN001-R2.md:1575 / 2297', affects: ['Runtime', 'Control Total'], status: 'VISIBLE_NO_RESUELTO' },
  { id: 'RT-005', kind: 'RT', title: 'planLocalSalud como efimero falso canonico en compilador PLS', severity: 'CRITICO', source: 'CONTRASTE-RUNTIME-CON-ARB-CORPUS-R1 / Sala N2', affects: ['planLocalSalud', 'Compilador', 'Documento PLS'], status: 'VISIBLE_NO_RESUELTO' },
  { id: 'GAP-PAE-001', kind: 'GAP', title: 'Plan recuperado no reconstruye Agenda automaticamente', severity: 'IMPORTANTE', source: 'ESPECIFICACION-DE-SALA-DE-MANDO-N2.md:630', affects: ['Plan', 'Agenda', 'Evaluacion'], status: 'OBSERVADO' },
  { id: 'GAP-PAE-002', kind: 'GAP', title: 'Evaluacion potencialmente parcial por agenda no sincronizada', severity: 'IMPORTANTE', source: 'Auditorias Plan -> Agenda -> Evaluacion', affects: ['Evaluacion', 'Compilador'], status: 'OBSERVADO' },
  { id: 'DEUDA-CHK-006-007-PROVISIONAL', kind: 'DEUDA', title: 'Deuda heredada de reparacion documental 006/007', severity: 'MENOR', source: 'CORPUS-PAN001-R3.md:1633', affects: ['CAP-006', 'CAP-007'], status: 'HEREDADA' },
  { id: 'LIMITE-CONTROL-TOTAL', kind: 'LIMITE', title: 'Control Total no declarado', severity: 'CRITICO', source: 'CORPUS-PAN001-R3.md:1638 / Sala N0', affects: ['Gobierno runtime', 'Sala'], status: 'DECLARADO' },
];

// ── OBJETOS RUNTIME (sin cambio — no existen en dataset estructural) ──────
export const runtimeObjects = [
  { id: 'planLocalSalud', classification: 'HÍBRIDO / ACUMULADOR / EFÍMERO / PROYECCIÓN', authority: 'NO FUENTE DE VERDAD COMPLETA', persistence: 'Parcial y dependiente de cadenas observadas', rehydration: 'Parcial; no reconstruccion completa garantizada', risks: ['RT-005', 'GAP-PAE-001'], source: 'ESPECIFICACION-DE-SALA-DE-MANDO-N2.md:525-527' },
  { id: 'ContextoIA', classification: 'PROYECCION / DERIVADO', authority: 'Consume representacion parcial del municipio', persistence: 'No aplica en la Sala de Control Semántico', rehydration: 'Dependiente de fuentes observadas', risks: ['ZC-002'], source: 'Auditorias ContextoIA / Runtime' },
  { id: 'accionesAgenda', classification: 'CACHE / ESTADO RUNTIME', authority: 'Agenda observable', persistence: 'Firebase agenda observado en corpus runtime', rehydration: 'Parcial', risks: ['GAP-PAE-001'], source: 'GRAFO-MAESTRO-PAN001-R2.md:1871' },
  { id: 'propuestaActual', classification: 'EFIMERO / DERIVADO', authority: 'No canonico por si mismo', persistence: 'No garantizada', rehydration: 'No reconstruida automaticamente segun auditorias', risks: ['ZC-002'], source: 'Auditorias de rehidratacion' },
  { id: 'datosFusionPriorizacion', classification: 'DERIVADO', authority: 'Resultado de fusion de priorizacion', persistence: 'No gobernada por la Sala', rehydration: 'Parcial/no observada en esta versión', risks: ['ZC-002'], source: 'Auditorias de priorizacion' },
  { id: 'analisisActual', classification: 'DERIVADO / ESTADO RUNTIME', authority: 'Resultado de analisis actual', persistence: 'No gobernada por la Sala', rehydration: 'Parcial', risks: ['ZC-002'], source: 'Auditorias de rehidratacion' },
  { id: 'analisisActualV3', classification: 'DERIVADO / ESTADO RUNTIME', authority: 'No reconstruido automaticamente en rehidratacion completa', persistence: 'No gobernada por la Sala', rehydration: 'No completa', risks: ['ZC-002'], source: 'Auditorias de rehidratacion R2' },
  { id: 'window.COMPAS.state', classification: 'FUENTE RUNTIME DISTRIBUIDA / STATE CON RESERVAS', authority: 'Runtime, no documental', persistence: 'Fuera del alcance de la Sala', rehydration: 'Fuera del alcance de la Sala', risks: ['ZC-002'], source: 'Especificacion Capa Runtime' },
];

// ── CADENAS — existentes + 7 subgrafos reales del dataset ─────────────────
const subgrafoCadenas = rawDataset.subgrafos.map((s) => ({
  id: s.id,
  name: s.funcion,
  steps: [s.nodos_rango, s.rels_rango],
  status: 'DOCUMENTAL_CONSTITUIDA',
  rupture: 'Sin ruptura estructural en la comunidad documentada.',
  risks: [],
  source: 'GRAFO-MAESTRO-PAN001-R2',
}));

export const chains = [
  { id: 'CADENA-PLAN-AGENDA-EVALUACION-COMPILADOR', name: 'Plan → Agenda → Evaluación → Compilador', steps: ['Plan', 'Agenda', 'Evaluación', 'Compilador', 'Documento PLS'], status: 'PARCIAL_OBSERVADA', rupture: 'Plan recuperado no reconstruye Agenda automaticamente; depende de sincronizacion posterior.', risks: ['GAP-PAE-001', 'RT-005'], source: 'ESPECIFICACION-DE-SALA-DE-MANDO-N2.md:376 / 630' },
  { id: 'CADENA-CAP-CHK-ARB-CORPUS-GRAFO', name: 'CAP → CHK → ARB → Corpus → Grafo', steps: ['CAP', 'CHK', 'ARB', 'CORPUS-PAN001-R3', 'GRAFO-MAESTRO-PAN001-R2'], status: 'DOCUMENTAL_CONSTITUIDA', rupture: 'Sin ruptura estructural para Sala N2; mantiene reservas runtime.', risks: ['ZC-002'], source: 'CORPUS-PAN001-R3 / GRAFO-MAESTRO-PAN001-R2' },
  ...subgrafoCadenas,
];

// ── ROLES (sin cambio) ────────────────────────────────────────────────────
export const roles = [
  { id: 'operador-sala', name: 'Operador/a de Sala', permissions: ['Leer', 'Auditar / marcar revisión'], limits: 'No decide autoridad documental.' },
  { id: 'auditor-documental', name: 'Auditor/a documental', permissions: ['Leer', 'Auditar / marcar revisión'], limits: 'No modifica Corpus ni Grafo.' },
  { id: 'responsable-gobierno', name: 'Responsable de gobierno', permissions: ['Leer', 'Auditar / marcar revisión', 'Decidir / autorizar'], limits: 'Autoriza decisiones humanas, no crea soberania documental.' },
  { id: 'cartografo-compas', name: 'Cartógrafo/a COMPÁS', permissions: ['Leer', 'Auditar / marcar revisión'], limits: 'No recartografía desde la Sala.' },
  { id: 'auditor-runtime', name: 'Auditor/a runtime', permissions: ['Leer', 'Auditar / marcar revisión'], limits: 'Observa runtime documentado, no runtime vivo.' },
  { id: 'equipo-tecnico', name: 'Equipo técnico', permissions: ['Leer', 'Auditar / marcar revisión'], limits: 'No implementa desde la Sala de Control Semántico.' },
  { id: 'grupo-motor', name: 'Decisor institucional / Grupo Motor', permissions: ['Leer', 'Decidir / autorizar'], limits: 'No supera Corpus ni Grafo.' },
  { id: 'lector-externo', name: 'Lector/a externo o validador', permissions: ['Leer'], limits: 'Solo lectura.' },
];

// ── VISTAS (sin cambio) ───────────────────────────────────────────────────
export const views = [
  { id: 'explorador', label: 'Explorador' },
  { id: 'panoptico', label: 'Territorio' },
  { id: 'ejecutiva', label: 'Vista Ejecutiva' },
  { id: 'arbol', label: 'Vista Arbol' },
  { id: 'nodo', label: 'Vista Nodo' },
  { id: 'relaciones', label: 'Vista Relaciones' },
  { id: 'riesgos', label: 'Vista Riesgos' },
  { id: 'runtime', label: 'Vista Runtime' },
  { id: 'cadenas', label: 'Vista Cadenas' },
  { id: 'busqueda', label: 'Busqueda' },
  { id: 'operativa', label: 'Vista Operativa' },
  { id: 'checklist', label: 'Checklist gobierno' },
];

// ── WORK OBJECTS — 24 objetos de gobierno humano ─────────────────────────
export const workObjects = [
  // INICIO
  { id:'wo-municipio', name:'Municipio activo', group:'INICIO', criticality:5,
    function:'Punto de entrada de toda sesión. Establece el municipio activo y desencadena la carga completa desde Firebase. Ejecuta 12+ resets preventivos de globals.',
    location:'Header / FASE 1', consumes:['#municipio selector','estrategia activa','Firebase /municipios'],
    produces:['datosMunicipioActual','reset de 12+ globals (analisisActual, propuestaActual, datosFusionPriorizacion…)'],
    engines:['actualizarMunicipio()'], breaksIfFails:'Todo. Estado anterior contamina el nuevo municipio.',
    associatedEnt:['ENT-452'], associatedRel:['REL-203','REL-205','REL-138'],
    codeRefs:[{identifier:'actualizarMunicipio()',line:16408,file:'index.html'}],
    risks:['Sin municipio → todos los globals contaminados del anterior'] },

  // DIAGNÓSTICO
  { id:'wo-config-estrategica', name:'Configuración estratégica', group:'DIAGNÓSTICO', criticality:3,
    function:'Define la estrategia activa y el marco estratégico municipal (EPVSA, líneas, territorios). Configura constantes usadas por todos los motores.',
    location:'FASE 1 / Modal Configuración', consumes:['ESTRUCTURA_EPVSA (constante global)','estrategia seleccionada'],
    produces:['estrategiaActual','valoresMunicipio','marco estratégico en Firebase'],
    engines:['generarMarcoEstrategico(config)','guardarConfigMarco()'],
    breaksIfFails:'Marco EPVSA incorrecto → propuestas y scores erróneos en toda la cadena.',
    associatedEnt:['ENT-339','ENT-340'], associatedRel:['REL-184','REL-186','REL-187'],
    codeRefs:[{identifier:'generarMarcoEstrategico(config)',line:15294,file:'index.html'}],
    risks:['Marco incorrecto → scoring erróneo en toda la cadena'] },

  { id:'wo-informe-municipal', name:'Informe municipal (Word)', group:'DIAGNÓSTICO', criticality:4,
    function:'Importa el informe de salud municipal en formato Word y lo convierte a HTML vía Mammoth. Fuente primaria del diagnóstico textual (Parte 1 del PLS).',
    location:'FASE 2 / Panel carga datos', consumes:['Archivo .docx (usuario)','CDN Mammoth (l.19)'],
    produces:['datosMunicipioActual.informe.htmlCompleto','HTML en #contenido-informe-dinamico'],
    engines:['Mammoth CDN','cargarInformeWord()'],
    breaksIfFails:'PLS sin perfil textual (Parte 1 vacía).',
    associatedEnt:['ENT-007','ENT-016'], associatedRel:['REL-001','REL-033'],
    codeRefs:[{identifier:'cargarInformeWord()',line:12696,file:'index.html'},{identifier:'.compas-informe-html',line:null,file:'index.html'}],
    risks:['Sin informe → PLS Parte 1 vacía; Parte 1.6 análisis IA depende de analisisActual runtime vs Firebase'] },

  { id:'wo-motor-at2', name:'Motor AT2', group:'DIAGNÓSTICO', criticality:4,
    function:'Motor de análisis estadístico territorial v2. Procesa indicadores, determinantes y datos IBSE. Produce análisis estructurado del municipio base para la propuesta EPVSA.',
    location:'FASE 2 / Tab AT2', consumes:['datosMunicipioActual','indicadores EAS','determinantes','datos IBSE'],
    produces:['analisisActualV3','scores por dimensión','narrativa automática'],
    engines:['at2_generar()','at2_actualizarFuentes()'],
    breaksIfFails:'Propuesta EPVSA sin base analítica. Motor 2 opera con analisisActual obsoleto.',
    associatedEnt:['ENT-041..ENT-092'], associatedRel:['REL-063','REL-064'],
    codeRefs:[], risks:['analisisActualV3 efímero sin rehidratación automática entre sesiones'] },

  { id:'wo-motor-sintesis', name:'Motor síntesis perfil (Motor 1)', group:'DIAGNÓSTICO', criticality:4,
    function:'Motor IA externo (motorSintesisPerfil.js) que genera análisis interpretativo del perfil de salud. Produce analisisActual como síntesis narrativa para el Motor de Plan.',
    location:'FASE 2 / Botón Generar análisis IA', consumes:['ContextoIA (snapshot de globals)','datosMunicipioActual','determinantes'],
    produces:['analisisActual','guardado en Firebase /analisisIA'],
    engines:['motorSintesisPerfil.js (externo)','generarAnalisisIA()','crearContextoIA()'],
    breaksIfFails:'Motor 2 opera en modo degradado. Propuesta EPVSA automática imposible.',
    associatedEnt:[], associatedRel:['REL-059','REL-062'],
    codeRefs:[{identifier:'generarAnalisisIA()',line:null,file:'index.html'}],
    risks:['ContextoIA puede ser parcial o del municipio anterior (silencioso)'] },

  { id:'wo-ibse', name:'IBSE', group:'DIAGNÓSTICO', criticality:3,
    function:'Índice de Bienestar Socioemocional. Tres vías: formulario directo, CSV REDCap, Firebase. SuperMonitor 9 tabs. Componente CB del ISS (×0,25).',
    location:'FASE 2 / Panel IBSE / Modal IBSE v2', consumes:['Respuestas ciudadanas (formulario/CSV/Firebase)','escalas EAS P.57b/P.57c'],
    produces:['datosIBSE','score IBSE individual y agregado','window._ibse_v2_rawData'],
    engines:['calcularIBSE(d)','ibse_v2_calcularIBSE()','ibseSM_abrir()'],
    breaksIfFails:'ISS sin componente CB. ISS incalculable. Evaluación FASE 6 incompleta.',
    associatedEnt:['ENT-799','ENT-831'], associatedRel:['REL-116','REL-035','REL-039'],
    codeRefs:[{identifier:'calcularIBSE(d)',line:65525,file:'index.html'}],
    risks:['Dos implementaciones paralelas (l.65525 e ibse_v2) con riesgo de divergencia de FIX'] },

  { id:'wo-sam', name:'SAM', group:'DIAGNÓSTICO', criticality:3,
    function:'Sistema de Ajuste Muestral. Ajusta estadísticamente los datos de participación ciudadana (RELAS, IBSE, HPC). 4 instancias en FASE 3.',
    location:'FASE 3 / Priorización (×4 instancias)', consumes:['datosParticipacionCiudadana','datos RELAS crudos','tamaños muestrales'],
    produces:['Datos de participación ajustados','pesos estadísticos para scoring FMC V4'],
    engines:['sam_inicializarMonitor()','normalizarParticipacion()'],
    breaksIfFails:'Scores estadísticamente incorrectos. FMC V4 en tarjetas sesgado.',
    associatedEnt:['ENT-093..ENT-223'], associatedRel:['REL-073','REL-322'],
    codeRefs:[{identifier:'normalizarParticipacion()',line:37416,file:'index.html'}],
    risks:['Scores sesgados si SAM no se aplica correctamente antes de la fusión'] },

  { id:'wo-estudios', name:'Estudios complementarios', group:'DIAGNÓSTICO', criticality:2,
    function:'Carga estudios adicionales al informe principal: CSV determinantes, CSV indicadores, texto libre. Enriquecen el perfil de salud municipal.',
    location:'FASE 2 / Acordeón estudios complementarios', consumes:['Archivos CSV (determinantes, indicadores)','texto libre'],
    produces:['datosComplementarios','enriquecimiento de datosMunicipioActual'],
    engines:['cargarDeterminantesCSV()','cargarIndicadoresCSV()','cargarEstudiosComplementarios()'],
    breaksIfFails:'Análisis territorial sin datos específicos del municipio.',
    associatedEnt:['ENT-050..ENT-092'], associatedRel:['REL-044','REL-045','REL-046','REL-047','REL-048','REL-049'],
    codeRefs:[], risks:['Perfil incompleto si no se cargan estudios específicos del municipio'] },

  // PRIORIZACIÓN
  { id:'wo-motor-plan', name:'Motor propuesta IA (Motor 2)', group:'PRIORIZACIÓN', criticality:4,
    function:'Motor IA externo (motorPlanAccion.js) que genera propuesta EPVSA automática. Único punto de import() dinámico del monolito. Con fallback a _generarPropuestaLocal().',
    location:'FASE 3 / Tab Modo Automático', consumes:['ContextoIA','analisisActual/V3','analisis.propuestaEPVSA'],
    produces:['propuestaActual','window.__trazabilidadEjecucionPlan','decisionGeneracionPlan'],
    engines:['motorPlanAccion.js + contextoIA.js (import dinámico)','generarPropuestaIA()','_generarPropuestaLocal()'],
    breaksIfFails:'Sin plan automático → selección manual. Sin propuesta → PLS Parte 2 vacía.',
    associatedEnt:['ENT-744..ENT-761'], associatedRel:['REL-464','REL-470','REL-471','REL-474'],
    codeRefs:[{identifier:'generarPropuestaIA()',line:null,file:'index.html'}],
    risks:['propuestaActual es HUÉRFANO — 3 productores sin precedencia. No persiste como objeto propio.'] },

  { id:'wo-epvsa', name:'Selección EPVSA', group:'PRIORIZACIÓN', criticality:4,
    function:'Selección y priorización de líneas estratégicas EPVSA. Modo manual y automático con Motor 2. Tarjetas con score FMC V4 y 3 modos (tecnocrático/mixto/comunitario).',
    location:'FASE 3 / Tab Selección / Tab Automático', consumes:['propuestaActual','analisisActual','ESTRUCTURA_EPVSA','scores FMC V4'],
    produces:['seleccionAceptada','propuestaAceptada','selección guardada en Firebase'],
    engines:['_compas_calcularScoreFinal()','renderizarPropuestaIA()','selección manual UI'],
    breaksIfFails:'PLS sin plan de acción (Parte 2 vacía). guardarPlanAccionParaCompilador() sin datos.',
    associatedEnt:['ENT-744..ENT-761'], associatedRel:['REL-258'],
    codeRefs:[{identifier:'guardarPlanAccionParaCompilador()',line:9951,file:'index.html'}],
    risks:['Score visual de tarjeta puede ser cosmético y no afectar selección final'] },

  { id:'wo-vrelas', name:'VRELAS (votación temática)', group:'PRIORIZACIÓN', criticality:3,
    function:'Votación ciudadana por temas de salud (líneas EPVSA). Tres vías: CSV REDCap temático, Firebase en tiempo real, formulario presencial.',
    location:'FASE 3 / Priorización Temática', consumes:['Votos ciudadanos (CSV/Firebase/formulario)','COMPAS_VRELAS_A_LE'],
    produces:['datosParticipacionCiudadana.vrelas','prioridades por línea EPVSA'],
    engines:['vrelas_processData()','vrelas_listener (Firebase)','vrelas_importarCSV()'],
    breaksIfFails:'Priorización sin voz ciudadana. SAM sin datos temáticos que ajustar.',
    associatedEnt:['ENT-671..ENT-705'], associatedRel:['REL-071'],
    codeRefs:[], risks:['_VRELAS_A_LE1 es deuda técnica activa con uso parcial — no eliminar'] },

  { id:'wo-hpc', name:'HPC (Hábitos-Problemas-Colectivos)', group:'PRIORIZACIÓN', criticality:3,
    function:'Análisis ciudadano de hábitos de vida, problemas de salud y colectivos vulnerables vía encuesta RELAS. Rankings, cruces, triadas, señales de coherencia. Simulador de escenarios.',
    location:'FASE 3 / RELAS / Motor HPC', consumes:['CSV RELAS (128 campos)','Demo 120 registros sintéticos','Firebase /relas_datos'],
    produces:['window.COMPAS.prioridades.relas','window.__COMPAS_HPC_OUTPUT (rankings/cruces/triadas/señales)'],
    engines:['relas_processData()','relas_computeFreq()','relas_scoreV2 ×10 intervenciones'],
    breaksIfFails:'Priorización sin eje comunitario. Árbol de priorizaciones sin fusión HPC.',
    associatedEnt:['ENT-671..ENT-705'], associatedRel:['REL-066','REL-035'],
    codeRefs:[], risks:['relas_lastSimResult no persiste automáticamente'] },

  { id:'wo-fusion', name:'Fusión de priorizaciones', group:'PRIORIZACIÓN', criticality:4,
    function:'Integra las tres priorizaciones (estratégica EPVSA, temática VRELAS, comunitaria HPC) en una decisión única. Produce datosFusionPriorizacion.',
    location:'FASE 3 / Panel Priorización Integrada', consumes:['datosParticipacionCiudadana','resultados VRELAS','resultados HPC','propuesta EPVSA'],
    produces:['datosFusionPriorizacion','decisionPriorizacionActual'],
    engines:['confirmarPriorizacion()','relas_confirmarPriorizacionTriple()'],
    breaksIfFails:'Plan no refleja participación integrada. datosFusionPriorizacion se pierde al cambiar municipio.',
    associatedEnt:['ENT-093..ENT-223'], associatedRel:['REL-072','REL-074'],
    codeRefs:[], risks:['datosFusionPriorizacion es HUÉRFANO — sin estructura formal ni rehidratación automática'] },

  // COMPILADOR
  { id:'wo-compilador', name:'Compilador PLS', group:'COMPILADOR', criticality:5,
    function:'Ensambla el Plan Local de Salud desde 4 compartimentos: Perfil / Plan / Agenda / Cuadro de Mandos. planLocalSalud es efímero. Módulo externo: core/documentos/generarHTMLPlanLocal.js.',
    location:'FASE 4 / BLOQUE-016 (l.28293-l.34651) + módulo externo', consumes:['planLocalSalud.perfil.html','planLocalSalud.planAccion.html','planLocalSalud.agenda.actuaciones','analisisActual','datosMunicipioActual'],
    produces:['Documento PLS HTML','PDF exportable','Impresión vía _imprimirEnIframe()'],
    engines:['generarHTMLPlanLocal(completo)','generarContenidoPLSPreview()','_imprimirEnIframe()'],
    breaksIfFails:'Documento final imposible. Todos los flujos de exportación convergen aquí.',
    associatedEnt:['ENT-556','ENT-557','ENT-558','ENT-562','ENT-564','ENT-568','ENT-593'],
    associatedRel:['REL-258','REL-302','REL-305','REL-307','REL-308','REL-317','REL-325'],
    codeRefs:[
      {identifier:'guardarPlanAccionParaCompilador()',line:9951,file:'index.html'},
      {identifier:'guardarAgendaParaCompilador()',line:9994,file:'index.html'},
      {identifier:'resetearPlanLocal()',line:10030,file:'index.html'},
      {identifier:'actualizarEstadoCompilador()',line:9829,file:'index.html'},
      {identifier:'verificarAccesoFase6()',line:10076,file:'index.html'},
      {identifier:'generarHTMLPlanLocal()',line:null,file:'core/documentos/generarHTMLPlanLocal.js'},
    ],
    risks:['RT-005: planLocalSalud efímero falso canónico [CRÍTICO]','PLS no persiste en Firebase — pérdida si cierra app antes de exportar','cuadroMandos sin escritor → completitud nunca total'] },

  { id:'wo-panel-estado', name:'Panel estado compilador', group:'COMPILADOR', criticality:3,
    function:'Muestra completitud de los 4 compartimentos del PLS: Perfil ✓/✗, Plan ✓/✗, Agenda ✓/✗, Cuadro de Mandos (siempre ✗). Criterio de acceso a exportación.',
    location:'FASE 4 / 3 badges de estado', consumes:['planLocalSalud.perfil.completado','planLocalSalud.planAccion.completado','planLocalSalud.agenda.completado','planLocalSalud.cuadroMandos.completado'],
    produces:['Estado visual de completitud','habilitación de botones de exportación'],
    engines:['verificarPlanLocalCompleto()','actualizarEstadoCompilador()'],
    breaksIfFails:'Usuario no sabe si el PLS está listo. Exportación habilitada incorrectamente.',
    associatedEnt:['ENT-224..ENT-254'], associatedRel:['REL-323','REL-324'],
    codeRefs:[{identifier:'actualizarEstadoCompilador()',line:9829,file:'index.html'}],
    risks:['cuadroMandos.completado SIEMPRE false — bug estructural: PLS nunca puede declarar completitud total'] },

  // AGENDA
  { id:'wo-agenda', name:'Agenda Kanban', group:'AGENDA', criticality:5,
    function:'Gestiona actuaciones del plan por año/trimestre/entorno (sanitario/comunitario/educativo/laboral). Drag & drop. 40+ campos por actuación. Ruptura Plan→Agenda vía #btn-sync-agenda.',
    location:'FASE 5 / #agenda-municipio-contenido (l.6600)', consumes:['accionesAgenda[] (desde Firebase /agendas)','propuestaActual (para sincronización)'],
    produces:['accionesAgenda[] actualizado','guardado en Firebase /agendas'],
    engines:['mostrarModalNuevaAccion()','guardarAccion()','dropAccion()','filtrarAgendas()','guardarAgendasFirebase()'],
    breaksIfFails:'PLS Parte 3 vacía. Evaluación FASE 6 sin actuaciones.',
    associatedEnt:['ENT-255','ENT-267','ENT-268','ENT-274','ENT-279','ENT-290'],
    associatedRel:['REL-075','REL-094','REL-099','REL-281'],
    codeRefs:[{identifier:'#btn-sync-agenda',line:null,file:'index.html'},{identifier:'guardarAgendasFirebase()',line:null,file:'index.html'}],
    risks:['RUPTURA Plan→Agenda: #btn-sync-agenda es MANUAL — plan y agenda pueden diverger silenciosamente','accionesAgenda es CACHÉ/EFÍMERO sin discriminación de estado'] },

  { id:'wo-modal-accion', name:'Modal de acción', group:'AGENDA', criticality:3,
    function:'Formulario para crear/editar actuaciones del plan. 8 bloques: EPVSA, caracterización (12 campos), estado y trazabilidad, cobertura, implementación, red local, evaluación y aprendizaje, fechas.',
    location:'FASE 5 / #modal-accion (l.6758)', consumes:['Entrada manual del usuario','estructura EPVSA activa'],
    produces:['Registro de acción en accionesAgenda[]','guardado en Firebase'],
    engines:['guardarAccion()','editarAccion()'],
    breaksIfFails:'No se pueden añadir actuaciones al plan.',
    associatedEnt:['ENT-279','ENT-280','ENT-281','ENT-282','ENT-283','ENT-284','ENT-285','ENT-286','ENT-287','ENT-288','ENT-289','ENT-290'],
    associatedRel:['REL-095','REL-099'],
    codeRefs:[{identifier:'#modal-accion',line:6758,file:'index.html'}],
    risks:['anio:2026 hardcoded — actuaciones de ciclos futuros con año incorrecto'] },

  // EVALUACIÓN
  { id:'wo-evaluacion', name:'Evaluación FASE 6', group:'EVALUACIÓN', criticality:4,
    function:'Evalúa el grado de implantación del plan y el estado de salud del municipio. Calcula el ISS. Alimenta LONGI. Dashboard de indicadores.',
    location:'FASE 6 / #eval-dashboard-container (l.7500)', consumes:['accionesAgenda (actuaciones realizadas)','planLocalSalud.agenda','datos IBSE','indicadores EAS'],
    produces:['Estado de evaluación','scores CI/CD/CB','ISS calculado','contexto LONGI'],
    engines:['eval_actualizarResultados()','eval_actualizarFase6()','eval_calcularISS()'],
    breaksIfFails:'ISS incalculable. Seguimiento LONGI sin datos. Rendición de cuentas imposible.',
    associatedEnt:['ENT-301..ENT-326','ENT-302'], associatedRel:['REL-112','REL-323'],
    codeRefs:[{identifier:'#eval-dashboard-container',line:7500,file:'index.html'},{identifier:'eval_actualizarResultados()',line:null,file:'index.html'}],
    risks:['seguimientoAnual AUSENTE de ContextoIA por diseño — evaluación desde motores IA siempre parcial','accionesAgenda puede no estar sincronizada con el plan'] },

  { id:'wo-iss', name:'ISS (Índice Sintético de Salud)', group:'EVALUACIÓN', criticality:3,
    function:'Indicador terminal de síntesis evaluativa. CI×0,40 + CD×0,35 + CB×0,25. Pesos hardcoded, no configurables desde UI. Consume outputs de IBSE, determinantes e indicadores.',
    location:'FASE 6 / Cuadro de Mandos', consumes:['Motor indicadores (CI)','determinantes EAS (CD)','IBSE (CB)'],
    produces:['ISS numérico (0-100)','estado de salud del municipio'],
    engines:['eval_calcularISS()'],
    breaksIfFails:'Sin síntesis evaluativa del ciclo. Sin referencia para comparación longitudinal.',
    associatedEnt:['ENT-831'], associatedRel:[],
    codeRefs:[], risks:['Pesos 0.40/0.35/0.25 hardcoded — cambio requiere modificar código directamente'] },

  { id:'wo-longi', name:'LONGI (evaluación longitudinal)', group:'EVALUACIÓN', criticality:3,
    function:'Framework de 11 capas de evaluación no-causal del proceso a lo largo del tiempo. Produce contexto longitudinal unificado del municipio.',
    location:'FASE 6 / BLOQUE-025 (l.73100-l.76662)', consumes:['Histórico de ciclos municipales','datosMunicipioActual','estado plan/agenda de ciclos anteriores'],
    produces:['contexto_longitudinal_runtime_v1_11','interpretación LONGI','informe LONGI'],
    engines:['COMPAS_construirContextoLongitudinalRuntime()','COMPAS_interpretarLecturaLongitudinal()'],
    breaksIfFails:'Sin evaluación longitudinal. Cada ciclo es independiente sin continuidad observable.',
    associatedEnt:['ENT-825..ENT-914'], associatedRel:[],
    codeRefs:[{identifier:'COMPAS_construirContextoLongitudinalRuntime()',line:76662,file:'index.html'}],
    risks:['Sin histórico Firebase estructurado, LONGI opera solo sobre el ciclo actual'] },

  { id:'wo-motor-v3v4', name:'Motor V3/V4', group:'EVALUACIÓN', criticality:3,
    function:'Motor analítico de siguiente generación. V3 (COMPAS_analizarV3) produce analisisActualV3. V4 produce salida FMC para tarjetas EPVSA. Coexiste con análisis v2.',
    location:'FASE 2-3 (transversal) — BLOQUE-023', consumes:['datosMunicipioActual','datosParticipacionCiudadana','COMPAS.prioridades.tematicas (fallback)'],
    produces:['analisisActualV3','window.__ultimaSalidaMotorSintesisV4','window.analisisActualV4'],
    engines:['COMPAS_analizarV3()','Motor AT2 v2 interno'],
    breaksIfFails:'Tarjetas EPVSA sin FMC V4. Propuesta automática recae en v2 o propuesta local.',
    associatedEnt:['ENT-762..ENT-793'], associatedRel:['REL-478'],
    codeRefs:[], risks:['DV-025/DV-026: coexistencia v1/v2/v3 — resultados mezclados silenciosos si versión no discriminada'] },

  // INFRAESTRUCTURA
  { id:'wo-contextoia', name:'ContextoIA', group:'INFRAESTRUCTURA', criticality:4,
    function:'Snapshot estructurado que alimenta todos los motores IA. Agrega globals disponibles en el momento de ejecución. Efímero: construido antes de cada motor, no persiste. seguimientoAnual AUSENTE por diseño.',
    location:'Transversal — invocado antes de cada motor IA', consumes:['datosMunicipioActual (caché Firebase)','analisisActual/V3','datosParticipacionCiudadana','globals en memoria'],
    produces:['Objeto ContextoIA (efímero, no persiste)'],
    engines:['crearContextoIA()','contextoDesdeGlobalesHeredados()'],
    breaksIfFails:'Todos los motores IA reciben contrato vacío o del municipio anterior.',
    associatedEnt:[], associatedRel:['REL-059','REL-464'],
    codeRefs:[{identifier:'crearContextoIA()',line:null,file:'index.html'}],
    risks:['seguimientoAnual AUSENTE por diseño declarado (motorEvaluacion.js l.30-34)','Si datosMunicipioActual es stale: outputs erróneos sin aviso'] },

  { id:'wo-firebase', name:'Firebase', group:'INFRAESTRUCTURA', criticality:5,
    function:'Única fuente de verdad permanente del sistema. Toda información municipal sobrevive entre sesiones únicamente en Firebase. Ningún objeto runtime tiene permanencia propia.',
    location:'Backend — CDN Firebase l.13, l.15', consumes:['Todo dato que el usuario guarda explícitamente'],
    produces:['datosMunicipioActual','analisisActual (rehidratado)','planAccionFirebase','accionesAgenda','decisionPriorizacionActual'],
    engines:['guardarTodoFirebase()','cargarDatosMunicipioFirebase()','guardarAgendasFirebase()'],
    breaksIfFails:'Pérdida total de datos entre sesiones. Toda sesión debe recomenzar desde cero.',
    associatedEnt:['ENT-341','ENT-342'], associatedRel:['REL-002','REL-066','REL-138','REL-050'],
    codeRefs:[{identifier:'guardarTodoFirebase()',line:null,file:'index.html'},{identifier:'cargarDatosMunicipioFirebase()',line:null,file:'index.html'}],
    risks:['Firebase es el único backend permanente — sin él el sistema es stateless'] },

  { id:'wo-documento-pls', name:'Documento PLS', group:'INFRAESTRUCTURA', criticality:4,
    function:'Artefacto documental final del ciclo de planificación. Documento imprimible/exportable con diagnóstico, plan, agenda y cuadro de mandos. Output del Compilador. NO persiste en Firebase.',
    location:'Output de FASE 4', consumes:['planLocalSalud (acumulador efímero completo)','_imprimirEnIframe()'],
    produces:['PDF para entrega institucional','HTML descargable','impresión'],
    engines:['generarHTMLPlanLocal()','exportarPDFPlanLocal()','exportarHTMLPlan()'],
    breaksIfFails:'Sin producto entregable institucional. El ciclo completo no tiene artefacto.',
    associatedEnt:['ENT-593'], associatedRel:['REL-304','REL-305','REL-306'],
    codeRefs:[{identifier:'exportarPDFPlanLocal()',line:null,file:'index.html'}],
    risks:['PLS NO persiste en Firebase — cerrar la app antes de exportar = pérdida definitiva','planLocalSalud base del PLS es efímero sin coherencia temporal garantizada'] },
];

// ── META — métricas reales del dataset ────────────────────────────────────
export const meta = {
  n_nodos:            rawDataset.meta.n_nodos,
  n_arcos:            rawDataset.meta.n_arcos,
  n_bloques:          rawDataset.meta.n_bloques,
  n_fazes:            rawDataset.fazes.length,
  n_arcos_completos:  rawDataset.meta.n_arcos_completos,
  n_arcos_parciales:  rawDataset.meta.n_arcos_parciales,
};

// ── ENSAMBLAJE ────────────────────────────────────────────────────────────
const workById = Object.fromEntries(workObjects.map((item) => [item.id, item]));
const runtimeById = Object.fromEntries(runtimeObjects.map((item) => [item.id, item]));
const artifactById = Object.fromEntries(artifacts.map((item) => [item.id, item]));
const riskById = Object.fromEntries(risks.map((item) => [item.id, item]));

function buildPanopticoNode(node) {
  return {
    ...node,
    type: 'PANOPTICO_V1',
    workObjects: node.workObjectIds.map((id) => workById[id]).filter(Boolean),
    runtimeObjects: node.runtimeObjectIds.map((id) => runtimeById[id]).filter(Boolean),
    artifacts: node.artifactIds.map((id) => artifactById[id]).filter(Boolean),
    risks: node.riskIds.map((id) => riskById[id]).filter(Boolean),
  };
}

export const panopticoNodes = [
  buildPanopticoNode({
    id: 'pn-que-es-compas',
    name: 'Que es COMPAS',
    summary: 'Entrada de orientacion del Panoptico V1. Resume lo confirmado por el dataset y por los objetos de trabajo sin declarar Control Total.',
    workObjectIds: ['wo-municipio', 'wo-config-estrategica', 'wo-contextoia', 'wo-firebase', 'wo-documento-pls'],
    runtimeObjectIds: ['window.COMPAS.state', 'ContextoIA'],
    artifactIds: ['CORPUS-PAN001-R3', 'GRAFO-MAESTRO-PAN001-R2', 'SALA-DE-MANDO-N2'],
    riskIds: ['LIMITE-CONTROL-TOTAL', 'ZC-002'],
    confirmed: [
      `${rawDataset.meta.n_nodos} ENT y ${rawDataset.meta.n_arcos} REL proceden del dataset R2.`,
      'La Sala React está integrada en COMPÁS. Opera en modo solo lectura sin gobierno runtime.',
      'Firebase, ContextoIA, municipio activo y Documento PLS existen como workObjects.',
    ],
    inferred: [
      'COMPAS se gobierna en esta V1 como sistema documental-operativo observable, no como runtime vivo.',
    ],
    pending: [
      'No existe un workObject unico llamado "Que es COMPAS"; esta ficha es una agregacion de workObjects existentes.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-documentos-proceso',
    name: 'Documentos del proceso',
    summary: 'Nodo documental operativo apoyado en Informe municipal, Compilador PLS y Documento PLS.',
    workObjectIds: ['wo-informe-municipal', 'wo-compilador', 'wo-documento-pls'],
    runtimeObjectIds: ['planLocalSalud'],
    artifactIds: ['CORPUS-PAN001-R3', 'GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['RT-005'],
    confirmed: [
      'Informe municipal, Compilador PLS y Documento PLS existen como workObjects.',
      'Documento PLS se declara output documental imprimible/exportable y no persiste en Firebase.',
    ],
    inferred: [
      'La documentacion del proceso queda representada por los objetos que producen o transportan artefactos documentales.',
    ],
    pending: [
      'No existe workObject exacto "Documentos del proceso".',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-plan-local-salud',
    name: 'Plan Local de Salud',
    summary: 'Nodo centrado en planLocalSalud, Compilador PLS y Documento PLS.',
    workObjectIds: ['wo-compilador', 'wo-panel-estado', 'wo-documento-pls'],
    runtimeObjectIds: ['planLocalSalud'],
    artifactIds: ['SALA-DE-MANDO-N2'],
    riskIds: ['RT-005'],
    confirmed: [
      'planLocalSalud esta clasificado como HIBRIDO / ACUMULADOR / EFIMERO / PROYECCION.',
      'Compilador PLS consume planLocalSalud y produce Documento PLS HTML/PDF.',
    ],
    inferred: [
      'El Plan Local de Salud operable en Sala V1 se entiende como acumulador runtime mas salida documental.',
    ],
    pending: [
      'No hay gobierno runtime vivo ni persistencia completa del objeto desde la Sala.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-agenda-anual',
    name: 'Agenda anual',
    summary: 'Ficha quirurgica completa — auditoria R2. Gestion de actuaciones por año/trimestre/entorno (Kanban). Ruptura Plan→Agenda documentada. Downstream: Evaluacion Fase 6 y Compilador PLS.',
    workObjectIds: ['wo-agenda', 'wo-modal-accion'],
    runtimeObjectIds: ['accionesAgenda'],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['GAP-PAE-001', 'GAP-PAE-002'],
    confirmed: [
      'wo-agenda criticidad 5 FASE 5 — engines: guardarAccion() guardarAgendasFirebase() mostrarModalNuevaAccion() dropAccion() filtrarAgendas().',
      'wo-modal-accion: #modal-accion l.6758 — engines: guardarAccion() editarAccion(). 8 bloques 40+ campos por actuacion.',
      'accionesAgenda: CACHE / ESTADO RUNTIME — persistence Firebase /agendas. Source: GRAFO-MAESTRO-PAN001-R2.md:1871.',
      '#btn-sync-agenda: index.html:6093.',
      'initAgendas(): carga y rehidrata accionesAgenda desde Firebase — index.html:26312.',
      'Lectura Firebase /agendas confirmada en index.html:26322 — inicializa accionesAgenda[].',
      'renderAgendas(): renderiza accionesAgenda con fallback planLocalSalud.agenda — index.html:26747.',
      '_rehidratarAgendaCompilador(): rehidrata agenda en compilador desde Firebase — index.html:57542. Asigna accionesAgenda = acts y accionesAgenda._municipio = mun en index.html:57561.',
      'guardarAgendaParaCompilador(acts) transfiere planLocalSalud.agenda.actuaciones al Compilador PLS — index.html:57560 y index.html:10010.',
      'resetearPlanLocal() limpia planLocalSalud.agenda — index.html:16529 y index.html:10038.',
      'sincronizarPlanConAgenda(false) actualiza runtime/compilador/render pero NO persiste automaticamente en Firebase — index.html:78736.',
      'Plan guardado no reconstruye agenda automaticamente al cargar — index.html:24267.',
      'eval_actualizarFase6() confirmada en wo-evaluacion.engines — downstream directo de accionesAgenda.',
      'GAP-PAE-001: Plan recuperado no reconstruye Agenda automaticamente — OBSERVADO severity IMPORTANTE.',
      'GAP-PAE-002: Evaluacion potencialmente parcial por agenda no sincronizada — OBSERVADO severity IMPORTANTE.',
      '_rehidratarAgendaCompilador() no limpia accionesAgenda si /agendas esta vacio: solo asigna dentro de if(data && Object.keys(data).length > 0), sin rama else ni llamada a guardarAgendaParaCompilador([]). Cache anterior persiste hasta que initAgendas() ejecute accionesAgenda = [] — index.html:57549 57556 57560 57561 26340.',
    ],
    inferred: [
      'propuestaActual es dependencia upstream de la Agenda solo en el flujo de sincronizacion via #btn-sync-agenda.',
      'planLocalSalud.agenda.actuaciones es el compartimento PLS alimentado por guardarAgendaParaCompilador().',
      'accionesAgenda tiene doble naturaleza confirmada: cache de Firebase (initAgendas) y estado efimero de sesion (sincronizarPlanConAgenda).',
    ],
    pending: [
      'Ruptura Plan recuperado → Agenda reconstruida sigue sin resolver (incidencia fuera de alcance de esta V1).',
    ],
    surgical: {
      selectors: [
        { id: '#btn-sync-agenda', description: 'Boton sincronizacion Plan→Agenda', location: 'index.html:6093', evidence: 'CONFIRMADO', source: 'Auditoria R2 / index.html:6093' },
        { id: '#agenda-municipio-contenido', description: 'Contenedor principal Kanban agenda', location: 'FASE 5 l.6600', evidence: 'CONFIRMADO', source: 'wo-agenda.location' },
        { id: '#modal-accion', description: 'Modal crear/editar actuaciones — 8 bloques 40+ campos', location: 'FASE 5 l.6758', evidence: 'CONFIRMADO', source: 'wo-modal-accion.codeRefs l.6758' },
      ],
      functions: [
        { id: 'initAgendas()', evidence: 'CONFIRMADO', source: 'index.html:26312', note: 'Carga y rehidrata accionesAgenda[] desde Firebase /agendas al iniciar' },
        { id: '_rehidratarAgendaCompilador()', evidence: 'CONFIRMADO', source: 'index.html:57542 — asigna accionesAgenda = acts y accionesAgenda._municipio = mun en index.html:57561', note: 'Rehidrata agenda en el compilador desde Firebase' },
        { id: 'renderAgendas()', evidence: 'CONFIRMADO', source: 'index.html:26747', note: 'Renderiza accionesAgenda con fallback a planLocalSalud.agenda (index.html:26755)' },
        { id: 'guardarAccion()', evidence: 'CONFIRMADO', source: 'wo-agenda.engines / wo-modal-accion.engines', note: 'Crea y actualiza registros en accionesAgenda[]' },
        { id: 'guardarAgendasFirebase()', evidence: 'CONFIRMADO', source: 'wo-agenda.codeRefs + wo-firebase.engines / index.html:28080', note: 'Persiste accionesAgenda[] en Firebase /agendas' },
        { id: 'guardarAgendaParaCompilador(acts)', evidence: 'CONFIRMADO', source: 'index.html:57560 y index.html:10010', note: 'Transfiere actuaciones a planLocalSalud.agenda.actuaciones para el Compilador PLS' },
        { id: 'sincronizarPlanConAgenda(false)', evidence: 'CONFIRMADO', source: 'index.html:78736', note: 'Actualiza runtime/compilador/render pero NO persiste en Firebase — requiere guardarAgendasFirebase() explicito' },
        { id: 'resetearPlanLocal()', evidence: 'CONFIRMADO', source: 'index.html:16529 y index.html:10038', note: 'Limpia planLocalSalud.agenda al resetear' },
        { id: 'mostrarModalNuevaAccion()', evidence: 'CONFIRMADO', source: 'wo-agenda.engines', note: 'Abre modal para nueva actuacion' },
        { id: 'dropAccion()', evidence: 'CONFIRMADO', source: 'wo-agenda.engines', note: 'Gestiona drag & drop Kanban' },
        { id: 'filtrarAgendas()', evidence: 'CONFIRMADO', source: 'wo-agenda.engines', note: 'Filtra actuaciones por año/trimestre/entorno' },
        { id: 'editarAccion()', evidence: 'CONFIRMADO', source: 'wo-modal-accion.engines', note: 'Edita actuacion existente' },
        { id: 'eval_actualizarFase6()', evidence: 'CONFIRMADO', source: 'wo-evaluacion.engines', note: 'Downstream: actualiza Evaluacion Fase 6 desde accionesAgenda' },
      ],
      runtime: [
        { id: 'accionesAgenda', classification: 'CACHE / ESTADO RUNTIME', nature: 'Doble confirmada: cache Firebase (initAgendas) + estado efimero de sesion (sincronizarPlanConAgenda)', persistence: 'Firebase /agendas — escrita en index.html:28080', rehydration: 'initAgendas() l.26312 / _rehidratarAgendaCompilador() l.57542', evidence: 'CONFIRMADO', source: 'runtimeObjects / GRAFO-MAESTRO-PAN001-R2.md:1871 / Auditoria R2' },
        { id: 'planLocalSalud.agenda', classification: 'COMPARTIMENTO DEL ACUMULADOR PLS', nature: 'Efimero — sub-objeto de planLocalSalud; limpiado por resetearPlanLocal()', persistence: 'No persiste como objeto propio', rehydration: 'No reconstructible automaticamente (GAP-PAE-001) — index.html:24267', evidence: 'CONFIRMADO', source: 'wo-compilador.consumes / wo-evaluacion.consumes / index.html:10038' },
        { id: 'propuestaActual', classification: 'EFIMERO / DERIVADO', nature: 'Dependencia condicional de sincronizacion via #btn-sync-agenda', persistence: 'No garantizada', rehydration: 'No reconstruida automaticamente', evidence: 'INFERIDO', source: 'wo-agenda.consumes — solo en flujo #btn-sync-agenda' },
      ],
      firebase: {
        reads: [
          { path: '/agendas', operation: 'initAgendas() inicializa accionesAgenda[] — index.html:26322', evidence: 'CONFIRMADO', source: 'index.html:26322 / Auditoria R2' },
        ],
        writes: [
          { path: '/agendas', operation: 'guardarAgendasFirebase() persiste accionesAgenda[] — index.html:28080', evidence: 'CONFIRMADO', source: 'index.html:28080 / wo-agenda.produces' },
          { path: '/agendas (via modal)', operation: 'guardarAccion() escribe cada actuacion individual', evidence: 'CONFIRMADO', source: 'wo-modal-accion.engines + wo-agenda.produces' },
        ],
      },
      rehydration: {
        reconstructs: [
          { what: 'accionesAgenda[] desde Firebase /agendas', how: 'initAgendas() l.26312 al cargar municipio activo', evidence: 'CONFIRMADO' },
          { what: 'planLocalSalud.agenda.actuaciones via compilador', how: '_rehidratarAgendaCompilador() l.57542 asigna accionesAgenda = acts', evidence: 'CONFIRMADO' },
        ],
        doesNotReconstruct: [
          { what: 'Plan→Agenda automatica', reason: 'Ruptura confirmada en index.html:24267 — requiere #btn-sync-agenda (l.6093) manual', evidence: 'CONFIRMADO' },
          { what: 'sincronizarPlanConAgenda no persiste', reason: 'Actualiza runtime y render (l.78736) pero no escribe en Firebase — requiere guardarAgendasFirebase() separado', evidence: 'CONFIRMADO' },
          { what: 'propuestaActual', reason: 'No se rehidrata automaticamente; divergencia silenciosa posible', evidence: 'CONFIRMADO' },
          { what: 'planLocalSalud.agenda como objeto propio', reason: 'Compartimento efimero de planLocalSalud — limpiado por resetearPlanLocal() l.16529/10038', evidence: 'CONFIRMADO' },
          { what: 'accionesAgenda cuando /agendas Firebase devuelve vacio', reason: '_rehidratarAgendaCompilador() no limpia: solo asigna dentro de if(data && keys>0) l.57549-57561. Sin rama else. Cache anterior persiste hasta que initAgendas() ejecute accionesAgenda = [] l.26340.', evidence: 'CONFIRMADO' },
        ],
        pending: [],
      },
      upstream: [
        { id: 'Plan de Accion', detail: 'propuestaActual → #btn-sync-agenda (l.6093) → accionesAgenda (sincronizacion manual)', evidence: 'CONFIRMADO', risk: 'GAP-PAE-001' },
        { id: 'propuestaActual', detail: 'Dependencia condicional — solo activa en flujo de sincronizacion via #btn-sync-agenda', evidence: 'INFERIDO', risk: 'GAP-PAE-001' },
        { id: 'Firebase /agendas', detail: 'initAgendas() l.26322 carga accionesAgenda[] al iniciar municipio', evidence: 'CONFIRMADO', risk: null },
      ],
      downstream: [
        { id: 'Evaluacion Fase 6', detail: 'eval_actualizarFase6() consume accionesAgenda y planLocalSalud.agenda', evidence: 'CONFIRMADO', risk: 'GAP-PAE-002' },
        { id: 'Compilador PLS', detail: 'guardarAgendaParaCompilador(acts) l.57560/10010 → planLocalSalud.agenda.actuaciones', evidence: 'CONFIRMADO', risk: 'RT-005' },
        { id: 'Plan Local de Salud (Parte 3)', detail: 'PLS Parte 3 vacia si accionesAgenda no tiene actuaciones', evidence: 'CONFIRMADO', risk: null },
      ],
      specificRisks: [
        { id: 'GAP-PAE-001', title: 'Plan guardado no reconstruye Agenda al cargar', severity: 'IMPORTANTE', detail: 'Confirmado en index.html:24267. #btn-sync-agenda (l.6093) es MANUAL — plan y agenda pueden diverger silenciosamente tras recuperacion de sesion.', evidence: 'CONFIRMADO' },
        { id: 'GAP-PAE-002', title: 'Divergencia silenciosa Plan/Agenda', severity: 'IMPORTANTE', detail: 'Evaluacion Fase 6 puede ser parcial si accionesAgenda no refleja el plan vigente.', evidence: 'CONFIRMADO' },
        { id: 'SYNC-NO-PERSISTE', title: 'sincronizarPlanConAgenda no persiste en Firebase', severity: 'IMPORTANTE', detail: 'index.html:78736 confirma que sincronizarPlanConAgenda(false) actualiza runtime/compilador/render pero NO escribe en Firebase. Requiere guardarAgendasFirebase() explicito posterior para persistir.', evidence: 'CONFIRMADO' },
        { id: 'DOBLE-NATURALEZA-ACCIONES', title: 'Doble naturaleza de accionesAgenda', severity: 'IMPORTANTE', detail: 'accionesAgenda actua como cache de Firebase (initAgendas l.26312) Y como estado efimero de sesion (sincronizarPlanConAgenda l.78736). Sin discriminacion explicita entre ambas capas.', evidence: 'CONFIRMADO' },
        { id: 'RIESGO-AGENDA-REHIDRATACION-SIN-LIMPIEZA', title: '_rehidratarAgendaCompilador no limpia accionesAgenda si Firebase devuelve vacio', severity: 'IMPORTANTE', detail: '_rehidratarAgendaCompilador() solo asigna accionesAgenda = acts dentro de if(data && Object.keys(data).length > 0) — index.html:57549 57556. No hay rama else ni llamada a guardarAgendaParaCompilador([]). Si /agendas esta vacio, accionesAgenda conserva cache anterior hasta que initAgendas() ejecute accionesAgenda = [] en index.html:26340. Evidencia: index.html:57549 57556 57560 57561 26340.', evidence: 'CONFIRMADO' },
      ],
    },
  }),
  buildPanopticoNode({
    id: 'pn-estudios-complementarios',
    name: 'Estudios complementarios',
    summary: 'Nodo de enriquecimiento diagnostico municipal. Incluye IBSE (Bienestar Socioemocional).',
    workObjectIds: ['wo-estudios', 'wo-ibse', 'wo-sam'],
    runtimeObjectIds: [],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: [],
    confirmed: [
      'Estudios complementarios existe como workObject.',
      'IBSE existe como workObject con tres vias: formulario, CSV REDCap y Firebase.',
      'IBSE alimenta datosIBSE y participa en ISS como componente CB.',
    ],
    inferred: [
      'Opera como enriquecimiento del perfil de salud municipal segun su funcion documentada.',
      'IBSE es un estudio concreto de bienestar socioemocional integrado en el diagnostico municipal.',
    ],
    pending: [
      'No se anaden rutas ni relaciones nuevas fuera de los workObjects existentes.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-firebase',
    name: 'Firebase',
    summary: 'Nodo de fuente permanente y rehidratacion municipal.',
    workObjectIds: ['wo-firebase', 'wo-municipio'],
    runtimeObjectIds: ['window.COMPAS.state'],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['ZC-002'],
    confirmed: [
      'Firebase existe como workObject de infraestructura con criticidad 5.',
      'El workObject Firebase declara que toda informacion municipal permanente sobrevive entre sesiones unicamente en Firebase.',
    ],
    inferred: [
      'Firebase es la base de recuperacion del estado operativo documentado, con reservas runtime.',
    ],
    pending: [
      'La Sala de Control Semántico opera en modo solo lectura sobre Firebase.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-motores',
    name: 'Motores',
    summary: 'Nodo agregado de motores declarados en workObjects.',
    workObjectIds: ['wo-motor-at2', 'wo-motor-sintesis', 'wo-motor-plan', 'wo-motor-v3v4', 'wo-contextoia'],
    runtimeObjectIds: ['ContextoIA', 'analisisActual', 'analisisActualV3'],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['ZC-002'],
    confirmed: [
      'Motor AT2, Motor sintesis perfil, Motor propuesta IA y Motor V3/V4 existen como workObjects.',
      'ContextoIA existe como workObject transversal que alimenta motores IA.',
    ],
    inferred: [
      'Motores es una agregacion operativa de workObjects con campo engines.',
    ],
    pending: [
      'No existe workObject unico "Motores"; no se ejecutan motores desde esta V1.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-runtime',
    name: 'Runtime',
    summary: 'Nodo de estado vivo documentado, no conectado al runtime real.',
    workObjectIds: ['wo-contextoia', 'wo-firebase', 'wo-compilador', 'wo-agenda'],
    runtimeObjectIds: ['planLocalSalud', 'ContextoIA', 'accionesAgenda', 'propuestaActual', 'datosFusionPriorizacion', 'analisisActual', 'analisisActualV3', 'window.COMPAS.state'],
    artifactIds: ['SALA-DE-MANDO-N2'],
    riskIds: ['RT-005', 'ZC-002', 'LIMITE-CONTROL-TOTAL'],
    confirmed: [
      'runtimeObjects existe con planLocalSalud, ContextoIA, accionesAgenda, propuestaActual, datosFusionPriorizacion, analisisActual, analisisActualV3 y window.COMPAS.state.',
      'La Sala declara explicitamente que no gobierna runtime.',
    ],
    inferred: [
      'Runtime en V1 es una vista documental de objetos criticos, no un observatorio vivo.',
    ],
    pending: [
      'No hay lectura de runtime vivo, Firebase vivo ni verificacion dinamica desde esta V1.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-priorizacion',
    name: 'Priorizacion participativa',
    summary: 'Nodo de priorizacion participativa. Agrupa la seleccion EPVSA, la votacion tematica VRELAS, el analisis ciudadano HPC y la fusion de priorizaciones.',
    workObjectIds: ['wo-epvsa', 'wo-vrelas', 'wo-hpc', 'wo-fusion'],
    runtimeObjectIds: ['propuestaActual', 'datosFusionPriorizacion'],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['ZC-002'],
    confirmed: [
      'wo-epvsa, wo-vrelas, wo-hpc y wo-fusion existen como workObjects de priorizacion.',
      'propuestaActual y datosFusionPriorizacion son runtimeObjects dependientes de este nodo.',
    ],
    inferred: [
      'La priorizacion participativa integra tres vias: estrategica (EPVSA), tematica (VRELAS) y comunitaria (HPC).',
    ],
    pending: [
      'wo-sam aparece como capacidad transversal en este dominio; su nodo principal es pn-estudios-complementarios.',
    ],
  }),
  buildPanopticoNode({
    id: 'pn-evaluacion',
    name: 'Evaluacion y seguimiento',
    summary: 'Nodo de evaluacion del ciclo de salud municipal. Agrupa la evaluacion de Fase 6, el ISS y el seguimiento longitudinal LONGI.',
    workObjectIds: ['wo-evaluacion', 'wo-iss', 'wo-longi'],
    runtimeObjectIds: [],
    artifactIds: ['GRAFO-MAESTRO-PAN001-R2'],
    riskIds: ['GAP-PAE-002'],
    confirmed: [
      'wo-evaluacion, wo-iss y wo-longi existen como workObjects de evaluacion.',
      'ISS = CI×0,40 + CD×0,35 + CB×0,25. Pesos hardcoded — cambio requiere modificar codigo directamente.',
      'LONGI opera sobre el ciclo actual si no existe historico Firebase estructurado.',
    ],
    inferred: [
      'La evaluacion depende de que accionesAgenda este sincronizada con el plan (GAP-PAE-002).',
    ],
    pending: [
      'accionesAgenda puede no reflejar el plan vigente — riesgo de evaluacion parcial confirmado.',
    ],
  }),
];

export const territoryData = {
  authority: 'AGRUPACION_VISUAL_DERIVADA',
  source: 'panopticoNodes + workObjects + runtimeObjects + risks + compas-dataset-r2.json',
  root: {
    id: 'territory-root-compas',
    label: 'COMPAS',
    target: { type: 'panopticoNode', id: 'pn-que-es-compas' },
    metrics: [
      `${rawDataset.meta.n_nodos} ENT`,
      `${rawDataset.meta.n_arcos} REL`,
      `${rawDataset.meta.n_bloques} bloques`,
    ],
  },
  domains: [
    {
      id: 'diagnostico',
      label: 'Diagnostico',
      subtitle: 'Perfil, informe y estudios complementarios',
      x: 315,
      y: 88,
      target: { type: 'panopticoNode', id: 'pn-documentos-proceso' },
      panopticoNodeIds: ['pn-documentos-proceso', 'pn-estudios-complementarios'],
      workObjectIds: ['wo-informe-municipal', 'wo-motor-at2', 'wo-motor-sintesis', 'wo-ibse', 'wo-estudios', 'wo-sam'],
      runtimeIds: ['analisisActual', 'analisisActualV3', 'ContextoIA'],
      riskIds: ['ZC-002'],
      fazeIds: ['FASE_2'],
    },
    {
      id: 'priorizacion',
      label: 'Priorizacion / Planificacion',
      subtitle: 'EPVSA, propuesta IA y seleccion',
      x: 690,
      y: 88,
      target: { type: 'panopticoNode', id: 'pn-priorizacion' },
      panopticoNodeIds: ['pn-priorizacion', 'pn-motores'],
      workObjectIds: ['wo-motor-plan', 'wo-sam'],
      runtimeIds: ['propuestaActual', 'datosFusionPriorizacion'],
      riskIds: ['ZC-002'],
      fazeIds: ['FASE_3'],
    },
    {
      id: 'compilador',
      label: 'Compilador / PLS',
      subtitle: 'planLocalSalud y documento final',
      x: 805,
      y: 285,
      target: { type: 'panopticoNode', id: 'pn-plan-local-salud' },
      panopticoNodeIds: ['pn-plan-local-salud'],
      workObjectIds: ['wo-compilador', 'wo-panel-estado', 'wo-documento-pls'],
      runtimeIds: ['planLocalSalud'],
      riskIds: ['RT-005', 'LIMITE-CONTROL-TOTAL'],
      fazeIds: ['FASE_4'],
    },
    {
      id: 'agenda',
      label: 'Agenda',
      subtitle: 'Actuaciones, sync manual y Kanban',
      x: 690,
      y: 468,
      target: { type: 'panopticoNode', id: 'pn-agenda-anual' },
      panopticoNodeIds: ['pn-agenda-anual'],
      workObjectIds: ['wo-agenda', 'wo-modal-accion'],
      runtimeIds: ['accionesAgenda'],
      riskIds: ['GAP-PAE-001', 'GAP-PAE-002'],
      fazeIds: ['FASE_5'],
    },
    {
      id: 'evaluacion',
      label: 'Evaluacion',
      subtitle: 'ISS, seguimiento y resultado',
      x: 315,
      y: 468,
      target: { type: 'panopticoNode', id: 'pn-evaluacion' },
      panopticoNodeIds: ['pn-evaluacion'],
      workObjectIds: ['wo-evaluacion', 'wo-iss'],
      runtimeIds: [],
      riskIds: ['GAP-PAE-002'],
      fazeIds: ['FASE_6'],
    },
    {
      id: 'infraestructura',
      label: 'Infra / Firebase / Runtime',
      subtitle: 'Persistencia, municipio activo y estado vivo',
      x: 175,
      y: 285,
      target: { type: 'panopticoNode', id: 'pn-firebase' },
      panopticoNodeIds: ['pn-firebase', 'pn-runtime', 'pn-que-es-compas'],
      workObjectIds: ['wo-firebase', 'wo-municipio', 'wo-contextoia'],
      runtimeIds: ['window.COMPAS.state', 'planLocalSalud', 'accionesAgenda'],
      riskIds: ['ZC-002', 'RT-005'],
      fazeIds: ['INFRA'],
    },
  ],
  relations: [
    { id: 'territory-rel-01', from: 'diagnostico', to: 'priorizacion', label: 'analisis -> propuesta', riskIds: [], labelDy: -24 },
    { id: 'territory-rel-02', from: 'priorizacion', to: 'compilador', label: 'seleccion -> plan', riskIds: [], lane: 'critical', labelDx: 26, labelDy: -18 },
    { id: 'territory-rel-03', from: 'compilador', to: 'agenda', label: 'plan -> agenda', riskIds: ['GAP-PAE-001'], lane: 'critical', labelDx: 38, labelDy: -20 },
    { id: 'territory-rel-04', from: 'agenda', to: 'evaluacion', label: 'acciones -> evaluacion', riskIds: ['GAP-PAE-002'], lane: 'critical', labelDy: 30 },
    { id: 'territory-rel-05', from: 'evaluacion', to: 'compilador', label: 'resultados -> documento', riskIds: [], labelDx: 88, labelDy: -4 },
    { id: 'territory-rel-06', from: 'infraestructura', to: 'agenda', label: 'Firebase /agendas', riskIds: ['GAP-PAE-001'], labelDx: -92, labelDy: 18 },
    { id: 'territory-rel-07', from: 'infraestructura', to: 'compilador', label: 'runtime -> PLS', riskIds: ['RT-005'], labelDx: -12, labelDy: -24 },
    { id: 'territory-rel-08', from: 'infraestructura', to: 'diagnostico', label: 'municipio -> datos', riskIds: ['ZC-002'], labelDx: -42, labelDy: -12 },
  ],
  bottomBand: [
    { id: 'territory-band-firebase', label: 'Firebase', detail: 'Persistencia municipal observada', target: { type: 'panopticoNode', id: 'pn-firebase' } },
    { id: 'territory-band-runtime', label: 'Runtime', detail: 'Estado vivo documentado, no gobernado', target: { type: 'panopticoNode', id: 'pn-runtime' } },
    { id: 'territory-band-agenda', label: 'Agenda /agendas', detail: 'Cache + estado efimero con riesgos confirmados', target: { type: 'panopticoNode', id: 'pn-agenda-anual' } },
  ],
};

export const salaData = { artifacts, entities, relations, risks, runtimeObjects, chains, roles, views, guardrails, meta, workObjects, panopticoNodes, territoryData };

// ── FUNCIONES DE ACCESO (sin cambio en lógica) ────────────────────────────
export function findItem(type, id) {
  const map = {
    artifact: artifacts,
    entity: entities,
    relation: relations,
    risk: risks,
    runtime: runtimeObjects,
    chain: chains,
    role: roles,
    workObject: workObjects,
    panopticoNode: panopticoNodes,
  };
  return map[type]?.find((item) => item.id === id) ?? null;
}

export function searchSala(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const groups = [
    ['artifact', artifacts],
    ['entity', entities],
    ['relation', relations],
    ['risk', risks],
    ['runtime', runtimeObjects],
    ['chain', chains],
    ['role', roles],
    ['workObject', workObjects],
    ['panopticoNode', panopticoNodes],
  ];
  return groups.flatMap(([type, list]) =>
    list.filter((item) => JSON.stringify(item).toLowerCase().includes(q)).map((item) => ({ type, item })),
  );
}
