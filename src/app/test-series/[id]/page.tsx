import TestSeriesDetailPage from "@/component/test-series/TestSeriesDetailPage";
import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <TestSeriesDetailPage slug={params?.id} />
};

export default Page;