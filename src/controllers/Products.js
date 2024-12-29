//products.controller.js

import mongoose from "mongoose";
import Products from "../models/Products.js";
import createError from "../utils/error.js";

export const addProducts = async (req, res, next) => {
  try {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      return next(
        createError(400, "Invalid request. Expected an array of products")
      );
    }

    const createdproducts = [];

    for (const productInfo of productsData) {
      const { title, name, desc, img, price, sizes, category } = productInfo;

      const product = new Products({
        title,
        name,
        desc,
        img,
        price,
        sizes,
        category,
      });
      const createdproduct = await product.save();

      createdproducts.push(createdproduct);
    }

    return res
      .status(201)
      .json({ message: "Products added successfully", createdproducts });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log("Product ID:", id);
    // console.log("New stock value:", req.body.stock);

    if (!id) {
      return next(createError(400, "Product ID is required"));
    }

    const product = await Products.findById(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // console.log("Existing product:", product);

    product.stock = req.body.stock;

    try {
      const savedProduct = await product.save();
      // console.log("Updated product:", savedProduct);
      return res.status(200).json(savedProduct);
    } catch (saveError) {
      // console.error("Error saving product:", saveError);
      return next(createError(500, "Error saving product"));
    }
  } catch (err) {
    // console.error("Error finding product:", err);
    return next(createError(500, "Internal server error"));
  }
};

