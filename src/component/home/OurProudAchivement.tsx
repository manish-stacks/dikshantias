"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { useTranslation } from "react-i18next";

interface Topper {
  _id: string
  name: string
  service: string
  year: string
  rank: string
  image: {
    url: string
  }
}

interface SectionContent {
  description: {
    en: string
    hi: string
  }
  buttonText: {
    en: string
    hi: string
  }
  buttonLink: string
}

export default function OurProudAchivement() {
   const { t, i18n } = useTranslation("common")
  const [section, setSection] = useState<SectionContent | null>(null)
  const [toppers, setToppers] = useState<Topper[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await fetch("/api/admin/result-section")
        const data = await res.json()
        setSection(data)
      } catch (err) {
        console.error("Error fetching section:", err)
      }
    }
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/admin/results")
        const data = await res.json()
        const activeResults = data.filter((item: Topper & { active: boolean }) => item.active === true)
        setToppers(activeResults)
      } catch (error) {
        console.error("Error fetching results:", error)
      }
    }

    Promise.all([fetchSection(), fetchResults()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1)
      else if (window.innerWidth < 768) setItemsPerView(2)
      else if (window.innerWidth < 1024) setItemsPerView(3)
      else setItemsPerView(4)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const maxIndex = Math.max(0, toppers.length - itemsPerView)
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex)
  }, [itemsPerView, toppers.length, currentIndex])

  const maxIndex = Math.max(0, toppers.length - itemsPerView)

  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))

  useEffect(() => {
    if (toppers.length === 0) return
    const interval = setInterval(() => nextSlide(), 6000)
    return () => clearInterval(interval)
  }, [toppers, currentIndex, itemsPerView])

          return (
            <div className="py-5 px-2 md:px-4 mb-4" style={{ backgroundColor: "#fff" }}>
              <div className="max-w-7xl md:mx-auto mt-7">
                <div className="bg-[#ecf4fc] backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#040c33] mb-2">
          {loading ? (
            <Skeleton width={200} />
          ) : (
            <>
              {t("ourResults")}
              
              <span className="block text-sm md:text-base lg:text-lg font-normal text-gray-600 mt-1">
                {t("ourResultsSubtitle")}
              </span>
            </>
          )}
        </h2>


          {/* Description */}
         <p className="text-blue-950 mb-4 md:mb-10">
  {loading ? (
    <Skeleton count={3} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: section?.description?.[i18n.language] || "" }} />
  )}
</p>


          <div className="relative">
            {toppers.length > itemsPerView && !loading && (
              <>
                <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#a50309]/70 hover:bg-[#a50309] rounded-full p-2 transition-all duration-200">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#a50309]/70 hover:bg-[#a50309] rounded-full p-2 transition-all duration-200">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}>
                {loading
                  ? Array.from({ length: itemsPerView }).map((_, idx) => (
                      <div key={idx} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                        <div className="text-center bg-[#040c33] py-8 rounded-2xl">
                          <Skeleton circle width={112} height={112} className="mx-auto mb-4" />
                          <Skeleton width={80} height={20} className="mx-auto mb-2" />
                          <Skeleton width={60} height={16} className="mx-auto mb-1" />
                          <Skeleton width={40} height={14} className="mx-auto" />
                        </div>
                      </div>
                    ))
                  : toppers.map((topper) => (
                     <div key={topper._id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                      <div className="text-center bg-[#040c33] border border-[#000622] py-8 rounded-2xl">
                        <div className="relative inline-block mb-4">
                          <div className="w-25 h-25 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 md:border-3 border-orange-400">
                            <Image
                              src={topper.image?.url || "/placeholder.svg"}
                              alt={topper.name?.[i18n.language] || "Result"}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {topper.rank?.[i18n.language] || ""}
                          </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                          {topper.name?.[i18n.language] || ""}
                        </h3>
                        <p className="text-white/80 font-medium mb-1">
                          {topper.service?.[i18n.language] || ""}
                        </p>
                        <p className="text-orange-300 text-sm">{topper.year}</p>
                      </div>
                    </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {loading ? (
              <Skeleton width={150} height={40} />
            ) : (
              <Link
  href={section?.buttonLink || "/"}
  className="px-4 py-2 bg-[#a50309] text-white rounded-md"
>
  {section?.buttonText?.[i18n.language] || "View All Results"}
</Link>

            )}
          </div>
        </div>
      </div>
    </div>
  )
}
