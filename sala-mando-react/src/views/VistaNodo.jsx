import { useState } from 'react';

const FAZE_CHIPS = [
  { id: 'all',    label: 'Todas' },
  { id: 'FASE_1', label: 'FASE 1' },
  { id: 'FASE_2', label: 'FASE 2' },
  { id: 'FASE_3', label: 'FASE 3' },
  { id: 'FASE_4', label: 'FASE 4' },
  { id: 'FASE_5', label: 'FASE 5' },
  { id: 'FASE_6', label: 'FASE 6' },
  { id: 'INFRA',  label: 'INFRA' },
];

export default function VistaNodo({ data, openItem }) {
  const [fazeFilter, setFazeFilter] = useState('all');
  const visible = fazeFilter === 'all'
    ? data.entities
    : data.entities.filter((e) => e.faze === fazeFilter);

  return (
    <section className="band full">
      <h2>Nodos gobernables</h2>
      <div className="filter-chips">
        {FAZE_CHIPS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={fazeFilter === f.id ? 'chip active' : 'chip'}
            onClick={() => setFazeFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="filter-count">{visible.length} entidades</p>
      <div className="table-like nodo-table">
        <div className="row head"><span>ID · FASE</span><span>Bloque</span><span>Estado</span><span>Riesgos</span></div>
        {visible.map((item) => (
          <button className="row" key={item.id} type="button" onClick={() => openItem('entity', item.id)}>
            <span>{item.name}</span>
            <span>{item.block}</span>
            <span>{item.status}</span>
            <span>{item.risks.join(', ') || 'Sin riesgo asociado'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
