// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

// ensure .env is loaded even if this file is imported before index.ts
dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error(
      "❌ Missing MongoDB connection string. Please set MONGO_URI in your .env",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
};
