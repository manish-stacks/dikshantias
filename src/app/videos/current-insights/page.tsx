import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Currentinsights from "@/component/videos/Currentinsights";

export const metadata: Metadata = {
  title: SEO_DATA["/videos/current-insights"]?.title,

  description: SEO_DATA["/videos/current-insights"]?.description,
};


export default function Page() {
  return <Currentinsights />;
}
