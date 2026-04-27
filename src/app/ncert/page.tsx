import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Ncert from "@/component/special/Ncert";

export const metadata: Metadata = {
  title: SEO_DATA["/ncert"]?.title,

  description: SEO_DATA["/ncert"]?.description,
};


export default function Page() {
  return <Ncert />;
}
