import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema(
  {
    photos: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Gift || mongoose.model("Gift", GiftSchema);
