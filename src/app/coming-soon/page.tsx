"use client";
import Image from "next/image";
import React from "react";

export default function ComingSoon() {
  return (
    <>
      <div className="container mx-auto px-2 mt-2 md:mt-2 md:px-0">
        <div className="max-w-7xl pb-3 mx-auto">
          <Image
            src="/img/coming-soon.jpg"
            width={1600}
            height={500}
            alt="About Us"
            className="rounded-xl w-full h-auto object-cover"
          />
        </div>
      </div>
    </>
  );
}
