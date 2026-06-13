import { useMemo, useState } from 'react';
import { salaData, findItem, searchSala } from './data/salaData.js';
import { governanceChecklist } from './data/governanceChecklist.js';
import { useCompasLive } from './hooks/useCompasLive.js';
import SalaShell from './components/SalaShell.jsx';
import VistaEjecutiva from './views/VistaEjecutiva.jsx';
import VistaArbol from './views/VistaArbol.jsx';
import VistaNodo from './views/VistaNodo.jsx';
import VistaRelaciones from './views/VistaRelaciones.jsx';
import VistaRiesgos from './views/VistaRiesgos.jsx';
import VistaRuntime from './views/VistaRuntime.jsx';
import VistaCadenas from './views/VistaCadenas.jsx';
import VistaBusqueda from './views/VistaBusqueda.jsx';
import VistaOperativa from './views/VistaOperativa.jsx';
import VistaPanoptico from './views/VistaPanoptico.jsx';
import VistaExploradorSemantico from './views/VistaExploradorSemantico.jsx';
import VistaChecklistGobierno from './views/VistaChecklistGobierno.jsx';

export default function App() {
  const [view, setView] = useState('explorador');
  const [selected, setSelected] = useState({ type: 'workObject', id: 'wo-municipio' });
  const [query, setQuery] = useState('');
  const [roleId, setRoleId] = useState('operador-sala');
  const liveData = useCompasLive();

  const selectedItem = useMemo(() => findItem(selected.type, selected.id), [selected]);
  const results = useMemo(() => searchSala(query), [query]);
  const role = salaData.roles.find((item) => item.id === roleId) ?? salaData.roles[0];

  const [checklistItems, setChecklistItems] = useState(
    () => governanceChecklist.map(i => ({ ...i }))
  );
  function updateChecklistItem(id, patch) {
    setChecklistItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  function openItem(type, id, targetView) {
    setSelected({ type, id });
    if (targetView) setView(targetView);
  }

  const commonProps = { data: salaData, openItem, selected, selectedItem };
  const renderedView = {
    explorador: <VistaExploradorSemantico {...commonProps} />,
    panoptico: <VistaPanoptico {...commonProps} />,
    ejecutiva: <VistaEjecutiva {...commonProps} />,
    arbol: <VistaArbol {...commonProps} />,
    nodo: <VistaNodo {...commonProps} />,
    relaciones: <VistaRelaciones {...commonProps} />,
    riesgos: <VistaRiesgos {...commonProps} />,
    runtime: <VistaRuntime {...commonProps} liveData={liveData} />,
    cadenas: <VistaCadenas {...commonProps} />,
    busqueda: <VistaBusqueda {...commonProps} query={query} setQuery={setQuery} results={results} />,
    operativa: <VistaOperativa {...commonProps} />,
    checklist: <VistaChecklistGobierno {...commonProps} checklistItems={checklistItems} onUpdate={updateChecklistItem} />,
  }[view];

  return (
    <SalaShell
      data={salaData}
      view={view}
      setView={setView}
      selected={selected}
      selectedItem={selectedItem}
      openItem={openItem}
      role={role}
      roleId={roleId}
      setRoleId={setRoleId}
      liveData={liveData}
    >
      {renderedView}
    </SalaShell>
  );
}
