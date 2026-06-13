export default function VistaCadenas({ data, openItem }) {
  return (
    <section className="band full">
      <h2>Cadenas funcionales y documentales</h2>
      <div className="chain-list">
        {data.chains.map((item) => (
          <button className="chain" key={item.id} type="button" onClick={() => openItem('chain', item.id)}>
            <strong>{item.name}</strong>
            <div className="chain-steps">
              {item.steps.map((step) => <span key={step}>{step}</span>)}
            </div>
            <p>{item.rupture}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
