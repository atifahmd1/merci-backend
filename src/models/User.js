import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: [
        {
          street: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          zip: { type: String, required: true },
          country: { type: String, default: "India" },
        },
      ],
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Products",
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Shopping-Orders",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", UserSchema);
