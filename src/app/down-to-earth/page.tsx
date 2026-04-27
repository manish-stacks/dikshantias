import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Downtoearth from "@/component/special/Downtoearth";

export const metadata: Metadata = {
  title: SEO_DATA["/down-to-earth"]?.title,

  description: SEO_DATA["/down-to-earth"]?.description,
};


export default function Page() {
  return <Downtoearth />;
}
