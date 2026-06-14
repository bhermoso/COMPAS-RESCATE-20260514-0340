import { useMemo, useState } from 'react';
import {
  createEncargo,
  createExpediente,
  detectWorkObjectIds,
  resolveContext,
  runOperationalAi,
} from '../data/iaOperativa.js';

const EJEMPLOS = [
  'Arregla Agenda.',
  'Ocúpate de Firebase.',
  'Quiero entender IBSE.',
  'Prepárame un prompt.',
];

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

// ── Contenidos de los acordeones ──────────────────────────────────────────

function ContextoPanel({ cou }) {
  const core = cou.relevance?.core ?? [];
  const direct = cou.relevance?.direct ?? [];
  const extended = cou.relevance?.extended ?? [];
  const domains = cou.domains ?? [];
  const runtime = cou.runtimeObjects ?? [];

  const Row = ({ label, items }) =>
    items.length ? (
      <div className="ai-ctx-row">
        <span className="ai-ctx-label">{label}</span>
        <div className="ai-ctx-chips">
          {items.map((i) => <span key={i.id ?? i.name ?? i} className="ai-ctx-chip">{i.name ?? i.label ?? i.id ?? i}</span>)}
        </div>
      </div>
    ) : null;

  return (
    <div className="ai-ctx-panel">
      <Row label="Núcleo" items={core} />
      <Row label="Apoyo directo" items={direct} />
      <Row label="Contexto ampliado" items={extended} />
      <Row label="Dominio" items={domains} />
      <Row label="Runtime" items={runtime} />
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
      ) : (
        <p className="ai-muted">Sin riesgos normalizados en este contexto.</p>
      )}
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

