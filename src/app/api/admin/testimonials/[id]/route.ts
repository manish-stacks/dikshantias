import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import TestimonialModel from "@/models/TestimonialsModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// GET single Testimonial
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE Testimonial (with AWS S3 image upload)
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();
    const { id } = context.params;

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const rank = formData.get("rank") as string;
    const year = formData.get("year") as string;
    const quote = formData.get("quote") as string;
    const attempts = formData.get("attempts") as string;
    const optional = (formData.get("optional") as string) || "";
    const background = (formData.get("background") as string) || "";
    const active = formData.get("active") === "true";

    const existing = await TestimonialModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    let updatedImage = existing.image;
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 0) {
      // Delete old image from S3
      if (existing.image?.key) {
        await deleteFromS3(existing.image.key);
      }
      // Upload new image to S3
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "testimonials");

      updatedImage = { url, key };
    }
    const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      {
        name,
        rank,
        year,
        quote,
        attempts,
        optional,
        background,
        image: updatedImage,
        active,
      },
      { new: true }
    );

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (err) {
    console.error("Error updating Testimonial:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to update Testimonial" },
      { status: 500 }
    );
  }
}

// PATCH -> update only active status
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();

    const testimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to update active status:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE Testimonial
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    // Delete image from S3
    if (testimonial.image?.key) {
      await deleteFromS3(testimonial.image.key);
    }

    await TestimonialModel.findByIdAndDelete(id); 

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Failed to delete Testimonial:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
