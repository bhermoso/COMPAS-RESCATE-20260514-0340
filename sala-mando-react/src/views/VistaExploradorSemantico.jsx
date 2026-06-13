import { useMemo, useState } from 'react';

const TAB_DEFS = [
  { id: 'home', label: 'Home', description: 'Entrada operativa a COMPAS.', priorityIds: ['wo-municipio', 'wo-firebase', 'wo-compilador', 'wo-agenda'] },
  { id: 'diagnostico', label: 'Diagnostico', domainIds: ['diagnostico'] },
  { id: 'priorizacion', label: 'Priorizacion / Planificacion', domainIds: ['priorizacion'] },
  { id: 'plan-agenda-evaluacion', label: 'Plan / Agenda / Evaluacion', domainIds: ['compilador', 'agenda', 'evaluacion'] },
  { id: 'firebase', label: 'Firebase', objectIds: ['wo-firebase', 'wo-municipio', 'wo-contextoia'] },
  { id: 'motores', label: 'Motores' },
  { id: 'runtime', label: 'Runtime', objectIds: ['wo-compilador', 'wo-agenda', 'wo-evaluacion', 'wo-contextoia', 'wo-firebase', 'wo-documento-pls'] },
  { id: 'riesgos', label: 'Riesgos' },
  { id: 'codigo', label: 'Codigo' },
];

function textOf(value) {
  return String(value ?? '').toLowerCase();
}

function listText(values) {
  return (values || []).join(' | ');
}

function getDomainForObject(data, objectId) {
  return data.territoryData?.domains.find((domain) => domain.workObjectIds?.includes(objectId)) ?? null;
}

function getObjectsForTab(data, tab) {
  const byId = new Map(data.workObjects.map((item) => [item.id, item]));
  if (tab.priorityIds) return tab.priorityIds.map((id) => byId.get(id)).filter(Boolean);
  if (tab.objectIds) return tab.objectIds.map((id) => byId.get(id)).filter(Boolean);
  if (tab.domainIds) {
    const ids = new Set(
      data.territoryData.domains
        .filter((domain) => tab.domainIds.includes(domain.id))
        .flatMap((domain) => domain.workObjectIds || []),
    );
    return data.workObjects.filter((item) => ids.has(item.id));
  }
  if (tab.id === 'motores') {
    return data.workObjects.filter((item) => {
      const name = textOf(item.name);
      return name.includes('motor') || name.includes('sam') || name.includes('vrelas') || name.includes('hpc') || name.includes('fusion') || item.engines?.length > 0;
    });
  }
  if (tab.id === 'riesgos') return data.workObjects.filter((item) => item.risks?.length > 0);
  if (tab.id === 'codigo') return data.workObjects.filter((item) => item.codeRefs?.length > 0);
  return data.workObjects;
}

function FieldList({ label, values }) {
  if (!values || values.length === 0) return null;
  return (
    <div className="explorer-field">
      <span>{label}</span>
      <p>{listText(values)}</p>
    </div>
  );
}

