import jwt from "jsonwebtoken";
import createError from "../utils/error.js";

export const verifyToken = async (req, res, next) => {
  try {
    // console.log("req.headers: ", req.headers);
    // console.log("req.headers.authorization: ", req.headers.authorization);
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token: ", token);
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;
    // console.log("verifyToken req.user: ", req.user);
    return next();
  } catch (err) {
    next(err);
  }
};
