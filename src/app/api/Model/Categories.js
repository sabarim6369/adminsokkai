import mongoose from "mongoose";
const SubcategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true, unique: true }, // Add `unique` if necessary
  subcategories: [SubcategorySchema],
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
