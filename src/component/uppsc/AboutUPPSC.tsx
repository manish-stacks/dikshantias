"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PageContent {
  en?: any;
  hi?: any;
  exam?: string;
  page?: string;
  status?: boolean;
}

export default function AboutUPPSC() {
  const { i18n, t } = useTranslation("common");

  const lang = i18n.language === "hi" ? "hi" : "en";

  const [data, setData] = useState<PageContent | null>(null);

  useEffect(() => {
    fetch("/api/admin/page-content")
      .then((res) => res.json())

      .then((res) => {
        const pageData = res.find(
          (item: PageContent) =>
            item.exam === "UPPSC" &&
            item.page === "About" &&
            item.status === true,
        );

        setData(pageData);
      });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">{data?.[lang]?.title}</h1>

      <p className="text-gray-600 mb-6">{data?.[lang]?.shortContent}</p>

      <div
        dangerouslySetInnerHTML={{
          __html: data?.[lang]?.content || "",
        }}
      />
    </section>
  );
}
