"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function GlobalBanner() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="w-full bg-white relative">
      <div className="max-w-7xl px-3 mx-auto py-1">
        <Link href="/summer-offer" className="block w-full">
          {/* Mobile */}
          <div className="block sm:hidden relative w-full">
            <Image
              src="/img/mobpa.png"
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
              src="/img/webPatti.png"
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
