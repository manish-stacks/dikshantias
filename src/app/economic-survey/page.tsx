import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Economicsurvey from "@/component/special/Economicsurvey";

export const metadata: Metadata = {
  title: SEO_DATA["/economic-survey"]?.title,

  description: SEO_DATA["/economic-survey"]?.description,
};


export default function Page() {
  return <Economicsurvey/>;
}
