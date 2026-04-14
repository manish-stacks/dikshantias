import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import VideoCourses from "@/component/videocourses/VideoCourses";
import React from "react";

export const metadata: Metadata = SEO_DATA["/video-courses"];


function page() {
  return (
    <>
      <VideoCourses />
    </>
  );
}

export default page;
