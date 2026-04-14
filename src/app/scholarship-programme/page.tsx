import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import ScholarshipPage from "./ScholarshipPage";

export const metadata: Metadata = SEO_DATA["/scholarship-programme"];

export default function Page() {
  return <ScholarshipPage />;
}
