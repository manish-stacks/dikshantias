import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import SliderModel from "@/models/SliderModel";
import { uploadToS3 } from "@/lib/s3";

// ========================== ROUTES ==========================

// GET all sliders
export async function GET() {
  try {
    await connectToDB();
    const sliders = await SliderModel.find();
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
  }
}

// Create new slider
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string);
    const type = (formData.get("type") as "Desktop" | "Mobile") || "Desktop";
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Convert File → Buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to S3
    const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "sliders");

    // Save in MongoDB
    const newSlider = await SliderModel.create({
      title,
      displayOrder,
      type,
      image: { url, key },
      active: true,
    });

    return NextResponse.json(newSlider, { status: 201 });
  } catch (err) {
    console.error("Error creating slider:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create slider" },
      { status: 500 }
    );
  }
}
