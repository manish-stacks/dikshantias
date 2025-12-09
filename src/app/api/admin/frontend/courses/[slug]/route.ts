import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Course from "@/models/Course";

// GET course by Slug
export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  try {
    await connectToDB();

    const { slug } = context.params;

    const course = await Course.findOne({ slug });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching course by slug:", errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
