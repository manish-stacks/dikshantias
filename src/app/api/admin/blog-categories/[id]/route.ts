import { NextResponse } from "next/server";
import type { RouteContext } from "next"; 
import { connectToDB } from "@/lib/mongodb";
import BlogCategoryModel from "@/models/BlogCategoryModel";

// ✅ GET category by ID
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();

    const { id } = context.params;
    const category = await BlogCategoryModel.findById(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE category
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }> // 👈 same as GET
) {
  try {
    await connectToDB();
    const body = await request.json();

    const updatedCategory = await BlogCategoryModel.findByIdAndUpdate(
      context.params.id,
      body,
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category" },
      { status: 500 }
    );
  }
}

// ✅ DELETE category
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }> // 👈 same fix
) {
  try {
    await connectToDB();

    const deletedCategory = await BlogCategoryModel.findByIdAndDelete(context.params.id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category" },
      { status: 500 }
    );
  }
}
