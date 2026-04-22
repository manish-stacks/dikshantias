import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import BPSCSyllabus from "@/component/bpsc/BPSCSyllabus";


export const metadata: Metadata = {
  title: SEO_DATA["/bpsc-syllabus"].title,

  description: SEO_DATA["/bpsc-syllabus"].description,
};



export default function Page() {
  return <BPSCSyllabus />;
}
