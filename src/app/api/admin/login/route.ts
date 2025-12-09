import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findAdminByEmail, verifyPassword } from "@/models/Admin";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const admin = await findAdminByEmail(email);
  if (!admin) return NextResponse.json({ message: "Invalid email" }, { status: 401 });

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) return NextResponse.json({ message: "Invalid password" }, { status: 401 });

  const token = jwt.sign(
    { email: admin.email, role: "admin" },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });
}
