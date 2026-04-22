import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import BPSCAbout from "@/component/bpsc/BPSCAbout";

export const metadata: Metadata = {
  title: SEO_DATA["/about-bpsc"]?.title,
  description: SEO_DATA["/about-bpsc"]?.description,
};

export default function Page() {
  return <BPSCAbout />;
}
