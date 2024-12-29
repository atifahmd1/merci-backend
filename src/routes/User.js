import express from "express";
import {
  UserLogin,
  UserRegister,
  getUser,
  getAllOrders,
  placeOrder,
  updateUserDetails,
} from "../controllers/User.js";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  addFavorite,
  clearFavorites,
  getFavorites,
  removeFavorite,
} from "../controllers/favorites.controller.js";
import {
  getCartItems,
  addToCart,
  updateItemQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

//user
router.post("/signup", UserRegister);
router.post("/login", UserLogin);
router.get("/me", verifyToken, getUser);
router.put("/update", updateUserDetails);

//cart
router.get("/cart", verifyToken, getCartItems);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart/:productId", verifyToken, updateItemQuantity);
router.delete("/cart/:productId", verifyToken, removeFromCart);
router.delete("/cart", verifyToken, clearCart);

//order
router.get("/orders", verifyToken, getAllOrders);
router.post("/order/checkout", verifyToken, createOrder);
router.post("/order/verifypayment", verifyPayment);
router.post("/order/placeOrder", verifyToken, placeOrder);

//favourites
router.get("/favorites", verifyToken, getFavorites);
router.post("/favorites", verifyToken, addFavorite);
router.delete("/favorites", verifyToken, clearFavorites);
router.delete("/favorites/:productId", verifyToken, removeFavorite);

export default router;
