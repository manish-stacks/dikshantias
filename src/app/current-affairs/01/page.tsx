'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface CurrentAffair {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

const OrderedListArrowCards: React.FC = () => {
  const { slug } = useParams();
  const [data, setData] = useState<CurrentAffair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAffair = async () => {
      try {
        const res = await fetch('/api/admin/current-affairs');
        if (!res.ok) throw new Error('Failed to fetch current affairs');
        const allData: CurrentAffair[] = await res.json();

        // find by slug
        const matched = allData.find((item) => item.slug === slug);
        setData(matched || null);
      } catch (error) {
        console.error(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCurrentAffair();
  }, [slug]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!data) {
    return <p className="text-center py-10">No content found.</p>;
  }

  return (
    <div className="px-2 py-6 md:px-8 mb-7 -mt-14 md:mt-3">
      <div className="max-w-7xl mx-auto bg-slate-100 p-6 rounded-xl">
        {/* Title from API */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#00072c] mb-6 text-center md:text-left">
          {data.title}
        </h1>

        {/* Render HTML content safely */}
        <div
          className="prose max-w-none text-blue-950 text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </div>
  );
};

export default OrderedListArrowCards;
