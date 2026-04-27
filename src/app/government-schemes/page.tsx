import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Governmentschemes from "@/component/special/Governmentschemes";

export const metadata: Metadata = {
  title: SEO_DATA["/government-schemes"]?.title,

  description: SEO_DATA["/government-schemes"]?.description,
};


export default function Page() {
  return <Governmentschemes />;
}
