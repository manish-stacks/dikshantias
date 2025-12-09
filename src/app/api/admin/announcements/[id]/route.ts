import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";


// PUT update an announcement
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const body = await req.json();
    const updated = await Announcement.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true }
    );

    if (!updated) return NextResponse.json({ success: false, error: "Announcement not found" });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

// DELETE an announcement
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDB();
  try {
    const deleted = await Announcement.findByIdAndDelete(params.id);

    if (!deleted) return NextResponse.json({ success: false, error: "Announcement not found" });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
