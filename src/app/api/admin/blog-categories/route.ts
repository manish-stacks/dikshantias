import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import BlogCategoryModel from "@/models/BlogCategoryModel";


// GET all categories
export async function GET() {
  try {
    await connectToDB();
    const categories = await BlogCategoryModel.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// CREATE new category
export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, slug, active } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCategory = await BlogCategoryModel.create({
      name,
      slug,
      active: active ?? true,
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
