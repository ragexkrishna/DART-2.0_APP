import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding.");

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists:", adminExists.email);
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@dart.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:", admin.email);
    console.log("Password is: admin123");
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
