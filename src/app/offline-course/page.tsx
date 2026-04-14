
import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import OfflineCourse from "@/component/offlinecourse/OfflineCourse";
import React from "react";

export const metadata: Metadata = SEO_DATA["/offline-course"];

function page() {
  return (
    <>
      <OfflineCourse />
    </>
  );
}

export default page;