import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    originalprice: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: [Number],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    selectedGift: {
      type: String,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: [String],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    total_revenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
