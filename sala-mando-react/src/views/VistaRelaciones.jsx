import { useState } from 'react';

const MODO_CHIPS = [
  { id: 'all',      label: 'Todas' },
  { id: 'completas', label: 'Completas' },
  { id: 'fuente',   label: 'Detalle en fuente' },
];

export default function VistaRelaciones({ data, openItem }) {
  const [modoFilter, setModoFilter] = useState('all');
  const visible =
    modoFilter === 'all'      ? data.relations :
    modoFilter === 'completas' ? data.relations.filter((r) => r.status === 'OBSERVABLE') :
                                 data.relations.filter((r) => r.status === 'DOCUMENTAL_EN_FUENTE');

  return (
    <section className="band full">
      <h2>Relaciones navegables</h2>
      <div className="filter-chips">
        {MODO_CHIPS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={modoFilter === m.id ? 'chip active' : 'chip'}
            onClick={() => setModoFilter(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="filter-count">{visible.length} relaciones</p>
      <div className="table-like relations-table">
        <div className="row head"><span>ID</span><span>Origen</span><span>Tipo</span><span>Destino</span><span>Riesgos</span></div>
        {visible.map((item) => (
          <button className="row" key={item.id} type="button" onClick={() => openItem('relation', item.id)}>
            <span>{item.id}</span>
            <span>{item.origin}</span>
            <span>{item.relationType}</span>
            <span>{item.target}</span>
            <span>{item.risks.join(', ') || '—'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
