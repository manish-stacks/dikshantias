import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/SubCategoryModel";

// GET single subcategory
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const subcategory = await SubCategoryModel.findById(id).populate(
      "category",
      "name slug"
    );

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategory, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// UPDATE subcategory
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;
    const { name, slug, active, category } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Subcategory ID is required" },
        { status: 400 }
      );
    }

    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(active !== undefined && { active }),
        ...(category && { category }),
      },
      { new: true }
    ).populate("category", "name slug");

    if (!updatedSubCategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubCategory, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating subcategory:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// UPDATE Subcategory active status only
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();

    const subcategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategory, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to update active status:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown server error" }, { status: 500 });
  }
}

// DELETE subcategory
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const deleted = await SubCategoryModel.findByIdAndDelete(id);

    return deleted
      ? NextResponse.json({ message: "Subcategory deleted successfully" })
      : NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting subcategory:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
