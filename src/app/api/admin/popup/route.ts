import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PopupModel from "@/models/Popup";
import { uploadToS3 } from "@/lib/s3";

// ✅ GET all popups
export async function GET() {
  try {
    await connectToDB();

    const popups = await PopupModel.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return NextResponse.json(popups, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching popups:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch popups" },
      { status: 500 },
    );
  }
}

// CREATE popup
// CREATE popup
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const subtitle = formData.get("subtitle")?.toString().trim();
    const description = formData.get("description")?.toString() || "";

    const primaryText = formData.get("primaryText")?.toString() || "";
    const primaryLink = formData.get("primaryLink")?.toString() || "";

    const secondaryText = formData.get("secondaryText")?.toString() || "";
    const secondaryLink = formData.get("secondaryLink")?.toString() || "";

    const imageFile = formData.get("image") as File | null;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!subtitle) {
      return NextResponse.json(
        { error: "Subtitle is required" },
        { status: 400 },
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const { url, key } = await uploadToS3(
      buffer,
      imageFile.name,
      imageFile.type,
      "popup",
    );

    const newPopup = await PopupModel.create({
      title,
      subtitle,
      description,
      image: { url, key },
      primaryButton: {
        text: primaryText,
        link: primaryLink,
      },
      secondaryButton: {
        text: secondaryText,
        link: secondaryLink,
      },
      active: true,
    });

    return NextResponse.json(newPopup, { status: 201 });
  } catch (error: any) {
    console.error("Create Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create popup" },
      { status: 500 },
    );
  }
}
