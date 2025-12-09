import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import BlogsModel from "@/models/BlogsModel";
import "@/models/BlogCategoryModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";


// ✅ GET single blog
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const blog = await BlogsModel.findById(id).populate("category", "name");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE blog
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const blog = await BlogsModel.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    const contentType = request.headers.get("content-type") || "";

    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();

      // Parse multilingual fields
     blog.title = {
        en: (formData.get("titleEn") as string) || blog.title?.en || "",
        hi: (formData.get("titleHi") as string) || blog.title?.hi || ""
      };
      blog.shortContent = {
        en: (formData.get("shortContentEn") as string) || blog.shortContent?.en || "",
        hi: (formData.get("shortContentHi") as string) || blog.shortContent?.hi || ""
      };
      blog.content = {
        en: (formData.get("contentEn") as string) || blog.content?.en || "",
        hi: (formData.get("contentHi") as string) || blog.content?.hi || ""
      };
      blog.postedBy = {
        en: (formData.get("postedByEn") as string) || blog.postedBy?.en || "",
        hi: (formData.get("postedByHi") as string) || blog.postedBy?.hi || ""
      };

      //Single value fields
      blog.slug = (formData.get("slug") as string) ?? blog.slug;
      blog.category = (formData.get("category") as string) ?? blog.category;
      blog.active =
        formData.get("active") !== null
          ? JSON.parse(formData.get("active") as string)
          : blog.active;

      blog.tags =
        formData.get("tags") !== null
          ? JSON.parse(formData.get("tags") as string)
          : blog.tags;

      //SEO fields
      blog.metaTitle = (formData.get("metaTitle") as string) ?? blog.metaTitle;
      blog.metaDescription =
        (formData.get("metaDescription") as string) ?? blog.metaDescription;
      blog.metaKeywords =
        formData.get("metaKeywords") !== null
          ? JSON.parse(formData.get("metaKeywords") as string)
          : blog.metaKeywords;
      blog.canonicalUrl =
        (formData.get("canonicalUrl") as string) ?? blog.canonicalUrl;
      blog.ogTitle = (formData.get("ogTitle") as string) ?? blog.ogTitle;
      blog.ogDescription =
        (formData.get("ogDescription") as string) ?? blog.ogDescription;
      blog.index =
        formData.get("index") !== null
          ? JSON.parse(formData.get("index") as string)
          : blog.index;
      blog.follow =
        formData.get("follow") !== null
          ? JSON.parse(formData.get("follow") as string)
          : blog.follow;

      // Handle image upload
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        // delete old image from S3 if exists
        if (blog.image?.key) {
          await deleteFromS3(blog.image.key);
        }
        // upload new image
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadedImage = await uploadToS3(
          buffer,
          imageFile.name,
          imageFile.type,
          "blogs"
        );

        blog.image = {
          url: uploadedImage.url,
          key: uploadedImage.key,
          alt: (formData.get("imageAlt") as string) || blog.image?.alt || "",
        };
      }

      await blog.save();

      const populatedBlog = await blog.populate([{ path: "category", select: "name" }]);
      return NextResponse.json(populatedBlog, { status: 200 });
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


// ✅ UPDATE blog active status only
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const { active } = await request.json();
    const blog = await BlogsModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Failed to update active status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ DELETE blog
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const blog = await BlogsModel.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    if (blog.image?.key) {
      await deleteFromS3(blog.image.key);
    }

    await BlogsModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
