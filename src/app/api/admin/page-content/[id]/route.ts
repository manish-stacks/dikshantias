import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

// UPDATE STATUS
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const body = await req.json();

    const updated = await PageContent.findByIdAndUpdate(
      params.id,

      body,

      { new: true },
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },

      { status: 500 },
    );
  }
}

// DELETE PAGE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    await PageContent.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "Deleted",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
