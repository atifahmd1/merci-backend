// import { configDotenv } from "dotenv";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./db/connection.js";

// configDotenv();
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import UserRouter from "../src/routes/User.js";
import ProductRoutes from "../src/routes/Products.js";
import OrderRoutes from "../src/routes/Order.js";

app.use("/api/user", UserRouter);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);

//error handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err); // Log the error
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message: message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello World!\nI'm a Node.js API",
  });
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// ;(async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
//         console.log(`Connected to ${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`)

//         app.on("error", ()=>{
//             console.log("ERROR", error)
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`Listening on port ${process.env.PORT}`)
//         })
//     }
//     catch(err){
//         console.log(err);
//         throw err
//     }
// })();
