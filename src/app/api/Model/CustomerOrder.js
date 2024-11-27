import mongoose from "mongoose";

const customerOrderSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    totalprice: { type: Number, required: true },
    coupun_name: { type: String },
    coupunamount: { type: Number, default: 0 },
    payment_type: { type: String, enum: ["online", "offline"], required: true },
  },
  { timestamps: true }
);

const CustomerOrder =
  mongoose.models.CustomerOrder ||
  mongoose.model("CustomerOrder", customerOrderSchema);
export default CustomerOrder;