function CodeRefsBlock({ refs }) {
  return (
    <div className="explorer-code-block">
      <h3>Codigo</h3>
      {!refs || refs.length === 0 ? (
        <p className="muted">Sin codeRefs registrados para este objeto.</p>
      ) : (
        <div className="explorer-code-list">
          {refs.map((ref) => (
            <code key={`${ref.identifier}-${ref.file}-${ref.line ?? 'na'}`}>
              {ref.identifier}{ref.line ? ` l.${ref.line}` : ''} · {ref.file}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}

function ObjectList({ objects, activeId, openItem }) {
  return (
    <aside className="explorer-object-list" aria-label="Objetos visibles">
      <p className="eyebrow">Objetos visibles</p>
      {objects.map((obj) => (
        <button
          key={obj.id}
          type="button"
          className={activeId === obj.id ? 'active' : ''}
          onClick={() => openItem('workObject', obj.id, 'explorador')}
        >
          <strong>{obj.name}</strong>
          <span>{obj.group} · criticidad {obj.criticality}/5</span>
        </button>
      ))}
    </aside>
  );
}

function ObjectFicha({ object, activeTab }) {
  if (!object) {
    return (
      <section className="explorer-object-card empty">
        <p className="eyebrow">Objeto</p>
        <h2>Selecciona un objeto</h2>
        <p>El flujo operativo es COMPAS -&gt; Tab -&gt; Objeto -&gt; Codigo.</p>
      </section>
    );
  }

  return (
    <section className="explorer-object-card">
      <div className="explorer-flow">
        <span>COMPAS</span>
        <span>{activeTab.label}</span>
        <span>{object.name}</span>
        <span>Codigo</span>
        <span className="future">Reparacion futura</span>
      </div>

      <p className="eyebrow">Objeto seleccionado</p>
      <h2>{object.name}</h2>
      <div className="status-row">
        <span className="status-chip confirmed">dato confirmado</span>
        <span>{object.group}</span>
        <span>criticidad {object.criticality}/5</span>
      </div>

      <div className="explorer-card-grid">
        <div>
          <div className="explorer-field">
            <span>Funcion</span>
            <p>{object.function}</p>
          </div>
          <div className="explorer-field">
            <span>Ubicacion</span>
            <p>{object.location}</p>
          </div>
          <FieldList label="Consume" values={object.consumes} />
          <FieldList label="Produce" values={object.produces} />
        </div>
        <div>
          <FieldList label="Subobjetos / funciones" values={object.engines} />
          <FieldList label="Riesgos" values={object.risks} />
          <div className="explorer-field">
            <span>Reparacion</span>
            <p>Futura. No activa en esta version.</p>
          </div>
        </div>
      </div>

      <CodeRefsBlock refs={object.codeRefs} />
    </section>
  );
}

function TerritoryContext({ data, activeObject }) {
  const activeDomain = activeObject ? getDomainForObject(data, activeObject.id) : null;
  const territory = data.territoryData;
  const relations = territory.relations || [];
  const domainIndex = Object.fromEntries(territory.domains.map((domain) => [domain.id, domain]));

  return (
    <section className="territory-context" aria-label="Contexto territorial">
      <div className="territory-context-head">
        <div>
          <p className="eyebrow">Territorio contextual</p>
          <h3>{activeDomain ? activeDomain.label : 'Sin relacion territorial confirmada'}</h3>
        </div>
        <span>{territory.authority}</span>
      </div>
      <svg viewBox="0 0 1000 360" role="img" aria-label="Territorio reducido">
        <rect className="tc-ground" x="18" y="18" width="964" height="324" rx="10" />
        <g className="tc-root" transform="translate(500 178)">
          <circle r="42" />
          <text textAnchor="middle" y="5">COMPAS</text>
        </g>
        {relations.map((rel) => {
          const from = domainIndex[rel.from];
          const to = domainIndex[rel.to];
          if (!from || !to) return null;
          const visible = activeDomain && (rel.from === activeDomain.id || rel.to === activeDomain.id);
          return (
            <line
              key={rel.id}
              className={visible ? 'tc-relation active' : 'tc-relation'}
              x1={from.x}
              y1={Math.max(58, from.y * 0.55)}
              x2={to.x}
              y2={Math.max(58, to.y * 0.55)}
            />
          );
        })}
        {territory.domains.map((domain) => {
          const active = activeDomain?.id === domain.id;
          return (
            <g key={domain.id} className={active ? 'tc-domain active' : 'tc-domain'} transform={`translate(${domain.x} ${Math.max(58, domain.y * 0.55)})`}>
              <rect x="-72" y="-24" width="144" height="48" rx="5" />
              <text textAnchor="middle" y="4">{domain.label.replace(' / ', ' / ').slice(0, 28)}</text>
            </g>
          );
        })}
      </svg>
      {!activeDomain && <p className="muted">El objeto seleccionado no tiene dominio territorial confirmado en territoryData.</p>}
    </section>
  );
}

export default function VistaExploradorSemantico({ data, selected, selectedItem, openItem }) {
  const [activeTabId, setActiveTabId] = useState('home');
  const activeTab = TAB_DEFS.find((tab) => tab.id === activeTabId) || TAB_DEFS[0];
  const visibleObjects = useMemo(() => getObjectsForTab(data, activeTab), [data, activeTab]);
  const selectedObject = selected.type === 'workObject' ? selectedItem : null;
  const activeObject = selectedObject && visibleObjects.some((item) => item.id === selectedObject.id) ? selectedObject : null;

  return (
    <section className="explorer" aria-label="Explorador semantico de COMPAS">
      <header className="explorer-header">
        <div>
          <p className="eyebrow">COMPAS</p>
          <h2>Explorador semantico</h2>
          <p>Ruta principal: COMPAS -&gt; Tab -&gt; Objeto -&gt; Codigo. El territorio queda como contexto relacional.</p>
        </div>
        <div className="explorer-header-metrics">
          <span>{data.meta.n_nodos} ENT</span>
          <span>{data.meta.n_arcos} REL</span>
        </div>
      </header>

      <nav className="semantic-tabs" aria-label="Tabs semanticos">
        {TAB_DEFS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab.id === tab.id ? 'active' : ''}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="explorer-body">
        <ObjectList objects={visibleObjects} activeId={selectedObject?.id} openItem={openItem} />
        <ObjectFicha object={activeObject} activeTab={activeTab} />
        <TerritoryContext data={data} activeObject={selectedObject} />
      </div>
    </section>
  );
}
