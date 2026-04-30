import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import UPPSCPYQ from "@/component/uppsc/UPPSCPYQ";

export const metadata: Metadata = {
  title: SEO_DATA["/uppsc-pyq-pre"]?.title,

  description: SEO_DATA["/uppsc-pyq-pre"]?.description,
};



export default function Page() {
  return <UPPSCPYQ />;
}
