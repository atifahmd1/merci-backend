import User from "../models/User.js";
import Product from "../models/Products.js";
import createError from "../utils/error.js";

// Get Cart Items
export const getCartItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "cart.product",
      model: "Products",
    });
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// Add Item to Cart
export const addToCart = async (req, res, next) => {
  const { id, quantity } = req.body;

  if (!id) {
    return next(createError(400, "Product Id is required!"));
  }
  if (!quantity) {
    quantity = 1;
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return next(createError(404, "Product not found!"));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const cartItem = user.cart.find((item) => item.product.toString() === id);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: id, quantity });
    }

    await user.save();

    await user.populate({
      path: "cart.product",
      model: "Products",
    });

    // console.log("user.cart: ", user.cart);

    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// Update Item Quantity in Cart
export const updateItemQuantity = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId || !quantity) {
    return next(createError(400, "Product ID and quantity are required!"));
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem) {
      return next(createError(404, "Product not found in cart!"));
    }

    cartItem.quantity = quantity;
    await user.save();

    await user.populate({
      path: "cart.product",
      model: "Products",
    });

    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  //   console.log(productId);
  if (!productId) {
    return next(createError(400, "Product ID is required!"));
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    user.cart = user.cart.filter((item) => {
      return item.product.toString() !== productId;
    });
    await user.save();

    await user.populate({
      path: "cart.product",
      model: "Products",
    });

    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// Clear Cart
export const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    user.cart = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "Cart cleared successfully!", cart: user.cart });
  } catch (err) {
    next(err);
  }
};
