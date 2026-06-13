import Header from './Header.jsx';
import SidebarPrincipal from './SidebarPrincipal.jsx';
import InspectorLateral from './InspectorLateral.jsx';

export default function SalaShell({ data, view, setView, selected, selectedItem, openItem, role, roleId, setRoleId, children, liveData }) {
  const isPanoptico = view === 'panoptico';

  return (
    <div className="sala-app">
      <Header data={data} role={role} roleId={roleId} setRoleId={setRoleId} liveData={liveData} />
      <div className="guardrail-strip" aria-label="Restricciones criticas">
        {data.guardrails.map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className={`sala-layout ${isPanoptico ? 'territory-mode' : ''}`}>
        <SidebarPrincipal
          data={data}
          views={data.views}
          activeView={view}
          setView={setView}
          selected={selected}
          openItem={openItem}
          compact={isPanoptico}
        />
        <main className="main-panel">
          <div className={`view-heading ${isPanoptico ? 'territory-heading' : ''}`}>
            <p className="eyebrow">Integrada en COMPÁS · Gobierno semántico operativo</p>
            <h1>{data.views.find((item) => item.id === view)?.label ?? 'Vista Ejecutiva'}</h1>
          </div>
          {children}
        </main>
        <InspectorLateral selected={selected} item={selectedItem} openItem={openItem} />
      </div>
    </div>
  );
}
