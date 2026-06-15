import { useMemo, useState } from 'react';
import {
  createEncargo,
  createExpediente,
  detectWorkObjectIds,
  resolveContext,
  runOperationalAi,
} from '../data/iaOperativa.js';
import { getLexiconMeta } from '../data/lexicon.js';

const EJEMPLOS = [
  'Arregla Agenda.',
  'Ocúpate de Firebase.',
  'Quiero entender IBSE.',
  'Prepárame un prompt.',
];

const INTENT_LABELS = {
  comprension:  'Comprensión',
  intervencion: 'Intervención',
  impacto:      'Análisis de impacto',
  localizacion: 'Localización',
  prompt:       'Generación de prompt',
  analisis:     'Análisis',
  baja_confianza: 'Baja confianza',
};

function selectedToWorkObjectIds(selected, selectedItem, data) {
  if (!selected) return [];
  if (selected.type === 'workObject') return [selected.id];
  if (selected.type === 'panopticoNode') return selectedItem?.workObjectIds ?? selectedItem?.workObjects?.map((i) => i.id) ?? [];
  if (selected.type === 'runtime') {
    return data.workObjects
      .filter((wo) => JSON.stringify(wo).toLowerCase().includes(selected.id.toLowerCase()))
      .map((wo) => wo.id);
  }
  if (selected.type === 'risk') {
    return data.workObjects
      .filter((wo) => (wo.risks ?? []).includes(selected.id))
      .map((wo) => wo.id);
  }
  return [];
}

// ── Acordeón ──────────────────────────────────────────────────────────────

function Acordeon({ title, count, isOpen, onToggle, children }) {
  return (
    <div className="ai-acordeon">
      <button type="button" className="ai-acordeon-trigger" onClick={onToggle}>
        <span>{isOpen ? '▲' : '▼'} {title}{count != null ? ` (${count})` : ''}</span>
      </button>
      {isOpen && <div className="ai-acordeon-body">{children}</div>}
    </div>
  );
}

// ── Contenidos de acordeones ──────────────────────────────────────────────

function CandidatosPanel({ candidatos, alternativeIds = [] }) {
  if (!candidatos?.length) return <p className="ai-muted">Sin candidatos detectados para esta consulta.</p>;
  const altSet = new Set(alternativeIds);
  return (
    <ul className="ai-code-list">
      {candidatos.map((c) => (
        <li key={c.id}>
          {altSet.has(c.id) && <span className="ai-risk-sev" style={{ marginRight: 4 }}>alt</span>}
          <strong>{c.name}</strong>
          <span className="ai-muted"> — {c.group} — {c.score} pts</span>
        </li>
      ))}
    </ul>
  );
}

function ContextoPanel({ cou }) {
  const Row = ({ label, items }) =>
    items?.length ? (
      <div className="ai-ctx-row">
        <span className="ai-ctx-label">{label}</span>
        <div className="ai-ctx-chips">
          {items.map((i) => <span key={i.id ?? i.name ?? i} className="ai-ctx-chip">{i.name ?? i.label ?? i.id ?? i}</span>)}
        </div>
      </div>
    ) : null;

  return (
    <div className="ai-ctx-panel">
      <Row label="Núcleo"         items={cou.relevance?.core ?? []} />
      <Row label="Apoyo directo"  items={cou.relevance?.direct ?? []} />
      <Row label="Ampliado"       items={cou.relevance?.extended ?? []} />
      <Row label="Dominio"        items={cou.domains ?? []} />
      <Row label="Runtime"        items={cou.runtimeObjects ?? []} />
    </div>
  );
}

function CodigoPanel({ codeRefs }) {
  if (!codeRefs?.length) return <p className="ai-muted">Sin referencias de código confirmadas.</p>;
  return (
    <ul className="ai-code-list">
      {codeRefs.map((r, i) => (
        <li key={r.identifier ?? i}>
          <code>{r.identifier}</code>
          {r.line ? <span> · {r.file}:{r.line}</span> : r.file ? <span> · {r.file}</span> : null}
          {r.workObjectName && <span className="ai-muted"> — {r.workObjectName}</span>}
        </li>
      ))}
    </ul>
  );
}

