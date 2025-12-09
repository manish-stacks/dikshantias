import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import Course, { ICourse } from "@/models/Course";
import slugify from "slugify";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// GET course by ID
export async function GET(  
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch course";
    console.error("Error fetching course:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE course by ID
export async function PUT(
  req: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const rawSlug = formData.get("slug") as string | null;
    const slug =
      rawSlug && rawSlug.trim().length > 0
        ? rawSlug
        : slugify(title, { lower: true, strict: true });

        const shortContent = formData.get("shortContent") as string;
        const content = formData.get("content") as string;
        const active = formData.get("active")
          ? JSON.parse(formData.get("active") as string)
          : true;
        const courseMode = formData.get("courseMode") as "online" | "offline";
        const lectures = parseInt(formData.get("lectures") as string, 10);
        const duration = formData.get("duration") as string;
        const languages = formData.get("languages") as string;
        const displayOrder = formData.get("displayOrder")
          ? parseInt(formData.get("displayOrder") as string, 10)
          : 0;

    const originalPrice = formData.get("originalPrice")
      ? parseFloat(formData.get("originalPrice") as string)
      : undefined;
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined;
    // Badge & Features
    const badge = (formData.get("badge") as string) || undefined;
    const badgeColor = (formData.get("badgeColor") as string) || undefined;
    const features = formData.get("features")
      ? JSON.parse(formData.get("features") as string)
      : undefined;
    // Handle image update
    let updatedImage: ICourse["image"] | undefined = course.image;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      // Delete old image from S3 if exists
      if (course.image?.key) {
        await deleteFromS3(course.image.key);
      }
      // Upload new image
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "courses"
      );

      updatedImage = {
        url: uploadedImage.url,
        key: uploadedImage.key,
        alt: (formData.get("imageAlt") as string) || "",
      };
    }
    // Videos
    const demoVideo = formData.get("demoVideo") as string | undefined;
    const videos = formData.get("videos")
      ? JSON.parse(formData.get("videos") as string)
      : [];
    // SEO fields
    const metaTitle = (formData.get("metaTitle") as string) || "";
    const metaDescription = (formData.get("metaDescription") as string) || "";
    const metaKeywords = formData.get("metaKeywords")
      ? JSON.parse(formData.get("metaKeywords") as string)
      : [];
    const canonicalUrl = (formData.get("canonicalUrl") as string) || "";
    const ogTitle = (formData.get("ogTitle") as string) || "";
    const ogDescription = (formData.get("ogDescription") as string) || "";
    const index = formData.get("index")
      ? JSON.parse(formData.get("index") as string)
      : true;
    const follow = formData.get("follow")
      ? JSON.parse(formData.get("follow") as string)
      : true;
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        shortContent,
        content,
        active,
        courseMode,
        lectures,
        duration,
        languages,
        displayOrder,
        originalPrice,
        price,
        ...(updatedImage && { image: updatedImage }),
        demoVideo,
        videos,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        index,
        follow,
        ...(badge && { badge }),
        ...(badgeColor && { badgeColor }),
        ...(features && { features }),
      },
      { new: true }
    );
    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update course";
    console.error("Error updating course:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Update course active status only
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const { active } = await request.json();
    const course = await Course.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update active status";
    console.error("Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE course by ID
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    // Delete image from S3 if exists
    if (course.image?.key) {
      await deleteFromS3(course.image.key);
    }
    await Course.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Course and associated image deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete course";
    console.error("Error deleting course:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
