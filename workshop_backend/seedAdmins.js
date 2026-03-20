import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";
import User     from "./src/models/User.js";

dotenv.config();

const ADMINS = [
  { name: "Krishna Shah",  email: "krishnashah0948@gmail.com",  password: "krishna1412" },
  { name: "Ankur Sagar",   email: "ankursagar1234560@gmail.com", password: "1234567"     },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas\n");

    for (const admin of ADMINS) {
      const existing = await User.findOne({ email: admin.email });
      if (existing) {
        // Update role to admin in case the account already exists as student
        if (existing.role !== "admin") {
          await User.updateOne({ email: admin.email }, { role: "admin" });
          console.log(`↑  Upgraded existing account to admin: ${admin.email}`);
        } else {
          console.log(`⏩  Already admin: ${admin.email}`);
        }
        continue;
      }

      const hashed = await bcrypt.hash(admin.password, 10);
      await User.create({ name: admin.name, email: admin.email, password: hashed, role: "admin" });
      console.log(`✅  Created admin: ${admin.email}`);
    }

    console.log("\nDone.");
    process.exit(0);
  } catch (err) {
    console.error("❌  Error:", err.message);
    process.exit(1);
  }
};

seed();
