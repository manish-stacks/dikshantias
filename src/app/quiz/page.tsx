import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import AllQuizzes from "@/component/quiz/Quiz";
import React from "react";

export const metadata: Metadata = SEO_DATA["/quiz"];


const page = () => {
  return <AllQuizzes />;
};

export default page;
