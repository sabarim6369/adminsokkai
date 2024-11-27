import mongoose from "mongoose";

const coupunSchema = new mongoose.Schema({
  coupun: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pricing: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});
const Coupun = mongoose.models.Coupun || mongoose.model("Coupun", coupunSchema);

export default Coupun;