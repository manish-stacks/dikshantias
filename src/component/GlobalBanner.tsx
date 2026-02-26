"use client";

import Link from "next/link";
import Image from "next/image";

export default function GlobalBanner() {
  return (
    <div className="w-full bg-white border-gray-200">
      <div className="max-w-7xl mx-auto px-3 py-3">
        <Link href="/holi-offer" className="block">
          <Image
            src="/img/holi-banner.png"
            alt="Holi Offer"
            width={1600}
            height={500}
            priority
            className="w-full h-auto rounded-xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          />
        </Link>
      </div>
    </div>
  );
}
