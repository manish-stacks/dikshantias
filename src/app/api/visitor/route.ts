import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import VisitorModel from "@/models/Visitor";

export async function GET(request: Request) {
  await connectToDB();

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";

  try {
    // Insert only if not exists
    await VisitorModel.updateOne(
      { ip },
      { $setOnInsert: { ip } },
      { upsert: true },
    );

    const total = await VisitorModel.countDocuments();

    return NextResponse.json({ count: total });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ count: 0 });
  }
}
