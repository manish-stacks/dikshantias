import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import AboutUPPSC from "@/component/uppsc/AboutUPPSC";

export const metadata: Metadata = {
  title: SEO_DATA["/about-uppsc"]?.title,

  description: SEO_DATA["/about-uppsc"]?.description,
};

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <AboutUPPSC />
    </div>
  );
}
