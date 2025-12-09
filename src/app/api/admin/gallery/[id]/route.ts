import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import GalleryModel from "@/models/GalleryModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";


// GET gallery by ID
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const gallery = await GalleryModel.findById(id);
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }
    return NextResponse.json(gallery);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE gallery (PUT)
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const alt = formData.get("alt") as string;
    const imageFile = formData.get("image") as File | null;

    const gallery = await GalleryModel.findById(id);
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    let updatedImage = gallery.image;
    if (imageFile && imageFile.size > 0) {
      if (gallery.image?.key) {
        await deleteFromS3(gallery.image.key);
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "gallery"
      );

      updatedImage = {
        key: uploadedImage.key,
        url: uploadedImage.url,
      };
    }

    gallery.title = title;
    gallery.alt = alt;
    gallery.image = updatedImage;

    await gallery.save();

    return NextResponse.json(gallery, { status: 200 });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update gallery" },
      { status: 500 }
    );
  }
}

// UPDATE Gallery active status (PATCH)
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();

    const gallery = await GalleryModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Failed to update active status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE gallery
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const gallery = await GalleryModel.findById(id);
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Delete image from S3
    if (gallery.image?.key) {
      await deleteFromS3(gallery.image.key);
    }

    await GalleryModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Failed to delete Gallery:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
