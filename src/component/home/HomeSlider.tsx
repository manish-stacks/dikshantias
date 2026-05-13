"use client";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

interface SliderItem {
  _id: string;
  title: string;
  type: string;
  displayOrder: number;
  active: boolean;
  image: {
    url: string;
  };
}

export default function HomeSlider({
  sliderType,
}: {
  sliderType: "Desktop" | "Mobile";
}) {

  const [
    sliders,
    setSliders,
  ] = useState<SliderItem[]>([]);

  // =========================
  // Fetch Sliders
  // =========================

  useEffect(() => {

    let ignore = false;

    async function fetchSliders() {

      try {

        const res = await fetch(
          "/api/admin/sliders",
          {
            cache: "force-cache",
          }
        );

        const data: SliderItem[] =
          await res.json();

        if (ignore) return;

        const filtered = data
          .filter(
            (s) =>
              s.type === sliderType &&
              s.active
          )
          .sort(
            (a, b) =>
              a.displayOrder -
              b.displayOrder
          );

        setSliders(filtered);

      } catch (error) {

        console.error(
          "Failed to load sliders:",
          error
        );

      }

    }

    fetchSliders();

    return () => {
      ignore = true;
    };

  }, [sliderType]);

  // =========================
  // Skeleton Loader
  // =========================

  if (!sliders.length) {

    return (
      <div className="w-full h-[220px] md:h-[500px] bg-gray-100 animate-pulse rounded-xl" />
    );

  }

  return (
    <Swiper

      modules={[
        Autoplay,
        Pagination,
      ]}

      slidesPerView={1}

      spaceBetween={20}

      // =========================
      // Performance Optimizations
      // =========================

      preloadImages={false}

      lazyPreloadPrevNext={1}

      observer

      observeParents

      resizeObserver

      updateOnWindowResize

      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}

      pagination={{
        clickable: true,
      }}

      className="md:rounded-xl rounded-lg"
    >

      {sliders.map(
        (slide, index) => (

          <SwiperSlide
            key={`${sliderType}-${slide._id}-${index}`}
          >

            <div className="relative bg-white shadow-md md:rounded-lg overflow-hidden">

              <Image

                src={slide.image.url}

                alt={slide.title}

                width={
                  sliderType === "Desktop"
                    ? 1920
                    : 800
                }

                height={
                  sliderType === "Desktop"
                    ? 500
                    : 1000
                }

                className="w-full h-full object-cover"

                // =========================
                // Load ONLY First Image Fast
                // =========================

                priority={index === 0}

                loading={
                  index === 0
                    ? "eager"
                    : "lazy"
                }

                // =========================
                // Compress Images
                // =========================

                quality={60}

                sizes="100vw"

                // =========================
                // Blur Placeholder
                // =========================

                placeholder="blur"

                blurDataURL="
                  data:image/svg+xml;base64,
                  PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlNWU3ZWInLz48L3N2Zz4=
                "
              />

              {/* =========================
                  Scholarship Button
              ========================= */}

              {slide.title
                .trim()
                .toUpperCase() ===
                "SCHOLARSHIP" && (

                <div
                  className="
                    absolute
                    bottom-2 right-3
                    sm:bottom-3 sm:right-6
                    md:bottom-5 md:right-14
                  "
                >

                  <a href="/summer-offer">

                    <button
                      className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-3 py-1.5 text-xs
                        sm:px-4 sm:py-2 sm:text-sm
                        md:px-6 md:py-3 md:text-lg
                        rounded-md md:rounded-lg
                        font-semibold
                        shadow-lg
                        transition-all
                        duration-300
                      "
                    >

                      Apply Now

                    </button>

                  </a>

                </div>

              )}

            </div>

          </SwiperSlide>

        )
      )}

    </Swiper>
  );
}