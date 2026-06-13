function readableValue(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => readableValue(item))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    const preferred = value.id || value.title || value.label || value.name || value.key;
    if (preferred) return String(preferred);
    try {
      const compact = JSON.stringify(value);
      return compact.length > 120 ? `${compact.slice(0, 117)}...` : compact;
    } catch {
      return 'Objeto sin titulo';
    }
  }
  return String(value);
}

function Field({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="field">
      <span>{label}</span>
      <p>{readableValue(value)}</p>
    </div>
  );
}

export default function InspectorLateral({ selected, item, openItem }) {
  return (
    <aside className="inspector" aria-label="Inspector lateral">
      <p className="eyebrow">Inspector</p>
      {!item ? (
        <p>No hay elemento seleccionado.</p>
      ) : (
        <>
          <h2>{item.id}</h2>
          <Field label="Tipo" value={selected.type} />
          <Field label="Nombre" value={item.name || item.title} />
          <Field label="Función" value={item.function} />
          <Field label="Grupo" value={item.group} />
          <Field label="Ubicación" value={item.location} />
          <Field label="Estado" value={item.status} />
          <Field label="FAZE" value={item.fazeNombre} />
          <Field label="Regimen" value={item.regimen} />
          <Field label="Bloque" value={item.block} />
          <Field label="Autoridad" value={item.authority} />
          <Field label="Clasificacion" value={item.classification} />
          <Field label="Modo" value={item.modo} />
          <Field label="Fuente" value={item.source || item.evidence} />
          <Field label="Evidencia" value={item.evidencia} />
          <Field label="Persistencia" value={item.persistence} />
          <Field label="Rehidratacion" value={item.rehydration} />
          <Field label="Motores" value={item.engines} />
          <Field label="Consume" value={item.consumes} />
          <Field label="Produce" value={item.produces} />
          <Field label="Falla si" value={item.breaksIfFails} />
          <Field label="Riesgos" value={item.risks} />
          <Field label="Afecta" value={item.affects} />
          <Field label="Limites" value={item.limits} />
          <Field label="Dato confirmado" value={item.confirmed} />
          <Field label="Dato inferido" value={item.inferred} />
          <Field label="Dato pendiente" value={item.pending} />
          {selected.type === 'panopticoNode' && item.workObjects?.length > 0 && (
            <div className="field">
              <span>WorkObjects vinculados</span>
              {item.workObjects.map((obj) => (
                <button className="inline-action" key={obj.id} type="button" onClick={() => openItem('workObject', obj.id, 'panoptico')}>
                  {obj.name}
                </button>
              ))}
            </div>
          )}
          {item.codeRefs && item.codeRefs.length > 0 && (
            <div className="field">
              <span>Código localizable</span>
              {item.codeRefs.map((r) => (
                <p key={r.identifier} style={{ margin: '3px 0', fontFamily: 'monospace', fontSize: 11 }}>
                  {r.identifier}{r.line ? ` → l.${r.line}` : ''}{r.file !== 'index.html' ? ` [${r.file}]` : ''}
                </p>
              ))}
            </div>
          )}
          {selected.type === 'risk' && item.id === 'RT-005' && (
            <button className="inline-action" type="button" onClick={() => openItem('runtime', 'planLocalSalud', 'runtime')}>Abrir planLocalSalud</button>
          )}
          {selected.type === 'runtime' && item.id === 'planLocalSalud' && (
            <div className="critical-note">
              <strong>NO FUENTE DE VERDAD COMPLETA</strong>
              <p>HÍBRIDO / ACUMULADOR / EFÍMERO / PROYECCIÓN. Riesgo asociado: RT-005.</p>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
