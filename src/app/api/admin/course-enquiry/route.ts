export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CourseEnquiry from "@/models/CourseEnquiry";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();
    await CourseEnquiry.create(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const enquiries = await CourseEnquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}