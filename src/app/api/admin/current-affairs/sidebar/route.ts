export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CurrentAffairs from "@/models/CurrentAffair";
import BlogCategoryModel from "@/models/BlogCategoryModel";
import SubCategoryModel from "@/models/SubCategoryModel";

export async function GET() {
  try {
    await connectToDB();

    const data = await CurrentAffairs.find({ active: true })
      .populate({
        path: "category",
        model: BlogCategoryModel,
        select: "name",
      })
      .populate({
        path: "subCategory",
        model: SubCategoryModel,
        select: "name",
      })
      .sort({ affairDate: -1 })
      .limit(50);

    // helper → only title + slug
    const onlyTitleSlug = (arr: any[]) =>
      arr.map((item) => ({
        title: item.title,
        slug: item.slug,
      }));

    const facts = onlyTitleSlug(
      data
        .filter((i) => i.subCategory?.name === "Important Facts of the Day")
        .slice(0, 5),
    );

    const daily = onlyTitleSlug(
      data
        .filter((i) => i.subCategory?.name === "Daily Current Affairs Analysis")
        .slice(0, 5),
    );

    const editorial = onlyTitleSlug(
      data
        .filter((i) => i.subCategory?.name === "Editorial Analysis")
        .slice(0, 5),
    );

    return NextResponse.json({
      facts,
      daily,
      editorial,
    });
  } catch (error) {
    console.error("Sidebar API error", error);

    return NextResponse.json(
      { error: "Failed to load sidebar" },
      { status: 500 },
    );
  }
}
