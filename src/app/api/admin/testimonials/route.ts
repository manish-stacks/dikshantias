import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import TestimonialModel from "@/models/TestimonialsModel";
import { uploadToS3 } from "@/lib/s3";

// GET all testimonials
export async function GET() {
  try {
    await connectToDB();
    const testimonials = await TestimonialModel.find()
      .sort({ createdAt: -1 }); // Latest first
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    console.log("Form Data Entries:", formData);
    const name = JSON.parse(formData.get("name")?.toString() || '{}');
    const rank = JSON.parse(formData.get("rank")?.toString() || '{}');
    const quote = JSON.parse(formData.get("quote")?.toString() || '{}');
    const optional = JSON.parse(formData.get("optional")?.toString() || '{}');
    const background = JSON.parse(formData.get("background")?.toString() || '{}');
    const year = formData.get("year")?.toString();
    const attempts = formData.get("attempts")?.toString();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    // Upload image to S3
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "testimonials");

    const newTestimonial = await TestimonialModel.create({
      name,
      rank,
      year,
      quote,
      attempts,
      optional,
      background,
      image: { url, key },
      active: true,
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (err) {
    console.error("Error creating testimonial:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}


