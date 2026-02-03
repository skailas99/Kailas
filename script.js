const plants = [
  {
    name: "Tulsi (Holy Basil)",
    systems: ["Ayurveda", "Yoga & Naturopathy"],
    action: "Adaptogenic, immune support",
    region: "North & South India",
    preparation: "Leaf infusion, sunrise mist",
    caution: "Avoid high doses during pregnancy without guidance.",
  },
  {
    name: "Ashwagandha",
    systems: ["Ayurveda"],
    action: "Stress resilience, vitality",
    region: "Madhya Pradesh, Rajasthan",
    preparation: "Root powder with warm milk",
    caution: "Use cautiously with thyroid conditions.",
  },
  {
    name: "Neem",
    systems: ["Ayurveda", "Siddha"],
    action: "Purifying, skin support",
    region: "Pan-Indian",
    preparation: "Leaf decoction, topical paste",
    caution: "Avoid in pregnancy and for young children.",
  },
  {
    name: "Brahmi (Bacopa)",
    systems: ["Ayurveda", "Yoga & Naturopathy"],
    action: "Cognitive clarity, calming",
    region: "Wetlands",
    preparation: "Fresh juice or ghrita",
    caution: "May slow digestion in excess.",
  },
  {
    name: "Unani Rosa damascena",
    systems: ["Unani"],
    action: "Cooling, mood support",
    region: "Kashmir",
    preparation: "Rose water, syrup",
    caution: "Ensure allergy awareness.",
  },
  {
    name: "Nilavembu",
    systems: ["Siddha"],
    action: "Seasonal wellness, fever support",
    region: "Tamil Nadu",
    preparation: "Kashayam decoction",
    caution: "Avoid if low blood pressure.",
  },
  {
    name: "Thuthuvalai",
    systems: ["Siddha"],
    action: "Respiratory wellness",
    region: "Southern India",
    preparation: "Leaf chutney",
    caution: "Use moderately in pregnancy.",
  },
  {
    name: "Arnica",
    systems: ["Homeopathy"],
    action: "Recovery, bruising care",
    region: "Temperate gardens",
    preparation: "Topical homeopathic dilution",
    caution: "Avoid applying on broken skin.",
  },
  {
    name: "Calendula",
    systems: ["Homeopathy", "Yoga & Naturopathy"],
    action: "Skin soothing",
    region: "Himalayan foothills",
    preparation: "Infused oil, tincture",
    caution: "Check for Asteraceae sensitivity.",
  },
  {
    name: "Ajwain",
    systems: ["Unani", "Ayurveda"],
    action: "Digestive support",
    region: "Gujarat, Rajasthan",
    preparation: "Seed infusion",
    caution: "Avoid excess with acidity.",
  },
  {
    name: "Turmeric",
    systems: ["Ayurveda", "Siddha"],
    action: "Anti-inflammatory, wound care",
    region: "Kerala",
    preparation: "Golden milk, paste",
    caution: "May thin blood in high doses.",
  },
  {
    name: "Jatamansi",
    systems: ["Unani", "Ayurveda"],
    action: "Sleep support",
    region: "Himalayas",
    preparation: "Root powder",
    caution: "Avoid in pregnancy without guidance.",
  },
];

const filters = [
  "All",
  "Ayurveda",
  "Yoga & Naturopathy",
  "Unani",
  "Siddha",
  "Homeopathy",
];

