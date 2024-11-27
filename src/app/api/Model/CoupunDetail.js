import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const coupunDetail = mongoose.model("CoupunDetail", couponSchema);
export default coupunDetail;
