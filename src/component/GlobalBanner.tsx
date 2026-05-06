"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import { usePathname } from "next/navigation";

interface BannerData {
  link: string;

  status: boolean;

  desktopBanner: {
    url: string;
  };

  mobileBanner: {
    url: string;
  };
}

export default function GlobalBanner() {
  const pathname =
    usePathname();

  const [banner, setBanner] =
    useState<BannerData | null>(
      null,
    );

  // HIDE ON ADMIN
  if (
    pathname.startsWith(
      "/admin",
    )
  )
    return null;

  // FETCH API
  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner =
    async () => {
      try {
        const res = await fetch(
          "/api/admin/global-banner",
        );

        const data =
          await res.json();

        // ONLY SHOW ACTIVE
        if (data?.status) {
          setBanner(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch banner:",
          error,
        );
      }
    };

  // NO DATA
  if (!banner) return null;

  return (
    <div className="w-full bg-white relative">
      <div className="max-w-7xl mx-auto py-1 px-4">
        
        <Link
          href={banner.link}
          className="block w-full"
        >
          {/* Mobile */}
          <div className="block sm:hidden relative w-full">
            <Image
              src={
                banner
                  .mobileBanner
                  .url
              }
              alt="Mobile Banner"
              width={800}
              height={400}
              className="w-full h-auto rounded-lg shadow-md"
              priority
            />
          </div>

          {/* Desktop */}
          <div className="hidden sm:block relative w-full">
            <Image
              src={
                banner
                  .desktopBanner
                  .url
              }
              alt="Desktop Banner"
              width={1600}
              height={500}
              className="w-full h-auto rounded-xl shadow-md"
              priority
            />
          </div>
        </Link>
      </div>
    </div>
  );
}