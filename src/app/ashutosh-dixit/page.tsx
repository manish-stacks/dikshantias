import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import AshutoshDixit from "@/component/AshutoshDixit";
import React from "react";

export const metadata: Metadata = SEO_DATA["/ashutosh-dixit"];

function page() {
  return (
    <>
      <AshutoshDixit />
    </>
  );
}

export default page;
