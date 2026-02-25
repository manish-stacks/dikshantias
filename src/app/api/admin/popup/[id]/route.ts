import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PopupModel from "@/models/Popup";
import { uploadToS3 } from "@/lib/s3";
import { deleteFromS3 } from "@/lib/s3";

interface Params {
  params: { id: string };
}

// ✅ GET single popup
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

// ✅ UPDATE popup
export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectToDB();

    const contentType = req.headers.get("content-type");

    // Toggle Active Only
    if (contentType?.includes("application/json")) {
      const body = await req.json();

      const updated = await PopupModel.findByIdAndUpdate(params.id, body, {
        new: true,
      });

      return NextResponse.json({ popup: updated });
    }

    // Full Update with FormData
    const formData = await req.formData();

    const popup = await PopupModel.findById(params.id);
    if (!popup) {
      return NextResponse.json({ error: "Popup not found" }, { status: 404 });
    }

    const headerTitle = formData.get("headerTitle") as string;
    const subTitle = (formData.get("subTitle") as string) || "";
    const description = (formData.get("description") as string) || "";
    const displayOrder = Number(formData.get("displayOrder") || 0);

    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Delete old image
      if (popup.image?.key) {
        await deleteFromS3(popup.image.key);
      }

      const uploaded = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "popup",
      );

      popup.image = {
        url: uploaded.url,
        key: uploaded.key,
      };
    }

    popup.headerTitle = headerTitle;
    popup.subTitle = subTitle;
    popup.description = description;
    popup.displayOrder = displayOrder;

    await popup.save();

    return NextResponse.json(popup);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update popup" },
      { status: 500 },
    );
  }
}

// ✅ DELETE popup
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
