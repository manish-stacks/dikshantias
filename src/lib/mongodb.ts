// import mongoose from "mongoose";

// let isConnected = false;

// export async function connectToDB() {
//   if (isConnected) {
//     return;
//   }

//   try {
//     const mongoUri = process.env.MONGODB_URI as string;
//     if (!mongoUri) {
//       throw new Error("MONGODB_URI is not defined in .env");
//     }

//     await mongoose.connect(mongoUri);
//     isConnected = true;

//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err;
//   }
// }

// worked in local

import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

let isConnected = false;

export async function connectToDB() {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI as string;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(mongoUri, {
      family: 4, // Force IPv4 (very important for your case)
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
