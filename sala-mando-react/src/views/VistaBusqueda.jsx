export default function VistaBusqueda({ query, setQuery, results, openItem }) {
  return (
    <section className="band full">
      <h2>Busqueda global</h2>
      <label className="search-box">
        Buscar por identificador, riesgo, objeto runtime o fuente
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. RT-005, planLocalSalud, REL-075, ENT-914" />
      </label>
      <div className="search-results">
        {results.length === 0 && <p>No hay resultados para la busqueda actual.</p>}
        {results.map(({ type, item }) => (
          <button key={`${type}-${item.id}`} type="button" onClick={() => openItem(type, item.id, viewForType(type))}>
            <strong>{item.id}</strong>
            <span>{type}</span>
            <p>{item.name || item.title || item.relationType || item.classification}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function viewForType(type) {
  if (type === 'risk') return 'riesgos';
  if (type === 'runtime') return 'runtime';
  if (type === 'relation') return 'relaciones';
  if (type === 'chain') return 'cadenas';
  if (type === 'workObject') return 'operativa';
  return 'nodo';
}
