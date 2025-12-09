import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET() {
  await connectToDB();
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

export async function POST(req: Request) {
  await connectToDB();
  try {
    const body = await req.json();
    const announcement = new Announcement(body);
    await announcement.save();
    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
