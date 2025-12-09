import { NextResponse } from "next/server";
import type { RouteContext } from "next";
import { connectToDB } from "@/lib/mongodb";
import ResultModel from "@/models/ResultModel";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// GET single result
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();
    const result = await ResultModel.findById(id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

  // UPDATE result (with optional image upload)
export async function PUT(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    await connectToDB();

    const formData = await request.formData();

    console.log("Form Data Received for Update:", formData);
    const id = context.params.id;

    // ✅ Get multilingual fields
    const name_en = formData.get("name_en")?.toString();
    const name_hi = formData.get("name_hi")?.toString();

    const rank_en = formData.get("rank_en")?.toString();
    const rank_hi = formData.get("rank_hi")?.toString();

    const service_en = formData.get("service_en")?.toString();
    const service_hi = formData.get("service_hi")?.toString();
   

    const year = formData.get("year")?.toString();

    const imageFile = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json({ error: "Result ID is required" }, { status: 400 });
    }

    const existingResult = await ResultModel.findById(id);
    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // ✅ Handle image update
    let updatedImage = existingResult.image;
    if (imageFile && imageFile.size > 0) {
      if (existingResult.image?.key) {
        await deleteFromS3(existingResult.image.key);
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadedImage = await uploadToS3(
        buffer,
        imageFile.name,
        imageFile.type,
        "results"
      );

      updatedImage = {
        url: uploadedImage.url,
        key: uploadedImage.key,
      };
    }

    // ✅ Update multilingual fields properly
     const updatedResult = await ResultModel.findByIdAndUpdate(
      id,
      {
        name: {
          en: name_en ?? existingResult.name.en,
          hi: name_hi ?? existingResult.name.hi,
        },
        rank: {
          en: rank_en ?? existingResult.rank.en,
          hi: rank_hi ?? existingResult.rank.hi,
        },
        service: {
          en: service_en ?? existingResult.service.en,
          hi: service_hi ?? existingResult.service.hi,
        },
        year: year ?? existingResult.year,
        image: updatedImage,
      },
      { new: true }
    );
    return NextResponse.json(updatedResult, { status: 200 });
  } catch (error) {
    console.error("Error updating Result:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update Result" },
      { status: 500 }
    );
  }
}


// UPDATE Result active status
export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const { active } = await request.json();
    const result = await ResultModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update active Result:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE result
export async function DELETE(
  request: Request,
  context: RouteContext<{ id: string }>
) {
  try {
    const { id } = context.params;
    await connectToDB();

    const result = await ResultModel.findById(id);
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Delete image from S3
    if (result.image?.key) {
      await deleteFromS3(result.image.key);
    }

    await ResultModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Failed to delete result:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
