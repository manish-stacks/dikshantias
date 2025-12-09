import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ELearningCourse from "@/models/Elearning";
import { uploadToS3 } from "@/lib/s3";

export async function GET() {
  try {
    await connectToDB();
    const elearnings = await ELearningCourse.find({ active: true }).sort({ displayOrder: 1 });
    return NextResponse.json(elearnings, { status: 200 });
  } catch (error) {
    console.error("Error fetching ELearning:", error);
    return NextResponse.json({ error: "Failed to fetch ELearning" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectToDB();
    const formData = await req.formData();

    const titleEN = formData.get("titleEN") as string;
    const titleHI = formData.get("titleHI") as string;
    const monthYear = formData.get("monthYear") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string) || 1;
    const active = formData.get("active") === "true";

    const enFile = formData.get("fileEN") as File | null;
    const hiFile = formData.get("fileHI") as File | null;

    if (!titleEN || !titleHI || !monthYear || !enFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const enBuffer = Buffer.from(await enFile.arrayBuffer());
    const enUpload = await uploadToS3(enBuffer, enFile.name, enFile.type, "elearning/en");

    let hiUpload;
    if (hiFile) {
      const hiBuffer = Buffer.from(await hiFile.arrayBuffer());
      hiUpload = await uploadToS3(hiBuffer, hiFile.name, hiFile.type, "elearning/hi");
    }

    const newELearning = await ELearningCourse.create({
      titleEN,
      titleHI,
      monthYear,
      displayOrder,
      active,
      fileLinkEN: { url: enUpload.url, key: enUpload.key },
      fileLinkHI: hiUpload ? { url: hiUpload.url, key: hiUpload.key } : undefined,
    });

    return NextResponse.json(
      { message: "E-Learning created successfully", data: newELearning },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error creating ELearning:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create E-Learning" },
      { status: 500 }
    );
  }
}

