import { useMemo, useState } from 'react';

function EvidenceList({ title, type, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`evidence-box ${type}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function EvidenceBadge({ evidence }) {
  const cls = evidence === 'CONFIRMADO' ? 'confirmado' : evidence === 'INFERIDO' ? 'inferido' : 'pendiente';
  return <span className={`sq-evidence-badge ${cls}`}>{evidence}</span>;
}

function SurgicalFichaAgenda({ s }) {
  return (
    <div className="sq-surgical">
      <h3 className="sq-section-title">Ficha quirurgica</h3>

      <div className="sq-section">
        <h4>Selectores</h4>
        <div className="sq-table">
          <div className="sq-row sq-head"><span>Selector</span><span>Descripcion</span><span>Ubicacion</span><span>Evidencia</span></div>
          {s.selectors.map((sel) => (
            <div className="sq-row" key={sel.id}>
              <code>{sel.id}</code>
              <span>{sel.description}</span>
              <span className="sq-muted">{sel.location}</span>
              <EvidenceBadge evidence={sel.evidence} />
            </div>
          ))}
        </div>
      </div>

      <div className="sq-section">
        <h4>Funciones</h4>
        <div className="sq-table">
          <div className="sq-row sq-head"><span>Funcion</span><span>Nota</span><span>Evidencia</span></div>
          {s.functions.map((fn) => (
            <div className="sq-row" key={fn.id}>
              <code>{fn.id}</code>
              <span>{fn.note}</span>
              <EvidenceBadge evidence={fn.evidence} />
            </div>
          ))}
        </div>
      </div>

      <div className="sq-section">
        <h4>Runtime</h4>
        {s.runtime.map((rt) => (
          <div className="sq-runtime-card" key={rt.id}>
            <div className="sq-runtime-header">
              <code>{rt.id}</code>
              <EvidenceBadge evidence={rt.evidence} />
            </div>
            <div className="sq-runtime-body">
              <span><strong>Tipo:</strong> {rt.classification}</span>
              <span><strong>Naturaleza:</strong> {rt.nature}</span>
              <span><strong>Persistencia:</strong> {rt.persistence}</span>
              <span><strong>Rehidratacion:</strong> {rt.rehydration}</span>
              <span className="sq-muted">{rt.source}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sq-section">
        <h4>Firebase</h4>
        <p className="sq-subsection-label">Lecturas</p>
        {s.firebase.reads.map((r) => (
          <div className="sq-fb-row" key={r.path + 'r'}>
            <code>{r.path}</code>
            <span>{r.operation}</span>
            <EvidenceBadge evidence={r.evidence} />
          </div>
        ))}
        <p className="sq-subsection-label">Escrituras</p>
        {s.firebase.writes.map((w) => (
          <div className="sq-fb-row" key={w.path + 'w'}>
            <code>{w.path}</code>
            <span>{w.operation}</span>
            <EvidenceBadge evidence={w.evidence} />
          </div>
        ))}
      </div>

      <div className="sq-section">
        <h4>Rehidratacion</h4>
        <p className="sq-subsection-label">Reconstruye</p>
        {s.rehydration.reconstructs.map((r) => (
          <div className="sq-reh-row" key={r.what}>
            <EvidenceBadge evidence={r.evidence} />
            <span><strong>{r.what}</strong> — {r.how}</span>
          </div>
        ))}
        <p className="sq-subsection-label">No reconstruye</p>
        {s.rehydration.doesNotReconstruct.map((r) => (
          <div className="sq-reh-row" key={r.what}>
            <EvidenceBadge evidence={r.evidence} />
            <span><strong>{r.what}</strong> — {r.reason}</span>
          </div>
        ))}
        <p className="sq-subsection-label">Pendiente</p>
        {s.rehydration.pending.map((r) => (
          <div className="sq-reh-row" key={r.what}>
            <EvidenceBadge evidence={r.evidence} />
            <span><strong>{r.what}</strong> — {r.reason}</span>
          </div>
        ))}
      </div>

      <div className="sq-section sq-dep-grid">
        <div>
          <h4>Upstream</h4>
          {s.upstream.map((u) => (
            <div className="sq-dep-row" key={u.id}>
              <EvidenceBadge evidence={u.evidence} />
              <div>
                <strong>{u.id}</strong>
                <p>{u.detail}</p>
                {u.risk && <span className="sq-risk-ref">{u.risk}</span>}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h4>Downstream</h4>
          {s.downstream.map((d) => (
            <div className="sq-dep-row" key={d.id}>
              <EvidenceBadge evidence={d.evidence} />
              <div>
                <strong>{d.id}</strong>
                <p>{d.detail}</p>
                {d.risk && <span className="sq-risk-ref">{d.risk}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sq-section">
        <h4>Riesgos especificos</h4>
        {s.specificRisks.map((r) => (
          <div className={`sq-risk-card sev-${r.severity.toLowerCase()}`} key={r.id}>
            <div className="sq-risk-header">
              <code>{r.id}</code>
              <span className={`severity ${r.severity.toLowerCase()}`}>{r.severity}</span>
              <EvidenceBadge evidence={r.evidence} />
            </div>
            <strong>{r.title}</strong>
            <p>{r.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeRefs({ refs }) {
  if (!refs || refs.length === 0) return <p className="muted">Sin codeRefs registrados en workObjects.</p>;
  return (
    <div className="code-ref-list">
      {refs.map((ref) => (
        <code key={`${ref.identifier}-${ref.file}-${ref.line ?? 'na'}`}>
          {ref.identifier}{ref.line ? ` l.${ref.line}` : ''} · {ref.file}
        </code>
      ))}
    </div>
  );
}

function Field({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="pan-field">
      <span>{label}</span>
      <p>{Array.isArray(value) ? value.join(', ') : value}</p>
    </div>
  );
}

function WorkObjectCard({ obj, openItem }) {
  return (
    <button className={`linked-work-card crit-${obj.criticality}`} type="button" onClick={() => openItem('workObject', obj.id, 'panoptico')}>
      <strong>{obj.name}</strong>
      <span>{obj.group} · criticidad {obj.criticality}/5</span>
      <p>{obj.function}</p>
      <div className="mini-meta">
        {obj.engines?.length > 0 && <em>{obj.engines.length} funcion(es)</em>}
        {obj.risks?.length > 0 && <em>{obj.risks.length} riesgo(s)</em>}
        {obj.associatedEnt?.length > 0 && <em>{obj.associatedEnt.length} ENT</em>}
        {obj.associatedRel?.length > 0 && <em>{obj.associatedRel.length} REL</em>}
      </div>
    </button>
  );
}

function WorkObjectFicha({ item }) {
  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · workObject confirmado</p>
      <h2>{item.name}</h2>
      <div className="status-row">
        <span className="status-chip confirmed">dato confirmado</span>
        <span>{item.group}</span>
        <span>criticidad {item.criticality}/5</span>
      </div>
      <Field label="Funcion" value={item.function} />
      <Field label="Ubicacion" value={item.location} />
      <Field label="Consume" value={item.consumes} />
      <Field label="Produce" value={item.produces} />
      <Field label="Funciones ejecutadas" value={item.engines} />
      <Field label="Falla si" value={item.breaksIfFails} />
      <Field label="Riesgos" value={item.risks} />
      <div className="pan-section">
        <h3>Codigo asociado</h3>
        <CodeRefs refs={item.codeRefs} />
      </div>
    </section>
  );
}

function PanopticoNodeFicha({ node, openItem }) {
  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · nodo Panoptico V1</p>
      <h2>{node.name}</h2>
      <p className="pan-summary">{node.summary}</p>

      <div className="evidence-grid">
        <EvidenceList title="Dato confirmado" type="confirmed" items={node.confirmed} />
        <EvidenceList title="Dato inferido" type="inferred" items={node.inferred} />
        <EvidenceList title="Dato pendiente" type="pending" items={node.pending} />
      </div>

      <div className="pan-section">
        <h3>Objetos de trabajo existentes</h3>
        {node.workObjects?.length > 0 ? (
          <div className="linked-work-grid">
            {node.workObjects.map((obj) => <WorkObjectCard key={obj.id} obj={obj} openItem={openItem} />)}
          </div>
        ) : (
          <p className="muted">No existe workObject especifico para este nodo. La ficha queda marcada como pendiente.</p>
        )}
      </div>

      {node.runtimeObjects?.length > 0 && (
        <div className="pan-section">
          <h3>Runtime relacionado</h3>
          <div className="runtime-links">
            {node.runtimeObjects.map((obj) => (
              <button key={obj.id} type="button" onClick={() => openItem('runtime', obj.id, 'panoptico')}>
                {obj.id}<span>{obj.classification}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {node.risks?.length > 0 && (
        <div className="pan-section">
          <h3>Riesgos relacionados</h3>
          <div className="runtime-links">
            {node.risks.map((risk) => (
              <button key={risk.id} type="button" onClick={() => openItem('risk', risk.id, 'panoptico')}>
                {risk.id}<span>{risk.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {node.surgical && <SurgicalFichaAgenda s={node.surgical} />}
    </section>
  );
}

const ZOOM_LEVELS = [
  { id: 0, label: 'Nivel 0', detail: 'COMPAS + dominios' },
  { id: 1, label: 'Nivel 1', detail: 'Dominio + vecinos' },
  { id: 2, label: 'Nivel 2', detail: 'Objetos semanticos' },
  { id: 3, label: 'Nivel 3', detail: 'Subobjetos / funciones' },
];

function makeIndex(list) {
  return Object.fromEntries((list || []).map((item) => [item.id, item]));
}

function getDomainForSelection(domains, selected) {
  if (!selected) return null;
  return domains.find((domain) => (
    domain.panopticoNodeIds?.includes(selected.id)
    || domain.workObjectIds?.includes(selected.id)
    || domain.runtimeIds?.includes(selected.id)
    || domain.riskIds?.includes(selected.id)
  )) ?? null;
}

function getNeighbors(relations, domainId) {
  return new Set(
    relations
      .filter((rel) => rel.from === domainId || rel.to === domainId)
      .flatMap((rel) => [rel.from, rel.to]),
  );
}

function splitLabel(label) {
  return String(label).split(' / ');
}

function DomainNode({ domain, active, muted, onOpen }) {
  const labelParts = splitLabel(domain.label);
  const titleY = labelParts.length > 2 ? -18 : labelParts.length > 1 ? -8 : 0;
  const lineStep = labelParts.length > 2 ? 14 : 16;
  const subtitleY = labelParts.length > 2 ? 34 : 28;
  return (
    <g
      className={`territory-domain ${active ? 'active' : ''} ${muted ? 'muted-node' : ''}`}
      transform={`translate(${domain.x} ${domain.y})`}
      onClick={() => onOpen(domain)}
      role="button"
      tabIndex="0"
    >
      {active && <circle className="domain-halo" cx="0" cy="0" r="78" />}
      <rect x="-92" y="-42" width="184" height="84" rx="6" />
      <text className="domain-title" textAnchor="middle" y={titleY}>
        {labelParts.map((part, idx) => <tspan key={part} x="0" dy={idx === 0 ? 0 : lineStep}>{part}</tspan>)}
      </text>
      <text className="domain-subtitle" textAnchor="middle" y={subtitleY}>{domain.subtitle}</text>
    </g>
  );
}

function RelationLine({ rel, from, to, riskIndex, visible, onRisk }) {
  if (!from || !to) return null;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const labelX = midX + (rel.labelDx || 0);
  const labelY = midY + (rel.labelDy || -8);
  const labelWidth = Math.max(74, rel.label.length * 6.2 + 18);
  const hasRisk = rel.riskIds?.length > 0;
  return (
    <g className={`territory-relation ${visible ? 'visible' : 'dimmed'} ${hasRisk ? 'critical' : ''} ${rel.lane === 'critical' ? 'main-flow' : ''}`}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
      <rect className="relation-label-bg" x={labelX - labelWidth / 2} y={labelY - 13} width={labelWidth} height="22" rx="11" />
      <text x={labelX} y={labelY + 4} textAnchor="middle">{rel.label}</text>
      {hasRisk && rel.riskIds.map((riskId, idx) => {
        const risk = riskIndex[riskId];
        return (
          <g
            key={riskId}
            className={`risk-pin ${risk?.severity?.toLowerCase() || 'importante'}`}
            transform={`translate(${labelX + (idx * 48) - ((rel.riskIds.length - 1) * 24)} ${labelY + 28})`}
            onClick={(event) => {
              event.stopPropagation();
              onRisk(riskId);
            }}
            role="button"
            tabIndex="0"
          >
            <rect x="-24" y="-11" width="48" height="22" rx="4" />
            <text textAnchor="middle" y="4">{riskId.replace('GAP-', 'G-')}</text>
          </g>
        );
      })}
    </g>
  );
}

function SemanticObjectNode({ item, idx, total, center, onOpen }) {
  const cols = Math.min(4, Math.max(2, total));
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  const startX = center.x - ((cols - 1) * 112) / 2;
  const x = startX + col * 112;
  const y = center.y + 76 + row * 58;
  const label = item.name || item.title || item.id;
  return (
    <g
      className={`semantic-object kind-${item.kind}`}
      transform={`translate(${x} ${y})`}
      onClick={() => item.target && onOpen(item.target, { x, y })}
      role={item.target ? 'button' : 'img'}
      tabIndex={item.target ? '0' : '-1'}
    >
      <rect x="-50" y="-20" width="100" height="40" rx="5" />
      <text textAnchor="middle" y="-2">{label.length > 20 ? `${label.slice(0, 18)}...` : label}</text>
      <text className="object-kind" textAnchor="middle" y="12">{item.kind}</text>
    </g>
  );
}

function SubObjectNode({ item, idx, total, center, onOpen }) {
  const angle = (-120 + (idx * 240) / Math.max(total - 1, 1)) * (Math.PI / 180);
  const x = center.x + Math.cos(angle) * 145;
  const y = center.y + Math.sin(angle) * 92;
  const navigable = !!item.target;
  return (
    <g
      className={`subobject-node${navigable ? ' sub-navigable' : ' sub-informative'}`}
      transform={`translate(${x} ${y})`}
      onClick={navigable ? () => onOpen(item.target) : undefined}
      role={navigable ? 'button' : 'img'}
      tabIndex={navigable ? '0' : '-1'}
    >
      <rect x="-62" y="-15" width="124" height="30" rx="4" />
      <text textAnchor="middle" y="4">{item.label.length > 22 ? `${item.label.slice(0, 20)}...` : item.label}</text>
    </g>
  );
}

function TerritoryCanvas({ data, selected, selectedItem, openItem }) {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [activeDomainId, setActiveDomainId] = useState('diagnostico');
  const [selectedObjectCenter, setSelectedObjectCenter] = useState(null);
  const territory = data.territoryData;

  const indexes = useMemo(() => ({
    panopticoNode: makeIndex(data.panopticoNodes),
    workObject: makeIndex(data.workObjects),
    runtime: makeIndex(data.runtimeObjects),
    risk: makeIndex(data.risks),
  }), [data]);

  const selectedDomain = getDomainForSelection(territory.domains, selected);
  const activeDomain = selectedDomain || territory.domains.find((domain) => domain.id === activeDomainId) || territory.domains[0];
  const neighborIds = getNeighbors(territory.relations, activeDomain.id);
  const domainIndex = makeIndex(territory.domains);
  const zoomFieldRadius = zoomLevel === 1
    ? { rx: 165, ry: 98 }
    : zoomLevel === 2
      ? { rx: 250, ry: 145 }
      : { rx: 315, ry: 190 };

  const objectNodes = useMemo(() => {
    if (!activeDomain || zoomLevel < 2) return [];
    const nodes = [
      ...(activeDomain.panopticoNodeIds || []).map((id) => ({ ...indexes.panopticoNode[id], kind: 'PAN', target: { type: 'panopticoNode', id } })),
      ...(activeDomain.runtimeIds || []).map((id) => ({ ...indexes.runtime[id], name: id, kind: 'RT', target: { type: 'runtime', id } })),
      ...(activeDomain.riskIds || []).map((id) => ({ ...indexes.risk[id], name: id, kind: 'RISK', target: { type: 'risk', id } })),
    ];
    return nodes.filter((item) => item.id).slice(0, 12);
  }, [activeDomain, indexes, zoomLevel]);

  const subObjects = useMemo(() => {
    if (zoomLevel < 3 || !selectedItem) return [];
    if (selected.type === 'workObject') {
      return (selectedItem.engines || []).slice(0, 8).map((eng) => ({
        id: eng,
        label: eng,
        target: null, // engines son strings de función; sin entidad navegable directa en salaData
      }));
    }
    if (selected.type === 'panopticoNode' && selectedItem.surgical) {
      return selectedItem.surgical.functions.slice(0, 8).map((fn) => ({
        id: fn.id,
        label: fn.id,
        target: null, // funciones quirúrgicas no tienen tipo openItem propio aún
      }));
    }
    if (selected.type === 'runtime') {
      return ['autoridad', 'persistencia', 'rehidratacion', 'riesgos'].map((key) => ({
        id: key,
        label: key,
        target: null, // etiquetas conceptuales informativas; no hay entidad separada para abrir
      }));
    }
    return [];
  }, [selected, selectedItem, zoomLevel]);

  function openTarget(target) {
    if (!target) return;
    openItem(target.type, target.id, 'panoptico');
  }

  function openObjectNode(target, center) {
    if (!target) return;
    if (zoomLevel < 3) setZoomLevel(3);
    if (center && typeof center.x === 'number' && typeof center.y === 'number') {
      setSelectedObjectCenter(center);
    }
    openItem(target.type, target.id, 'panoptico');
  }

  function openDomain(domain) {
    setActiveDomainId(domain.id);
    setSelectedObjectCenter(null);
    if (zoomLevel < 1) setZoomLevel(1);
    openTarget(domain.target);
  }

  return (
    <section className="territory-shell" aria-label="Panoptico V2 territorio visual">
      <div className="territory-toolbar">
        <div>
          <p className="eyebrow">Panoptico V2</p>
          <h2>Territorio visual navegable</h2>
          <p>Agrupacion visual derivada. Corpus y Grafo siguen siendo la autoridad documental.</p>
        </div>
        <div className="zoom-controls" aria-label="Zoom semantico">
          {ZOOM_LEVELS.map((level) => (
            <button key={level.id} type="button" className={zoomLevel === level.id ? 'active' : ''} onClick={() => setZoomLevel(level.id)} title={level.detail}>
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="territory-map-wrap">
        <svg className={`territory-map zoom-${zoomLevel}`} viewBox="0 0 1000 680" role="img" aria-label="Mapa visual del Panoptico">
          <defs>
            <marker id="arrow-territory" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          <rect className="map-ground" x="14" y="14" width="972" height="652" rx="10" />
          <rect className="runtime-zone" x="118" y="548" width="764" height="76" rx="8" />
          <text className="runtime-zone-title" x="136" y="544">Firebase / Runtime persistente inferior</text>
          {zoomLevel > 0 && activeDomain && (
            <ellipse
              className={`zoom-field depth-${zoomLevel}`}
              cx={activeDomain.x}
              cy={activeDomain.y}
              rx={zoomFieldRadius.rx}
              ry={zoomFieldRadius.ry}
            />
          )}

          {territory.relations.map((rel) => (
            <RelationLine
              key={rel.id}
              rel={rel}
              from={domainIndex[rel.from]}
              to={domainIndex[rel.to]}
              riskIndex={indexes.risk}
              visible={zoomLevel === 0 || neighborIds.has(rel.from) || neighborIds.has(rel.to)}
              onRisk={(riskId) => openTarget({ type: 'risk', id: riskId })}
            />
          ))}

          <g className="root-node" transform="translate(500 285)" onClick={() => openTarget(territory.root.target)} role="button" tabIndex="0">
            <circle r="76" />
            <text textAnchor="middle" y="-10">COMPAS</text>
            {territory.root.metrics.map((metric, idx) => (
              <text className="root-metric" key={metric} textAnchor="middle" y={15 + idx * 14}>{metric}</text>
            ))}
          </g>

          {territory.domains.map((domain) => {
            const active = zoomLevel > 0 && activeDomain.id === domain.id;
            const muted = zoomLevel > 0 && !active && !neighborIds.has(domain.id);
            return <DomainNode key={domain.id} domain={domain} active={active} muted={muted} onOpen={openDomain} />;
          })}

          {zoomLevel >= 2 && objectNodes.map((item, idx) => (
            <SemanticObjectNode key={`${item.kind}-${item.id}`} item={item} idx={idx} total={objectNodes.length} center={activeDomain} onOpen={openObjectNode} />
          ))}

          {zoomLevel >= 3 && subObjects.length === 0 && (
            <text className="subobject-hint" x={activeDomain.x} y={activeDomain.y + 120} textAnchor="middle">
              Selecciona un objeto (Nivel 2) para ver sus subelementos
            </text>
          )}
          {zoomLevel >= 3 && subObjects.map((item, idx) => (
            <SubObjectNode key={item.id} item={item} idx={idx} total={subObjects.length} center={selectedObjectCenter || activeDomain} onOpen={openTarget} />
          ))}

          {territory.bottomBand.map((item, idx) => (
            <g key={item.id} className="bottom-band-node" transform={`translate(${210 + idx * 290} 592)`} onClick={() => openTarget(item.target)} role="button" tabIndex="0">
              <rect x="-118" y="-23" width="236" height="46" rx="5" />
              <text textAnchor="middle" y="-3">{item.label}</text>
              <text className="bottom-band-detail" textAnchor="middle" y="13">{item.detail}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="territory-status">
        <span>Zoom: {ZOOM_LEVELS[zoomLevel].detail}</span>
        <span>Dominio activo: {activeDomain.label}</span>
        <span>{data.meta.n_nodos} ENT / {data.meta.n_arcos} REL disponibles</span>
      </div>
    </section>
  );
}


function RiskFicha({ risk, data, openItem }) {
  if (!risk || !risk.severity) {
    return <section className="pan-ficha"><p className="muted">Riesgo no encontrado.</p></section>;
  }

  const affectedNodes = data.panopticoNodes.filter((pn) => pn.riskIds?.includes(risk.id));
  const affectedDomains = data.territoryData.domains.filter((d) => d.riskIds?.includes(risk.id));
  const affectedRelations = data.territoryData.relations.filter((rel) => rel.riskIds?.includes(risk.id));

  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · riesgo operativo</p>
      <h2>{risk.id}</h2>

      <div className="status-row">
        <span className={`status-chip sev-${risk.severity.toLowerCase()}`}>{risk.severity}</span>
        <span>{risk.kind}</span>
        <span>{risk.status}</span>
      </div>

      <Field label="Titulo" value={risk.title} />
      <Field label="Fuente" value={risk.source} />
      <Field label="Afecta" value={risk.affects} />

      {affectedDomains.length > 0 && (
        <div className="pan-section">
          <h3>Dominios afectados</h3>
          <div className="runtime-links">
            {affectedDomains.map((domain) => (
              <button key={domain.id} type="button" onClick={() => openItem(domain.target.type, domain.target.id, 'panoptico')}>
                {domain.label}<span>{domain.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {affectedRelations.length > 0 && (
        <div className="pan-section">
          <h3>Relaciones territoriales afectadas</h3>
          <div className="runtime-links">
            {affectedRelations.map((rel) => (
              <button key={rel.id} type="button" disabled>
                {rel.from} → {rel.to}<span>{rel.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {affectedNodes.length > 0 && (
        <div className="pan-section">
          <h3>Nodos panóptico afectados</h3>
          <div className="runtime-links">
            {affectedNodes.map((node) => (
              <button key={node.id} type="button" onClick={() => openItem('panopticoNode', node.id, 'panoptico')}>
                {node.name}<span>{node.summary}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function RuntimeFicha({ rt, data, openItem }) {
  if (!rt || !rt.classification) {
    return <section className="pan-ficha"><p className="muted">Runtime no encontrado.</p></section>;
  }

  const affectedNodes = data.panopticoNodes.filter((pn) => pn.runtimeObjectIds?.includes(rt.id));
  const affectedDomains = data.territoryData.domains.filter((d) => d.runtimeIds?.includes(rt.id));
  const associatedRisks = data.risks.filter((risk) => rt.risks?.includes(risk.id));

  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · objeto runtime</p>
      <h2>{rt.id}</h2>

      <div className="status-row">
        <span className="status-chip confirmed">{rt.classification}</span>
      </div>

      <Field label="Autoridad" value={rt.authority} />
      <Field label="Persistencia" value={rt.persistence} />
      <Field label="Rehidratación" value={rt.rehydration} />
      <Field label="Fuente" value={rt.source} />

      {associatedRisks.length > 0 && (
        <div className="pan-section">
          <h3>Riesgos asociados</h3>
          <div className="runtime-links">
            {associatedRisks.map((risk) => (
              <button key={risk.id} type="button" onClick={() => openItem('risk', risk.id, 'panoptico')}>
                {risk.id}<span>{risk.severity}</span><span>{risk.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {affectedDomains.length > 0 && (
        <div className="pan-section">
          <h3>Dominios que usan este runtime</h3>
          <div className="runtime-links">
            {affectedDomains.map((domain) => (
              <button key={domain.id} type="button" onClick={() => openItem(domain.target.type, domain.target.id, 'panoptico')}>
                {domain.label}<span>{domain.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {affectedNodes.length > 0 && (
        <div className="pan-section">
          <h3>Nodos panóptico relacionados</h3>
          <div className="runtime-links">
            {affectedNodes.map((node) => (
              <button key={node.id} type="button" onClick={() => openItem('panopticoNode', node.id, 'panoptico')}>
                {node.name}<span>{node.summary}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}


function ChainFicha({ chain, data, openItem }) {
  if (!chain || !chain.steps) {
    return <section className="pan-ficha"><p className="muted">Cadena no encontrada.</p></section>;
  }

  const associatedRisks = data.risks.filter((risk) => chain.risks?.includes(risk.id));

  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · cadena operacional</p>
      <h2>{chain.name || chain.id}</h2>

      <div className="status-row">
        <span className="status-chip confirmed">{chain.status}</span>
      </div>

      <Field label="ID" value={chain.id} />
      <Field label="Pasos" value={chain.steps} />
      <Field label="Ruptura" value={chain.rupture} />
      <Field label="Fuente" value={chain.source} />

      {associatedRisks.length > 0 && (
        <div className="pan-section">
          <h3>Riesgos de la cadena</h3>
          <div className="runtime-links">
            {associatedRisks.map((risk) => (
              <button key={risk.id} type="button" onClick={() => openItem('risk', risk.id, 'panoptico')}>
                {risk.id}<span>{risk.severity}</span><span>{risk.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ContextualPanel({ selected, selectedItem, data, openItem }) {
  const item = selectedItem ?? data.panopticoNodes[0];
  if (!item) return null;
  if (selected.type === 'workObject') return <WorkObjectFicha item={item} />;
  if (selected.type === 'panopticoNode') return <PanopticoNodeFicha node={item} openItem={openItem} />;
  if (selected.type === 'risk') return <RiskFicha risk={item} data={data} openItem={openItem} />;
  if (selected.type === 'runtime') return <RuntimeFicha rt={item} data={data} openItem={openItem} />;
  if (selected.type === 'chain') return <ChainFicha chain={item} data={data} openItem={openItem} />;
  return (
    <section className="pan-ficha contextual-compact">
      <p className="eyebrow">Panel contextual</p>
      <h2>{item.name || item.title || item.id}</h2>
      <p className="pan-summary">Elemento seleccionado desde el territorio visual. El inspector derecho mantiene el detalle persistente.</p>
    </section>
  );
}

export default function VistaPanoptico({ data, selected, selectedItem, openItem }) {
  return (
    <div className="panoptico-v2">
      <TerritoryCanvas data={data} selected={selected} selectedItem={selectedItem} openItem={openItem} />
      <ContextualPanel data={data} selected={selected} selectedItem={selectedItem} openItem={openItem} />
    </div>
  );

  const item = selectedItem ?? data.panopticoNodes[0];

  if (selected.type === 'workObject') return <WorkObjectFicha item={item} />;
  if (selected.type === 'panopticoNode') return <PanopticoNodeFicha node={item} openItem={openItem} />;

  return (
    <section className="pan-ficha">
      <p className="eyebrow">Ficha central · elemento vinculado</p>
      <h2>{item?.name || item?.title || item?.id}</h2>
      <p className="pan-summary">Elemento abierto desde el arbol o el inspector. La informacion completa se muestra en el inspector derecho.</p>
    </section>
  );
}
