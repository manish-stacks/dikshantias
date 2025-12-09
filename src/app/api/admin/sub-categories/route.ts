import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/SubCategoryModel";


// GET all subcategories
export async function GET() {
  try {
    await connectToDB();
    const subcategories = await SubCategoryModel.find({})
      .populate("category", "name slug"); // now populate works
    return NextResponse.json(subcategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

// CREATE new subcategory
export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, slug, active, category } = await req.json();

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const newSubCategory = await SubCategoryModel.create({
      name,
      slug,
      active: active ?? true,
      category, 
    });

    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 }
    );
  }
}