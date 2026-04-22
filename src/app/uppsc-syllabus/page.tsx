import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import UPPSCSyllabus from "@/component/uppsc/UPPSCSyllabus";

export const metadata: Metadata = {
  title: SEO_DATA["/uppsc-syllabus"]?.title,

  description: SEO_DATA["/uppsc-syllabus"]?.description,
};


export default function Page() {
  return <UPPSCSyllabus />;
}
