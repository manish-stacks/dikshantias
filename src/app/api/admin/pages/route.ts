import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"; 
import { connectToDB } from "@/lib/mongodb";
import PagesModel from "@/models/PagesModel";


// GET all Pages
export async function GET() {
  try {
    await connectToDB();
    const sliders = await PagesModel.find();
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Error fetching Pages:", error);
    return NextResponse.json({ error: "Failed to fetch Pages" }, { status: 500 });
  }
}

// Create new Page
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const active = formData.get("active") === "true";
 
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const metaKeywords = formData.get("metaKeywords")
      ? JSON.parse(formData.get("metaKeywords") as string)
      : [];
    const canonicalUrl = formData.get("canonicalUrl") as string;
    const ogTitle = formData.get("ogTitle") as string;
    const ogDescription = formData.get("ogDescription") as string;
    const index = formData.get("index") !== "false"; 
    const follow = formData.get("follow") !== "false";

    let imageData = null;
    const imageFile = formData.get("image");

    if (imageFile && typeof imageFile === "object") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadedImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "pages" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageData = {
        url: uploadedImage.secure_url,
        public_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
        alt: formData.get("imageAlt") as string,
      };
    }

    // Save in MongoDB
    const newPage = await PagesModel.create({
      title,
      slug,
      content,
      active,
      image: imageData,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      index,
      follow,
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (err) {
    console.error("Error creating page:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create page" },
      { status: 500 }
    );
  }
}


