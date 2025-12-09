import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Scholarship from "@/models/Scholarship";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const formData = await req.formData();

    // Basic fields
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const gender = formData.get("gender") as string | null;
    const category = formData.get("category") as string | null;
    const course = formData.get("course") as string | null;
    const medium = formData.get("medium") as string | null;
    const scholarship = formData.get("scholarship") as string | null; // e.g., "PROGRAMME - 1: 60% Scholarship"

    // Upload certificate
    let certificateData = { url: "", key: "", alt: "" };
    const certificateFile = formData.get("certificate") as File | null;
    if (certificateFile && certificateFile.size > 0) {
      const buffer = Buffer.from(await certificateFile.arrayBuffer());
      const uploaded = await uploadToS3(
        buffer,
        certificateFile.name,
        certificateFile.type,
        "scholarship-certificates"
      );
      certificateData = {
        url: uploaded.url,
        key: uploaded.key,
        alt: "Certificate",
      };
    }

    // Upload photo
    let photoData = { url: "", key: "", alt: "" };
    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const uploaded = await uploadToS3(
        buffer,
        photoFile.name,
        photoFile.type,
        "scholarship-photos"
      );
      photoData = {
        url: uploaded.url,
        key: uploaded.key,
        alt: "Candidate Photo",
      };
    }

    // Save to MongoDB
    const newScholarship = new Scholarship({
      name,
      phone,
      gender,
      category,
      course,
      medium,
      scholarship,
      certificate: certificateData,
      photo: photoData,
    });

    await newScholarship.save();

    // ✅ Dynamic success messages based on scholarship program
    let successMessage = "Thank you for registering!";

    if (
      scholarship?.includes("PROGRAMME - 1") ||
      scholarship?.includes("60%")
    ) {
      successMessage = `Thank you for registering!
Your application for the Scholarship Program has been received.
We’ll get in touch soon to verify your documents and confirm your seat.
Keep your required documents ready!`;
    } else if (
      scholarship?.includes("PROGRAMME - 2") ||
      scholarship?.includes("50%")
    ) {
      successMessage = `Thank you for registering!
Your application for the Scholarship Program has been received.
We’ll get in touch soon to verify your documents and confirm your seat.
Keep your required documents ready!`;
    } else if (
      scholarship?.includes("PROGRAMME - 3") ||
      scholarship?.includes("40%")
    ) {
      successMessage = `Thank you for registering!
Your application for the 40% Merit Scholarship has been received.
Aptitude test details will be shared soon.`;
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Error saving scholarship:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

// GET all scholarships
export async function GET() {
  try {
    await connectToDB();
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    return NextResponse.json(scholarships);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}
