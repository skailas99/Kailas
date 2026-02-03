import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    botanical_name: { type: String, required: true },
    common_name: { type: String, required: true },
    ayush_system: {
      type: String,
      enum: ["Ayurveda", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"],
      required: true,
    },
    medicinal_uses: [{ type: String }],
    part_used: [{ type: String }],
    dosage_form: [{ type: String }],
    precautions: [{ type: String }],
    region: { type: String },
  },
  { timestamps: true }
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
