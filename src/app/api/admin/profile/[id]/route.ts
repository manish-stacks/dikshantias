import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Admin, createAdmin } from "@/models/Admin";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt

// Update Admin by ID
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const { id } = await context.params; // ✅ Await params
    const data = await req.json();
    const { name, email, password } = data;

    // Fetch admin by id
    const admin = await Admin.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    admin.name = name;
    admin.email = email;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    return NextResponse.json({ message: "Profile updated", admin });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}


