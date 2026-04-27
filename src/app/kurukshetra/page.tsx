import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Kurukshetra from "@/component/special/Kurukshetra";

export const metadata: Metadata = {
  title: SEO_DATA["/kurukshetra"]?.title,

  description: SEO_DATA["/kurukshetra"]?.description,
};


export default function Page() {
  return <Kurukshetra />;
}
