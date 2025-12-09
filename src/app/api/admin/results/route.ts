import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ResultModel from "@/models/ResultModel";
import { uploadToS3 } from "@/lib/s3";


// GET all Results
export async function GET() {
  try {
    await connectToDB();
    const Results = await ResultModel.find()
      .sort({ createdAt: -1 }); // Latest first

    return NextResponse.json(Results);
  } catch (error) {
    console.error("Error fetching Results:", error);
    return NextResponse.json({ error: "Failed to fetch Results" }, { status: 500 });
  }
}


// Create new Result
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();
    console.log("Form Data Received:", formData);

    // English & Hindi fields
   const name_en = formData.get("nameEn")?.toString();
    const name_hi = formData.get("nameHi")?.toString();
    const rank_en = formData.get("rankEn")?.toString() || "";
    const rank_hi = formData.get("rankHi")?.toString() || "";
    const service_en = formData.get("serviceEn")?.toString() || "";
    const service_hi = formData.get("serviceHi")?.toString() || "";
    const desc_en = formData.get("descEn")?.toString() || "";
    const desc_hi = formData.get("descHi")?.toString() || "";
    const year = formData.get("year")?.toString();
   

    // Validate required fields
    if (!name_en || !name_hi || !year) {
      return NextResponse.json(
        { error: "Name (EN & HI) and Year are required" },
        { status: 400 }
      );
    }

    // Handle image upload
    const imageFile = formData.get("image");
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { url, key } = await uploadToS3(buffer, imageFile.name, imageFile.type, "results");

    // Create new Result
    const newResult = await ResultModel.create({
      name: { en: name_en, hi: name_hi },
      rank: { en: rank_en, hi: rank_hi },
      service: { en: service_en, hi: service_hi },
      desc: { en: desc_en, hi: desc_hi },
      year,
      active,
      image: { url, key },
    });

    return NextResponse.json(newResult, { status: 201 });
  } catch (err) {
    console.error("Error creating Result:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create Result" },
      { status: 500 }
    );
  }
}