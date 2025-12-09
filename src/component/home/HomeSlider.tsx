"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
  
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

export default function HomeSlider({ sliderType }: { sliderType: "Desktop" | "Mobile" }) {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch("/api/admin/sliders", { cache: "no-store" });
        const data: SliderItem[] = await res.json();

        const filtered = data
          .filter((s) => s.type === sliderType && s.active)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        setSliders(filtered);
      } catch (error) {
        console.error("Failed to load sliders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, [sliderType]);

  if (loading) {
    // Show skeleton while loading
    return (
      <div className="space-y-2">
        <Skeleton height={300} className="rounded-lg md:rounded-xl" />
        <Skeleton height={20} width={1300} />
      </div>
    );
  }

  if (sliders.length === 0) {
    return <p className="text-center text-gray-500">No {sliderType} sliders</p>;
  }

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      className="md:rounded-xl rounded-lg"
    >
      {sliders.map((slide, index) => (
        <SwiperSlide key={`${sliderType}-${slide._id}-${index}`}>
          <div className="h-auto bg-white shadow-md md:rounded-lg overflow-hidden">
            <Image
              width={1920}
              height={500}
              src={slide.image.url}
              alt={slide.title}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
