import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetails from "@/component/BlogDetails";

interface PageProps {
  params: { slug: string };
}

async function getBlog(slug: string) {
  const res = await fetch(`https://www.dikshantias.com/api/admin/blogs`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const blogs = await res.json();

  return blogs.find((b: any) => b.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: blog.metaTitle || blog.title?.en,
    description: blog.metaDescription || "",
    keywords: blog.metaKeywords || [],

    alternates: {
      canonical:
        blog.canonicalUrl || `https://www.dikshantias.com/blogs/${blog.slug}`,
    },

    robots: {
      index: blog.index ?? true,
      follow: blog.follow ?? true,
    },

    openGraph: {
      title: blog.ogTitle || blog.metaTitle,
      description: blog.ogDescription || blog.metaDescription,
      url: `https://www.dikshantias.com/blogs/${blog.slug}`,
      type: "article",
      images: [
        {
          url: blog.image?.url,
          alt: blog.image?.alt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.ogTitle || blog.metaTitle,
      description: blog.ogDescription || blog.metaDescription,
      images: [blog.image?.url],
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetails slug={params.slug} />;
};

export default Page;
