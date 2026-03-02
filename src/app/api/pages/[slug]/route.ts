import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PagesModel from "@/models/PagesModel";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await connectToDB();

    const page = await PagesModel.findOne({
      slug: params.slug,
      active: true, // 🔥 important
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
