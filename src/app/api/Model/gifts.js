import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema(
  {
    photos: [
      {
        url: String,
        public_id: String,
      },
    ],
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.gifts || mongoose.model("gifts", GiftSchema);
