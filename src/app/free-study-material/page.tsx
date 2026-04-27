import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Freestudymaterial from "@/component/special/Freestudymaterial";

export const metadata: Metadata = {
  title: SEO_DATA["/free-study-material"]?.title,

  description: SEO_DATA["/free-study-material"]?.description,
};


export default function Page() {
  return <Freestudymaterial />;
}
    