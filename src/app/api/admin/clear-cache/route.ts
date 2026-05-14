import { NextResponse } from "next/server";
import {
  revalidatePath,
  revalidateTag,
} from "next/cache";

export async function POST() {
  try {
    // Pages
    revalidatePath("/");

    // API Cache
    revalidateTag("popup-data");
    revalidateTag("global-banner");

    return NextResponse.json({
      success: true,
      message: "Website cache cleared successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cache",
      },
      { status: 500 }
    );
  }
}