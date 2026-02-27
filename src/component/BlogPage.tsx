"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortContent: string;
  image: { url: string; alt: string };
  category: { _id: string; name: string; slug: string };
  createdAt: string;
  tags?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation("common");

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await fetch("/api/admin/blogs");
        const categoriesRes = await fetch("/api/admin/blog-categories");
        const blogsData = await blogsRes.json();
        const categoriesData = await categoriesRes.json();
        setBlogs(blogsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            <Skeleton height={180} className="rounded-lg" />
            <div className="mt-3 w-24">
              <Skeleton height={20} />
            </div>
            <div className="mt-3">
              <Skeleton width={`90%`} height={22} />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Skeleton width={60} height={18} />
              <Skeleton width={80} height={18} />
            </div>
            <div className="mt-3">
              <Skeleton count={2} />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Skeleton height={36} borderRadius={8} />
              <Skeleton height={20} width={`50%`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter blogs by category slug
  const displayedBlogs = categorySlug
    ? blogs.filter((blog) => blog.category.slug === categorySlug)
    : blogs;

  return (
    <div className="bg-white min-h-screen mt-1 md:mt-1">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-blue-50 px-5 pt-1 pb-1 rounded-lg mb-4">
            <h1 className="text-3xl font-bold mb-2 text-[#040c33]">Blogs</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayedBlogs.map((blog) => (
              <div key={blog._id} className="bg-red-50 p-4 rounded-lg">
                <Image
                  src={blog.image.url}
                  alt={blog.image.alt || "Blog Image"}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-lg font-semibold mt-2 text-[#040c33]">
                  {i18n.language === "hi" ? blog.title.hi : blog.title.en}
                </h3>

                <p className="text-blue-950 mt-2 line-clamp-3">
                  {i18n.language === "hi"
                    ? blog.shortContent.hi
                    : blog.shortContent.en}
                </p>

                <p className="text-blue-800 text-sm mt-2">
                  {blog.category.name} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-red-600 mt-2 inline-block"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-full md:w-67 sticky top-6 h-fit space-y-5">
          {/* Categories */}
          <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#040c33]">
              Categories
            </h2>
            <ul className="space-y-2 text-blue-950">
              <li
                className={`cursor-pointer ${!categorySlug ? "font-bold" : ""}`}
                onClick={() => router.push("/blogs")}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className={`cursor-pointer ${categorySlug === cat.slug ? "font-bold text-red-600" : ""}`}
                  onClick={() => router.push(`/blogs?category=${cat.slug}`)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          {/* <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-[#040c33]">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {blogs.flatMap(blog => blog.tags || []).map((tag, idx) => (
                <span key={idx} className="bg-gray-50 px-2 py-1 rounded shadow-md text-blue-950">{tag}</span>
              ))}
            </div>
          </div> */}
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;
