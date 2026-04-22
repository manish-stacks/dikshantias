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

    const exam = formData.get("exam")?.toString();
    const page = formData.get("page")?.toString();
    const status = formData.get("status") === "true";

    if (!exam || !page) {
      return NextResponse.json(
        { error: "Exam and Page required" },
        { status: 400 },
      );
    }

    const en = JSON.parse(formData.get("en") as string);
    const hi = JSON.parse(formData.get("hi") as string);

    console.log("EN DATA =>", en);
    console.log("HI DATA =>", hi);

    

    const enPdf = formData.get("en_pdf") as File | null;
    const hiPdf = formData.get("hi_pdf") as File | null;

    // find existing
    const existing = await PageContent.findOne({ exam, page });

    let enPdfData = existing?.en?.pdf || null;
    let hiPdfData = existing?.hi?.pdf || null;

    // upload EN pdf
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

    // upload HI pdf
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

    // SAVE / UPDATE

   const data = await PageContent.findOneAndUpdate(
     { exam, page },
     {
       exam,
       page,
       status,

       "en.title": en.title || "",
       "en.shortContent": en.shortContent ?? "",
       "en.content": en.content || "",
       "en.pdf": enPdfData,

       "hi.title": hi.title || "",
       "hi.shortContent": hi.shortContent ?? "",
       "hi.content": hi.content || "",
       "hi.pdf": hiPdfData,
     },
     {
       upsert: true,
       new: true,
     },
   );

    return NextResponse.json(data);
  } catch (error: any) {
    console.log("PageContent POST error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
