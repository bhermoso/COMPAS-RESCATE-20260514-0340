import { useMemo, useState, useEffect } from 'react';
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

// ── Gobierno semántico — claves y helpers ────────────────────────────────
const LS_CHECKLIST = 'compas-governance-checklist';
const LS_REVIEWER  = 'compas-governance-reviewer';

const REVIEWER_DEFAULT = { displayName: '', role: '', instance: '' };

// Merge por sourceId: el estado guardado prevalece por ítem; ítems nuevos en la
// base reciben sus valores por defecto; ítems eliminados de la base son ignorados.
function mergeChecklist(base, saved) {
  if (!Array.isArray(saved) || saved.length === 0) return base;
  const savedMap = Object.fromEntries(saved.map(i => [i.sourceId, i]));
  return base.map(item => ({ ...item, ...(savedMap[item.sourceId] ?? {}) }));
}

function loadChecklist() {
  try {
    const raw = localStorage.getItem(LS_CHECKLIST);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[COMPAS Gobierno] localStorage checklist corrupto — usando estado base.', e);
    return null;
  }
}

function loadReviewer() {
  try {
    const raw = localStorage.getItem(LS_REVIEWER);
    if (!raw) return REVIEWER_DEFAULT;
    return { ...REVIEWER_DEFAULT, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('[COMPAS Gobierno] localStorage reviewer corrupto — usando estado base.', e);
    return REVIEWER_DEFAULT;
  }
}

export default function App() {
  const [view, setView] = useState('explorador');
  const [selected, setSelected] = useState({ type: 'workObject', id: 'wo-municipio' });
  const [query, setQuery] = useState('');
  const [roleId, setRoleId] = useState('operador-sala');
  const liveData = useCompasLive();

  const selectedItem = useMemo(() => findItem(selected.type, selected.id), [selected]);
  const results = useMemo(() => searchSala(query), [query]);
  const role = salaData.roles.find((item) => item.id === roleId) ?? salaData.roles[0];

  const [checklistItems, setChecklistItems] = useState(() =>
    mergeChecklist(governanceChecklist.map(i => ({ ...i })), loadChecklist()),
  );
  const [reviewer, setReviewer] = useState(loadReviewer);

  useEffect(() => {
    try { localStorage.setItem(LS_CHECKLIST, JSON.stringify(checklistItems)); }
    catch (e) { console.warn('[COMPAS Gobierno] No se pudo persistir el checklist.', e); }
  }, [checklistItems]);

  useEffect(() => {
    try { localStorage.setItem(LS_REVIEWER, JSON.stringify(reviewer)); }
    catch (e) { console.warn('[COMPAS Gobierno] No se pudo persistir el revisor.', e); }
  }, [reviewer]);

  function updateChecklistItem(id, patch) {
    setChecklistItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }
  function replaceChecklistItems(incoming) {
    setChecklistItems(mergeChecklist(governanceChecklist.map(i => ({ ...i })), incoming));
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
    checklist: <VistaChecklistGobierno {...commonProps} checklistItems={checklistItems} onUpdate={updateChecklistItem} onReplace={replaceChecklistItems} reviewer={reviewer} setReviewer={setReviewer} />,
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
