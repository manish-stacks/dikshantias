  import mongoose from "mongoose";

  let isConnected = false;

  export async function connectToDB() {
    if (isConnected) {
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI as string;
      if (!mongoUri) {
        throw new Error("❌ MONGODB_URI is not defined in .env");
      }

      await mongoose.connect(mongoUri);
      isConnected = true;

      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      throw err;
    }
  }
