import express from "express";
import {
  addProducts,
  updateProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getFilteredProducts,
} from "../controllers/Products.js";
import {
  getBrandsName,
  getCategoriesName,
  getSizes,
} from "../controllers/filter.parameters.controller.js";

const router = express.Router();

router.post("/add", addProducts);
router.patch("/update/:id", updateProduct);
router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
// router.get("/filter", getFilteredProducts);

//filter-parameters
router.get("/filter", getFilteredProducts);
router.get("/filter/categories", getCategoriesName);
router.get("/filter/brands", getBrandsName);
router.get("/filter/sizes", getSizes);
router.get("/:id", getProductById);

export default router;
