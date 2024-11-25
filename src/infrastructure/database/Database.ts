import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Database = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost/exam_app",
      { serverSelectionTimeoutMS: 30000 }
    );
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default Database;
