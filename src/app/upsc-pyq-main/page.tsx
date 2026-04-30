import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";

import UPSCPYQMAIN from "@/component/upsc/UPSCPYQMAIN";

export const metadata: Metadata = {
  title: SEO_DATA["/upsc-pyq-main"].title,

  description: SEO_DATA["/upsc-pyq-main"].description,
};

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <UPSCPYQMAIN />
    </div>
  );
}
