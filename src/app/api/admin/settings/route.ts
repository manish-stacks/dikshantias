import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import WebSettings from "@/models/WebSettingsModel";


// GET all WebSettings
export async function GET() {
  try {
    await connectToDB();
    const Web = await WebSettings.find();
    return NextResponse.json(Web);
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
  }
}


