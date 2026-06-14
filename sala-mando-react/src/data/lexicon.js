// ── Lexicon semántico centralizado — COMPÁS IA R1 ────────────────────────
//
// Fuente única de verdad léxica para la resolución de lenguaje natural.
// Alimenta: detectWorkObjectIds, scoreCandidate, búsqueda, clasificación.
//
// Regla: para añadir un nuevo sinónimo o nombre visible de un WorkObject,
// modificar ÚNICAMENTE este archivo. El algoritmo de resolución no cambia.
//
// Campos de cada entrada:
//   id            — identificador único de la entrada léxica
//   targetType    — 'workObject' | 'node' | 'domain'
//   targetId      — ID del objeto destino (e.g. 'wo-ibse')
//   canonical     — nombre oficial del objeto
//   priority      — 1-5; mayor prioridad en desambiguación (5 = crítico)
//   aliases       — términos que identifican inequívocamente este objeto
//                   → entran en el mapa de alias (peso +40 en scoring)
//   uiLabels      — texto literal visible en la interfaz para este objeto
//                   → entran en el mapa de alias (peso +40)
//   abbreviations — abreviaturas reconocidas
//                   → entran en el mapa de alias (peso +40)
//   historicalNames — nombres históricos o anteriores
//                   → entran en el mapa de alias (peso +40)
//   synonyms      — equivalentes semánticos específicos de este objeto
//                   → entran en el mapa de alias (peso +40)
//   keywords      — palabras sueltas que SUGIEREN este objeto pero pueden
//                   ser ambiguas. NO entran en el mapa de alias.
//                   Uso: documentación, herramientas de gobierno, LLM.
//
// Campos semánticos (opcionales — catálogo oficial de COMPÁS):
//   description      — descripción funcional del concepto (una o dos frases)
//   functionalRole   — 'motor' | 'interfaz' | 'persistencia' | 'informacional' | 'agregador'
//   criticality      — 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO'
//   feedsRuntime     — true si alimenta objetos en ejecución activa
//   feedsPersistence — true si escribe o lee de Firebase / capa de persistencia
//   feedsIA          — true si sus datos entran en el COU o en motores IA
//   isInformational  — true si es presentacional/documental sin rol operativo
//   relatedTargets   — targetIds semánticamente relacionados (array de strings)
//   preferredLabel   — etiqueta preferida en UI y respuestas (si difiere de canonical)
//   deprecatedLabels — términos obsoletos que deben evitarse
//   notes            — observaciones de gobierno (restricciones, decisiones, advertencias)
//
// NOTA RETROCOMPAT: todos los alias del dict anterior están preservados.
// buildAliasMap() solo lee aliases/uiLabels/abbreviations/historicalNames/synonyms.
// Los campos semánticos son ignorados por el resolver actual — no lo afectan.

