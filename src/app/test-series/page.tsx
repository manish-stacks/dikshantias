import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import React from "react";
import TestSeriesPage from "@/component/test-series/TestSeries";

export const metadata: Metadata = SEO_DATA["/test-series"];

const page = () => {
  return <TestSeriesPage />;
};

export default page;
