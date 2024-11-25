import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import AdminModel from "./infrastructure/database/models/AdminModel"; // Adjust the path as needed

dotenv.config();

async function seedAdmin() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI!, {});
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    // Create the admin
    const admin = new AdminModel({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      fullName: "Default Admin",
      adminID: process.env.SEED_ADMIN_ID || "default_admin_id",
    });

    // Save admin to database
    await admin.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Execute the seeding function
seedAdmin();