function RiesgosPanel({ risks, riskNotes }) {
  return (
    <div>
      {risks?.length ? (
        <ul className="ai-risk-list">
          {risks.map((r) => (
            <li key={r.id}>
              <strong>{r.id}</strong>
              {r.severity && <span className="ai-risk-sev">{r.severity}</span>}
              <span>{r.title}</span>
            </li>
          ))}
        </ul>
      ) : <p className="ai-muted">Sin riesgos normalizados en este contexto.</p>}
      {riskNotes?.length > 0 && (
        <ul className="ai-risk-list" style={{ marginTop: 8 }}>
          {riskNotes.map((n, i) => <li key={i} className="ai-muted">{n}</li>)}
        </ul>
      )}
    </div>
  );
}

function ChecklistGobiernoPanel({ items }) {
  if (!items?.length) return <p className="ai-muted">Sin entradas de gobierno en este contexto.</p>;
  return (
    <ul className="ai-checklist-gov">
      {items.map((item) => (
        <li key={item.id}>
          <span className="ai-ctx-label">{item.sourceId}</span>
          <span className={`ai-assessment ai-assessment--${item.assessment}`}>{item.assessment}</span>
          {item.notes && <p className="ai-muted" style={{ marginTop: 2 }}>{item.notes}</p>}
          {item.reviewedBy && <p className="ai-muted">Revisado por {item.reviewedBy}</p>}
        </li>
      ))}
    </ul>
  );
}

function ModoAvanzadoPanel({ cou }) {
  return (
    <div className="ai-cou-raw">
      <p className="ai-muted" style={{ marginBottom: 4, fontStyle: 'italic' }}>
        Este panel muestra el COU en bruto. Solo para ingeniería y debug.
      </p>
      <p className="ai-muted">{cou.source}</p>
      <p className="ai-muted">Generado: {new Date(cou.generatedAt).toLocaleString('es-ES')}</p>
      <ul style={{ margin: '8px 0 0', paddingLeft: 16, display: 'grid', gap: 4 }}>
        <li className="ai-muted">{cou.workObjects.length} workObject(s)</li>
        <li className="ai-muted">{cou.codeRefs.length} codeRef(s)</li>
        <li className="ai-muted">{cou.relations.length} relación(es)</li>
        <li className="ai-muted">{cou.risks.length} riesgo(s) + {cou.riskNotes.length} nota(s)</li>
        <li className="ai-muted">{cou.runtimeObjects.length} runtime object(s)</li>
        <li className="ai-muted">{cou.checklist.length} entrada(s) checklist</li>
        <li className="ai-muted">LiveData: {cou.liveData.estado}</li>
      </ul>
    </div>
  );
}

// ── Tarjeta de respuesta principal ────────────────────────────────────────

