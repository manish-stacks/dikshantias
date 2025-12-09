import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import BlogsModel from "@/models/BlogsModel";
import "@/models/BlogCategoryModel";
import { uploadToS3 } from "@/lib/s3";

export async function GET() {
  try {
    await connectToDB();

    const blogs = await BlogsModel.find()
      .populate("category")
      .sort({ createdAt: -1 }) // Latest first

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//  POST - Add new blog with AWS S3 upload
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    // Parse multilingual fields from JSON string to object
    const title = formData.get("title")
      ? JSON.parse(formData.get("title") as string)
      : { en: "", hi: "" };

    const shortContent = formData.get("shortContent")
      ? JSON.parse(formData.get("shortContent") as string)
      : { en: "", hi: "" };

    const content = formData.get("content")
      ? JSON.parse(formData.get("content") as string)
      : { en: "", hi: "" };

    const postedBy = formData.get("postedBy")
      ? JSON.parse(formData.get("postedBy") as string)
      : { en: "", hi: "" };

    const slug = formData.get("slug")?.toString();
    const categoryId = formData.get("category")?.toString();
    const active = formData.get("active") === "true";
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];

    // SEO fields
    const metaTitle = formData.get("metaTitle")?.toString();
    const metaDescription = formData.get("metaDescription")?.toString();
    const metaKeywords = formData.get("metaKeywords")
      ? JSON.parse(formData.get("metaKeywords") as string)
      : [];
    const canonicalUrl = formData.get("canonicalUrl")?.toString();
    const ogTitle = formData.get("ogTitle")?.toString();
    const ogDescription = formData.get("ogDescription")?.toString();
    const index = formData.get("index") === "true";
    const follow = formData.get("follow") === "true";

    const imageFile = formData.get("image") as File | null;
    const imageAlt = formData.get("imageAlt")?.toString() || "";

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { url, key } = await uploadToS3(
      buffer,
      imageFile.name,
      imageFile.type,
      "blogs"
    );

    const newBlog = await BlogsModel.create({
      title,
      slug,
      shortContent,
      content,
      category: categoryId,
      postedBy,
      active,
      tags,
      image: {
        url,
        key,
        alt: imageAlt,
      },
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      index,
      follow,
    });

    const populatedBlog = await newBlog.populate([{ path: "category", select: "name" }]);

    return NextResponse.json(populatedBlog, { status: 201 });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}
