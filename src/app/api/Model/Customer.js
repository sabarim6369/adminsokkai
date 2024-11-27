import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  couponApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], 
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, min: 1 }, 
    },
  ],
  totalPurchasePrice: { type: Number, default: 0 }, 
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
