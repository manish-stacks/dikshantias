import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/mongodb";
import CurrentAffairs from "@/models/CurrentAffair";
import BlogCategoryModel from "@/models/BlogCategoryModel";
import SubCategoryModel from "@/models/SubCategoryModel";

import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// ✅ GET Current Affair by ID or Slug
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  const { id } = context.params;

  try {
    await connectToDB();

    let currentAffair;
    if (mongoose.Types.ObjectId.isValid(id)) {
      currentAffair = await CurrentAffairs.findById(id)
        .populate({ path: "category", model: BlogCategoryModel })
        .populate({ path: "subCategory", model: SubCategoryModel });
    } else {
      currentAffair = await CurrentAffairs.findOne({ slug: id, active: true })
        .populate({ path: "category", model: BlogCategoryModel })
        .populate({ path: "subCategory", model: SubCategoryModel });
    }

    if (!currentAffair) {
      return NextResponse.json(
        { error: "Current Affair not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentAffair, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch current affair",
      },
      { status: 500 }
    );
  }
}

// ✅ UPDATE Current Affair
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const formData = await request.formData();
    const affair = await CurrentAffairs.findById(id);

    if (!affair) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ Parse bilingual fields
    const titleRaw = formData.get("title")?.toString();
    if (titleRaw) affair.title = JSON.parse(titleRaw);

    const shortContentRaw = formData.get("shortContent")?.toString();
    if (shortContentRaw) affair.shortContent = JSON.parse(shortContentRaw);

    const contentRaw = formData.get("content")?.toString();
    if (contentRaw) affair.content = JSON.parse(contentRaw);

    // ✅ Other fields
    const slug = formData.get("slug")?.toString();
    if (slug) affair.slug = slug;

    const categoryId = formData.get("category")?.toString();
    if (categoryId) affair.category = categoryId;

    const subCategoryId = formData.get("subCategory")?.toString();
    affair.subCategory = subCategoryId || undefined;

    affair.active = formData.get("active") === "true";

    const affairDate = formData.get("affairDate")?.toString();
    if (affairDate) affair.affairDate = new Date(affairDate);

    // ✅ Handle image upload with S3
    const imageFile = formData.get("image");
    if (imageFile && typeof imageFile !== "string" && "arrayBuffer" in imageFile) {
      if (affair.image?.key) {
        await deleteFromS3(affair.image.key);
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToS3(
        buffer,
        (imageFile as File).name,
        (imageFile as File).type,
        "current_affairs"
      );

      affair.image = {
        key: uploadedImage.key,
        url: uploadedImage.url,
      };
    }

    const imageAlt = formData.get("imageAlt")?.toString();
    if (imageAlt) affair.imageAlt = imageAlt;

    await affair.save();

    const populated = await affair.populate([
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
    ]);

    return NextResponse.json(populated, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update current affair",
      },
      { status: 500 }
    );
  }
}


// ✅ DELETE Current Affair
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const currentAffair = await CurrentAffairs.findById(id);
    if (!currentAffair) {
      return NextResponse.json(
        { error: "Current Affair not found" },
        { status: 404 }
      );
    }

    // ✅ delete image from S3 if exists
    if (currentAffair.image?.key) {
      await deleteFromS3(currentAffair.image.key);
    }

    await CurrentAffairs.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Current Affair deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete current affair",
      },
      { status: 500 }
    );
  }
}
