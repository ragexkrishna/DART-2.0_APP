import mongoose from "mongoose";
import dotenv from "dotenv";
import Announcement from "../src/models/Announcement.js";

dotenv.config();

const clear = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        
        const result = await Announcement.deleteMany({});
        console.log(`Deleted ${result.deletedCount} announcements.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Failed to clear announcements:", error.message);
        process.exit(1);
    }
};

clear();
