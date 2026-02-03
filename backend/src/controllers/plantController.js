import Plant from "../models/Plant.js";
import seedPlants from "../data/seedPlants.js";

export const listPlants = async (_req, res) => {
  const count = await Plant.countDocuments();
  if (count === 0) {
    await Plant.insertMany(seedPlants);
  }

  const plants = await Plant.find().sort({ common_name: 1 });
  res.json(plants);
};

export const getPlantById = async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }

  res.json(plant);
};
