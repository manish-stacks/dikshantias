import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ELearningCourse from "@/models/Elearning";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

interface RouteContext<T> {
  params: T;
}

// ---------------- PUT: Update full E-Learning ----------------
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing E-Learning ID" }, { status: 400 });
    }

    const formData = await req.formData();

    const titleEN = formData.get("titleEN") as string;
    const titleHI = formData.get("titleHI") as string;
    const monthYear = formData.get("monthYear") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string) || 1;
    const active = formData.get("active") === "true";

    const enFile = formData.get("fileEN") as File | null;
    const hiFile = formData.get("fileHI") as File | null;

    // Fetch existing record
    const existing = await ELearningCourse.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "E-Learning not found" }, { status: 404 });
    }

    let enUpload = existing.fileLinkEN;
    let hiUpload = existing.fileLinkHI;

    if (enFile) {
      const enBuffer = Buffer.from(await enFile.arrayBuffer());
      const uploadedEN = await uploadToS3(enBuffer, enFile.name, enFile.type, "elearning/en");
      enUpload = { url: uploadedEN.url, key: uploadedEN.key };
    }

    if (hiFile) {
      const hiBuffer = Buffer.from(await hiFile.arrayBuffer());
      const uploadedHI = await uploadToS3(hiBuffer, hiFile.name, hiFile.type, "elearning/hi");
      hiUpload = { url: uploadedHI.url, key: uploadedHI.key };
    }

    const updatedELearning = await ELearningCourse.findByIdAndUpdate(
      id,
      {
        titleEN,
        titleHI,
        monthYear,
        displayOrder,
        active,
        fileLinkEN: enUpload,
        fileLinkHI: hiUpload,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "E-Learning updated successfully", data: updatedELearning },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating ELearning:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update E-Learning" },
      { status: 500 }
    );
  }
}

// ---------------- PATCH: Update only active status ----------------
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDB();

    const { active } = await req.json();
    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "Active must be a boolean" }, { status: 400 });
    }

    const updatedCourse = await ELearningCourse.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: "E-Learning not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Active status updated successfully", data: updatedCourse },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating active status:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update active status" },
      { status: 500 }
    );
  }
}

// ---------------- DELETE: Remove E-Learning and files ----------------
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const { id } = params;

    const existing = await ELearningCourse.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "E-Learning not found" }, { status: 404 });
    }

    // Delete files from S3 if present
    if (existing.fileLinkEN?.key) {
      await deleteFromS3(existing.fileLinkEN.key);
    }
    if (existing.fileLinkHI?.key) {
      await deleteFromS3(existing.fileLinkHI.key);
    }

    await ELearningCourse.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "E-Learning and associated files deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting E-Learning:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete E-Learning" },
      { status: 500 }
    );
  }
}
