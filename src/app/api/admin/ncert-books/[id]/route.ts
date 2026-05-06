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

      const pdfFile =
        formData.get(
          `pdf_${i}`,
        ) as File | null;

      let pdfUrl =
        subject.pdf || "";

      // NEW PDF UPLOAD
      if (pdfFile) {
        const buffer =
          Buffer.from(
            await pdfFile.arrayBuffer(),
          );

        const uploaded =
          await uploadToS3(
            buffer,
            pdfFile.name,
            pdfFile.type,
            "ncert-pdfs",
          );

        pdfUrl = uploaded.url;
      }

      uploadedSubjects.push({
        subjectName:
          subject.subjectName,
        pdf: pdfUrl,
      });
    }

    const updatedBook =
      await NCERTBook.findByIdAndUpdate(
        params.id,
        {
          className,
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