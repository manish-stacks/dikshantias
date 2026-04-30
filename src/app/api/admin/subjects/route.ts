import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";

// ================= GET (LIST + PAGINATION) =================

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const exam = searchParams.get("exam");
    const type = searchParams.get("type");
     console.log("FILTER:", { exam, type });

    let filter: any = { status: true };

    if (exam) filter.exam = exam;
    if (type) filter.type = type;

    const total = await Subject.countDocuments(filter);

    const subjects = await Subject.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data: subjects,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.log("GET SUBJECT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ================= POST (CREATE) =================
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { exam, page, type, name, slug, status } = body;

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
      status: status ?? true,
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.log("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
