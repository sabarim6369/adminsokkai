import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  photos: [{ url: String, public_id: String }],
  name: String,
  price: Number,
  status: { type: String, default: "active" },
});

export default mongoose.models.gifts || mongoose.model("gifts", giftSchema);
