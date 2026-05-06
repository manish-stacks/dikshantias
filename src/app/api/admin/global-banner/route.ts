import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import GlobalBanner from "@/models/GlobalBanner";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// GET GLOBAL BANNER
export async function GET(req: Request) {
  try {
    await connectToDB();

    const url = new URL(req.url);

    const isAdmin = url.pathname.includes("/api/admin/");

    let banner;

    // ADMIN
    if (isAdmin) {
      banner = await GlobalBanner.findOne();
    }

    // FRONTEND
    else {
      banner = await GlobalBanner.findOne({
        status: true,
      });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching global banner:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch global banner",
      },
      {
        status: 500,
      },
    );
  }
}

// CREATE / UPDATE GLOBAL BANNER
export async function POST(req: Request) {
  try {
    await connectToDB();

    const formData = await req.formData();

    const link = formData.get("link") as string;

    const status = formData.get("status") === "true";

    const desktopBanner = formData.get("desktopBanner") as File | null;

    const mobileBanner = formData.get("mobileBanner") as File | null;

    // OLD BANNER
    const existingBanner = await GlobalBanner.findOne();

    let desktopData = existingBanner?.desktopBanner;

    let mobileData = existingBanner?.mobileBanner;

    // DESKTOP UPLOAD
    if (desktopBanner) {
      // DELETE OLD
      if (existingBanner?.desktopBanner?.key) {
        await deleteFromS3(existingBanner.desktopBanner.key);
      }

      const buffer = Buffer.from(await desktopBanner.arrayBuffer());

      const uploaded = await uploadToS3(
        buffer,
        desktopBanner.name,
        desktopBanner.type,
        "global-banner",
      );

      desktopData = {
        url: uploaded.url,
        key: uploaded.key,
      };
    }

    // MOBILE UPLOAD
    if (mobileBanner) {
      // DELETE OLD
      if (existingBanner?.mobileBanner?.key) {
        await deleteFromS3(existingBanner.mobileBanner.key);
      }

      const buffer = Buffer.from(await mobileBanner.arrayBuffer());

      const uploaded = await uploadToS3(
        buffer,
        mobileBanner.name,
        mobileBanner.type,
        "global-banner",
      );

      mobileData = {
        url: uploaded.url,
        key: uploaded.key,
      };
    }

    let banner;

    // UPDATE EXISTING
    if (existingBanner) {
      banner = await GlobalBanner.findByIdAndUpdate(
        existingBanner._id,
        {
          link,
          desktopBanner: desktopData,
          mobileBanner: mobileData,
          status,
        },
        {
          new: true,
        },
      );
    }

    // CREATE NEW
    else {
      banner = await GlobalBanner.create({
        link,

        desktopBanner: desktopData,

        mobileBanner: mobileData,

        status,
      });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error saving global banner:", error);

    return NextResponse.json(
      {
        error: "Failed to save global banner",
      },
      {
        status: 500,
      },
    );
  }
}

// UPDATE STATUS
export async function PATCH(req: Request) {
  try {
    await connectToDB();

    const body = await req.json();

    const banner = await GlobalBanner.findOne();

    if (!banner) {
      return NextResponse.json(
        {
          error: "Banner not found",
        },
        {
          status: 404,
        },
      );
    }

    const updatedBanner = await GlobalBanner.findByIdAndUpdate(
      banner._id,
      {
        status: body.status,
      },
      {
        new: true,
      },
    );

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Error updating status:", error);

    return NextResponse.json(
      {
        error: "Failed to update status",
      },
      {
        status: 500,
      },
    );
  }
}
