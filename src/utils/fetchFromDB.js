import mongoose from "mongoose";
import Products from "../models/Products.js";
import Category from "../models/Category.model.js";
import Brand from "../models/Brand.model.js";
import Size from "../models/Size.model.js";
import * as dotenv from "dotenv";
dotenv.config();

try {
  const conn = await mongoose.connect(
    `${process.env.MONGODB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );

  console.log(
    `Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}, with DB: ${conn.connection.name}`
  );
} catch (err) {
  console.log(err);
  process.exit(1);
}

const fetchAproduct = async () => {
  try {
    const product = await Products.findById(
      "668d320cd94340e16e240948"
    ).populate("category");
    console.log(product);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

const extractAndStoreUniqueValues = async () => {
  try {
    // Fetch all products
    const products = await Products.find();

    // Use Sets to store unique categories and brands
    const uniqueCategories = new Set();
    const uniqueBrands = new Set();
    const uniqueSizes = new Set([
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "XXXL",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "28",
      "30",
      "32",
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
    ]);

    // Extract unique categories and brands from products
    products.forEach((product) => {
      if (product.category) uniqueCategories.add(product.category);
      if (product.brand) uniqueBrands.add(product.brand);
    });

    // Convert Sets to Arrays
    const categoriesArray = Array.from(uniqueCategories).map((name) => ({
      name,
    }));
    const brandsArray = Array.from(uniqueBrands).map((name) => ({ name }));
    const sizesArray = Array.from(uniqueSizes).map((name) => ({ name }));
    console.log(sizesArray);

    // Store unique categories in the Category collection
    await Category.insertMany(categoriesArray, { ordered: false }).catch(
      (error) => {
        if (error.writeErrors) {
          console.log(
            `Some categories were already present: ${error.writeErrors.length}`
          );
        }
      }
    );

    // Store unique brands in the Brand collection
    await Brand.insertMany(brandsArray, { ordered: false }).catch((error) => {
      if (error.writeErrors) {
        console.log(
          `Some brands were already present: ${error.writeErrors.length}`
        );
      }
    });
    await Size.insertMany(sizesArray, { ordered: false }).catch((error) => {
      if (error.writeErrors) {
        console.log(
          `Some brands were already present: ${error.writeErrors.length}`
        );
      }
    });

    console.log("Unique categories and brands have been stored.");
  } catch (error) {
    console.error("Error extracting and storing unique values:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

const updateProductReferences = async () => {
  try {
    // Fetch all products
    const products = await Products.find();
    // console.log(products);

    for (const product of products) {
      console.log(product);
      // Find the corresponding category and brand documents
      const category = await Category.findOne({ name: product.categories });
      const brand = await Brand.findOne({ name: product.brands });

      // Ensure the category and brand exist
      if (!category || !brand) {
        // console.error(
        //   `Category or Brand not found for product ID: ${product._id}`
        // );
        continue;
      }

      // Update the product with the references
      product.category = category._id;
      product.brand = brand._id;

      // Randomly select a size
      const sizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "28",
        "30",
        "32",
        "34",
        "36",
        "38",
        "40",
        "42",
        "44",
      ];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

      // Find the corresponding size document
      const size = await Size.findOne({ name: randomSize });

      if (!size) {
        console.error(`Size not found: ${randomSize}`);
        continue;
      }

      product.size = size._id;

      // Save the updated product
      await product.save();
      console.log(`Updated product ID: ${product._id}`);
    }

    console.log("Product references updated successfully");
  } catch (error) {
    console.error("Error updating product references:", error);
  } finally {
    mongoose.connection.close();
  }
};

const updateProductCategories = async () => {
  // await mongoose.connect('mongodb://localhost:27017/your-db-name', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const products = await Products.find({});
    for (const product of products) {
      if (typeof product.category === "string") {
        const categoryName = product.category;
        const category = await Category.findOne({ name: categoryName });
        if (category) {
          product.category = category._id;
          await product.save();
          console.log(
            `Updated product ${product.title} with category ${category.name}`
          );
        } else {
          console.log(
            `Category ${categoryName} not found for product ${product.title}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating product categories:", error);
  } finally {
    mongoose.connection.close();
  }
};

const renameFieldsInProducts = async () => {
  // await mongoose.connect('mongodb://localhost:27017/your-db-name', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Rename 'category' to 'categories'
    await mongoose.connection
      .collection("products")
      .updateMany(
        { category: { $exists: true } },
        { $rename: { category: "categories" } }
      );
    console.log("Renamed 'category' to 'categories'");

    // Rename 'brand' to 'brands'
    await mongoose.connection
      .collection("products")
      .updateMany(
        { brand: { $exists: true } },
        { $rename: { brand: "brands" } }
      );
    console.log("Renamed 'brand' to 'brands'");
  } catch (error) {
    console.error("Error renaming fields:", error);
  } finally {
    mongoose.connection.close();
  }
};

const removeFields = async () => {
  try {
    await Products.updateMany({}, { $unset: { categories: "", brands: "" } });
    console.log("Fields 'categories' and 'brands' removed from all products.");
  } catch (error) {
    console.error("Error removing fields:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// fetchAproduct();

// removeFields();

// renameFieldsInProducts();

// updateProductCategories();

// updateProductReferences();

// Run the function
// extractAndStoreUniqueValues();
