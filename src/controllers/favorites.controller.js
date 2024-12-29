import User from "../models/User.js";
import Products from "../models/Products.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  // console.log("getuser req.user: ", req.user);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, check if the product exists
    const productExists = await Products.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
      // console.log("user.favorites: ", user);
    }

    // Populate favorites with product details
    const populatedUser = await User.findById(userId).populate("favorites");
    res.json(populatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  // console.log("removeFavorite: ", productId, userId);

  try {
    const user = await User.findById(userId);
    user.favorites.pull(productId);
    await user.save();
    const populatedUser = await User.findById(userId).populate("favorites");
    // console.log("fav:", populatedUser.favorites);
    res.json(populatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    // console.log("clearFavorites: ", user);
    user.favorites = [];
    await user.save();
    // console.log("clearFavoritesafter save: ", user);
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
