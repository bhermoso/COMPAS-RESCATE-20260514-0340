export default function VistaRiesgos({ data, openItem }) {
  return (
    <section className="band full">
      <h2>ZC, GAP, RT, deudas y limites</h2>
      <div className="risk-list">
        {data.risks.map((item) => (
          <button className="risk-row" key={item.id} type="button" onClick={() => openItem('risk', item.id)}>
            <span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span>
            <strong>{item.id}</strong>
            <span>{item.kind}</span>
            <p>{item.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
