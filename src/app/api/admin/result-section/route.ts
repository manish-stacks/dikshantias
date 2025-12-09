import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongodb";
import ResultSection from "@/models/ResultSection"

// GET result section content
export async function GET() {
  await connectToDB()
  const section = await ResultSection.findOne()
  return NextResponse.json(section)
}


// PUT update section
export async function PUT(req: Request) {
  await connectToDB()
  const body = await req.json()
  const updated = await ResultSection.findOneAndUpdate({}, body, { new: true, upsert: true })
  return NextResponse.json(updated)
}
