import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// ================= GET =================

export async function GET() {
  await connectToDB();

  const data = await PageContent.find({}).sort({ exam: 1, page: 1 });

  return NextResponse.json(data);
}

// ================= POST (ADD + UPDATE) =================

export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const id = formData.get("id")?.toString(); // ✅ IMPORTANT
    const exam = formData.get("exam")?.toString();
    const page = formData.get("page")?.toString();
    const status = formData.get("status") === "true";

    console.log("==== POST REQUEST START ====");
    console.log("id:", id);
    console.log("exam:", exam);
    console.log("page:", page);

    if (!exam || !page) {
      return NextResponse.json(
        { error: "Exam and Page required" },
        { status: 400 },
      );
    }

    // ✅ check PYQ
    const isPYQ = page.includes("PYQ");

    // ✅ normalize page
    let dbPage = page;
    if (page === "PYQ_PRE" || page === "PYQ_MAINS") {
      dbPage = "PYQ";
    }

    // ✅ subject
    const subject = isPYQ
      ? formData.get("subject")?.toString().toLowerCase().trim() || ""
      : "";

    // ✅ validate subject
    if (isPYQ && !subject) {
      return NextResponse.json(
        { error: "Subject is required for PYQ" },
        { status: 400 },
      );
    }

    // ✅ safe JSON parse
    let en, hi;
    try {
      en = JSON.parse(formData.get("en") as string);
      hi = JSON.parse(formData.get("hi") as string);
    } catch (err) {
      console.log("JSON parse error:", err);
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    }

    const enPdf = formData.get("en_pdf") as File | null;
    const hiPdf = formData.get("hi_pdf") as File | null;

    // ✅ find existing (for file replace)
    let existing = null;

    if (id) {
      existing = await PageContent.findById(id);
    } else {
      existing = await PageContent.findOne({
        exam,
        page: dbPage,
        subject,
      });
    }

    let enPdfData = existing?.en?.pdf || null;
    let hiPdfData = existing?.hi?.pdf || null;

    // ================= EN PDF =================
    if (enPdf && enPdf.size > 0) {
      const buffer = Buffer.from(await enPdf.arrayBuffer());

      const uploaded = await uploadToS3(
        buffer,
        enPdf.name,
        enPdf.type,
        "page-content",
      );

      if (existing?.en?.pdf?.key) {
        await deleteFromS3(existing.en.pdf.key);
      }

      enPdfData = {
        url: uploaded.url,
        key: uploaded.key,
      };
    }

    // ================= HI PDF =================
    if (hiPdf && hiPdf.size > 0) {
      const buffer = Buffer.from(await hiPdf.arrayBuffer());

      const uploaded = await uploadToS3(
        buffer,
        hiPdf.name,
        hiPdf.type,
        "page-content",
      );

      if (existing?.hi?.pdf?.key) {
        await deleteFromS3(existing.hi.pdf.key);
      }

      hiPdfData = {
        url: uploaded.url,
        key: uploaded.key,
      };
    }

    // ================= SAVE =================
    const data = await PageContent.findOneAndUpdate(
      id
        ? { _id: id } // ✅ update by ID
        : { exam, page: dbPage, subject }, // ✅ insert case
      {
        exam,
        page: dbPage,
        subject,
        status,

        "en.title": en.title || "",
        "en.shortContent": en.shortContent ?? "",
        "en.content": en.content || "",
        "en.pdf": enPdfData,
        "en.videoUrl": en.videoUrl || "",

        "hi.title": hi.title || "",
        "hi.shortContent": hi.shortContent ?? "",
        "hi.content": hi.content || "",
        "hi.pdf": hiPdfData,
        "hi.videoUrl": hi.videoUrl || "",
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("Saved:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log("PageContent POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