function CouCompletoPanel({ cou }) {
  return (
    <div className="ai-cou-raw">
      <p className="ai-muted">{cou.source}</p>
      <p className="ai-muted">Generado: {new Date(cou.generatedAt).toLocaleString('es-ES')}</p>
      <ul style={{ margin: '8px 0 0', paddingLeft: 16, display: 'grid', gap: 4 }}>
        <li className="ai-muted">{cou.workObjects.length} workObject(s)</li>
        <li className="ai-muted">{cou.codeRefs.length} codeRef(s)</li>
        <li className="ai-muted">{cou.relations.length} relación(es)</li>
        <li className="ai-muted">{cou.risks.length} riesgo(s) normalizados + {cou.riskNotes.length} nota(s)</li>
        <li className="ai-muted">{cou.runtimeObjects.length} runtime object(s)</li>
        <li className="ai-muted">{cou.checklist.length} entrada(s) de checklist</li>
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
  const { objetoNucleo, respuestaPrincipal, codigoRelevante, promptGenerado, perspective } = respuesta;
  const isPrepIntervencion = perspective === 'preparacion_de_intervencion';
  const isPrompt = perspective === 'preparacion_de_prompt';

  return (
    <section className="ai-response-card">

      {/* Objeto núcleo */}
      {objetoNucleo && (
        <div className="ai-objeto-nucleo">
          <div>
            <strong>{objetoNucleo.name}</strong>
            <span>
              {objetoNucleo.group}
              {objetoNucleo.criticality != null ? ` · Criticidad ${objetoNucleo.criticality}/5` : ''}
            </span>
          </div>
          <button
            type="button"
            className="ai-chip-link"
            onClick={() => onOpenInSala('workObject', objetoNucleo.workObjectId)}
          >
            Ir a la Sala →
          </button>
        </div>
      )}

      {/* Respuesta principal */}
      <div className="ai-respuesta-body">
        <p className="ai-declaracion">{respuestaPrincipal?.declaracion}</p>

        {isPrompt ? (
          <pre className="ai-prompt-text">{promptGenerado}</pre>
        ) : (
          respuestaPrincipal?.desarrollo && (
            <p className="ai-desarrollo">{respuestaPrincipal.desarrollo}</p>
          )
        )}

        {isPrepIntervencion && codigoRelevante?.length > 0 && (
          <ul className="ai-codigo-inline">
            {codigoRelevante.map((ref, i) => <li key={i}><code>{ref}</code></li>)}
          </ul>
        )}

        {respuestaPrincipal?.accion && (
          <div className="ai-accion-bloque">
            <span className="eyebrow">Siguiente paso</span>
            <p>{respuestaPrincipal.accion}</p>
          </div>
        )}
      </div>

      {/* Acordeones */}
      <div className="ai-acordeones">
        <Acordeon
          title="Contexto"
          count={contexto.workObjects.length}
          isOpen={open.ctx}
          onToggle={() => toggle('ctx')}
        >
          <ContextoPanel cou={contexto} />
        </Acordeon>

        <Acordeon
          title="Código"
          count={contexto.codeRefs.length}
          isOpen={open.cod}
          onToggle={() => toggle('cod')}
        >
          <CodigoPanel codeRefs={contexto.codeRefs} />
        </Acordeon>

        <Acordeon
          title="Riesgos"
          count={contexto.risks.length + contexto.riskNotes.length}
          isOpen={open.rie}
          onToggle={() => toggle('rie')}
        >
          <RiesgosPanel risks={contexto.risks} riskNotes={contexto.riskNotes} />
        </Acordeon>

        <Acordeon
          title="Valoración de gobierno"
          count={contexto.checklist.length}
          isOpen={open.gov}
          onToggle={() => toggle('gov')}
        >
          <ChecklistGobiernoPanel items={contexto.checklist} />
        </Acordeon>

        <Acordeon
          title="COU completo"
          isOpen={open.cou}
          onToggle={() => toggle('cou')}
        >
          <CouCompletoPanel cou={contexto} />
        </Acordeon>
      </div>

      {/* Pie minimal */}
      <p className="ai-muted" style={{ fontSize: 10, paddingTop: 4 }}>
        {expediente.id} · {new Date(expediente.historial[0]?.at).toLocaleString('es-ES')} · {expediente.estado}
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

  // COU del contexto activo (usado en el sidebar solo para el contador)
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

          {/* Contexto activo */}
          <div className="ai-context-bar">
            <span className="eyebrow">Contexto activo</span>
            <strong style={{ color: '#1e293b', fontSize: 13 }}>
              {selectedItem?.name ?? selectedItem?.id ?? 'Sin selección'}
            </strong>
            {currentCou.workObjects.length > 0 && (
              <span className="ai-muted">
                {currentCou.workObjects.length} objeto(s) en COU
              </span>
            )}
          </div>

          {/* Encargo */}
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
                <button key={ex} type="button" onClick={() => setInstruction(ex)}>
                  {ex}
                </button>
              ))}
            </div>
            <button className="primary-action" type="submit" disabled={isRunning}>
              {isRunning ? 'Preparando expediente…' : 'Crear expediente →'}
            </button>
          </form>

          {/* Historial de encargos */}
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
                    <span>{exp.respuesta.perspective.replace(/_/g, ' ')}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* ── Panel principal ── */}
        <main className="ai-main-panel">
          {activeExpediente ? (
            <ResponseCard expediente={activeExpediente} onOpenInSala={openItem} />
          ) : (
            <section className="ai-empty-state">
              <p className="eyebrow">IA de COMPÁS · infraestructura cognitiva</p>
              <h2>Escribe un encargo</h2>
              <p>
                La IA analiza tu petición, identifica los componentes relevantes de COMPÁS
                y responde según la intención: explicar, localizar, diagnosticar o preparar una intervención.
              </p>
              <p className="ai-muted" style={{ marginTop: 8 }}>
                Todo el detalle técnico queda disponible en acordeones desplegables.
                La pantalla muestra primero la respuesta al encargo.
              </p>
            </section>
          )}
        </main>

      </div>
    </div>
  );
}
