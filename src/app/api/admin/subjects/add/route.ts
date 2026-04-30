import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";

// ================= CREATE SUBJECT =================
export async function POST(req: Request) {
  try {
    await connectToDB();

    const body = await req.json();

    const { exam, page, type, name, slug, status } = body;

    // basic validation
    if (!exam || !page || !type || !name || !slug) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const subject = await Subject.create({
      exam,
      page,
      type,
      name,
      slug,
      status: status ?? true, // default true
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.log("POST Subject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
