'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, User } from 'lucide-react';
import Image from 'next/image';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

interface MultilingualString {
  en: string;
  hi: string;
}

interface Blog {
  _id: string;
  title: MultilingualString;
  slug: string;
  content: MultilingualString;
  image: { url: string; alt: string };
  category: { _id: string; name: string; slug: string };
  tags: string[];
  postedBy: MultilingualString;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface BlogDetailsProps {
  slug: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const { i18n } = useTranslation('common');

  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await fetch('/api/admin/blogs');
        const blogs: Blog[] = await blogsRes.json();
        const currentBlog = blogs.find(b => b.slug === slug) || null;
        setBlog(currentBlog);

        const categoriesRes = await fetch('/api/admin/blog-categories');
        const categoriesData: Category[] = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen -mt-14 md:mt-3 p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Main Skeleton */}
        <main className="flex-1 space-y-4">
          <Skeleton height={400} borderRadius={12} />
          <Skeleton height={40} width={`70%`} />
          <Skeleton height={20} width={`40%`} />
          <Skeleton count={5} />
        </main>

        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-67 space-y-5">
          <Skeleton height={40} width={`50%`} />
          <Skeleton count={6} />
          <Skeleton height={40} width={`50%`} className="mt-4" />
          <Skeleton count={3} />
        </aside>
      </div>
    );
  }

  if (!blog) return <p className="text-center py-10 text-red-600">Blog not found</p>;

  // pick the current language
  const lang = i18n.language === 'hi' ? 'hi' : 'en';
  const cleanHTML = DOMPurify.sanitize(blog.content[lang], { USE_PROFILES: { html: true } });

  return (
    <div className="bg-white min-h-screen -mt-14 md:mt-3">
      <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row gap-8 px-2 md:px-0">
        {/* Main Content */}
        <main className="flex-1">
          <div className="pt-1 pb-1 rounded-lg mb-4 overflow-hidden">
            <Image
              src={blog.image.url}
              width={1500}
              height={400}
              alt={blog.image.alt || 'Blog Image'}
              className="rounded-xl"
            />
          </div>

          <h1 className="font-bold text-xl md:text-3xl text-[#040c33]">{blog.title[lang]}</h1>

          <div className="flex items-center gap-4 text-sm text-blue-900 mb-4">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.postedBy[lang]}</span>
            </div>
          </div>

          <div  className="
            max-w-none text-gray-800 leading-relaxed space-y-8
            [&>h1]:text-3xl [&>h1]:mt-10 [&>h1]:mb-6
            [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-5
            [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-4
            [&>p]:mb-6
            [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6
            [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6
            [&>li]:mb-3
            [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6
            [&>img]:rounded-lg [&>img]:my-8
          ">{parse(cleanHTML)}</div>
        </main>

        {/* Sidebar */}
        <aside className="w-full md:w-67 sticky top-6 h-fit space-y-5">
          <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#040c33]">Categories</h2>
            <ul className="space-y-2 text-blue-950">
              <li className="cursor-pointer" onClick={() => router.push('/blogs')}>
                All
              </li>
              {categories.map(cat => (
                <li
                  key={cat._id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/blogs/category/${cat.slug}`)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-[#040c33]">Tags</h2>
            <div className="flex flex-wrap gap-2 text-blue-950">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-50 px-2 py-1 rounded shadow-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetails;
