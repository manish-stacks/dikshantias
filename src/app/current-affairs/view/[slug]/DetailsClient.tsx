"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import HinduDetails from "@/app/current-affairs/HinduDetails";
import { ArrowLeft } from "lucide-react";

interface CurrentAffairItem {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  content?: { en: string; hi: string };
  image?: { url: string };
  imageAlt?: string;
}

export default function DetailsClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language) as "en" | "hi";

  const [item, setItem] = useState<CurrentAffairItem | null>(null);

  useEffect(() => {
    async function fetchAffair() {
      const res = await fetch(`/api/admin/current-affairs/${slug}`);
      const data = await res.json();
      setItem(data);
    }

    if (slug) fetchAffair();
  }, [slug]);

  if (!item) return <p className="py-10 text-center">Loading...</p>;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg"
        style={{ backgroundColor: "#E94E4E", color: "#FFFFFF" }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <HinduDetails
        title={item.title?.[lang]}
        content={item.content?.[lang]}
        imageUrl={item.image?.url}
        imageAlt={item.imageAlt}
      />
    </div>
  );
}
