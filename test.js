import mongoose from "mongoose";

// Replace <password> with your actual MongoDB Atlas password
const uri =
  "mongodb+srv://atifahmd1:P915mZdwIhWiEL2y@projects.uyfcro0.mongodb.net/ecommerce?retryWrites=true&w=majority";

// Connect to the MongoDB Atlas cluster
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the MongoDB Atlas cluster!");
  })
  .catch((err) => {
    console.error("Error connecting to the MongoDB Atlas cluster:", err);
  });

// Define review schema
const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
});

// Define dimensions schema
const dimensionsSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
});

// Define meta schema
const metaSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  barcode: { type: String, required: true },
  qrCode: { type: String, required: true },
});

// Define product schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  rating: { type: Number, required: true },
  stock: { type: Number, required: true },
  tags: [{ type: String, required: true }],
  brand: { type: String, required: true },
  sku: { type: String, required: true },
  weight: { type: Number, required: true },
  dimensions: dimensionsSchema,
  warrantyInformation: { type: String, required: true },
  shippingInformation: { type: String, required: true },
  availabilityStatus: { type: String, required: true },
  reviews: [reviewSchema],
  returnPolicy: { type: String, required: true },
  minimumOrderQuantity: { type: Number, required: true },
  meta: metaSchema,
  images: [{ type: String, required: true }],
  thumbnail: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// Example: Create a new product
const newProduct = new Product({
  id: "6",
  title: "Calvin Klein CK One",
  description:
    "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
  category: "fragrances",
  price: 49.99,
  discountPercentage: 0.32,
  rating: 4.85,
  stock: 17,
  tags: ["fragrances", "perfumes"],
  brand: "Calvin Klein",
  sku: "DZM2JQZE",
  weight: 5,
  dimensions: {
    width: 11.53,
    height: 14.44,
    depth: 6.81,
  },
  warrantyInformation: "5 year warranty",
  shippingInformation: "Ships overnight",
  availabilityStatus: "In Stock",
  reviews: [
    {
      rating: 5,
      comment: "Great value for money!",
      date: "2024-05-23T08:56:21.619Z",
      reviewerName: "Sophia Brown",
      reviewerEmail: "sophia.brown@x.dummyjson.com",
    },
    {
      rating: 3,
      comment: "Very disappointed!",
      date: "2024-05-23T08:56:21.619Z",
      reviewerName: "Madison Collins",
      reviewerEmail: "madison.collins@x.dummyjson.com",
    },
    {
      rating: 1,
      comment: "Poor quality!",
      date: "2024-05-23T08:56:21.619Z",
      reviewerName: "Maya Reed",
      reviewerEmail: "maya.reed@x.dummyjson.com",
    },
  ],
  returnPolicy: "No return policy",
  minimumOrderQuantity: 20,
  meta: {
    createdAt: "2024-05-23T08:56:21.619Z",
    updatedAt: "2024-05-23T08:56:21.619Z",
    barcode: "2210136215089",
    qrCode: "https://assets.dummyjson.com/public/qr-code.png",
  },
  images: [
    "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png",
    "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/2.png",
    "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/3.png",
  ],
  thumbnail:
    "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
});

// Save the product to the database
newProduct
  .save()
  .then(() => {
    console.log("Product saved successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error saving product:", err);
    mongoose.connection.close();
  });
