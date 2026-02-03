import { useEffect, useMemo, useState } from "react";

import Chatbot from "./components/Chatbot.jsx";
import PlantDetail from "./components/PlantDetail.jsx";
import PlantList from "./components/PlantList.jsx";
import { fetchPlants } from "./services/api.js";

const systemFilters = [
  "All",
  "Ayurveda",
  "Yoga & Naturopathy",
  "Unani",
  "Siddha",
  "Homeopathy",
];

const buildFilterOptions = (items) => ["All", ...items];

const App = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDosageForm, setActiveDosageForm] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const data = await fetchPlants();
        setPlants(data);
        setSelectedPlant(data[0] ?? null);
        setError("");
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load plant data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, []);


  const filteredPlants = useMemo(() => {
    if (activeFilter === "All") {
      return plants;
    }

    return plants.filter((plant) => plant.ayush_system === activeFilter);
  }, [activeFilter, plants]);

  const dosageFormOptions = useMemo(() => {
    const forms = new Set();
    plants.forEach((plant) => {
      plant.dosage_form?.forEach((form) => forms.add(form));
    });
    return buildFilterOptions([...forms].sort());
  }, [plants]);

  const regionOptions = useMemo(() => {
    const regions = new Set();
    plants.forEach((plant) => {
      if (plant.region) {
        regions.add(plant.region);
      }
    });
    return buildFilterOptions([...regions].sort());
  }, [plants]);

  const fullyFilteredPlants = useMemo(() => {
    return filteredPlants.filter((plant) => {
      const matchesDosage =
        activeDosageForm === "All" ||
        plant.dosage_form?.includes(activeDosageForm);
      const matchesRegion =
        activeRegion === "All" || plant.region === activeRegion;

      return matchesDosage && matchesRegion;
    });
  }, [activeDosageForm, activeRegion, filteredPlants]);

  useEffect(() => {
    const isSelectedVisible = fullyFilteredPlants.some(
      (plant) => plant._id === selectedPlant?._id
    );

    if (
      (!selectedPlant || !isSelectedVisible) &&
      fullyFilteredPlants.length > 0
    ) {
      setSelectedPlant(fullyFilteredPlants[0]);
    }
  }, [fullyFilteredPlants, selectedPlant]);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Virtual Herbal Garden (AYUSH)</p>
          <h1>Explore medicinal plants across AYUSH systems.</h1>
          <p className="subtitle">
            Discover plant profiles, traditional uses, and ask the herbal
            assistant for educational guidance.
          </p>
        </div>
        <div className="filters">
          {systemFilters.map((filter) => (
            <button
              key={filter}
              className={filter === activeFilter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <label>
            Dosage form
            <select
              value={activeDosageForm}
              onChange={(event) => setActiveDosageForm(event.target.value)}
            >
              {dosageFormOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Region
            <select
              value={activeRegion}
              onChange={(event) => setActiveRegion(event.target.value)}
            >
              {regionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Medicinal plants</h2>
          {isLoading ? (
            <p>Loading plants...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <PlantList
              plants={fullyFilteredPlants}
              selectedPlant={selectedPlant}
              onSelect={setSelectedPlant}
            />
          )}
        </section>

        <section className="panel">
          <h2>Plant details</h2>
          <PlantDetail plant={selectedPlant} />
        </section>

        <section className="panel">
          <h2>Herbal AI assistant</h2>
          <Chatbot />
        </section>
      </main>
    </div>
  );
};

export default App;
