import mongoose from "mongoose";

const connectDB = async () => {
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
};

export default connectDB;
