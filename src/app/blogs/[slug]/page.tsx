import React from 'react';
import BlogDetails from '@/component/BlogDetails';

interface PageProps {
  params: Promise<{ slug: string }>; // Next.js gives it as a Promise
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params; // ✅ await to unwrap
  return <BlogDetails slug={slug} />;
};

export default Page;
