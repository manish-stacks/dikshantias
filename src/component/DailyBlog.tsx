'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface MultilingualString {
  en: string;
  hi: string;
}

interface Blog {
  _id: string;
  title: MultilingualString;
  slug: string;
  createdAt: string;
}

const DailyBlog = () => {
  const { i18n } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/admin/blogs", {
          cache: "no-store",
        });
        const data = await res.json();

        // sort latest first and take only 4
        const latest = data
          .sort(
            (a: Blog, b: Blog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);

        setBlogs(latest);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  return (
    <section className="py-10 -mt-6 mb-6 md:mt-10 md:mb-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">        
        <div className="grid lg:grid-cols-1">
          <div>
            <div className="bg-red-100 rounded-2xl p-6 shadow-md">
              <h3 className="text-[18px] md:text-3xl font-bold text-[#00072c] mb-6">
                Daily Blog
              </h3>

              <div className="space-y-4">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blogs/${blog.slug}`}
                      className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer group"
                    >
                      <div className="text-red-600 mr-4 mt-1">
                        <TrendingUp className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-[#00072c] group-hover:text-pink-600 transition-colors duration-300">
                          {blog.title[lang]}
                        </h4>
                        <p className="text-sm text-[#081347] mt-1">
                          Daily & Monthly Updates
                        </p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-red-600 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No blogs available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyBlog;
