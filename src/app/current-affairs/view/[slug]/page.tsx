import { Metadata } from "next";
import DetailsClient from "./DetailsClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await fetch(
    `https://www.dikshantias.com/api/admin/current-affairs/${params.slug}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return {
      title: "Current Affair Not Found",
    };
  }

  const data = await res.json();

  return {
    title: data.metaTitle || data.title?.en,
    description: data.metaDescription || "",
    keywords: data.metaKeywords || [],
    robots: {
      index: data.index ?? true,
      follow: data.follow ?? true,
    },
    openGraph: {
      title: data.ogTitle || data.metaTitle || data.title?.en,
      description: data.ogDescription || data.metaDescription || "",
      images: data.image?.url ? [data.image.url] : [],
    },
    alternates: {
      canonical: data.canonicalUrl || "",
    },
  };
}

export default function Page({ params }: Props) {
  return <DetailsClient slug={params.slug} />;
}
