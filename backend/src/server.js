import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDatabase from "./config/db.js";
import plantRoutes from "./routes/plantRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Virtual Herbal Garden (AYUSH) API",
  });
});

app.use("/api/plants", plantRoutes);
app.use("/api/chat", chatbotRoutes);

const port = process.env.PORT || 4000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
