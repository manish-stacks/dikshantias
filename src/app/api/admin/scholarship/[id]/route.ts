import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Scholarship from "@/models/Scholarship";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDB();

    const deleted = await Scholarship.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Scholarship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Scholarship deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete scholarship error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete scholarship" },
      { status: 500 }
    );
  }
}