export const LEXICON_ENTRIES = [

  // ── INICIO ────────────────────────────────────────────────────────────────

  {
    id: 'lex-municipio',
    targetType: 'workObject',
    targetId: 'wo-municipio',
    canonical: 'Municipio activo',
    priority: 5,
    aliases: ['municipio', 'municipio activo', 'cambio de municipio', 'selector municipio'],
    uiLabels: ['Municipio', 'Municipio activo', 'selector de municipio'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      // 'home' y 'pantalla inicial' son válidos: wo-municipio es el punto de entrada
      // funcional de cada sesión (establece el municipio y desencadena la carga completa).
      'home', 'inicio', 'pantalla inicial', 'pantalla de inicio', 'pagina inicial',
      'carga inicial', 'entrada del sistema', 'seleccion municipio',
      // NOTA: expresiones sobre "qué es COMPÁS" → ver lex-que-es-compas (targetType:node)
    ],
    keywords: ['municipio', 'inicio', 'home', 'carga', 'sesion', 'entrada', 'activo'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Gateway operativo de toda sesión. Define la clave raíz de Firebase y desencadena la carga completa de datos municipales. Sin municipio activo el sistema no puede ejecutar motores ni construir el COU.',
    functionalRole: 'agregador',
    criticality: 'CRITICO',
    feedsRuntime: true,
    feedsPersistence: true,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-firebase', 'wo-contextoia', 'wo-compilador', 'wo-ibse', 'wo-agenda', 'wo-evaluacion'],
    preferredLabel: 'Municipio activo',
    deprecatedLabels: [],
    notes: 'getMunicipioActual() lee #municipio. actualizarMunicipio() resetea en cascada 8+ variables de runtime. cargarDatosMunicipioFirebase() lee la raíz municipal de Firebase estrategias/{estrategia}/municipios/{municipio}. planLocalSalud.municipio queda keyed al municipio activo. buildAIContext incluye municipality como campo del COU.',
  },

  // ── NODO PANÓPTICO: Que es COMPÁS ─────────────────────────────────────────
  // Auditoría: pn-que-es-compas existe en panopticoNodes de salaData.js.
  // Su pending declara explícitamente: "No existe un workObject único llamado
  // 'Que es COMPÁS'; esta ficha es una agregación de workObjects existentes."
  // workObjectIds: [wo-municipio, wo-config-estrategica, wo-contextoia, wo-firebase, wo-documento-pls]
  //
  // DECISIÓN: NO mapear a wo-municipio. Usar targetType:'node' para distinguir.
  // buildAliasMap() filtra targetType!='workObject', por lo que estas expresiones
  // producen BAJA_CONFIANZA en el resolver actual — que es la respuesta honesta:
  // no existe un único WO que represente "qué es COMPÁS".
  //
  // El operador que pregunte "¿Qué es COMPÁS?" recibirá baja confianza y los
  // candidatos detectados por scoring (que serán los 5 WOs del nodo).
  {
    id: 'lex-que-es-compas',
    targetType: 'node',
    targetId: 'pn-que-es-compas',
    canonical: 'Que es COMPAS',
    priority: 4,
    aliases: [
      'que es compas', 'qué es compás', 'que es compas modal',
      'modal que es compas', 'modal compas', 'presentacion compas',
      'introduccion compas', 'descripcion compas',
    ],
    uiLabels: ['Que es COMPÁS', 'Modal Qué es COMPÁS', 'Panóptico Que es COMPAS'],
    abbreviations: [],
    historicalNames: [],
    synonyms: ['orientacion compas', 'descripcion sistema', 'vista inicial compas'],
    keywords: ['compas', 'que es', 'introduccion', 'presentacion', 'descripcion', 'sistema'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Nodo informativo que presenta el sistema COMPÁS. No corresponde a un WorkObject único; agrega wo-municipio, wo-config-estrategica, wo-contextoia, wo-firebase y wo-documento-pls.',
    functionalRole: 'informacional',
    criticality: 'BAJO',
    feedsRuntime: false,
    feedsPersistence: false,
    feedsIA: false,
    isInformational: true,
    relatedTargets: ['wo-municipio', 'wo-config-estrategica', 'wo-contextoia', 'wo-firebase', 'wo-documento-pls'],
    preferredLabel: 'Qué es COMPÁS',
    deprecatedLabels: [],
    notes: 'pn-que-es-compas es un nodo presentacional. No participa en runtime ni persistencia. Eliminar: impacto documental, no funcional. No mapear a wo-municipio.',
  },

  // ── DIAGNÓSTICO ───────────────────────────────────────────────────────────

  {
    id: 'lex-config-estrategica',
    targetType: 'workObject',
    targetId: 'wo-config-estrategica',
    canonical: 'Configuración estratégica',
    priority: 3,
    aliases: [
      'configuracion estrategica', 'configuración estratégica',
      'marco estrategico', 'marco estratégico',
      'epvsa configuracion', 'lineas estrategicas',
      'estrategia activa',
    ],
    uiLabels: ['Configuración estratégica', 'Modal Configuración'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'configuracion', 'estrategia', 'marco epvsa', 'configuracion municipal',
    ],
    keywords: ['estrategia', 'epvsa', 'lineas', 'configuracion', 'marco', 'territorial'],
  },

  {
    id: 'lex-informe-municipal',
    targetType: 'workObject',
    targetId: 'wo-informe-municipal',
    canonical: 'Informe municipal (Word)',
    priority: 3,
    aliases: [
      'informe municipal', 'informe word', 'informe salud',
      'informe de salud municipal', 'cargar informe', 'importar informe',
      'diagnostico textual', 'diagnóstico textual',
    ],
    uiLabels: ['Informe municipal', 'Panel carga datos', 'cargarInformeWord'],
    abbreviations: [],
    historicalNames: [],
    synonyms: ['perfil textual', 'perfil de salud', 'documento word', 'docx'],
    keywords: ['informe', 'word', 'docx', 'mammoth', 'carga', 'importar'],
  },

  {
    id: 'lex-motor-at2',
    targetType: 'workObject',
    targetId: 'wo-motor-at2',
    canonical: 'Motor AT2',
    priority: 4,
    aliases: [
      'motor at2', 'at2', 'analisis territorial', 'análisis territorial',
      'motor analisis', 'motor de analisis',
      'at2_generar', 'at2_actualizarFuentes',
    ],
    uiLabels: ['Motor AT2', 'Tab AT2', 'FASE 2 / Tab AT2'],
    abbreviations: ['AT2'],
    historicalNames: ['analisis territorial v2'],
    synonyms: [
      'analisis estadistico', 'motor estadistico', 'motor territorial',
      'indicadores territoriales', 'determinantes territoriales',
    ],
    keywords: ['at2', 'territorial', 'estadistico', 'indicadores', 'determinantes', 'analisis'],
  },

  {
    id: 'lex-motor-sintesis',
    targetType: 'workObject',
    targetId: 'wo-motor-sintesis',
    canonical: 'Motor síntesis perfil (Motor 1)',
    priority: 4,
    aliases: [
      'motor sintesis', 'motor síntesis', 'motor 1', 'motor uno',
      'sintesis perfil', 'síntesis perfil',
      'generarAnalisisIA', 'generar analisis ia',
      'motorSintesisPerfil',
    ],
    uiLabels: ['Motor síntesis perfil', 'Generar análisis IA', 'Motor 1'],
    abbreviations: ['Motor 1'],
    historicalNames: [],
    synonyms: [
      'analisis ia', 'análisis ia', 'analisis interpretativo',
      'sintesis narrativa', 'motor ia externo',
    ],
    keywords: ['sintesis', 'perfil', 'motor', 'analisis', 'ia', 'narrativa'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Motor IA externo (Motor 1) que genera el análisis interpretativo del perfil municipal. Recibe el COU y produce síntesis narrativa de diagnóstico.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: false,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-contextoia', 'wo-motor-plan', 'wo-ibse', 'wo-informe-municipal'],
    preferredLabel: 'Motor síntesis perfil (Motor 1)',
    deprecatedLabels: [],
    notes: 'Función: generarAnalisisIA(). Primer motor IA del ciclo. Consume el COU completo. Sin persistencia directa en Firebase — la síntesis se muestra en UI, no se guarda automáticamente.',
  },

  {
    id: 'lex-ibse',
    targetType: 'workObject',
    targetId: 'wo-ibse',
    canonical: 'IBSE',
    priority: 5,
    aliases: [
      'ibse',
      'bienestar socioemocional', 'bienestar socio emocional',
      'indice de bienestar socioemocional', 'índice de bienestar socioemocional',
      'indice bienestar', 'índice bienestar',
      'iss emocional', 'ciudadania emocional',
      'escala ibse', 'cuestionario ibse',
      'calcularIBSE', 'ibse v2',
    ],
    uiLabels: ['IBSE', 'Panel IBSE', 'Modal IBSE', 'Monitor IBSE'],
    abbreviations: ['IBSE'],
    historicalNames: [],
    synonyms: [
      'bienestar emocional', 'salud socioemocional',
      'componente cb', 'cb del iss',
      'ciudadania emocional escolar',
    ],
    keywords: ['ibse', 'bienestar', 'socioemocional', 'emocional', 'escolar', 'cb'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Módulo de medición del Índice de Bienestar Socioemocional Escolar. Integra recogida de datos, SAM, análisis estadístico y dashboards de resultados.',
    functionalRole: 'motor',
    criticality: 'CRITICO',
    feedsRuntime: true,
    feedsPersistence: true,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-sam', 'wo-evaluacion', 'wo-motor-sintesis', 'wo-firebase'],
    preferredLabel: 'IBSE',
    deprecatedLabels: [],
    notes: 'Componente CB del ISS. SAM solo para ≥16 años; ≤15 solo descriptivo sin ajuste. No tocar cálculos IBSE ni SAM sin orden explícita.',
  },

  {
    id: 'lex-sam',
    targetType: 'workObject',
    targetId: 'wo-sam',
    canonical: 'SAM',
    priority: 4,
    aliases: [
      'sam',
      'sistema de ajuste muestral', 'ajuste muestral',
      'normalizarParticipacion', 'normalizar participacion',
      'sam_inicializarMonitor',
    ],
    uiLabels: ['SAM', 'Ajuste muestral', 'Sistema de Ajuste Muestral'],
    abbreviations: ['SAM'],
    historicalNames: [],
    synonyms: [
      'pesos estadisticos', 'ajuste estadistico', 'ajuste muestral estadistico',
      'participacion ajustada',
    ],
    keywords: ['sam', 'ajuste', 'muestral', 'pesos', 'estadistico', 'participacion', 'normalizacion'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Sistema de Ajuste Muestral que aplica pesos estadísticos para normalizar la participación en datos IBSE. Garantiza comparabilidad estadística entre municipios.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: true,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-ibse', 'wo-motor-sintesis', 'wo-evaluacion'],
    preferredLabel: 'SAM',
    deprecatedLabels: [],
    notes: 'Ajuste solo para participantes ≥16 años; ≤15 solo descriptivo sin ajuste. Pesos SAM ~1 = calibración correcta. Función: normalizarParticipacion().',
  },

  {
    id: 'lex-estudios',
    targetType: 'workObject',
    targetId: 'wo-estudios',
    canonical: 'Estudios complementarios',
    priority: 2,
    aliases: [
      'estudios', 'estudios complementarios', 'determinantes', 'indicadores csv',
      'cargar determinantes', 'cargar indicadores',
      'cargarDeterminantesCSV', 'cargarIndicadoresCSV',
      'datos complementarios',
    ],
    uiLabels: ['Estudios complementarios', 'Acordeón estudios complementarios'],
    abbreviations: [],
    historicalNames: [],
    synonyms: ['complementarios', 'datos adicionales', 'fuentes adicionales'],
    keywords: ['estudios', 'complementarios', 'determinantes', 'indicadores', 'csv'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Módulo de carga e integración de datos complementarios (determinantes de salud, indicadores externos) mediante CSV. Enriquece el perfil diagnóstico municipal.',
    functionalRole: 'interfaz',
    criticality: 'MEDIO',
    feedsRuntime: false,
    feedsPersistence: true,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-motor-at2', 'wo-motor-sintesis', 'wo-informe-municipal'],
    preferredLabel: 'Estudios complementarios',
    deprecatedLabels: [],
    notes: 'cargarDeterminantesCSV() escribe en Firebase: estrategias/{est}/municipios/{mun}/determinantes. cargarIndicadoresCSV() escribe en: .../indicadores. Confirmado en index.html ll.13611 y 13721.',
  },

  // ── PRIORIZACIÓN ──────────────────────────────────────────────────────────

  {
    id: 'lex-motor-plan',
    targetType: 'workObject',
    targetId: 'wo-motor-plan',
    canonical: 'Motor propuesta IA (Motor 2)',
    priority: 4,
    aliases: [
      'propuesta ia', 'motor plan', 'motor propuesta', 'prompt',
      'motor 2', 'motor dos',
      'generarPropuestaIA', 'generar propuesta ia',
      'motorPlanAccion',
      'propuesta epvsa automatica', 'propuesta automatica',
    ],
    uiLabels: ['Motor propuesta IA', 'Motor 2', 'Modo Automático', 'Tab Modo Automático'],
    abbreviations: ['Motor 2'],
    historicalNames: [],
    synonyms: ['motor de propuesta', 'motor ia plan', 'plan automatico', 'generacion plan'],
    keywords: ['propuesta', 'motor', 'plan', 'automatico', 'ia', 'epvsa', 'generacion'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Motor IA de propuesta de plan de acción EPVSA (Motor 2). Lee del COU y produce la propuesta salutogénica que el técnico revisa, acepta y persiste en Firebase. Puente entre el análisis diagnóstico y la implantación.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: true,
    feedsPersistence: true,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-motor-sintesis', 'wo-contextoia', 'wo-epvsa', 'wo-firebase', 'wo-agenda', 'wo-compilador'],
    preferredLabel: 'Motor propuesta IA (Motor 2)',
    deprecatedLabels: [],
    notes: 'motorPlanAccion.js es módulo IA puro: lee contextoIA, sin DOM ni Firebase. generarPropuestaIA() es el orquestador del monolito. propuestaActual vive en runtime y se acepta mediante aceptarPropuesta(). guardarPlanEnFirebase() persiste seleccionEPVSA y actuaciones en estrategias/{est}/municipios/{mun}/planAccion. sincronizarPlanConAgenda() traslada actuaciones a la Agenda Kanban. IA propone, el técnico decide: estadoRevisionHumana comienza siempre como pendiente.',
  },

  {
    id: 'lex-epvsa',
    targetType: 'workObject',
    targetId: 'wo-epvsa',
    canonical: 'Selección EPVSA',
    priority: 4,
    aliases: [
      'epvsa', 'seleccion epvsa', 'selección epvsa',
      'lineas epvsa', 'líneas epvsa',
      'priorizacion estrategica', 'priorización estratégica',
    ],
    uiLabels: ['Selección EPVSA', 'Tab Selección', 'Tab Automático', 'FASE 3'],
    abbreviations: ['EPVSA'],
    historicalNames: [],
    synonyms: [
      'seleccion estrategica', 'lineas de salud', 'estrategia local de salud',
      'tarjetas epvsa', 'modo tecnocratico', 'modo mixto', 'modo comunitario',
    ],
    keywords: ['epvsa', 'seleccion', 'lineas', 'priorizacion', 'estrategia', 'tarjetas'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Interfaz de selección jerárquica de líneas EPVSA (Fase 3). Gestiona los checkboxes línea/objetivo/indicador/programa/actuación, persiste la selección en runtime y alimenta el Compilador y la Agenda.',
    functionalRole: 'interfaz',
    criticality: 'ALTO',
    feedsRuntime: true,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-motor-plan', 'wo-fusion', 'wo-compilador', 'wo-agenda', 'wo-contextoia'],
    preferredLabel: 'Selección EPVSA',
    deprecatedLabels: [],
    notes: 'M10 mantiene COMPAS.state.seleccionEPVSA entre re-renders. aplicarPropuestaACheckboxes() aplica la propuesta del Motor 2 a los checkboxes. cargarPlanGuardado() rehidrata desde planAccionFirebase. No escribe Firebase directamente: la selección se persiste mediante guardarPlanEnFirebase() en Motor 2. Alias score fmc solapado con lex-motor-v3v4; posible conflicto de alias pendiente de limpieza.',
  },

  {
    id: 'lex-vrelas',
    targetType: 'workObject',
    targetId: 'wo-vrelas',
    canonical: 'VRELAS (votación temática)',
    priority: 3,
    aliases: [
      'vrelas', 'votacion tematica', 'votación temática',
      'votos ciudadanos', 'votacion ciudadana',
      'vrelas_importarCSV', 'importar vrelas',
    ],
    uiLabels: ['VRELAS', 'Priorización Temática', 'FASE 3 / Priorización Temática'],
    abbreviations: ['VRELAS'],
    historicalNames: [],
    synonyms: [
      'votacion por temas', 'encuesta tematica', 'votos tematicos',
      'prioridades ciudadanas tematicas',
    ],
    keywords: ['vrelas', 'votacion', 'tematica', 'ciudadanos', 'encuesta', 'prioridades'],
  },

  {
    id: 'lex-hpc',
    targetType: 'workObject',
    targetId: 'wo-hpc',
    canonical: 'HPC (Hábitos-Problemas-Colectivos)',
    priority: 3,
    aliases: [
      'hpc', 'habitos problemas colectivos', 'hábitos problemas colectivos',
      'encuesta relas', 'motor hpc',
      'relas_processData', 'analisis relas',
    ],
    // NOTA: 'relas' EXCLUIDO de aliases — es substring de 'vrelas' y causaría
    // falsos positivos al resolver consultas sobre VRELAS.
    // NOTA: 'RELAS' eliminado de uiLabels — normaliza a 'relas' que es substring
    // de 'vrelas', provocando alias hit espurio en consultas sobre VRELAS.
    uiLabels: ['HPC', 'Motor HPC', 'FASE 3 / Motor HPC'],
    abbreviations: ['HPC', 'RELAS'],
    historicalNames: [],
    synonyms: [
      'habitos de vida', 'problemas de salud', 'colectivos vulnerables',
      'participacion comunitaria', 'priorizacion comunitaria',
    ],
    keywords: ['hpc', 'relas', 'habitos', 'problemas', 'colectivos', 'comunitario', 'participacion'],
  },

  {
    id: 'lex-fusion',
    targetType: 'workObject',
    targetId: 'wo-fusion',
    canonical: 'Fusión de priorizaciones',
    priority: 4,
    aliases: [
      'fusion priorizaciones', 'fusión de priorizaciones',
      'priorizacion integrada', 'priorización integrada',
      'confirmarPriorizacion', 'confirmar priorizacion',
      'decision priorizacion', 'decision de priorizacion',
      'panel fusion', 'panel de fusion', 'panel priorizacion integrada',
    ],
    uiLabels: ['Fusión de priorizaciones', 'Panel Priorización Integrada', 'FASE 3'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'integracion priorizaciones', 'integración de priorizaciones',
      'triple priorizacion', 'priorizacion triple',
      'fusion de datos', 'fusion estrategica',
    ],
    keywords: ['fusion', 'priorizacion', 'integrada', 'decision', 'triple'],
  },

  // ── COMPILADOR ────────────────────────────────────────────────────────────

  {
    id: 'lex-compilador',
    targetType: 'workObject',
    targetId: 'wo-compilador',
    canonical: 'Compilador PLS',
    priority: 5,
    aliases: [
      'compilador', 'compilador pls', 'documento pls', 'pls', 'plan local de salud',
      'plan local', 'generarHTMLPlanLocal', 'generar pls',
      'compilar plan', 'compilacion pls',
    ],
    uiLabels: ['Compilador PLS', 'FASE 4', 'BLOQUE-016', 'Exportar PLS'],
    abbreviations: ['PLS'],
    historicalNames: [],
    synonyms: [
      'plan de salud', 'documento de salud', 'exportacion pls',
      'generar documento', 'generar informe final',
    ],
    keywords: ['compilador', 'pls', 'plan', 'local', 'salud', 'documento', 'exportar', 'generar'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Motor de generación del Plan Local de Salud en formato HTML/PDF. Consolida las salidas de todas las fases anteriores en un documento exportable y presentable al pleno.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: false,
    feedsPersistence: false,
    feedsIA: false,
    isInformational: false,
    relatedTargets: ['wo-documento-pls', 'wo-panel-estado', 'wo-epvsa', 'wo-agenda', 'wo-fusion'],
    preferredLabel: 'Compilador PLS',
    deprecatedLabels: [],
    notes: 'FASE 4 del ciclo. Función principal: generarHTMLPlanLocal. Consume datos de todas las fases previas. Sin output propio de Firebase.',
  },

  {
    id: 'lex-panel-estado',
    targetType: 'workObject',
    targetId: 'wo-panel-estado',
    canonical: 'Panel estado compilador',
    priority: 2,
    aliases: [
      'panel estado', 'panel estado compilador',
      'estado compilador', 'completitud compilador',
      'actualizarEstadoCompilador', 'verificarPlanLocalCompleto',
      'badges estado', 'estado pls',
    ],
    uiLabels: ['Panel estado compilador', 'badges de estado', 'FASE 4 / 3 badges'],
    abbreviations: [],
    historicalNames: [],
    synonyms: ['completitud pls', 'indicadores compilador', 'estado del plan'],
    keywords: ['panel', 'estado', 'compilador', 'completitud', 'badges', 'pls'],
  },

  // ── AGENDA ────────────────────────────────────────────────────────────────

  {
    id: 'lex-agenda',
    targetType: 'workObject',
    targetId: 'wo-agenda',
    canonical: 'Agenda Kanban',
    priority: 5,
    aliases: [
      'agenda', 'agenda anual', 'agenda kanban',
      'acciones agenda', 'accionesagenda',
      'kanban', 'implantacion', 'implantación',
      'guardarAgendasFirebase', 'initAgendas',
      'actuaciones del plan', 'plan de actuaciones',
    ],
    uiLabels: ['Agenda Kanban', 'Agenda', 'FASE 5', '#agenda-municipio-contenido'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'tablero kanban', 'tablero de actuaciones',
      'plan de implantacion', 'implantacion del plan',
      'actuaciones', 'acciones sanitarias',
    ],
    keywords: ['agenda', 'kanban', 'actuaciones', 'acciones', 'trimestre', 'entorno', 'implantacion'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Tablero Kanban de implantación del Plan Local de Salud. Organiza acciones sanitarias por trimestres y entornos a lo largo del ciclo de implantación.',
    functionalRole: 'interfaz',
    criticality: 'ALTO',
    feedsRuntime: false,
    feedsPersistence: true,
    feedsIA: false,
    isInformational: false,
    relatedTargets: ['wo-modal-accion', 'wo-firebase', 'wo-compilador', 'wo-epvsa'],
    preferredLabel: 'Agenda Kanban',
    deprecatedLabels: [],
    notes: 'Persiste en Firebase via guardarAgendasFirebase. FASE 5 del ciclo COMPÁS. Dependencia directa del Compilador PLS.',
  },

  {
    id: 'lex-modal-accion',
    targetType: 'workObject',
    targetId: 'wo-modal-accion',
    canonical: 'Modal de acción',
    priority: 3,
    aliases: [
      'modal de accion', 'modal de acción',
      'modal accion', 'modal actuacion',
      'formulario accion', 'formulario actuacion',
      '#modal-accion', 'guardarAccion',
      'nueva accion', 'editar accion',
    ],
    uiLabels: ['Modal de acción', '#modal-accion', 'FASE 5 / #modal-accion'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'formulario nueva actuacion', 'dialogo accion',
      'popup accion', 'modal nueva accion',
    ],
    keywords: ['modal', 'accion', 'actuacion', 'formulario', 'dialog', 'popup', 'guardar'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Formulario modal para crear y editar acciones individuales del tablero Kanban. Punto de entrada de cada actuación sanitaria del Plan Local de Salud.',
    functionalRole: 'interfaz',
    criticality: 'MEDIO',
    feedsRuntime: false,
    feedsPersistence: true,
    feedsIA: false,
    isInformational: false,
    relatedTargets: ['wo-agenda', 'wo-firebase'],
    preferredLabel: 'Modal de acción',
    deprecatedLabels: [],
    notes: 'Subordinado de la Agenda Kanban. La acción guardada (guardarAccion()) persiste en Firebase como parte del estado de la Agenda. Sin este modal la Agenda sigue siendo consultable.',
  },

  // ── EVALUACIÓN ────────────────────────────────────────────────────────────

  {
    id: 'lex-evaluacion',
    targetType: 'workObject',
    targetId: 'wo-evaluacion',
    canonical: 'Evaluación FASE 6',
    priority: 4,
    aliases: [
      'evaluacion', 'evaluación', 'fase 6',
      'evaluacion fase 6', 'evaluación fase 6',
      'eval_actualizarResultados', 'eval_calcularISS',
      'dashboard evaluacion', 'indicadores evaluacion',
    ],
    uiLabels: ['Evaluación FASE 6', 'FASE 6', '#eval-dashboard-container'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'grado de implantacion', 'seguimiento del plan',
      'resultados evaluacion', 'revision final',
    ],
    keywords: ['evaluacion', 'fase6', 'seguimiento', 'resultados', 'implantacion', 'indicadores'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Motor de evaluación y cierre del ciclo COMPÁS (Fase 6). Determina el modo evaluativo real/exploratorio, orquesta los paneles de evaluación y produce el snapshot que consume LONGI para análisis longitudinal.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: true,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-agenda', 'wo-iss', 'wo-longi', 'wo-ibse', 'wo-sam'],
    preferredLabel: 'Evaluación FASE 6',
    deprecatedLabels: [],
    notes: 'eval_actualizarFase6() determina _evaluacionModo real/exploratorio y orquesta dashboard, proceso, resultados y jornada. No escribe en Firebase: consume accionesAgenda en runtime, persistida por Agenda mediante guardarAgendasFirebase(). COMPAS_crearSnapshotEvaluacion() produce el snapshot que LONGI consume como fuente longitudinal. motorEvaluacion.js es módulo puro que lee del COU; seguimientoAnual sigue pendiente de implementar en ContextoIA.',
  },

  {
    id: 'lex-iss',
    targetType: 'workObject',
    targetId: 'wo-iss',
    canonical: 'ISS (Índice Sintético de Salud)',
    priority: 4,
    aliases: [
      'iss',
      'indice sintetico de salud', 'índice sintético de salud',
      'indice sintetico', 'indice de salud',
      'eval_calcularISS', 'calcularISS',
      'indicador terminal',
    ],
    uiLabels: ['ISS', 'Cuadro de Mandos', 'Índice Sintético de Salud'],
    abbreviations: ['ISS'],
    historicalNames: [],
    synonyms: [
      'indicador salud', 'indice salud', 'resultado final salud',
      'puntuacion salud municipal',
    ],
    keywords: ['iss', 'indice', 'sintetico', 'salud', 'cuadro', 'mandos', 'puntuacion'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Índice Sintético de Salud: indicador terminal compuesto que agrega los resultados de evaluación municipal. Referencia principal del Cuadro de Mandos.',
    functionalRole: 'motor',
    criticality: 'CRITICO',
    feedsRuntime: false,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-evaluacion', 'wo-longi', 'wo-ibse', 'wo-motor-v3v4'],
    preferredLabel: 'ISS',
    deprecatedLabels: [],
    notes: 'Función: eval_calcularISS(). Agrega IBSE (componente CB) y otros indicadores. Alimenta LONGI y comparación longitudinal. Verificar si el valor calculado persiste en Firebase.',
  },

  {
    id: 'lex-longi',
    targetType: 'workObject',
    targetId: 'wo-longi',
    canonical: 'LONGI (evaluación longitudinal)',
    priority: 4,
    aliases: [
      'longi',
      'evaluacion longitudinal', 'evaluación longitudinal',
      'longitudinal', 'contexto longitudinal',
      'COMPAS_construirContextoLongitudinalRuntime',
      'seguimiento longitudinal', 'historico ciclos',
    ],
    uiLabels: ['LONGI', 'BLOQUE-025', 'Evaluación longitudinal'],
    abbreviations: ['LONGI'],
    historicalNames: [],
    synonyms: [
      'seguimiento historico', 'evaluacion multi ciclo',
      'continuidad observable', 'ciclos municipales',
    ],
    keywords: ['longi', 'longitudinal', 'historico', 'ciclos', 'seguimiento', 'continuo'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Motor de evaluación longitudinal que construye el contexto histórico de ciclos municipales. Permite comparar resultados entre ciclos y detectar tendencias de salud.',
    functionalRole: 'motor',
    criticality: 'ALTO',
    feedsRuntime: true,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-evaluacion', 'wo-iss', 'wo-contextoia'],
    preferredLabel: 'LONGI',
    deprecatedLabels: [],
    notes: 'BLOQUE-025. Función: COMPAS_construirContextoLongitudinalRuntime(). Lee histórico de Firebase pero no escribe su propio estado. Clave para análisis multi-ciclo.',
  },

  {
    id: 'lex-motor-v3v4',
    targetType: 'workObject',
    targetId: 'wo-motor-v3v4',
    canonical: 'Motor V3/V4',
    priority: 3,
    aliases: [
      'motor v3', 'motor v4', 'motor v3 v4', 'motor v3/v4',
      'COMPAS_analizarV3', 'analizarV3',
      'motor analitico', 'motor de analisis v3',
      'fmc', 'score fmc', 'fmc v4',
    ],
    uiLabels: ['Motor V3/V4', 'BLOQUE-023'],
    abbreviations: ['V3', 'V4', 'V3/V4'],
    historicalNames: ['Motor v2', 'AT2 v2'],
    synonyms: ['motor siguiente generacion', 'motor moderno', 'analisis v3'],
    keywords: ['v3', 'v4', 'motor', 'fmc', 'analisis', 'tarjetas', 'siguiente', 'generacion'],
  },

  // ── INFRAESTRUCTURA ───────────────────────────────────────────────────────

  {
    id: 'lex-contextoia',
    targetType: 'workObject',
    targetId: 'wo-contextoia',
    canonical: 'ContextoIA',
    priority: 4,
    aliases: [
      'contextoia', 'contexto ia', 'contexto operativo', 'cou',
      'crearContextoIA', 'crear contexto ia',
      'snapshot ia', 'contexto de ia',
      'contexto motor',
    ],
    uiLabels: ['ContextoIA', 'Contexto IA'],
    abbreviations: ['COU'],
    historicalNames: [],
    synonyms: [
      'contexto de motores', 'entrada motores ia',
      'snapshot operativo', 'estado para ia',
    ],
    keywords: ['contextoia', 'contexto', 'ia', 'snapshot', 'motores', 'entrada', 'cou'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Estructura del Contexto Operativo Unificado (COU). Se ensambla bajo demanda a partir de WorkObjects, relaciones, riesgos y datos vivos; es la entrada estructurada de los motores IA.',
    functionalRole: 'agregador',
    criticality: 'CRITICO',
    feedsRuntime: false,
    feedsPersistence: false,
    feedsIA: true,
    isInformational: false,
    relatedTargets: ['wo-motor-sintesis', 'wo-motor-plan', 'wo-firebase', 'wo-ibse'],
    preferredLabel: 'ContextoIA',
    deprecatedLabels: [],
    notes: 'COU es la instancia concreta del ContextoIA. Es efímero: se genera bajo demanda desde salaData y no persiste en Firebase. Sin ContextoIA los motores IA no tienen entrada estructurada.',
  },

  {
    id: 'lex-firebase',
    targetType: 'workObject',
    targetId: 'wo-firebase',
    canonical: 'Firebase',
    priority: 5,
    aliases: [
      'firebase',
      'persistencia', 'rehidratacion', 'rehidratación',
      'guardar', 'recuperar',
      'guardarTodoFirebase', 'cargarDatosMunicipioFirebase',
      'backend', 'base de datos', 'base datos',
    ],
    uiLabels: ['Firebase', 'CDN Firebase'],
    abbreviations: [],
    historicalNames: [],
    synonyms: [
      'fuente de verdad', 'almacenamiento', 'persistencia firebase',
      'base de datos firebase', 'realtime database',
    ],
    keywords: ['firebase', 'persistencia', 'backend', 'almacenamiento', 'rehidratacion', 'guardar'],
    // ── Catálogo semántico ──────────────────────────────────────────────────
    description: 'Capa de persistencia principal de COMPÁS. Almacena y rehidrata el estado completo de cada municipio entre sesiones via Firebase Realtime Database.',
    functionalRole: 'persistencia',
    criticality: 'CRITICO',
    feedsRuntime: true,
    feedsPersistence: true,
    feedsIA: false,
    isInformational: false,
    relatedTargets: ['wo-agenda', 'wo-ibse', 'wo-contextoia', 'wo-municipio', 'wo-evaluacion'],
    preferredLabel: 'Firebase',
    deprecatedLabels: ['backend', 'base de datos'],
    notes: 'Firebase Realtime Database es la única fuente de verdad persistente. Cualquier cambio de sesión que no pase por Firebase no sobrevive a la recarga.',
  },

  {
    id: 'lex-documento-pls',
    targetType: 'workObject',
    targetId: 'wo-documento-pls',
    canonical: 'Documento PLS',
    priority: 4,
    aliases: [
      'documento pls', 'plan local de salud', 'pleno municipal', 'documento final',
      'exportarPDFPlanLocal', 'pdf pls',
      'artefacto final', 'entregable final',
    ],
    uiLabels: ['Documento PLS', 'Output de FASE 4', 'PDF del plan'],
    abbreviations: ['PLS'],
    historicalNames: [],
    synonyms: [
      'documento entregable', 'informe final pls',
      'plan imprimible', 'pdf exportable',
    ],
    keywords: ['documento', 'pls', 'pdf', 'exportar', 'imprimir', 'entregable', 'final'],
  },

];

// ── Funciones de acceso ───────────────────────────────────────────────────

/**
 * Genera el mapa de alias compatible con aliasWorkObjects.
 * Incluye: aliases + uiLabels + abbreviations + historicalNames + synonyms.
 * Los keywords NO entran (son demasiado ambiguos para dar +40).
 *
 * Uso: sustituye directamente al dict aliasWorkObjects en iaOperativa.js.
 *   const aliasWorkObjects = buildAliasMap();
 */
export function buildAliasMap() {
  const map = {};
  for (const entry of LEXICON_ENTRIES) {
    if (entry.targetType !== 'workObject') continue;
    const terms = [
      ...entry.aliases,
      ...entry.uiLabels,
      ...entry.abbreviations,
      ...entry.historicalNames,
      ...entry.synonyms,
    ].filter(Boolean).map((t) => t.toLowerCase().trim());
    map[entry.targetId] = unique([...(map[entry.targetId] ?? []), ...terms]);
  }
  return map;
}

function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Devuelve todas las entradas del lexicon para un targetId dado.
 */
export function getLexiconEntries(targetId) {
  return LEXICON_ENTRIES.filter((e) => e.targetId === targetId);
}

/**
 * Devuelve todos los términos que resuelven a un targetId (para debug/gov).
 */
export function getAllTermsForTarget(targetId) {
  const entries = getLexiconEntries(targetId);
  return unique(entries.flatMap((e) => [
    e.canonical,
    ...e.aliases,
    ...e.uiLabels,
    ...e.abbreviations,
    ...e.historicalNames,
    ...e.synonyms,
    ...e.keywords,
  ]));
}

/**
 * Búsqueda inversa: dado un texto normalizado, devuelve los targetIds candidatos.
 * Solo considera el alias map (no keywords).
 */
export function lookupByText(normalizedText) {
  const map = buildAliasMap();
  const found = [];
  for (const [targetId, terms] of Object.entries(map)) {
    if (terms.some((t) => normalizedText.includes(t.toLowerCase()))) {
      found.push(targetId);
    }
  }
  return unique(found);
}

/**
 * Devuelve los metadatos semánticos del catálogo para un targetId dado.
 * Solo lee campos del catálogo oficial (no los de alias/scoring).
 * Devuelve null si el targetId no existe en el Lexicon.
 */
export function getLexiconMeta(targetId) {
  const entry = LEXICON_ENTRIES.find((e) => e.targetId === targetId);
  if (!entry) return null;
  return {
    targetId:        entry.targetId,
    targetType:      entry.targetType,
    canonical:       entry.canonical,
    preferredLabel:  entry.preferredLabel  ?? entry.canonical,
    description:     entry.description     ?? null,
    functionalRole:  entry.functionalRole  ?? null,
    criticality:     entry.criticality     ?? null,
    feedsRuntime:    entry.feedsRuntime     ?? null,
    feedsPersistence:entry.feedsPersistence ?? null,
    feedsIA:         entry.feedsIA          ?? null,
    isInformational: entry.isInformational  ?? false,
    relatedTargets:  entry.relatedTargets   ?? [],
    deprecatedLabels:entry.deprecatedLabels ?? [],
    notes:           entry.notes            ?? null,
    priority:        entry.priority,
  };
}

// ── Consultas de gobierno ─────────────────────────────────────────────────
// Responden preguntas estructurales sobre COMPÁS desde el catálogo oficial.
// Solo operan sobre los campos semánticos (no sobre alias/scoring).
// Devuelven arrays de objetos compactos — nunca mutan LEXICON_ENTRIES.

const CRITICALITY_ORDER = { CRITICO: 4, ALTO: 3, MEDIO: 2, BAJO: 1 };

function _meta(e) {
  return {
    targetId:         e.targetId,
    targetType:       e.targetType,
    canonical:        e.canonical,
    preferredLabel:   e.preferredLabel   ?? e.canonical,
    functionalRole:   e.functionalRole   ?? null,
    criticality:      e.criticality      ?? null,
    feedsRuntime:     e.feedsRuntime      ?? null,
    feedsPersistence: e.feedsPersistence  ?? null,
    feedsIA:          e.feedsIA           ?? null,
    isInformational:  e.isInformational   ?? false,
    notes:            e.notes             ?? null,
  };
}

/** ¿Qué objetos participan operativamente? (runtime, persistencia o IA; no puramente informativos). */
export function getOperationalTargets() {
  return LEXICON_ENTRIES
    .filter((e) => !e.isInformational && (e.feedsRuntime || e.feedsPersistence || e.feedsIA))
    .map(_meta);
}

/** ¿Qué objetos son solo informativos o documentales? */
export function getInformationalTargets() {
  return LEXICON_ENTRIES.filter((e) => e.isInformational === true).map(_meta);
}

/** ¿Qué objetos alimentan los motores IA (entran en el COU)? */
export function getIATargets() {
  return LEXICON_ENTRIES.filter((e) => e.feedsIA === true).map(_meta);
}

/** ¿Qué objetos leen o escriben en Firebase / capa de persistencia? */
export function getPersistenceTargets() {
  return LEXICON_ENTRIES.filter((e) => e.feedsPersistence === true).map(_meta);
}

/** ¿Qué objetos alimentan el runtime activo durante una sesión? */
export function getRuntimeTargets() {
  return LEXICON_ENTRIES.filter((e) => e.feedsRuntime === true).map(_meta);
}

/**
 * ¿Qué objetos son críticos a partir de un nivel mínimo?
 * minLevel: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO' (por defecto 'CRITICO')
 * Resultado ordenado de mayor a menor criticidad.
 */
export function getCriticalTargets(minLevel = 'CRITICO') {
  const floor = CRITICALITY_ORDER[minLevel] ?? 4;
  return LEXICON_ENTRIES
    .filter((e) => (CRITICALITY_ORDER[e.criticality] ?? 0) >= floor)
    .map(_meta)
    .sort((a, b) => (CRITICALITY_ORDER[b.criticality] ?? 0) - (CRITICALITY_ORDER[a.criticality] ?? 0));
}

/**
 * ¿Qué objetos tienen un rol funcional concreto?
 * role: 'motor' | 'interfaz' | 'persistencia' | 'informacional' | 'agregador'
 */
export function getTargetsByFunctionalRole(role) {
  return LEXICON_ENTRIES.filter((e) => e.functionalRole === role).map(_meta);
}

/**
 * ¿Qué podría revisarse con bajo riesgo?
 * Criterio: no alimenta runtime ni persistencia, y criticidad BAJO o MEDIO
 * (o sin caracterizar aún). No implica que sea eliminable — solo revisable.
 */
export function getTargetsSafeToReview() {
  return LEXICON_ENTRIES
    .filter((e) =>
      !e.feedsRuntime &&
      !e.feedsPersistence &&
      (e.criticality === 'BAJO' || e.criticality === 'MEDIO' || !e.criticality),
    )
    .map(_meta);
}

/**
 * Auditoría completa de cobertura del catálogo semántico.
 * Devuelve la matriz de todos los targetId con estado de campos y anomalías.
 * Útil para paneles de gobierno, herramientas de IA y auditorías automáticas.
 */
export function getCatalogueAudit() {
  const SEMANTIC = ['description', 'functionalRole', 'criticality', 'feedsRuntime', 'feedsPersistence', 'feedsIA', 'isInformational'];
  return LEXICON_ENTRIES.map((e) => {
    const filled  = SEMANTIC.filter((f) => e[f] !== undefined && e[f] !== null);
    const missing = SEMANTIC.filter((f) => e[f] === undefined || e[f] === null);
    const anomalies = [];
    if (e.isInformational && e.feedsRuntime)     anomalies.push('isInformational=true y feedsRuntime=true');
    if (e.isInformational && e.feedsIA)          anomalies.push('isInformational=true y feedsIA=true');
    if (e.isInformational && e.feedsPersistence) anomalies.push('isInformational=true y feedsPersistence=true');
    if (e.functionalRole === 'informacional' && e.criticality === 'CRITICO')
      anomalies.push('functionalRole=informacional y criticality=CRITICO');
    return {
      targetId:         e.targetId,
      targetType:       e.targetType,
      canonical:        e.canonical,
      coverage:         `${filled.length}/${SEMANTIC.length}`,
      complete:         missing.length === 0,
      missing:          missing.length > 0 ? missing : null,
      anomalies:        anomalies.length > 0 ? anomalies : null,
      functionalRole:   e.functionalRole   ?? null,
      criticality:      e.criticality      ?? null,
      feedsRuntime:     e.feedsRuntime      ?? null,
      feedsPersistence: e.feedsPersistence  ?? null,
      feedsIA:          e.feedsIA           ?? null,
      isInformational:  e.isInformational   ?? null,
    };
  });
}

/**
 * Estadísticas de cobertura del lexicon.
 */
export function getLexiconStats() {
  const byTarget = {};
  for (const entry of LEXICON_ENTRIES) {
    if (!byTarget[entry.targetId]) byTarget[entry.targetId] = { terms: 0, entries: 0 };
    byTarget[entry.targetId].entries++;
    byTarget[entry.targetId].terms += entry.aliases.length + entry.uiLabels.length +
      entry.abbreviations.length + entry.historicalNames.length + entry.synonyms.length;
  }
  return {
    totalEntries: LEXICON_ENTRIES.length,
    totalTargets: Object.keys(byTarget).length,
    totalTerms: Object.values(byTarget).reduce((s, v) => s + v.terms, 0),
    byTarget,
  };
}
