import { Metadata } from "next";
import parse from "html-react-parser";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPage(slug: string) {
  try {
    const res = await fetch(
      `https://www.dikshantias.com/api/admin/pages?slug=${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const pages = await res.json();

    if (!pages || pages.length === 0) return null;

    const page = pages.find((p: any) => p.slug === slug);

    return page || null;
  } catch (error) {
    console.error("Page fetch error:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: "404 - Page Not Found",
      description: "The requested page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || "",

    keywords: page.metaKeywords || [],

    alternates: {
      canonical: `https://www.dikshantias.com/${page.canonicalUrl || page.slug}`,
    },

    robots: {
      index: page.index ?? true,
      follow: page.follow ?? true,
    },

    openGraph: {
      title: page.ogTitle || page.metaTitle || page.title,
      description: page.ogDescription || page.metaDescription || "",
      url: `https://www.dikshantias.com/${page.slug}`,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: page.ogTitle || page.metaTitle || page.title,
      description: page.ogDescription || page.metaDescription || "",
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {page.image?.url && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-3xl relative">
            <Image
              src={page.image.url}
              alt={page.image.alt || page.title}
              width={800}
              height={450}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 text-gray-900">{page.title}</h1>

      <div className="max-w-none text-gray-800 leading-relaxed space-y-8">
        {parse(page.content || "")}
      </div>
    </div>
  );
}
