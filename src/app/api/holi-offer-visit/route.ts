import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Visit from "@/models/Visit";

export async function GET() {
  await connectToDB();

  const count = await Visit.countDocuments({
    page: "holi-offer",
  });

  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  try {
    await connectToDB();

    // Get IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "unknown";

    // Current date
    const today = new Date().toISOString().split("T")[0];

    // Try inserting unique record
    await Visit.create({
      page: "holi-offer",
      ip,
      date: today,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Duplicate error (means already counted)
    if (error.code === 11000) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
