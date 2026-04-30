import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import BPSCPYQ from "@/component/bpsc/BPSCPYQ";

export const metadata: Metadata = {
  title: SEO_DATA["/bpsc-pyq-pre"]?.title,
  description: SEO_DATA["/bpsc-pyq-pre"]?.description,
};



export default function Page() {
  return <BPSCPYQ />;
}