export const getProducts = async (req, res, next) => {
  try {
    //get all  products from products collection of mongodb
    const products = await Products.find();
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    console.log("category: ", category);
    const products = await Products.find({ category });
    // console.log("products: ", products);
    if (!products) {
      return next(
        createError(404, `No products of this category: ${category} found.`)
      );
    }
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// export const getFilteredProducts = async (req, res, next) => {
//   console.log("req.query: ", req.query);
//   try {
//     let { categories, brands, minPrice, maxPrice, sizes, search } = req.query;
//     console.log("Initial query params:", {
//       categories,
//       minPrice,
//       maxPrice,
//       sizes,
//       search,
//     });

//     if (sizes) sizes = sizes.split(",");
//     if (categories) categories = categories.split(",");

//     const filter = {};

//     if (categories && Array.isArray(categories)) {
//       filter.category = { $in: categories }; // Match products in any of the specified categories
//     }

//     if (brands && Array.isArray(brands)) {
//       filter.brand = { $in: brands }; // Match products in any of the specified brands
//     }

//     if (minPrice || maxPrice) {
//       filter["price.org"] = {};
//       if (minPrice) {
//         filter["price.org"]["$gte"] = parseFloat(minPrice);
//       }
//       if (maxPrice) {
//         filter["price.org"]["$lte"] = parseFloat(maxPrice);
//       }
//     }

//     if (sizes && Array.isArray(sizes)) {
//       filter.sizes = { $in: sizes }; // Match products in any of the specified sizes
//     }

//     if (search) {
//       filter.$or = [
//         { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
//         { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
//         { tags: { $regex: new RegExp(search, "i") } }, // Case-insensitive tags search
//       ];
//     }

//     console.log("Constructed filter object:", filter);
//     const products = await Products.find(filter);
//     return res.status(200).json(products);
//   } catch (err) {
//     console.error("Error in getFilteredProducts:", err);
//     next(err);
//   }
// };

// export const getFilteredProducts = async (req, res, next) => {
//   try {
//     console.log("Received request with query params:", req.query); // Log the query parameters

//     let {
//       categories,
//       brands,
//       sizes,
//       search,
//       priceRange,
//       discountRange,
//       stockAvailability,
//     } = req.query;

//     const filter = {};

//     const minPrice = priceRange
//       ? parseFloat(priceRange.split(",")[0])
//       : undefined;
//     const maxPrice = priceRange
//       ? parseFloat(priceRange.split(",")[1])
//       : undefined;
//     const minDiscount = discountRange
//       ? parseFloat(discountRange.split(",")[0])
//       : undefined;
//     const maxDiscount = discountRange
//       ? parseFloat(discountRange.split(",")[1])
//       : undefined;

//     console.log("minPrice:", minPrice);
//     console.log("maxPrice:", maxPrice);
//     console.log("minDiscount:", minDiscount);
//     console.log("maxDiscount:", maxDiscount);

//     // Additional logging for clarity
//     console.log("Initial query params:", {
//       categories,
//       brands,
//       minPrice,
//       maxPrice,
//       sizes,
//       search,
//       stockAvailability,
//     });

//     if (categories) {
//       filter.category = { $in: categories };
//     }

//     if (brands) {
//       filter.brand = { $in: brands };
//     }

//     if (minPrice || maxPrice) {
//       filter["price"] = {};
//       if (minPrice) {
//         filter["price"]["$gte"] = parseFloat(minPrice);
//       }
//       if (maxPrice) {
//         filter["price"]["$lte"] = parseFloat(maxPrice);
//       }
//     }
//     if (minDiscount || maxDiscount) {
//       filter["discount"] = {};
//       if (minDiscount) {
//         filter["discount"]["$gte"] = parseFloat(minDiscount);
//       }
//       if (maxDiscount) {
//         filter["discount"]["$lte"] = parseFloat(maxDiscount);
//       }
//     }

//     if (sizes && Array.isArray(sizes)) {
//       filter.sizes = { $in: sizes };
//     } else {
//       filter.sizes = sizes;
//     }

//     if (search) {
//       filter.$or = [
//         { title: { $regex: new RegExp(search, "i") } },
//         { desc: { $regex: new RegExp(search, "i") } },
//         { tags: { $regex: new RegExp(search, "i") } },
//       ];
//     }

//     console.log("Constructed filter object:", filter); // Log the constructed filter object

//     const products = await Products.find(filter);
//     console.log("Filtered products:", products); // Log the filtered products
//     return res.status(200).json(products);
//   } catch (err) {
//     console.error("Error in getFilteredProducts:", err);
//     next(err);
//   }
// };

export const getFilteredProducts = async (req, res, next) => {
  try {
    console.log("Received request with query params:", req.query); // Log the query parameters

    let {
      categories,
      brands,
      sizes,
      search,
      priceRange,
      discountRange,
      stockAvailability,
    } = req.query;

    const filter = {};

    const minPrice = priceRange
      ? parseFloat(priceRange.split(",")[0])
      : undefined;
    const maxPrice = priceRange
      ? parseFloat(priceRange.split(",")[1])
      : undefined;
    const minDiscount = discountRange
      ? parseFloat(discountRange.split(",")[0])
      : undefined;
    const maxDiscount = discountRange
      ? parseFloat(discountRange.split(",")[1])
      : undefined;

    console.log("minPrice:", minPrice);
    console.log("maxPrice:", maxPrice);
    console.log("minDiscount:", minDiscount);
    console.log("maxDiscount:", maxDiscount);

    // Additional logging for clarity
    console.log("Initial query params:", {
      categories,
      brands,
      minPrice,
      maxPrice,
      sizes,
      search,
      stockAvailability,
    });

    // Convert categories, brands, and sizes to arrays if they are not already
    if (categories && !Array.isArray(categories)) {
      categories = [categories];
    }
    if (brands && !Array.isArray(brands)) {
      brands = [brands];
    }
    if (sizes && !Array.isArray(sizes)) {
      sizes = [sizes];
    }

    // Convert string ids to MongoDB ObjectId
    if (categories) {
      categories = categories.map(
        (category) => new mongoose.Types.ObjectId(category)
      );
      filter.category = { $in: categories };
    }

    if (brands) {
      brands = brands.map((brand) => new mongoose.Types.ObjectId(brand));
      filter.brand = { $in: brands };
    }

    if (sizes) {
      sizes = sizes.map((size) => new mongoose.Types.ObjectId(size));
      filter.size = { $in: sizes };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice) {
        filter.price.$lte = maxPrice;
      }
    }

    if (minDiscount || maxDiscount) {
      filter.discountPercentage = {};
      if (minDiscount) {
        filter.discountPercentage.$gte = minDiscount;
      }
      if (maxDiscount) {
        filter.discountPercentage.$lte = maxDiscount;
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { tags: { $regex: new RegExp(search, "i") } },
      ];
    }

    // if (stockAvailability !== undefined) {
    //   filter.stock = stockAvailability === "true" ? { $gt: 0 } : { $lte: 0 };
    // }

    console.log("Constructed filter object:", filter); // Log the constructed filter object

    const products = await Products.find(filter);
    // console.log("Filtered products:", products); // Log the filtered products
    console.log("len:", products.length);
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error in getFilteredProducts:", err);
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const product = await Products.findById(id);
    // console.log(product);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
