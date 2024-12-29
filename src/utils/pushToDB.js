import Products from "../models/Products";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import connectDB from "../db/connection";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const jsonData = fs.readFileSync(path.join(__dirname, "db.json"), "utf-8");

const prods = JSON.parse(jsonData);
console.log(prods);

connectDB();

// // Save the products to the database
Products.insertMany(prods)
  .then(() => {
    console.log("All products have been successfully saved!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error saving products:", err);
    mongoose.connection.close();
  });
