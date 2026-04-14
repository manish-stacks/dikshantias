import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import OnlineCourse from "@/component/onlinecourse/OnlineCourse";
import React from "react";

export const metadata: Metadata = SEO_DATA["/online-live-course"];

function page() {
  return (
    <>
      <OnlineCourse />
    </>
  );
}

export default page;