function ResponseCard({ expediente, onOpenInSala }) {
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const { respuesta, contexto } = expediente;
  const {
    declaracion, diagnostico, riesgoPrincipal, planActuacion, proximoPaso,
    estadoSistema, objetoNucleo, promptGenerado, perspective,
    seccionesAdicionales, mostrarEstadoSistema,
  } = respuesta;
  const isPrompt = perspective === 'prompt';

  return (
    <section className="ai-response-card">

      {/* 1. Declaración de apertura — primera persona, dirigida al operador */}
      <p className="ai-declaracion">{declaracion}</p>

      {/* 2. Estado del sistema — oculto para comprensión y localización */}
      {mostrarEstadoSistema !== false && estadoSistema?.some((s) => s.active) && (
        <div className="ai-estado-sistema">
          <span className="eyebrow">Estado del sistema</span>
          <ul className="ai-estado-lista">
            {estadoSistema.map((s) => (
              <li key={s.id} className={s.active ? 'ai-estado-activo' : 'ai-estado-inactivo'}>
                <span aria-hidden="true">{s.active ? '●' : '○'}</span>{s.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Diagnóstico */}
      <div className="ai-seccion">
        <span className="eyebrow">Diagnóstico</span>
        {isPrompt
          ? <pre className="ai-prompt-text">{promptGenerado}</pre>
          : <p className="ai-texto">{diagnostico}</p>}
      </div>

      {/* 4. Riesgo principal — se omite para comprensión y localización */}
      {!isPrompt && riesgoPrincipal && (
        <div className="ai-seccion ai-seccion--riesgo">
          <span className="eyebrow">Riesgo principal</span>
          <p className="ai-texto">{riesgoPrincipal}</p>
        </div>
      )}

      {/* 4.5. Secciones adicionales orientadas por intención */}
      {seccionesAdicionales?.map((s, i) => (
        <div key={i} className="ai-seccion">
          <span className="eyebrow">{s.titulo}</span>
          <p className="ai-texto" style={{ whiteSpace: 'pre-line' }}>{s.contenido}</p>
        </div>
      ))}

      {/* 5. Plan de actuación */}
      {planActuacion?.length > 0 && (
        <div className="ai-seccion">
          <span className="eyebrow">Plan de actuación recomendado</span>
          <ol className="ai-plan-lista">
            {planActuacion.map((paso, i) => <li key={i}>{paso}</li>)}
          </ol>
        </div>
      )}

      {/* 6. Próximo paso */}
      {proximoPaso && (
        <div className="ai-accion-bloque">
          <span className="eyebrow">Próximo paso</span>
          <p>{proximoPaso}</p>
          {objetoNucleo && (
            <button
              type="button"
              className="ai-chip-link"
              style={{ marginTop: 8 }}
              onClick={() => onOpenInSala('workObject', objetoNucleo.workObjectId)}
            >
              Abrir {objetoNucleo.name} en la Sala →
            </button>
          )}
        </div>
      )}

      {/* 7. Acordeones — todo lo técnico colapsado */}
      <div className="ai-acordeones">
        {(perspective === 'baja_confianza' || respuesta.ambiguous) && (
          <Acordeon
            title={respuesta.ambiguous ? 'Ambigüedad — candidatos' : 'Candidatos detectados'}
            count={contexto.relevance?.candidatos?.length ?? 0}
            isOpen={open.cand ?? true}
            onToggle={() => toggle('cand')}
          >
            <CandidatosPanel
              candidatos={contexto.relevance?.candidatos}
              alternativeIds={respuesta.alternativeIds ?? []}
            />
          </Acordeon>
        )}
        <Acordeon title="Contexto" count={contexto.workObjects.length} isOpen={open.ctx} onToggle={() => toggle('ctx')}>
          <ContextoPanel cou={contexto} />
        </Acordeon>
        <Acordeon title="Código" count={contexto.codeRefs.length} isOpen={open.cod} onToggle={() => toggle('cod')}>
          <CodigoPanel codeRefs={contexto.codeRefs} />
        </Acordeon>
        <Acordeon title="Riesgos" count={contexto.risks.length + contexto.riskNotes.length} isOpen={open.rie} onToggle={() => toggle('rie')}>
          <RiesgosPanel risks={contexto.risks} riskNotes={contexto.riskNotes} />
        </Acordeon>
        <Acordeon title="Valoración de gobierno" count={contexto.checklist.length} isOpen={open.gov} onToggle={() => toggle('gov')}>
          <ChecklistGobiernoPanel items={contexto.checklist} />
        </Acordeon>
        <Acordeon title="Modo avanzado / Ingeniería" isOpen={open.cou} onToggle={() => toggle('cou')}>
          <ModoAvanzadoPanel cou={contexto} />
        </Acordeon>
      </div>

      {/* Pie minimal */}
      <p className="ai-muted" style={{ fontSize: 10, paddingTop: 4 }}>
        {expediente.id} · {new Date(expediente.historial[0]?.at).toLocaleString('es-ES')} · {expediente.estado}
      </p>
    </section>
  );
}

// ── Helpers para el Expediente Técnico ───────────────────────────────────

function buildPromptTecnico(instruccion, wo, cou, lexMeta) {
  const lines = [
    'Eres Claude Code. Actúas sobre el repositorio COMPÁS (index.html monolítico ~98k líneas + módulos en ia/).',
    '',
    `**Encargo del operador:** ${instruccion}`,
  ];
  if (wo) {
    lines.push(`**Objeto de intervención:** ${wo.name} (${wo.id}) · Grupo: ${wo.group} · Criticidad: ${wo.criticality ?? '?'}/5`);
    if (wo.function)  lines.push(`**Función documentada:** ${wo.function}`);
    if (wo.location)  lines.push(`**Ubicación en UI:** ${wo.location}`);
  }
  const refs = (cou.codeRefs ?? []).slice(0, 6);
  if (refs.length) {
    lines.push('\n**Puntos de código conocidos:**');
    refs.forEach((r) => lines.push(`  - ${r.identifier}${r.line ? ` — ${r.file}:${r.line}` : r.file ? ` — ${r.file}` : ''}`));
  }
  if (wo?.consumes?.length) lines.push(`\n**Consume:** ${wo.consumes.slice(0, 5).join(', ')}`);
  if (wo?.produces?.length) lines.push(`**Produce:** ${wo.produces.slice(0, 5).join(', ')}`);
  if (wo?.engines?.length)  lines.push(`**Motores / funciones principales:** ${wo.engines.join(', ')}`);
  if (wo?.breaksIfFails)    lines.push(`**Consecuencia si falla:** ${wo.breaksIfFails}`);
  const risks = (cou.risks ?? []).slice(0, 4);
  if (risks.length) {
    lines.push('\n**Riesgos documentados:**');
    risks.forEach((r) => lines.push(`  - [${r.severity ?? '?'}] ${r.id}: ${r.title}`));
  }
  if (lexMeta?.notes) lines.push(`\n**Nota del catálogo:** ${lexMeta.notes}`);
  lines.push('\n**Restricciones obligatorias (no negociables):**');
  lines.push('  - Auditar el código antes de cualquier edición. Leer las funciones implicadas completas.');
  lines.push('  - Una sola intervención mínima por respuesta. No encadenar cambios.');
  lines.push('  - No inventar dependencias no confirmadas en el código real del repo.');
  lines.push('  - No modificar lógica funcional fuera del bloque objetivo.');
  lines.push('  - No refactorizar ni renombrar fuera del bloque intervenido.');
  lines.push('  - Backup antes de cualquier edición (cp <archivo> <archivo>.backup_<fecha>).');
  lines.push('  - Verificar en http://localhost:8000 tras el cambio.');
  lines.push('\n**Verificaciones exigidas:**');
  lines.push('  1. Antes del cambio: localizar y leer la función/identificador completo.');
  if ((cou.runtimeObjects ?? []).some((r) => r.persistence && !r.persistence.toLowerCase().startsWith('no')))
    lines.push('  2. Antes del cambio: revisar rutas Firebase implicadas (lectura + escritura).');
  lines.push('  3. Después del cambio: probar el flujo completo en localhost:8000.');
  lines.push('  4. Después del cambio: consola del navegador sin errores nuevos.');
  if ((cou.runtimeObjects ?? []).length > 0)
    lines.push(`  5. Después del cambio: verificar runtime objects: ${(cou.runtimeObjects ?? []).map((r) => r.id).join(', ')}.`);
  if ((cou.relevance?.direct ?? []).length > 0)
    lines.push(`  6. Regresiones en objetos directos: ${(cou.relevance.direct ?? []).slice(0, 3).map((o) => o.name).join(', ')}.`);
  return lines.join('\n');
}

// ── Componentes de bloque del expediente ─────────────────────────────────

function ExpRow({ label, children, absent }) {
  return (
    <div className="exp-row">
      <span className="exp-label">{label}</span>
      <span className="exp-value">
        {absent ? <span className="ai-muted exp-na">no consta en catálogo</span> : children}
      </span>
    </div>
  );
}

function ExpTag({ children, type = 'default' }) {
  return <span className={`exp-tag exp-tag--${type}`}>{children}</span>;
}

// ── ExpedienteCard — reemplaza ResponseCard como renderer principal ────────

function ExpedienteCard({ expediente, onOpenInSala }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [openSec, setOpenSec] = useState({ prompt: false });
  const toggleSec = (k) => setOpenSec((p) => ({ ...p, [k]: !p[k] }));

  const cou        = expediente.contexto;
  const instruccion = expediente.historial?.[0]?.text ?? expediente.objetivo;
  const coreObj    = cou.relevance?.core?.[0] ?? null;
  const lexMeta    = coreObj ? getLexiconMeta(coreObj.id) : null;
  const candidatos = cou.relevance?.candidatos ?? [];
  const topScore   = candidatos[0]?.score ?? null;
  const lowConf    = !!(cou.relevance?.lowConfidence);
  const confianza  = lowConf ? 'baja' : topScore != null ? `${topScore} pts` : 'no calculada';

  // DOM selectors extraídos de location y codeRefs
  const domSels = [];
  if (coreObj?.location) {
    const m = coreObj.location.match(/#[\w-]+/g);
    if (m) domSels.push(...m);
  }
  cou.codeRefs.forEach((r) => {
    const m = (r.identifier ?? '').match(/#[\w-]+/g);
    if (m) domSels.push(...m);
  });
  const uniqueDomSels = [...new Set(domSels)];

  // Firebase paths: parseo textual de produces/consumes
  const fbSet = new Set();
  const extractFb = (arr) => (arr ?? []).forEach((s) => {
    // Patrón: "Firebase /ruta" o "Firebase /ruta1/ruta2"
    const m1 = String(s).match(/Firebase\s+([\w/{}.]+)/i);
    if (m1) fbSet.add(m1[1]);
    // Rutas explícitas como /agendas, /municipios, /analisisIA
    const m2 = String(s).match(/(\/[a-zA-Z][\w{}/.]*)/g);
    if (m2) m2.forEach((p) => p.length > 3 && fbSet.add(p));
  });
  extractFb(coreObj?.produces);
  extractFb(coreObj?.consumes);
  const fbPaths = [...fbSet];

  // Funciones de escritura inferidas de engines
  const writeEngines = (coreObj?.engines ?? []).filter((e) =>
    /guardar|write|set\b|push|save|cargar/i.test(e));

  // Runtime objects con rehidratación real
  const rtConRehi = (cou.runtimeObjects ?? []).filter(
    (r) => r.rehydration && !r.rehydration.toLowerCase().startsWith('no'),
  );

  // Prompt y JSON exportables
  const promptText = buildPromptTecnico(instruccion, coreObj, cou, lexMeta);
  const couJson    = JSON.stringify({
    expediente:    expediente.id,
    instruccion,
    objeto:        coreObj?.id ?? null,
    codeRefs:      cou.codeRefs,
    risks:         cou.risks,
    riskNotes:     cou.riskNotes,
    runtimeObjects: cou.runtimeObjects,
    relevance:     { core: cou.relevance?.core?.map((o) => o.id), candidatos },
  }, null, 2);

  function copy(text, key) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {});
  }

  const files = [...new Set(cou.codeRefs.map((r) => r.file).filter(Boolean))];

  return (
    <section className="ai-response-card ai-expediente">

      {/* Cabecera */}
      <div className="exp-header">
        <h3 className="exp-title">Expediente técnico COMPÁS</h3>
        <span className="ai-muted exp-badge">sin API externa · catálogo local</span>
      </div>

      {/* A — Encargo interpretado */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">A · Encargo interpretado</div>
        <ExpRow label="Texto original"><em>{instruccion}</em></ExpRow>
        <ExpRow label="Objeto resuelto" absent={!coreObj}>
          {coreObj && <><strong>{coreObj.name}</strong> <span className="ai-muted">· {coreObj.group}</span></>}
        </ExpRow>
        <ExpRow label="ID WorkObject" absent={!coreObj}>
          {coreObj && <code>{coreObj.id}</code>}
        </ExpRow>
        <ExpRow label="Confianza">
          <ExpTag type={lowConf ? 'warn' : 'ok'}>{confianza}</ExpTag>
          {cou.relevance?.ambiguous && <ExpTag type="warn"> ambigüedad</ExpTag>}
        </ExpRow>
        {lexMeta?.description && <ExpRow label="Descripción">{lexMeta.description}</ExpRow>}
        {lexMeta?.functionalRole && (
          <ExpRow label="Rol funcional">
            <ExpTag>{lexMeta.functionalRole}</ExpTag>
            {lexMeta.feedsRuntime  && <ExpTag type="ok"> feedsRuntime</ExpTag>}
            {lexMeta.feedsPersistence && <ExpTag type="ok"> feedsPersistence</ExpTag>}
            {lexMeta.feedsIA       && <ExpTag type="ok"> feedsIA</ExpTag>}
          </ExpRow>
        )}
      </div>

      {/* B — Punto de intervención */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">B · Punto de intervención</div>
        <ExpRow label="Archivos" absent={files.length === 0}>
          {files.map((f) => <ExpTag key={f}>{f}</ExpTag>)}
        </ExpRow>
        <ExpRow label="Funciones / ids" absent={cou.codeRefs.length === 0}>
          <ul className="exp-list">
            {cou.codeRefs.slice(0, 8).map((r, i) => (
              <li key={i}>
                <code>{r.identifier}</code>
                {r.line && <span className="ai-muted"> · :{r.line}</span>}
              </li>
            ))}
          </ul>
        </ExpRow>
        <ExpRow label="Selectores DOM" absent={uniqueDomSels.length === 0}>
          {uniqueDomSels.map((s) => <code key={s} style={{ marginRight: 6 }}>{s}</code>)}
        </ExpRow>
        <ExpRow label="Motores / engines" absent={!(coreObj?.engines?.length)}>
          <ul className="exp-list">{(coreObj?.engines ?? []).map((e) => <li key={e}><code>{e}</code></li>)}</ul>
        </ExpRow>
        {coreObj?.location && <ExpRow label="Ubicación UI"><span className="ai-muted">{coreObj.location}</span></ExpRow>}
      </div>

      {/* C — Runtime */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">C · Runtime</div>
        <ExpRow label="Produce" absent={!(coreObj?.produces?.length)}>
          <ul className="exp-list">{(coreObj?.produces ?? []).map((p, i) => <li key={i}>{p}</li>)}</ul>
        </ExpRow>
        <ExpRow label="Consume" absent={!(coreObj?.consumes?.length)}>
          <ul className="exp-list">{(coreObj?.consumes ?? []).map((c, i) => <li key={i}>{c}</li>)}</ul>
        </ExpRow>
        <ExpRow label="Runtime objects" absent={cou.runtimeObjects.length === 0}>
          <ul className="exp-list">
            {cou.runtimeObjects.slice(0, 5).map((r) => (
              <li key={r.id}>
                <strong>{r.id}</strong>
                {r.classification && <span className="ai-muted"> · {r.classification}</span>}
                {r.persistence    && <span className="ai-muted"> · {r.persistence}</span>}
              </li>
            ))}
          </ul>
        </ExpRow>
        <ExpRow label="Estado vivo">
          <ExpTag type={cou.liveData?.estado === 'DISPONIBLE_SI_LA_SALA_LO_PROVEE' ? 'ok' : 'off'}>
            {cou.liveData?.estado ?? 'no disponible'}
          </ExpTag>
          {cou.liveData?.municipio && <span className="ai-muted"> · {cou.liveData.municipio}</span>}
        </ExpRow>
      </div>

      {/* D — Persistencia */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">D · Persistencia</div>
        <ExpRow label="Rutas Firebase" absent={fbPaths.length === 0}>
          <ul className="exp-list">{fbPaths.map((p, i) => <li key={i}><code>{p}</code></li>)}</ul>
        </ExpRow>
        <ExpRow label="Funciones escritura" absent={writeEngines.length === 0}>
          {writeEngines.map((e) => <ExpTag key={e}>{e}</ExpTag>)}
        </ExpRow>
        <ExpRow label="Rehidratación" absent={rtConRehi.length === 0}>
          <ul className="exp-list">
            {rtConRehi.map((r) => <li key={r.id}><strong>{r.id}</strong>: {r.rehydration}</li>)}
          </ul>
        </ExpRow>
        {lexMeta && (
          <ExpRow label="Catálogo">
            <ExpTag type={lexMeta.feedsPersistence ? 'ok' : 'off'}>
              {lexMeta.feedsPersistence ? 'feedsPersistence ✓' : 'feedsPersistence ✗'}
            </ExpTag>
            {' '}
            <ExpTag type={lexMeta.feedsRuntime ? 'ok' : 'off'}>
              {lexMeta.feedsRuntime ? 'feedsRuntime ✓' : 'feedsRuntime ✗'}
            </ExpTag>
          </ExpRow>
        )}
      </div>

      {/* E — Dependencias */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">E · Dependencias</div>
        <ExpRow label="Si falla" absent={!coreObj?.breaksIfFails}>
          <span className="ai-muted">{coreObj?.breaksIfFails}</span>
        </ExpRow>
        <ExpRow label="Nodos panóptico" absent={cou.panopticoNodes.length === 0}>
          {cou.panopticoNodes.map((n) => <ExpTag key={n.id}>{n.name}</ExpTag>)}
        </ExpRow>
        <ExpRow label="Dominios" absent={cou.domains.length === 0}>
          {cou.domains.map((d) => <ExpTag key={d.id}>{d.label}</ExpTag>)}
        </ExpRow>
        <ExpRow label="Relacionados (lexicon)" absent={!(lexMeta?.relatedTargets?.length)}>
          {(lexMeta?.relatedTargets ?? []).map((id) => <code key={id} style={{ marginRight: 6 }}>{id}</code>)}
        </ExpRow>
        <ExpRow label="Objetos directos" absent={(cou.relevance?.direct ?? []).length === 0}>
          <ul className="exp-list">
            {(cou.relevance?.direct ?? []).slice(0, 5).map((o) => (
              <li key={o.id}>{o.name} <span className="ai-muted">· {o.group}</span></li>
            ))}
          </ul>
        </ExpRow>
      </div>

      {/* F — Riesgos */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">F · Riesgos</div>
        {(cou.risks.length + cou.riskNotes.length) === 0
          ? <p className="ai-muted">Sin riesgos normalizados en este contexto.</p>
          : (
            <ul className="exp-list exp-risk-list">
              {cou.risks.map((r) => (
                <li key={r.id}>
                  <span className="ai-risk-sev">{r.severity ?? '?'}</span>
                  {' '}<strong>{r.id}</strong>: {r.title}
                  {r.status && <span className="ai-muted"> · {r.status}</span>}
                </li>
              ))}
              {cou.riskNotes.map((n, i) => (
                <li key={`n${i}`} className="ai-muted">
                  {n} <ExpTag type="inf">inferencia</ExpTag>
                </li>
              ))}
            </ul>
          )
        }
        {coreObj?.breaksIfFails && (
          <p className="ai-muted" style={{ marginTop: 6 }}>
            Consecuencia documentada: <em>{coreObj.breaksIfFails}</em>
          </p>
        )}
        {lexMeta?.notes && (
          <p className="ai-muted" style={{ marginTop: 6, fontStyle: 'italic' }}>
            Nota catálogo: {lexMeta.notes}
          </p>
        )}
      </div>

      {/* G — Verificaciones */}
      <div className="exp-bloque">
        <div className="eyebrow exp-bloque-title">G · Verificaciones obligatorias</div>
        <ol className="exp-list exp-checklist">
          <li>Antes: localizar la función exacta en el código y leerla completa.</li>
          {fbPaths.length > 0 && <li>Antes: revisar las rutas Firebase afectadas ({fbPaths.slice(0,2).join(', ')}).</li>}
          <li>Después: probar el flujo completo en http://localhost:8000.</li>
          <li>Después: revisar consola del navegador — sin errores nuevos.</li>
          {cou.runtimeObjects.length > 0 && (
            <li>Después: verificar runtime: {cou.runtimeObjects.slice(0,3).map((r) => r.id).join(', ')}.</li>
          )}
          {(cou.relevance?.direct ?? []).length > 0 && (
            <li>Regresiones en objetos directos: {(cou.relevance.direct ?? []).slice(0, 3).map((o) => o.name).join(', ')}.</li>
          )}
        </ol>
      </div>

      {/* H — Prompt técnico exportable */}
      <Acordeon
        title="H · Prompt técnico exportable (para IA real / Claude Code)"
        isOpen={openSec.prompt}
        onToggle={() => toggleSec('prompt')}
      >
        <pre className="ai-prompt-text" style={{ fontSize: 11, whiteSpace: 'pre-wrap' }}>{promptText}</pre>
      </Acordeon>

      {/* Acordeones técnicos */}
      <Acordeon title="Código (codeRefs)" count={cou.codeRefs.length} isOpen={openSec.cod} onToggle={() => toggleSec('cod')}>
        <CodigoPanel codeRefs={cou.codeRefs} />
      </Acordeon>
      <Acordeon title="Checklist de gobierno" count={cou.checklist.length} isOpen={openSec.chk} onToggle={() => toggleSec('chk')}>
        <ChecklistGobiernoPanel items={cou.checklist} />
      </Acordeon>
      <Acordeon title="COU completo (debug)" isOpen={openSec.cou} onToggle={() => toggleSec('cou')}>
        <ModoAvanzadoPanel cou={cou} />
      </Acordeon>

      {/* Botones de acción */}
      <div className="exp-actions">
        <button type="button" className="ai-chip-link" onClick={() => copy(promptText, 'prompt')}>
          {copiedKey === 'prompt' ? '✓ Copiado' : 'Copiar prompt para IA →'}
        </button>
        <button type="button" className="ai-chip-link" onClick={() => copy(couJson, 'exp')}>
          {copiedKey === 'exp' ? '✓ Copiado' : 'Copiar expediente JSON'}
        </button>
        {coreObj && (
          <button type="button" className="ai-chip-link" onClick={() => onOpenInSala('workObject', coreObj.id)}>
            Abrir {coreObj.name} en Sala →
          </button>
        )}
      </div>

      {/* Pie */}
      <p className="ai-muted" style={{ fontSize: 10, paddingTop: 6, marginTop: 8, borderTop: '1px solid #f1f5f9' }}>
        {expediente.id} · {new Date(expediente.historial[0]?.at).toLocaleString('es-ES')} · {expediente.estado}
        {' · '}sin IA externa conectada
      </p>
    </section>
  );
}

// ── Vista principal ────────────────────────────────────────────────────────

export default function VistaIAOperativa({ data, selected, selectedItem, openItem, checklistItems, liveData }) {
  const [instruction, setInstruction] = useState('');
  const [expedientes, setExpedientes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentWorkObjectIds = useMemo(
    () => selectedToWorkObjectIds(selected, selectedItem, data),
    [selected, selectedItem, data],
  );

  const currentCou = useMemo(
    () => resolveContext(currentWorkObjectIds, { data, checklistItems, liveData, selected }),
    [currentWorkObjectIds, data, checklistItems, liveData, selected],
  );

  const activeExpediente = expedientes.find((i) => i.id === activeId) ?? expedientes[0] ?? null;

  async function handleSubmit(e) {
    e.preventDefault();
    const text = instruction.trim();
    if (!text) return;
    const workObjectIds = detectWorkObjectIds(text, data, selected);
    const encargo = createEncargo(text, workObjectIds);
    const cou = resolveContext(workObjectIds, { data, checklistItems, liveData, instruction: text, selected });
    setIsRunning(true);
    try {
      const simulatedResponse = await runOperationalAi(encargo, cou);
      const expediente = createExpediente(encargo, cou, simulatedResponse);
      setExpedientes((prev) => [expediente, ...prev]);
      setActiveId(expediente.id);
      setInstruction('');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="ai-operativa">
      <div className="ai-layout">

        {/* ── Sidebar ── */}
        <section className="ai-command-panel">
          <div className="ai-context-bar">
            <span className="eyebrow">Contexto activo</span>
            <strong style={{ color: '#1e293b', fontSize: 13 }}>
              {selectedItem?.name ?? selectedItem?.id ?? 'Sin selección'}
            </strong>
            {currentCou.workObjects.length > 0 && (
              <span className="ai-muted">{currentCou.workObjects.length} objeto(s) en COU</span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="ai-instruction">Encargo</label>
            <textarea
              id="ai-instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Escribe tu encargo en lenguaje natural…"
              rows={4}
            />
            <div className="ai-examples" aria-label="Ejemplos de encargo">
              {EJEMPLOS.map((ex) => (
                <button key={ex} type="button" onClick={() => setInstruction(ex)}>{ex}</button>
              ))}
            </div>
            <button className="primary-action" type="submit" disabled={isRunning}>
              {isRunning ? 'Preparando expediente…' : 'Crear expediente →'}
            </button>
          </form>

          {expedientes.length > 0 && (
            <section className="ai-card">
              <h3>Encargos de la sesión</h3>
              <div className="ai-session-list">
                {expedientes.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    className={activeExpediente?.id === exp.id ? 'active' : ''}
                    onClick={() => setActiveId(exp.id)}
                  >
                    <strong>{exp.objetivo}</strong>
                    <span>{INTENT_LABELS[exp.respuesta.perspective] ?? exp.respuesta.perspective}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* ── Panel principal ── */}
        <main className="ai-main-panel">
          {activeExpediente ? (
            <ExpedienteCard expediente={activeExpediente} onOpenInSala={openItem} />
          ) : (
            <section className="ai-empty-state">
              <p className="eyebrow">Expediente técnico COMPÁS · sin API externa</p>
              <h2>Escribe un encargo</h2>
              <p>
                La Sala identifica el WorkObject afectado, construye el contexto técnico completo
                y genera un expediente accionable con código, riesgos, persistencia, runtime
                y un prompt exportable para Claude Code o IA externa.
              </p>
              <p className="ai-muted" style={{ marginTop: 8 }}>
                Todos los datos provienen del catálogo y del Lexicon. Sin invención. Sin API.
              </p>
            </section>
          )}
        </main>

      </div>
    </div>
  );
}
