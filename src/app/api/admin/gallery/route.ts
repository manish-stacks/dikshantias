import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import GalleryModel from "@/models/GalleryModel";
import { uploadToS3 } from "@/lib/s3";

// GET all galleries
export async function GET() {
  try {
    await connectToDB();
    const galleries = await GalleryModel.find()
      .sort({ createdAt: -1 }); // Latest first
    return NextResponse.json(galleries, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// Create new Gallery
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const alt = (formData.get("alt") as string) || "";

    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to AWS S3
    const uploaded = await uploadToS3(
      buffer,
      imageFile.name,
      imageFile.type,
      "gallery"
    );
    const newGallery = await GalleryModel.create({
      title,
      alt,
      image: {
        url: uploaded.url,
        key: uploaded.key,
      },
      active: true,
    });

    return NextResponse.json(newGallery, { status: 201 });
  } catch (err) {
    console.error("Error creating gallery:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create gallery" },
      { status: 500 }
    );
  }
}
