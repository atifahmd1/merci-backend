// import mongoose from "mongoose";

// const OrdersSchema = new mongoose.Schema(
//   {
//     products: {
//       type: [
//         {
//           product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
//           quantity: { type: Number, default: 1 },
//         },
//       ],
//       required: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     total_amount: {
//       type: mongoose.Types.Decimal128,
//       required: true,
//     },
//     address: {
//       type: String,
//       default: "",
//     },
//     paid: {
//       type: String,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Shopping-Orders", OrdersSchema);

import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    paid: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
    payment_method: {
      type: String,
      enum: ["Razorpay", "CashOnDelivery"],
      required: true,
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  { timestamps: true }
);

export default mongoose.model("Shopping-Orders", OrdersSchema);
