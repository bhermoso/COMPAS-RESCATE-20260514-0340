// Checklist de gobierno — referencias a objetos existentes en salaData.js
// Sin copiar descripciones, codeRefs ni riesgos. Solo punteros y valoración humana.

const p = (id, sourceType, sourceId, suggested) => ({
  id,
  sourceType,
  sourceId,
  assessment: 'pendiente_auditoria',
  suggestedAssessment: suggested,
  governanceTags: [],
  notes: '',
  reviewedAt: null,
  reviewedBy: null,
});

export const governanceChecklist = [
  // ── workObjects (24) ──────────────────────────────────────────────────────
  p('gc-01', 'workObject', 'wo-municipio',          'requiere_ficha'),
  p('gc-02', 'workObject', 'wo-config-estrategica', 'pendiente_auditoria'),
  p('gc-03', 'workObject', 'wo-informe-municipal',  'requiere_ficha'),
  p('gc-04', 'workObject', 'wo-motor-at2',          'requiere_ficha'),
  p('gc-05', 'workObject', 'wo-motor-sintesis',     'requiere_ficha'),
  p('gc-06', 'workObject', 'wo-ibse',               'pendiente_auditoria'),
  p('gc-07', 'workObject', 'wo-sam',                'pendiente_auditoria'),
  p('gc-08', 'workObject', 'wo-estudios',           'pendiente_auditoria'),
  p('gc-09', 'workObject', 'wo-motor-plan',         'requiere_ficha'),
  p('gc-10', 'workObject', 'wo-epvsa',              'requiere_ficha'),
  p('gc-11', 'workObject', 'wo-vrelas',             'pendiente_auditoria'),
  p('gc-12', 'workObject', 'wo-hpc',                'pendiente_auditoria'),
  p('gc-13', 'workObject', 'wo-fusion',             'requiere_ficha'),
  p('gc-14', 'workObject', 'wo-compilador',         'requiere_ficha'),
  p('gc-15', 'workObject', 'wo-panel-estado',       'pendiente_auditoria'),
  p('gc-16', 'workObject', 'wo-agenda',             'requiere_ficha'),
  p('gc-17', 'workObject', 'wo-modal-accion',       'pendiente_auditoria'),
  p('gc-18', 'workObject', 'wo-evaluacion',         'requiere_ficha'),
  p('gc-19', 'workObject', 'wo-iss',                'pendiente_auditoria'),
  p('gc-20', 'workObject', 'wo-longi',              'pendiente_auditoria'),
  p('gc-21', 'workObject', 'wo-motor-v3v4',         'pendiente_auditoria'),
  p('gc-22', 'workObject', 'wo-contextoia',         'requiere_ficha'),
  p('gc-23', 'workObject', 'wo-firebase',           'requiere_ficha'),
  p('gc-24', 'workObject', 'wo-documento-pls',      'requiere_ficha'),

  // ── panopticoNodes (10) ───────────────────────────────────────────────────
  p('gc-25', 'panopticoNode', 'pn-que-es-compas',             'pendiente_auditoria'),
  p('gc-26', 'panopticoNode', 'pn-documentos-proceso',        'pendiente_auditoria'),
  p('gc-27', 'panopticoNode', 'pn-plan-local-salud',          'requiere_ficha'),
  p('gc-28', 'panopticoNode', 'pn-agenda-anual',              'requiere_ficha'),
  p('gc-29', 'panopticoNode', 'pn-priorizacion',             'requiere_ficha'),
  p('gc-30', 'panopticoNode', 'pn-estudios-complementarios', 'pendiente_auditoria'),
  p('gc-31', 'panopticoNode', 'pn-firebase',                  'requiere_ficha'),
  p('gc-32', 'panopticoNode', 'pn-motores',                   'requiere_ficha'),
  p('gc-33', 'panopticoNode', 'pn-runtime',                   'requiere_ficha'),
  p('gc-54', 'panopticoNode', 'pn-evaluacion',               'requiere_ficha'),

  // ── runtimeObjects (8) ───────────────────────────────────────────────────
  p('gc-34', 'runtimeObject', 'planLocalSalud',          'requiere_ficha'),
  p('gc-35', 'runtimeObject', 'ContextoIA',              'requiere_ficha'),
  p('gc-36', 'runtimeObject', 'accionesAgenda',          'requiere_ficha'),
  p('gc-37', 'runtimeObject', 'propuestaActual',         'requiere_ficha'),
  p('gc-38', 'runtimeObject', 'datosFusionPriorizacion', 'pendiente_auditoria'),
  p('gc-39', 'runtimeObject', 'analisisActual',          'requiere_ficha'),
  p('gc-40', 'runtimeObject', 'analisisActualV3',        'pendiente_auditoria'),
  p('gc-41', 'runtimeObject', 'window.COMPAS.state',     'pendiente_auditoria'),

  // ── risks (6) ─────────────────────────────────────────────────────────────
  p('gc-42', 'risk', 'ZC-002',                        'requiere_arbitraje'),
  p('gc-43', 'risk', 'RT-005',                        'requiere_arbitraje'),
  p('gc-44', 'risk', 'GAP-PAE-001',                   'requiere_ficha'),
  p('gc-45', 'risk', 'GAP-PAE-002',                   'requiere_ficha'),
  p('gc-46', 'risk', 'DEUDA-CHK-006-007-PROVISIONAL', 'pendiente_auditoria'),
  p('gc-47', 'risk', 'LIMITE-CONTROL-TOTAL',          'requiere_arbitraje'),

  // ── territoryData.domains (6) ─────────────────────────────────────────────
  p('gc-48', 'domain', 'diagnostico',    'pendiente_auditoria'),
  p('gc-49', 'domain', 'priorizacion',   'pendiente_auditoria'),
  p('gc-50', 'domain', 'compilador',     'requiere_ficha'),
  p('gc-51', 'domain', 'agenda',         'requiere_ficha'),
  p('gc-52', 'domain', 'evaluacion',     'pendiente_auditoria'),
  p('gc-53', 'domain', 'infraestructura','requiere_ficha'),
];
