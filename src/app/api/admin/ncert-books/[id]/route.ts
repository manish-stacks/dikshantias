import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import NCERTBook from "@/models/NCERTBook";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// UPDATE NCERT BOOK
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
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

    const updatedBook =
      await NCERTBook.findByIdAndUpdate(
        params.id,
        {
          className,

          classNameHindi,

          subjects:
            uploadedSubjects,

          status,
        },
        {
          new: true,
        },
      );

    return NextResponse.json(
      updatedBook,
    );
  } catch (error) {
    console.error(
      "Error updating NCERT book:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update NCERT book",
      },
      {
        status: 500,
      },
    );
  }
}



 // UPDATE STATUS
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const body = await req.json();

    const updatedBook =
      await NCERTBook.findByIdAndUpdate(
        params.id,
        {
          status: body.status,
        },
        {
          new: true,
        },
      );

    if (!updatedBook) {
      return NextResponse.json(
        {
          error:
            "NCERT Book not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      updatedBook,
    );
  } catch (error) {
    console.error(
      "Error updating status:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update status",
      },
      {
        status: 500,
      },
    );
  }
}


// DELETE NCERT BOOK
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    // FIND BOOK
    const book =
      await NCERTBook.findById(
        params.id,
      );

    if (!book) {
      return NextResponse.json(
        {
          error:
            "NCERT Book not found",
        },
        {
          status: 404,
        },
      );
    }

    // DELETE PDFs FROM S3
    for (const subject of book.subjects) {
      if (
        subject.pdf &&
        subject.pdf.includes(
          ".amazonaws.com/",
        )
      ) {
        const key =
          subject.pdf.split(
            ".amazonaws.com/",
          )[1];

        await deleteFromS3(key);
      }
    }

    // DELETE DATABASE RECORD
    await NCERTBook.findByIdAndDelete(
      params.id,
    );

    return NextResponse.json({
      message:
        "NCERT Book deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting NCERT book:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete NCERT book",
      },
      {
        status: 500,
      },
    );
  }
}