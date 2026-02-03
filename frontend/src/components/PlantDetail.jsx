const PlantDetail = ({ plant }) => {
  if (!plant) {
    return <p>Select a plant to see details.</p>;
  }

  return (
    <div className="plant-detail">
      <h3>{plant.common_name}</h3>
      <p className="muted">{plant.botanical_name}</p>
      <p className="muted">Region: {plant.region}</p>

      <div className="detail-grid">
        <div>
          <h4>Uses</h4>
          <ul>
            {plant.medicinal_uses?.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Parts used</h4>
          <ul>
            {plant.part_used?.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Dosage forms</h4>
          <ul>
            {plant.dosage_form?.map((form) => (
              <li key={form}>{form}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Precautions</h4>
          <ul>
            {plant.precautions?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
