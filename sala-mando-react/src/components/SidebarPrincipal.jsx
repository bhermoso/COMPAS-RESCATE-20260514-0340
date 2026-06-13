export default function SidebarPrincipal({ data, views, activeView, setView, selected, openItem, compact = false }) {
  return (
    <nav className={`sidebar ${compact ? 'sidebar-compact' : ''}`} aria-label="Navegacion principal">
      <h2>Arbol semantico</h2>
      {compact && <p className="territory-rail-label">Territorio</p>}
      <div className="semantic-tree">
        {data.panopticoNodes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={selected.type === 'panopticoNode' && selected.id === item.id ? 'active semantic-node' : 'semantic-node'}
            onClick={() => openItem('panopticoNode', item.id, 'panoptico')}
          >
            <strong>{item.name}</strong>
            <span>
              {item.workObjects.length} workObject{item.workObjects.length !== 1 ? 's' : ''} · {item.pending.length ? 'pendiente' : 'confirmado'}
            </span>
          </button>
        ))}
      </div>

      <h2 className="sidebar-subtitle">Vistas soporte</h2>
      {views.map((item) => (
        <button key={item.id} type="button" className={activeView === item.id ? 'active' : ''} onClick={() => setView(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
