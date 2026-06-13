import { useState } from 'react';

const GROUPS = [
  { id: 'all',            label: 'Todos (24)' },
  { id: 'INICIO',         label: 'Inicio' },
  { id: 'DIAGNÓSTICO',    label: 'Diagnóstico' },
  { id: 'PRIORIZACIÓN',   label: 'Priorización' },
  { id: 'COMPILADOR',     label: 'Compilador' },
  { id: 'AGENDA',         label: 'Agenda' },
  { id: 'EVALUACIÓN',     label: 'Evaluación' },
  { id: 'INFRAESTRUCTURA',label: 'Infraestructura' },
];

function Stars({ n }) {
  return (
    <span className="work-stars" title={`Criticidad ${n}/5`}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

export default function VistaOperativa({ data, openItem }) {
  const [group, setGroup] = useState('all');

  const items = group === 'all'
    ? data.workObjects
    : data.workObjects.filter((o) => o.group === group);

  return (
    <section className="band full">
      <h2>Vista Operativa — Gobierno humano de COMPÁS</h2>
      <p className="filter-count" style={{ marginBottom: 12 }}>
        24 objetos de trabajo real. Localizar cualquier elemento en menos de 10 segundos.
      </p>
      <div className="filter-chips">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={group === g.id ? 'chip active' : 'chip'}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <p className="filter-count">{items.length} objeto{items.length !== 1 ? 's' : ''}</p>
      <div className="work-grid">
        {items.map((obj) => (
          <button
            key={obj.id}
            type="button"
            className={`work-card crit-${obj.criticality}`}
            onClick={() => openItem('workObject', obj.id, 'operativa')}
          >
            <div className="work-card-header">
              <strong>{obj.name}</strong>
              <Stars n={obj.criticality} />
            </div>
            <span className="work-group-tag">{obj.group}</span>
            <p className="work-card-fn">
              {obj.function.length > 140 ? obj.function.slice(0, 140) + '…' : obj.function}
            </p>
            {obj.codeRefs.length > 0 && (
              <div className="work-card-refs">
                {obj.codeRefs.slice(0, 3).map((r) => (
                  <code key={r.identifier}>
                    {r.identifier}{r.line ? ` l.${r.line}` : ''}
                  </code>
                ))}
              </div>
            )}
            <div className="work-card-meta">
              {obj.risks.length > 0 && (
                <span className="work-risk-badge">{obj.risks.length} riesgo{obj.risks.length > 1 ? 's' : ''}</span>
              )}
              {obj.associatedEnt.length > 0 && <span>{obj.associatedEnt.length} ENT</span>}
              {obj.associatedRel.length > 0 && <span>{obj.associatedRel.length} REL</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
