import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createError from "../utils/error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();

//user register controller
export const UserRegister = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Email is already in use"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name: fullName,
      email,
      password: hashedpassword,
    });
    const createduser = user.save();
    const token = jwt.sign({ id: createduser._id }, process.env.JWT, {
      expiresIn: "1 hour",
    });
    console.log(token);
    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

//user login controller
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(createError(404, "user not found"));
    }

    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
      expiresIn: "1 hour",
    });
    return res.status(200).json({ token, user: existingUser });
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req, res) => {
  console.log("getuser req.user: ", req.user);
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

export const updateUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.id,
      req.body.updatedUser,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(createError(404, "User not found"));
    }
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    next(err);
  }
};

// Order

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });
    await order.save();

    user.cart.save();

    user.cart = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Orders.find({ user: user.id });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
