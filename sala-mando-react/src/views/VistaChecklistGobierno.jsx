import { useState, useMemo } from 'react';

const ASSESSMENTS = [
  { id: 'pendiente_auditoria', label: 'Pendiente auditoria' },
  { id: 'fundamental',         label: 'Fundamental' },
  { id: 'ingenieria_apoyo',    label: 'Ingeniería apoyo' },
  { id: 'instrumental',        label: 'Instrumental' },
  { id: 'complementario',      label: 'Complementario' },
  { id: 'deuda_historica',     label: 'Deuda histórica' },
  { id: 'dudoso',              label: 'Dudoso' },
  { id: 'incorrecto',          label: 'Incorrecto' },
  { id: 'redundante',          label: 'Redundante' },
  { id: 'fusionable',          label: 'Fusionable' },
  { id: 'eliminable',          label: 'Eliminable' },
  { id: 'requiere_ficha',      label: 'Requiere ficha' },
  { id: 'requiere_arbitraje',  label: 'Requiere arbitraje' },
];

const ASSESSMENT_COLOR = {
  pendiente_auditoria: '#94a3b8',
  fundamental:         '#16a34a',
  ingenieria_apoyo:    '#0074c8',
  instrumental:        '#0891b2',
  complementario:      '#475569',
  deuda_historica:     '#d97706',
  dudoso:              '#7c3aed',
  incorrecto:          '#dc2626',
  redundante:          '#ea580c',
  fusionable:          '#2563eb',
  eliminable:          '#dc2626',
  requiere_ficha:      '#d97706',
  requiere_arbitraje:  '#dc2626',
};

const TYPE_STYLE = {
  workObject:     { bg: '#eff6ff', color: '#0074c8' },
  panopticoNode:  { bg: '#f0fdf4', color: '#16a34a' },
  runtimeObject:  { bg: '#fffbeb', color: '#b45309' },
  risk:           { bg: '#fef2f2', color: '#dc2626' },
  domain:         { bg: '#f1f5f9', color: '#475569' },
};

const TYPE_LABEL = {
  workObject: 'workObject', panopticoNode: 'nodo',
  runtimeObject: 'runtime', risk: 'riesgo', domain: 'dominio',
};

const FILTERS = [
  { id: 'all',           label: 'Todos (53)' },
  { id: 'workObject',    label: 'workObjects' },
  { id: 'panopticoNode', label: 'Nodos' },
  { id: 'runtimeObject', label: 'Runtime' },
  { id: 'risk',          label: 'Riesgos' },
  { id: 'domain',        label: 'Dominios' },
];

function resolveName(item, data) {
  const { sourceType: t, sourceId: id } = item;
  if (t === 'workObject')    return data.workObjects.find(w => w.id === id)?.name ?? id;
  if (t === 'panopticoNode') return data.panopticoNodes.find(n => n.id === id)?.name ?? id;
  if (t === 'runtimeObject') return data.runtimeObjects.find(r => r.id === id)?.id ?? id;
  if (t === 'risk')          return data.risks.find(r => r.id === id)?.title ?? id;
  if (t === 'domain')        return data.territoryData.domains.find(d => d.id === id)?.label ?? id;
  return id;
}

function resolveCrit(item, data) {
  if (item.sourceType === 'workObject') {
    const c = data.workObjects.find(w => w.id === item.sourceId)?.criticality;
    return c != null ? `${c}/5` : null;
  }
  if (item.sourceType === 'risk') {
    return data.risks.find(r => r.id === item.sourceId)?.severity ?? null;
  }
  return null;
}

const TH = { padding: '7px 10px', color: '#64748b', fontWeight: 600, fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '2px solid #e2e8f0', textAlign: 'left', whiteSpace: 'nowrap' };
const TD = { padding: '7px 10px', verticalAlign: 'middle', borderBottom: '1px solid #f1f5f9' };

