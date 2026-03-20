import mongoose from "mongoose";
import bcrypt   from "bcryptjs";
import dotenv   from "dotenv";
import User     from "./src/models/User.js";

dotenv.config();

const ADMINS = [
  { email: "krishnashah0948@gmail.com",  password: "krishna1412" },
  { email: "ankursagar1234560@gmail.com", password: "1234567"    },
];

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB Atlas\n");

    for (const admin of ADMINS) {
      const hashed = await bcrypt.hash(admin.password, 10);
      const result = await User.findOneAndUpdate(
        { email: admin.email },
        { password: hashed, role: "admin" },
        { new: true, upsert: true }
      );
      console.log(`✅  Admin set: ${result.email}  (role: ${result.role})`);
    }

    console.log("\nDone — both admin accounts are ready.");
    process.exit(0);
  } catch (err) {
    console.error("❌  Error:", err.message);
    process.exit(1);
  }
};

resetPasswords();
