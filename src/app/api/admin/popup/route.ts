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

// ✅ CREATE popup
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const headerTitle = formData.get("headerTitle") as string;
    const subTitle = (formData.get("subTitle") as string) || "";
    const description = (formData.get("description") as string) || "";
    const displayOrder = Number(formData.get("displayOrder") || 0);

    const primaryText = formData.get("primaryText") as string;
    const primaryLink = formData.get("primaryLink") as string;

    const secondaryText = formData.get("secondaryText") as string;
    const secondaryLink = formData.get("secondaryLink") as string;

    const imageFile = formData.get("image") as File | null;

    if (!headerTitle) {
      return NextResponse.json(
        { error: "Header title is required" },
        { status: 400 },
      );
    }

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to S3
    const uploaded = await uploadToS3(
      buffer,
      imageFile.name,
      imageFile.type,
      "popup",
    );

    const newPopup = await PopupModel.create({
      headerTitle,
      subTitle,
      description,
      displayOrder,
      image: {
        url: uploaded.url,
        key: uploaded.key,
      },
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
    console.error("Error creating popup:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create popup" },
      { status: 500 },
    );
  }
}
