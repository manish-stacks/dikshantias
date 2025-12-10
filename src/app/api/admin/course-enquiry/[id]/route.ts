export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CourseEnquiry from "@/models/CourseEnquiry";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    await CourseEnquiry.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
