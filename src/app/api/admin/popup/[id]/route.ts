import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PopupModel from "@/models/Popup";
import { uploadToS3 } from "@/lib/s3";
import { deleteFromS3 } from "@/lib/s3";

interface Params {
  params: { id: string };
}

// GET single popup
export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const popup = await PopupModel.findById(params.id);

    if (!popup) {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    return NextResponse.json(popup);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch popup" },
      { status: 500 },
    );
  }
}

// UPDATE popup
export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const contentType = req.headers.get("content-type");

    // Toggle Active
    if (contentType?.includes("application/json")) {
      const body = await req.json();

      const updated = await PopupModel.findByIdAndUpdate(params.id, body, {
        new: true,
      });

      return NextResponse.json({ popup: updated });
    }

    const formData = await req.formData();

    const popup = await PopupModel.findById(params.id);
    if (!popup) {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    const title = formData.get("title")?.toString().trim();
    const subtitle = formData.get("subtitle")?.toString().trim();
    const description = formData.get("description")?.toString() || "";

    const primaryText = formData.get("primaryText")?.toString() || "";
    const primaryLink = formData.get("primaryLink")?.toString() || "";

    const secondaryText = formData.get("secondaryText")?.toString() || "";
    const secondaryLink = formData.get("secondaryLink")?.toString() || "";

    popup.title = title ?? popup.title;
    popup.subtitle = subtitle ?? popup.subtitle;
    popup.description = description;

    popup.primaryButton = {
      text: primaryText,
      link: primaryLink,
    };

    popup.secondaryButton = {
      text: secondaryText,
      link: secondaryLink,
    };

    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      if (popup.image?.key) {
        await deleteFromS3(popup.image.key);
      }

      const { url, key } = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "popup",
      );

      popup.image = { url, key };
    }

    await popup.save();

    return NextResponse.json(popup);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update popup" },
      { status: 500 },
    );
  }
}

// DELETE popup
export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const popup = await PopupModel.findById(params.id);

    if (!popup) {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    // Delete image from S3
    if (popup.image?.key) {
      await deleteFromS3(popup.image.key);
    }

    await popup.deleteOne();

    return NextResponse.json(
      { message: "Popup deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete popup" },
      { status: 500 },
    );
  }
}
