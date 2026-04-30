import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import BPSCPYQMAIN from "@/component/bpsc/BPSCPYQMAIN";

export const metadata: Metadata = {
  title: SEO_DATA["/bpsc-pyq-main"]?.title,
  description: SEO_DATA["/bpsc-pyq-main"]?.description,
};



export default function Page() {
  return <BPSCPYQMAIN />;
}