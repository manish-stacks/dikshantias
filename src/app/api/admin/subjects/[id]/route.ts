import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";

// ================= GET SINGLE =================
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const subject = await Subject.findById(params.id);

    return NextResponse.json(subject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ================= UPDATE (FULL + STATUS) =================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const body = await req.json();

    const updated = await Subject.findByIdAndUpdate(
      params.id,
      { $set: body }, 
      { new: true },
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    console.log("PUT Subject error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    await Subject.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
