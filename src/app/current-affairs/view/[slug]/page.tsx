'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
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

export default function CurrentAffairDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { i18n } = useTranslation();
    const lang = (i18n.resolvedLanguage || i18n.language) as "en" | "hi";

    const [item, setItem] = useState<CurrentAffairItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAffair() {
            try {
                const res = await fetch("/api/admin/current-affairs");
                const all: CurrentAffairItem[] = await res.json();

                const match = all.find((x) => x.slug === slug);
                setItem(match || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchAffair();
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl px-4 py-10 animate-pulse">
                <div className="mb-6 h-10 w-40 bg-gray-200 rounded"></div>
                <div className="h-64 w-full bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!item) return <p className="py-10 text-center">No content found.</p>;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-10">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition"
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
