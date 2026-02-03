import express from "express";
import { getPlantById, listPlants } from "../controllers/plantController.js";

const router = express.Router();

router.get("/", listPlants);
router.get("/:id", getPlantById);

export default router;
