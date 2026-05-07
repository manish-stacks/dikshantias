import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import NCERTBook from "@/models/NCERTBook";
import { uploadToS3 } from "@/lib/s3";

// GET ALL NCERT BOOKS
export async function GET() {
  try {
    await connectToDB();

    const books = await NCERTBook.find({
      status: true,
    }).sort({
      className: 1,
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error(
      "Error fetching NCERT books:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch NCERT books",
      },
      {
        status: 500,
      },
    );
  }
}

// CREATE NCERT BOOK
export async function POST(
  req: Request,
) {
  try {
    await connectToDB();

    const formData =
      await req.formData();

    const className =
      formData.get("className");

    const classNameHindi =
      formData.get(
        "classNameHindi",
      );

    const status =
      formData.get("status") ===
      "true";

    const subjectsData =
      formData.get("subjects");

    if (
      !className ||
      !subjectsData
    ) {
      return NextResponse.json(
        {
          error:
            "Class and subjects are required",
        },
        {
          status: 400,
        },
      );
    }

    const parsedSubjects =
      JSON.parse(
        subjectsData as string,
      );

    const uploadedSubjects = [];

    for (
      let i = 0;
      i < parsedSubjects.length;
      i++
    ) {
      const subject =
        parsedSubjects[i];

      // ENGLISH PDF
      const englishPdfFile =
        formData.get(
          `englishPdf_${i}`,
        ) as File | null;

      // HINDI PDF
      const hindiPdfFile =
        formData.get(
          `hindiPdf_${i}`,
        ) as File | null;

      let englishPdfUrl =
        subject.englishPdf || "";

      let hindiPdfUrl =
        subject.hindiPdf || "";

      // ENGLISH PDF UPLOAD
      if (englishPdfFile) {
        const buffer =
          Buffer.from(
            await englishPdfFile.arrayBuffer(),
          );

        const uploaded =
          await uploadToS3(
            buffer,
            englishPdfFile.name,
            englishPdfFile.type,
            "ncert-pdfs",
          );

        englishPdfUrl =
          uploaded.url;
      }

      // HINDI PDF UPLOAD
      if (hindiPdfFile) {
        const buffer =
          Buffer.from(
            await hindiPdfFile.arrayBuffer(),
          );

        const uploaded =
          await uploadToS3(
            buffer,
            hindiPdfFile.name,
            hindiPdfFile.type,
            "ncert-pdfs",
          );

        hindiPdfUrl =
          uploaded.url;
      }

      uploadedSubjects.push({
        // OLD FIELD
        subjectName:
          subject.subjectName,

        pdf:
          englishPdfUrl ||
          subject.pdf ||
          "",

        // NEW FIELD
        subjectNameHindi:
          subject.subjectNameHindi ||
          "",

        englishPdf:
          englishPdfUrl,

        hindiPdf:
          hindiPdfUrl,
      });
    }

    const newBook =
      await NCERTBook.create({
        className,

        classNameHindi,

        subjects:
          uploadedSubjects,

        status,
      });

    return NextResponse.json(
      newBook,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Error creating NCERT book:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create NCERT book",
      },
      {
        status: 500,
      },
    );
  }
}