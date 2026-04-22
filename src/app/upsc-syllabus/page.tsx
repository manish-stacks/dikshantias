import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";

import UPSCSyllabusClient from "@/component/upsc/UPSCSyllabusClient";

export const metadata: Metadata = {
  title: SEO_DATA["/upsc-syllabus"].title,

  description: SEO_DATA["/upsc-syllabus"].description,
};

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <UPSCSyllabusClient />
    </div>
  );
}
