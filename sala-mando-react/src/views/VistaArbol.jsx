export default function VistaArbol({ data, openItem }) {
  return (
    <section className="band full">
      <h2>Arbol documental y topologico</h2>
      <div className="tree-columns">
        <TreeGroup title="Gobierno documental" items={data.artifacts} type="artifact" openItem={openItem} />
        <TreeGroup title="Muestra ENT" items={data.entities} type="entity" openItem={openItem} />
        <TreeGroup title="Relaciones criticas" items={data.relations} type="relation" openItem={openItem} />
      </div>
    </section>
  );
}

function TreeGroup({ title, items, type, openItem }) {
  return (
    <div className="tree-group">
      <h3>{title}</h3>
      {items.map((item) => (
        <button key={item.id} type="button" onClick={() => openItem(type, item.id, type === 'relation' ? 'relaciones' : 'nodo')}>
          {item.id}
          <span>{item.block || item.type || item.relationType}</span>
        </button>
      ))}
    </div>
  );
}