// Estado de datos (checklistItems, onUpdate) vive en App.jsx — sobrevive al cambio de vista.
// Estado de UI (filter, expandedId) es local — se resetea al navegar (comportamiento correcto).
export default function VistaChecklistGobierno({ data, checklistItems, onUpdate }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const visible = useMemo(
    () => filter === 'all' ? checklistItems : checklistItems.filter(i => i.sourceType === filter),
    [checklistItems, filter],
  );

  const reviewed = useMemo(
    () => checklistItems.filter(i => i.assessment !== 'pendiente_auditoria').length,
    [checklistItems],
  );

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <section className="band full">
      <h2>Checklist de gobierno</h2>
      <p style={{ color: '#64748b', fontSize: '.88rem', marginBottom: 4 }}>
        Valoración humana de objetos gobernables. Estado local — no persiste todavía.
      </p>
      <p style={{ color: '#0074c8', fontWeight: 600, fontSize: '.88rem', marginBottom: 16 }}>
        {reviewed} / {checklistItems.length} valorados{' '}
        {reviewed > 0 && (
          <span style={{ fontWeight: 400, color: '#64748b' }}>
            ({checklistItems.length - reviewed} pendientes)
          </span>
        )}
      </p>

      <div className="filter-chips" style={{ marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            className={filter === f.id ? 'chip active' : 'chip'}
            onClick={() => setFilter(f.id)}
          >
            {f.id === 'all' ? `Todos (${checklistItems.length})` : f.label}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.84rem' }}>
          <thead>
            <tr>
              <th style={TH}>Objeto</th>
              <th style={TH}>Tipo</th>
              <th style={TH}>Crit.</th>
              <th style={TH}>Sugerido</th>
              <th style={TH}>Valoración</th>
              <th style={TH}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(item => {
              const name = resolveName(item, data);
              const crit = resolveCrit(item, data);
              const ts = TYPE_STYLE[item.sourceType] ?? { bg: '#f8fafc', color: '#475569' };
              const isExpanded = expandedId === item.id;
              const isReviewed = item.assessment !== 'pendiente_auditoria';

              return (
                <tr
                  key={item.id}
                  style={{ background: isReviewed ? '#f8fafc' : '#fff' }}
                >
                  {/* Objeto */}
                  <td style={{ ...TD, minWidth: 180 }}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: '#1e293b', fontWeight: 600, fontFamily: 'inherit', fontSize: '.84rem' }}
                    >
                      {isReviewed && <span style={{ color: '#16a34a', marginRight: 4 }}>✓</span>}
                      {name}
                    </button>
                    {isExpanded && (
                      <div style={{ marginTop: 6 }}>
                        <code style={{ fontSize: '.75rem', color: '#64748b', background: '#f1f5f9', padding: '2px 5px', borderRadius: 3 }}>
                          {item.sourceId}
                        </code>
                        <div style={{ marginTop: 6 }}>
                          <label style={{ fontSize: '.75rem', color: '#94a3b8', display: 'block', marginBottom: 3 }}>
                            Etiquetas (separadas por coma)
                          </label>
                          <input
                            type="text"
                            value={item.governanceTags.join(', ')}
                            placeholder="ej: critico, revisar, fase3"
                            onChange={e => onUpdate(item.id, {
                              governanceTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                            })}
                            style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 7px', fontSize: '.78rem', width: '100%', color: '#334155', boxSizing: 'border-box' }}
                          />
                        </div>
                        {item.governanceTags.length > 0 && (
                          <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {item.governanceTags.map(tag => (
                              <span key={tag} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 4, padding: '1px 6px', fontSize: '.75rem' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Tipo */}
                  <td style={TD}>
                    <span style={{ background: ts.bg, color: ts.color, borderRadius: 4, padding: '2px 7px', fontSize: '.76rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {TYPE_LABEL[item.sourceType] ?? item.sourceType}
                    </span>
                  </td>

                  {/* Criticidad */}
                  <td style={{ ...TD, color: '#94a3b8', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                    {crit ?? '—'}
                  </td>

                  {/* Sugerido */}
                  <td style={TD}>
                    <span style={{ color: ASSESSMENT_COLOR[item.suggestedAssessment] ?? '#94a3b8', fontSize: '.78rem', fontWeight: 500 }}>
                      {item.suggestedAssessment}
                    </span>
                  </td>

                  {/* Valoración */}
                  <td style={TD}>
                    <select
                      value={item.assessment}
                      onChange={e => onUpdate(item.id, {
                        assessment: e.target.value,
                        reviewedAt: new Date().toISOString(),
                      })}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 5,
                        padding: '3px 7px',
                        fontSize: '.8rem',
                        fontFamily: 'inherit',
                        color: ASSESSMENT_COLOR[item.assessment] ?? '#334155',
                        fontWeight: item.assessment !== 'pendiente_auditoria' ? 600 : 400,
                        background: '#fff',
                        cursor: 'pointer',
                        minWidth: 160,
                      }}
                    >
                      {ASSESSMENTS.map(a => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Notas */}
                  <td style={TD}>
                    <input
                      type="text"
                      value={item.notes}
                      placeholder="—"
                      onChange={e => onUpdate(item.id, { notes: e.target.value })}
                      style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 7px', fontSize: '.8rem', width: 170, color: '#334155', fontFamily: 'inherit' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
