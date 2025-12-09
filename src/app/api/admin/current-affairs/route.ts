export const runtime = 'nodejs'; // Use Node.js runtime
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import CurrentAffairs from "@/models/CurrentAffair";
import BlogCategoryModel from "@/models/BlogCategoryModel";
import SubCategoryModel from "@/models/SubCategoryModel";
import { uploadToS3 } from "@/lib/s3";





// ------------------ GET ALL ------------------
export async function GET() {
  try {
    await connectToDB();

     const currentAffairs = await CurrentAffairs.find()
      .populate({ path: "category", model: BlogCategoryModel })
      .populate({ path: "subCategory", model: SubCategoryModel })
      .sort({ createdAt: -1 }); // Latest first

    return NextResponse.json(currentAffairs);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch current affairs" },
      { status: 500 }
    );
  }
}

// ------------------ CREATE NEW ------------------



export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const title = JSON.parse(formData.get("title")?.toString() || '{}');
    const shortContent = JSON.parse(formData.get("shortContent")?.toString() || '{}');
    const content = JSON.parse(formData.get("content")?.toString() || '{}');

    const slug = formData.get("slug")?.toString() || '';
    const category = formData.get("category")?.toString();
    const subCategory = formData.get("subCategory")?.toString() || undefined;
    const active = formData.get("active") === "true";
    const affairDateStr = formData.get("affairDate")?.toString();
    const affairDate = affairDateStr ? new Date(affairDateStr) : undefined;
    const imageAlt = formData.get("imageAlt")?.toString() || "";

    const imageFile = formData.get("image") as File | null;
    let uploadedImage;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      uploadedImage = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "current_affairs"
      );
    }

    const newAffair = await CurrentAffairs.create({
      title,
      slug,
      shortContent,
      content,
      category,
      subCategory,
      active,
      affairDate,
      image: uploadedImage ? { key: uploadedImage.key, url: uploadedImage.url } : undefined,
      imageAlt,
    });

    const populatedAffair = await newAffair.populate([
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
    ]);

    return NextResponse.json(populatedAffair, { status: 201 });
  } catch (err) {
    console.error("Error creating current affair:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create current affair" },
      { status: 500 }
    );
  }
}
