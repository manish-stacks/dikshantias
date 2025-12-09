import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import WebSettings from "@/models/WebSettingsModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

interface WebSettingsUpdate {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  googleMap?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  telegram?: string;
  image?: { url: string; key: string };
}

export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;
    const formData = await request.formData();

    // Prepare update data
    const data: WebSettingsUpdate = {};
    const fields: (keyof WebSettingsUpdate)[] = [
      "name",
      "phone",
      "whatsapp",
      "email",
      "address",
      "googleMap",
      "facebook",
      "instagram",
      "youtube",
      "linkedin",
      "twitter",
      "telegram",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) data[field] = value.toString();
    });

    const existing = await WebSettings.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Web settings not found" }, { status: 404 });
    }

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      // Delete old image from S3 if exists
      if (existing.image?.key) {
        await deleteFromS3(existing.image.key);
      }

      // Upload new image to S3
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "web");

      data.image = { url, key };
    }

    // Update WebSettings document
    const updatedWeb = await WebSettings.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json(updatedWeb, { status: 200 });
  } catch (err) {
    console.error("Error updating WebSettings:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to update web settings" },
      { status: 500 }
    );
  }
}
