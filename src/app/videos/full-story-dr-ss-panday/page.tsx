import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import Storydrsspanday from "@/component/videos/Storydrsspanday";

export const metadata: Metadata = {
  title: SEO_DATA["/videos/full-story-dr-ss-panday"]?.title,

  description: SEO_DATA["/videos/full-story-dr-ss-panday"]?.description,
};


export default function Page() {
  return <Storydrsspanday />;
}
