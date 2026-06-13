export default function Header({ data, role, roleId, setRoleId, liveData }) {
  const isLive = liveData?.source === 'window';

  return (
    <header className="header">
      <div>
        <p className="eyebrow">Sala de Mando COMPÁS</p>
        <h1>Sala de Control Semántico COMPÁS</h1>
      </div>
      <div className="header-meta">
        <div><span>ENT</span><strong>914</strong></div>
        <div><span>REL</span><strong>576</strong></div>
        <div className={isLive ? 'header-live' : 'header-offline'}>
          <span>Municipio</span>
          <strong>{liveData?.municipio ?? '—'}</strong>
        </div>
        <div className={isLive ? 'source-badge badge-live' : 'source-badge badge-static'}>
          {isLive ? 'LIVE' : 'ESTÁTICO'}
        </div>
        <label className="role-select">
          Rol
          <select value={roleId} onChange={(event) => setRoleId(event.target.value)}>
            {data.roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <div className="role-summary"><span>Permisos</span><strong>{role.permissions.join(' / ')}</strong></div>
      </div>
    </header>
  );
}
