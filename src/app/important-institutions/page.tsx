import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Importantinstitutions from "@/component/special/Importantinstitutions";

export const metadata: Metadata = {
  title: SEO_DATA["/important-institutions"]?.title,

  description: SEO_DATA["/important-institutions"]?.description,
};


export default function Page() {
  return <Importantinstitutions />;
}
