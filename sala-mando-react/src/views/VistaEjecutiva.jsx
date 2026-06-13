export default function VistaEjecutiva({ data, openItem }) {
  const rt005 = data.risks.find((item) => item.id === 'RT-005');
  const zc002 = data.risks.find((item) => item.id === 'ZC-002');
  const m = data.meta;

  return (
    <section className="view-grid">
      <div className="band full">
        <h2>Estado ejecutivo</h2>
        <p>Superficie documental-operacional para navegar Corpus R3, Grafo R2 y Sala N2 sin integracion con COMPAS.</p>
        <div className="metrics">
          <span><strong>{m.n_nodos}</strong> ENTs</span>
          <span><strong>{m.n_arcos}</strong> RELs</span>
          <span><strong>{m.n_bloques}</strong> Bloques</span>
          <span><strong>{m.n_fazes}</strong> FAZEs</span>
        </div>
        <div className="metrics" style={{ marginTop: 8 }}>
          <span><strong>{m.n_arcos_completos}</strong> arcos completos</span>
          <span><strong>{m.n_arcos_parciales}</strong> arcos en fuente local</span>
          <span>Dataset R2 activo</span>
          <span>Runtime solo observacional</span>
        </div>
      </div>

      <div className="band">
        <h2>Artefactos base</h2>
        <div className="list-stack">
          {data.artifacts.map((item) => (
            <button key={item.id} type="button" onClick={() => openItem('artifact', item.id)}>
              <strong>{item.id}</strong>
              <span>{item.authority}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="band">
        <h2>Riesgos prioritarios</h2>
        <div className="priority-actions">
          <button type="button" onClick={() => openItem('risk', rt005.id, 'riesgos')}>{rt005.id} · {rt005.title}</button>
          <button type="button" onClick={() => openItem('risk', zc002.id, 'riesgos')}>{zc002.id} · {zc002.title}</button>
          <button type="button" onClick={() => openItem('chain', 'CADENA-PLAN-AGENDA-EVALUACION-COMPILADOR', 'cadenas')}>Abrir Plan → Agenda → Evaluación → Compilador</button>
        </div>
      </div>
    </section>
  );
}
