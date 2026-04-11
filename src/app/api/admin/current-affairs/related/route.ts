export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CurrentAffairs from "@/models/CurrentAffair";
import BlogCategoryModel from "@/models/BlogCategoryModel";
import SubCategoryModel from "@/models/SubCategoryModel";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug");

    const data = await CurrentAffairs.find({
      active: true,
      slug: { $ne: slug }, // current article exclude
    })

      // select only required fields
      .select("title slug image affairDate category subCategory")

      .populate({
        path: "category",
        model: BlogCategoryModel,
        select: "name slug",
      })

      .populate({
        path: "subCategory",
        model: SubCategoryModel,
        select: "name slug",
      })

      .sort({ affairDate: -1 })

      .limit(12)

      .lean();

    // format response
    const result = data.map((item) => ({
      title: item.title,

      slug: item.slug,

      image: item.image?.url || "",

      category: item.category?.name || "",

      subCategory: item.subCategory?.name || "",

      affairDate: item.affairDate,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Related API error", error);

    return NextResponse.json(
      { error: "Failed to load related articles" },
      { status: 500 },
    );
  }
}
