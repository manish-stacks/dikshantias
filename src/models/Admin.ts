import { connectToDB } from "@/lib/mongodb";
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AdminModel: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

// Export the model
export const Admin = AdminModel;

// Helper functions
export async function createAdmin(name: string, email: string, plainPassword: string) {
  await connectToDB();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const admin = new AdminModel({ name, email, password: hashedPassword });
  await admin.save();
  return admin;
}

export async function findAdminByEmail(email: string) {
  await connectToDB();
  return AdminModel.findOne({ email });
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
  