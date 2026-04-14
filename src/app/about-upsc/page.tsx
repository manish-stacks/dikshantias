import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import AboutUPSC from "@/component/aboutupsc/AboutUPSC";

export const metadata: Metadata = SEO_DATA["/about-upsc"];

export default function Page() {
  return <AboutUPSC />;
}
