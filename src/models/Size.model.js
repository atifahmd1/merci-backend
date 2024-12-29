import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  slug: { type: String },
  description: { type: String },
});

const Size = mongoose.model("Size", SizeSchema);
export default Size;
