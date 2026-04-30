import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import UPPSCPYQMAIN from "@/component/uppsc/UPPSCPYQMAIN";

export const metadata: Metadata = {
  title: SEO_DATA["/uppsc-pyq-main"]?.title,

  description: SEO_DATA["/uppsc-pyq-main"]?.description,
};



export default function Page() {
  return <UPPSCPYQMAIN />;
}
