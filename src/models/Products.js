import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
});

const dimensionsSchema = new mongoose.Schema({
  width: { type: Number },
  height: { type: Number },
  depth: { type: Number },
});

const metaSchema = new mongoose.Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  barcode: { type: String },
  qrCode: { type: String },
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  rating: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true },
  tags: [{ type: String, required: true }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
  sku: { type: String },
  weight: { type: Number },
  dimensions: dimensionsSchema,
  warrantyInformation: { type: String },
  shippingInformation: { type: String },
  availabilityStatus: { type: String },
  reviews: [reviewSchema],
  returnPolicy: {
    type: String,
    required: true,
    default: "10 days return policy",
  },
  minimumOrderQuantity: { type: Number, required: true, default: 1 },
  meta: metaSchema,
  images: [{ type: String }],
  thumbnail: { type: String, required: true },
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
});

const Products = mongoose.model("Products", productSchema);
export default Products;