const gardenGrid = document.getElementById("gardenGrid");
const filterGroup = document.getElementById("filterGroup");
const searchInput = document.getElementById("searchInput");
const plantModal = document.getElementById("plantModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const zoneGrid = document.getElementById("zoneGrid");
const zoneDetails = document.getElementById("zoneDetails");

const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");

const audioToggle = document.getElementById("audioToggle");
const startTour = document.getElementById("startTour");
const openAtlas = document.getElementById("openAtlas");

let activeFilter = "All";

const quizData = [
  {
    question: "Which plant is commonly used in Siddha for seasonal wellness?",
    options: ["Nilavembu", "Arnica", "Calendula", "Rose"],
    answer: "Nilavembu",
  },
  {
    question: "Tulsi is best known for supporting which quality?",
    options: ["Immune resilience", "Muscle recovery", "Bone density", "Appetite"],
    answer: "Immune resilience",
  },
  {
    question: "Which AYUSH system emphasizes humoral balance with cooling botanicals?",
    options: ["Unani", "Homeopathy", "Yoga", "Siddha"],
    answer: "Unani",
  },
];

let quizIndex = 0;
let activeZone = null;

const zones = [
  {
    name: "Himalayan Highlands",
    climate: "Cool alpine air with high UV exposure.",
    highlight: "Jatamansi, Brahmi, and alpine rose.",
    practices: ["Snow-melt irrigation", "Shade drying", "Wind-chime meditation"],
  },
  {
    name: "Coastal Wellness Belt",
    climate: "Humid, saline breezes and tropical rainfall.",
    highlight: "Lemongrass, turmeric, and vetiver.",
    practices: ["Salt-soil balancing", "Coconut coir mulching", "Sea-breeze yoga"],
  },
  {
    name: "Deccan Dry Gardens",
    climate: "Arid heat with resilient red soil.",
    highlight: "Ashwagandha, aloe, and ajwain.",
    practices: ["Drip irrigation", "Clay pot cooling", "Midday rest ritual"],
  },
  {
    name: "Sacred Wetlands",
    climate: "Water-rich marshland with monsoon mist.",
    highlight: "Brahmi, lotus, and gotu kola.",
    practices: ["Floating planters", "Lotus mud therapy", "Evening chanting"],
  },
  {
    name: "Urban Healing Pods",
    climate: "Compact rooftop microclimates.",
    highlight: "Tulsi, mint, and calendula.",
    practices: ["Vertical planting", "Community herb swaps", "Sunrise aroma walk"],
  },
];

const renderFilters = () => {
  filterGroup.innerHTML = "";
  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-button ${filter === activeFilter ? "active" : ""}`;
    button.textContent = filter;
    button.addEventListener("click", () => {
      activeFilter = filter;
      renderFilters();
      renderPlants();
    });
    filterGroup.appendChild(button);
  });
};

const renderZones = () => {
  zoneGrid.innerHTML = "";
  zones.forEach((zone, index) => {
    const button = document.createElement("button");
    const isActive = activeZone?.name === zone.name || (!activeZone && index === 0);
    if (!activeZone && index === 0) {
      activeZone = zone;
    }
    button.className = `zone-button ${isActive ? "active" : ""}`;
    button.innerHTML = `
      <h4>${zone.name}</h4>
      <p>${zone.climate}</p>
    `;
    button.addEventListener("click", () => {
      activeZone = zone;
      renderZones();
      renderZoneDetails();
    });
    zoneGrid.appendChild(button);
  });
  renderZoneDetails();
};

const renderZoneDetails = () => {
  if (!activeZone) return;
  zoneDetails.innerHTML = `
    <h3>${activeZone.name}</h3>
    <p><strong>Climate:</strong> ${activeZone.climate}</p>
    <p><strong>Signature herbs:</strong> ${activeZone.highlight}</p>
    <p><strong>Immersive practices:</strong></p>
    <ul>
      ${activeZone.practices.map((practice) => `<li>${practice}</li>`).join("")}
    </ul>
  `;
};

const matchesFilter = (plant) => {
  if (activeFilter === "All") return true;
  return plant.systems.includes(activeFilter);
};

const matchesSearch = (plant) => {
  const query = searchInput.value.toLowerCase();
  if (!query) return true;
  return (
    plant.name.toLowerCase().includes(query) ||
    plant.action.toLowerCase().includes(query) ||
    plant.region.toLowerCase().includes(query)
  );
};

const renderPlants = () => {
  gardenGrid.innerHTML = "";
  const filtered = plants.filter((plant) => matchesFilter(plant) && matchesSearch(plant));

  filtered.forEach((plant) => {
    const card = document.createElement("article");
    card.className = "plant-card";

    card.innerHTML = `
      <div>
        <h3>${plant.name}</h3>
        <p>${plant.action}</p>
      </div>
      <div class="tag-group">
        ${plant.systems.map((system) => `<span class="tag">${system}</span>`).join("")}
      </div>
      <div class="plant-meta">
        <span>${plant.region}</span>
        <span>${plant.preparation}</span>
      </div>
      <div class="card-actions">
        <button class="ghost-button" data-plant="${plant.name}">Explore</button>
        <span class="tag">${plant.caution}</span>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => openModal(plant));
    gardenGrid.appendChild(card);
  });
};

const openModal = (plant) => {
  modalBody.innerHTML = `
    <h2>${plant.name}</h2>
    <p><strong>Systems:</strong> ${plant.systems.join(", ")}</p>
    <p><strong>Primary actions:</strong> ${plant.action}</p>
    <p><strong>Preparation:</strong> ${plant.preparation}</p>
    <p><strong>Region:</strong> ${plant.region}</p>
    <p><strong>Caution:</strong> ${plant.caution}</p>
    <div class="tag-group" style="margin-top: 1rem;">
      <span class="tag">Herbal Habitat</span>
      <span class="tag">Interactive AR View</span>
      <span class="tag">Daily Ritual</span>
    </div>
  `;
  plantModal.classList.add("open");
  plantModal.setAttribute("aria-hidden", "false");
};

const closeModalHandler = () => {
  plantModal.classList.remove("open");
  plantModal.setAttribute("aria-hidden", "true");
};

const renderQuiz = () => {
  const current = quizData[quizIndex];
  quizQuestion.textContent = current.question;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "";

  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleQuizAnswer(option, button));
    quizOptions.appendChild(button);
  });
};

const handleQuizAnswer = (option, button) => {
  const current = quizData[quizIndex];
  const isCorrect = option === current.answer;

  document.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.disabled = true;
  });

  button.classList.add(isCorrect ? "correct" : "wrong");
  quizFeedback.textContent = isCorrect
    ? "Correct! You unlocked a new seed variety."
    : `Not quite. The correct answer is ${current.answer}.`;

  setTimeout(() => {
    quizIndex = (quizIndex + 1) % quizData.length;
    renderQuiz();
  }, 2200);
};

searchInput.addEventListener("input", renderPlants);
closeModal.addEventListener("click", closeModalHandler);
plantModal.addEventListener("click", (event) => {
  if (event.target === plantModal) {
    closeModalHandler();
  }
});

startTour.addEventListener("click", () => {
  document.getElementById("garden").scrollIntoView({ behavior: "smooth" });
});

openAtlas.addEventListener("click", () => {
  document.getElementById("paths").scrollIntoView({ behavior: "smooth" });
});

audioToggle.addEventListener("click", () => {
  const isOn = audioToggle.getAttribute("aria-pressed") === "true";
  audioToggle.setAttribute("aria-pressed", String(!isOn));
  audioToggle.textContent = `Ambient Mode: ${isOn ? "Off" : "On"}`;
});

document.querySelectorAll("[data-ritual]").forEach((button) => {
  button.addEventListener("click", () => {
    const ritual = button.dataset.ritual;
    button.textContent = ritual === "moon" ? "Moonlight Mode Active" : "Ritual Activated";
  });
});

renderFilters();
renderPlants();
renderZones();
renderQuiz();
