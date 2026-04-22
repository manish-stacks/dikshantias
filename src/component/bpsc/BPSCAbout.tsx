"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPageContent } from "@/lib/getPageContent";

export default function BPSCAbout() {
  const { i18n } = useTranslation();

  const lang = i18n.language === "hi" ? "hi" : "en";

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPageContent("BPSC", "About").then(setData);
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
