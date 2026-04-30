import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";

import UPSCPYQ from "@/component/upsc/UPSCPYQ";

export const metadata: Metadata = {
  title: SEO_DATA["/upsc-pyq-pre"].title,

  description: SEO_DATA["/upsc-pyq-pre"].description,
};

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <UPSCPYQ />
    </div>
  );
}
