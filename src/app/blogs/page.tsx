import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import BlogPage from "@/component/BlogPage";
import React, { Suspense } from "react";

export const metadata: Metadata = SEO_DATA["/blogs"];


function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPage />
      </Suspense>
    </>
  );
}

export default page;
