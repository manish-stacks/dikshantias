import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import TestSeriesPage from "@/component/test-series/TestSeries";
import React from "react";

export const metadata: Metadata = SEO_DATA["/test-series"];

const page = () => {
  return <TestSeriesPage />;
};

export default page;
