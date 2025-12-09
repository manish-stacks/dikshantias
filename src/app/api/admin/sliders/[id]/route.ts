import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import SliderModel from "@/models/SliderModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// ========================== ROUTES ==========================

// GET single slider
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const slider = await SliderModel.findById(id);

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE slider
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const slider = await SliderModel.findById(id);
    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";

    // 🔹 CASE 1: Update via JSON (active toggle only)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      slider.active = body.active ?? slider.active;
      await slider.save();
      return NextResponse.json(slider);
    }

    // 🔹 CASE 2: Update via FormData (title, image, displayOrder)
    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      const title = formData.get("title") as string;
      const displayOrder = parseInt(formData.get("displayOrder") as string);
      const imageFile = formData.get("image") as File | null;

      let updatedImage = slider.image;

      if (imageFile && imageFile.size > 0) {
        // delete old image from S3 if exists
        if (slider.image?.key) {
          await deleteFromS3(slider.image.key);
        }

        // upload new image to S3
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadToS3(
          buffer,
          imageFile.name,
          imageFile.type,
          "sliders"
        );

        updatedImage = {
          url: uploadedImage.url,
          key: uploadedImage.key,
        };
      }

      slider.title = title;
      slider.displayOrder = displayOrder;
      slider.image = updatedImage;

      await slider.save();
      return NextResponse.json(slider);
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update slider:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE slider active status only
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();

    const slider = await SliderModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error("Failed to update active status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE slider
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) { 
  try {
    const { id } = context.params;
    await connectToDB();

    const slider = await SliderModel.findById(id);
    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    // delete image from S3 if exists
    if (slider.image?.key) {
      await deleteFromS3(slider.image.key);
    }

    await SliderModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Slider deleted successfully" });
  } catch (error) {
    console.error("Failed to delete slider:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
