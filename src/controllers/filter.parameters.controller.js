import Category from "../models/Category.model.js";
import createError from "../utils/error.js";
import Brand from "../models/Brand.model.js";
import Size from "../models/Size.model.js";

export const getCategoriesName = async (req, res, next) => {
  try {
    const categories = await Category.find();
    // console.log(categories);
    if (!categories) {
      return next(createError(404, "No category available right now."));
    }

    return res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

export const getBrandsName = async (req, res, next) => {
  try {
    const brands = await Brand.find();

    if (!brands) {
      return next(createError(404, "No brand available right now."));
    }

    return res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
};

export const getSizes = async (req, res, next) => {
  try {
    const sizes = await Size.find();

    if (!sizes) {
      return next(createError(404, "No size available right now."));
    }

    return res.status(200).json(sizes);
  } catch (err) {
    next(err);
  }
};
