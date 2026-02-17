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

const tourThemes = {
  "Digestive Health": ["Digestion", "Digestive support", "Gut support"],
  Immunity: ["Immune support", "Cold relief", "Respiratory support"],
  "Skin Care": ["Skin care", "Wound", "Inflammation"],
  "Stress & Sleep": ["Stress", "Sleep support", "Calmness"],
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const App = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDosageForm, setActiveDosageForm] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeUse, setActiveUse] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTourTheme, setActiveTourTheme] = useState("Digestive Health");
  const [bookmarks, setBookmarks] = useState(() => loadFromStorage("vhg-bookmarks", []));
  const [notesByPlant, setNotesByPlant] = useState(() => loadFromStorage("vhg-notes", {}));
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

  useEffect(() => {
    localStorage.setItem("vhg-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("vhg-notes", JSON.stringify(notesByPlant));
  }, [notesByPlant]);

  const dosageFormOptions = useMemo(() => {
    const forms = new Set();
    plants.forEach((plant) => {
      plant.dosage_form?.forEach((form) => forms.add(form));
    });
    return ["All", ...Array.from(forms).sort()];
  }, [plants]);

  const regionOptions = useMemo(() => {
    const regions = new Set();
    plants.forEach((plant) => {
      if (plant.region) {
        regions.add(plant.region);
      }
    });
    return ["All", ...Array.from(regions).sort()];
  }, [plants]);

  const useOptions = useMemo(() => {
    const uses = new Set();
    plants.forEach((plant) => {
      plant.medicinal_uses?.forEach((item) => uses.add(item));
    });
    return ["All", ...Array.from(uses).sort()];
  }, [plants]);

  const fullyFilteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSystem =
        activeFilter === "All" || plant.ayush_system === activeFilter;
      const matchesDosage =
        activeDosageForm === "All" ||
        plant.dosage_form?.includes(activeDosageForm);
      const matchesRegion = activeRegion === "All" || plant.region === activeRegion;
      const matchesUse =
        activeUse === "All" || plant.medicinal_uses?.includes(activeUse);
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        [
          plant.common_name,
          plant.botanical_name,
          ...(plant.common_names || []),
          ...(plant.medicinal_uses || []),
          plant.habitat,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return (
        matchesSystem &&
        matchesDosage &&
        matchesRegion &&
        matchesUse &&
        matchesSearch
      );
    });
  }, [
    activeDosageForm,
    activeFilter,
    activeRegion,
    activeUse,
    plants,
    searchTerm,
  ]);

  useEffect(() => {
    const isSelectedVisible = fullyFilteredPlants.some(
      (plant) => plant._id === selectedPlant?._id
    );

    if ((!selectedPlant || !isSelectedVisible) && fullyFilteredPlants.length > 0) {
      setSelectedPlant(fullyFilteredPlants[0]);
    }
  }, [fullyFilteredPlants, selectedPlant]);

  const activeTourPlants = useMemo(() => {
    const keywords = tourThemes[activeTourTheme] || [];
    return plants.filter((plant) =>
      plant.medicinal_uses?.some((item) => keywords.some((keyword) => item.includes(keyword)))
    );
  }, [activeTourTheme, plants]);

  const toggleBookmark = (plantId) => {
    setBookmarks((current) =>
      current.includes(plantId)
        ? current.filter((id) => id !== plantId)
        : [...current, plantId]
    );
  };

  const saveNote = (plantId, note) => {
    setNotesByPlant((current) => ({ ...current, [plantId]: note }));
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Virtual Herbal Garden (AYUSH)</p>
          <h1>Explore medicinal plants through an interactive digital garden.</h1>
          <p className="subtitle">
            Rotate 3D-style plant cards, watch multimedia, join guided tours, and
            build your personal herbal notebook.
          </p>
        </div>

        <div className="search-row">
          <input
            type="search"
            placeholder="Search by name, use, habitat..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <p>{fullyFilteredPlants.length} plants found</p>
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
          <label>
            Medicinal use
            <select value={activeUse} onChange={(event) => setActiveUse(event.target.value)}>
              {useOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="panel tour-panel">
        <h2>Guided virtual tours</h2>
        <div className="tour-controls">
          {Object.keys(tourThemes).map((theme) => (
            <button
              key={theme}
              type="button"
              className={activeTourTheme === theme ? "active" : ""}
              onClick={() => setActiveTourTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
        <p>
          Theme plants: {activeTourPlants.map((plant) => plant.common_name).join(", ") || "No matches yet"}
        </p>
      </section>

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
              bookmarks={bookmarks}
            />
          )}
        </section>

        <section className="panel">
          <h2>Plant details</h2>
          <PlantDetail
            plant={selectedPlant}
            isBookmarked={bookmarks.includes(selectedPlant?._id)}
            onToggleBookmark={toggleBookmark}
            note={notesByPlant[selectedPlant?._id] || ""}
            onSaveNote={saveNote}
          />
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
