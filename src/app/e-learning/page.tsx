import type { Metadata } from "next";

import { SEO_DATA } from "@/lib/seo";

import ELearningPage from "@/component/elearning/ELearningPage";

export const metadata: Metadata = SEO_DATA["/e-learning"];

export default function Page() {
  return <ELearningPage />;
}
