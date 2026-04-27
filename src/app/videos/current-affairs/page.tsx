import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Currentaffairs from "@/component/videos/Currentaffairs";

export const metadata: Metadata = {
  title: SEO_DATA["/videos/current-affairs"]?.title,

  description: SEO_DATA["/videos/current-affairs"]?.description,
};


export default function Page() {
  return <Currentaffairs />;
}
