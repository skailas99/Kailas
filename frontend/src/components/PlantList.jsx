const PlantList = ({ plants, selectedPlant, onSelect }) => {
  if (plants.length === 0) {
    return <p>No plants available for this system.</p>;
  }

  return (
    <ul className="plant-list">
      {plants.map((plant) => (
        <li key={plant._id}>
          <button
            type="button"
            className={selectedPlant?._id === plant._id ? "active" : ""}
            onClick={() => onSelect(plant)}
          >
            <span>{plant.common_name}</span>
            <small>{plant.ayush_system}</small>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PlantList;
