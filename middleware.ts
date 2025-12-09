import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

// Protect admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
