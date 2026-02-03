import Plant from "../models/Plant.js";
import { createChatCompletion } from "../services/openaiClient.js";

export const chatWithHerbalAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const systemPrompt = [
    "You are a helpful AYUSH herbal assistant.",
    "Provide clear, educational information only.",
    "Do not diagnose or prescribe; advise consulting a qualified practitioner.",
    "If asked about safety, note that guidance is general.",
  ].join(" ");

  try {
    const contextPlants = await findRelevantPlants(message);
    const contextBlock = buildContext(contextPlants);
    const response = await createChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            "Question:",
            message,
            "",
            "Context from AYUSH plant catalog:",
            contextBlock,
          ].join("\n"),
        },
      ],
    });

    res.json({ reply: response });
  } catch (error) {
    console.error("Chatbot error", error);
    res.status(500).json({ message: "AI service unavailable" });
  }
};

const findRelevantPlants = async (message) => {
  const trimmed = message.trim();
  if (!trimmed) {
    return [];
  }

  const searchTokens = trimmed
    .toLowerCase()
    .split(/[^a-z0-9&]+/i)
    .filter(Boolean)
    .slice(0, 6);

  const regexQuery = searchTokens.length
    ? new RegExp(searchTokens.join("|"), "i")
    : null;

  if (!regexQuery) {
    return [];
  }

  return Plant.find({
    $or: [
      { common_name: regexQuery },
      { botanical_name: regexQuery },
      { medicinal_uses: regexQuery },
      { ayush_system: regexQuery },
      { region: regexQuery },
    ],
  })
    .limit(5)
    .lean();
};

const buildContext = (plants) => {
  if (!plants.length) {
    return "No matching plant data was found in the catalog.";
  }

  return plants
    .map((plant) => {
      return [
        `Common name: ${plant.common_name}`,
        `Botanical name: ${plant.botanical_name}`,
        `AYUSH system: ${plant.ayush_system}`,
        `Medicinal uses: ${(plant.medicinal_uses || []).join(", ") || "N/A"}`,
        `Parts used: ${(plant.part_used || []).join(", ") || "N/A"}`,
        `Dosage forms: ${(plant.dosage_form || []).join(", ") || "N/A"}`,
        `Region: ${plant.region || "N/A"}`,
        `Precautions: ${(plant.precautions || []).join(", ") || "N/A"}`,
      ].join(" | ");
    })
    .join("\n");
};
