  import type { Metadata } from "next";
  import { SEO_DATA } from "@/lib/seo";
  import React from 'react';
  import ReadInHindu from '@/component/currentaffaires/ReadInHindu';

  export const metadata: Metadata = SEO_DATA["/current-affairs"];

  const CurrentAffairsPage = () => {
    return <ReadInHindu />;
  };

  export default CurrentAffairsPage;
