export default function VistaRuntime({ data, openItem, liveData }) {
  const isLive = liveData?.source === 'window';
  const pls    = liveData?.planLocalSalud;
  const datos  = liveData?.datosMunicipio;

  return (
    <section className="band full">
      <h2>Runtime observado</h2>
      <p>Esta vista expone objetos runtime documentados. No lee runtime vivo ni gobierna Firebase.</p>

      {isLive ? (
        <div className="live-runtime-panel">
          <p className="live-label">COMPÁS LIVE · {liveData.municipio}</p>
          <div className="live-fields">
            <div><span>Municipio activo</span><strong>{liveData.municipio ?? '—'}</strong></div>
            {pls ? (
              <>
                <div><span>planLocalSalud.municipio</span><strong>{pls.municipio}</strong></div>
                <div><span>Perfil</span><strong>{pls.perfil?.completado ? 'completado' : 'pendiente'}</strong></div>
                <div><span>Plan de acción</span><strong>{pls.planAccion?.completado ? 'completado' : 'pendiente'}</strong></div>
                <div><span>Agenda</span><strong>{pls.agenda?.completado ? 'completado' : 'pendiente'}</strong></div>
              </>
            ) : (
              <div><span>planLocalSalud</span><strong>cargando…</strong></div>
            )}
            {datos ? (
              <div>
                <span>datosMunicipioActual</span>
                <strong>
                  {Object.keys(datos.determinantes ?? {}).length} det ·{' '}
                  {Object.keys(datos.indicadores ?? {}).length} ind
                </strong>
              </div>
            ) : (
              <div><span>datosMunicipioActual</span><strong>cargando…</strong></div>
            )}
          </div>
        </div>
      ) : (
        <p className="offline-note">window.COMPAS no detectado — modo estático</p>
      )}

      <div className="runtime-grid">
        {data.runtimeObjects.map((item) => (
          <button className={item.id === 'planLocalSalud' ? 'runtime-card critical' : 'runtime-card'} key={item.id} type="button" onClick={() => openItem('runtime', item.id)}>
            <strong>{item.id}</strong>
            <span>{item.classification}</span>
            <p>{item.authority}</p>
            <small>Riesgos: {item.risks.join(', ')}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
