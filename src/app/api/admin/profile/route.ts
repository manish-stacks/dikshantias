import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin"; 

export async function GET() {
  try {
    await connectToDB();
    const profile = await Admin.findOne(); 
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
