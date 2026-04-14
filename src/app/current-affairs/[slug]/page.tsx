import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo";
import ReadInHindu from "@/component/currentaffaires/ReadInHindu";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const seoKey =
    `/current-affairs/${params.slug}`;

  return (
    SEO_DATA[seoKey] || {
      title:
        "Current Affairs | Dikshant IAS",
      description:
        "Latest UPSC current affairs updates.",
    }
  );

}

export default function Page() {

  return <ReadInHindu />;

}