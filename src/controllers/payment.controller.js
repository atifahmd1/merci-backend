import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import Product from "../models/Products.js";
import createError from "../utils/error.js";
import Order from "../models/Orders.js";

// export const createOrder = async (req, res, next) => {
//   //   console.log("req.body: ", req.body);

//   const amount = req.body.totalAmount;

//   if (!amount) {
//     return next(createError(400, "Amount is required!"));
//   }

//   const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY,
//     key_secret: process.env.RAZORPAY_SECRET,
//   });

//   const options = {
//     amount: Math.round(amount * 100),
//     currency: "INR",
//     receipt: "receipt#1",
//     payment_capture: 1,
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ order: order, status: "ok" });
//   } catch (err) {
//     next(createError(500, "Error in creating order!"));
//   }
// };

export const createOrder = async (req, res, next) => {
  const { products, total_amount, address, payment_method } = req.body;
  // console.log(req.body);

  if (!total_amount) {
    return next(createError(400, "Total amount is required!"));
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  // console.log(razorpay);

  try {
    let razorpayOrder;
    if (payment_method === "Razorpay") {
      // Create Razorpay order if payment method is Razorpay
      const options = {
        amount: Math.round(total_amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };
      razorpayOrder = await razorpay.orders.create(options);
    }

    // console.log(req.user);

    // Create order in the database
    const order = new Order({
      products,
      user: req.user.id, // Assuming user info is in req.user
      total_amount,
      address,
      payment_method,
      razorpay_order_id: razorpayOrder?.id,
    });

    await order.save();

    res.status(200).json({ order });
  } catch (err) {
    next(createError(500, "Error in creating order!"));
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log("req.body: ", req.body);
  if (!razorpay_order_id) {
    return res
      .status(400)
      .json({ msg: "razorpay_order_id is required", success: false });
  }
  if (!razorpay_payment_id) {
    return res
      .status(400)
      .json({ msg: "razorpay_payment_id is required", success: false });
  }
  if (!razorpay_signature) {
    return res
      .status(400)
      .json({ msg: "razorpay_signature is required", success: false });
  }
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
  console.log("testing...");
  console.log("expectedSign: ", expectedSign);
  console.log("razorpay_signature: ", razorpay_signature);
  if (expectedSign === razorpay_signature) {
    return res.status(200).json({ msg: "Payment verified", success: true });
  } else {
    return res.status(400).json({ msg: "Invalid signature", success: false });
  }
};
