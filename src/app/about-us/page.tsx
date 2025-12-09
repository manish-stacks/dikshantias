"use client";

import AboutHero from '@/component/aboutus/AboutHero'
import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Page: React.FC = () => {
  const { t } = useTranslation("common")

  return (
    <>
      <AboutHero />

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 items-center px-2 md:px-0'>
          <div>
            <div className='content md:pr-4 md:pt-4 text-center md:text-start'>
              <h2 className='text-xl md:text-3xl lg:text-3xl font-bold text-red-700 mb-4'>
                {t("about_title")}
              </h2>
              <p className='text-justify text-blue-950'>
                {t("about_description")}
              </p>
            </div>
          </div>
          <div>
            <div className='video md:pl-4 mt-6 md:pt-4'>
              <iframe
                width="100%"
                height="400px"
                src="https://www.youtube.com/embed/gD-6ceWWRy4?si=yrHXkj4rgmg-y66O"
                title="YouTube video player"
                className='rounded-2xl'
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className='bg-[#ecf4fc] mt-20 py-10 md:py-18'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-2 md:px-0'>
          <div>
            <Image src='/img/about-vision.webp' width={600} height={400} alt='about vision' className='rounded-2xl' />
          </div>
          <div className='content md:pl-4 pt-4 text-center md:text-start'>
            <h3 className='text-xl md:text-3xl font-bold text-red-700 mb-4'>{t("vision_title")}</h3>
            <span className='font-bold text-blue-950'>{t("vision_quote")}</span>
            <p className='text-justify text-blue-950'>{t("vision_para1")}</p>
            <p className='text-justify text-blue-950'>{t("vision_para2")}</p>
            <p className='text-justify text-blue-950'>{t("vision_para3")}</p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className='py-8 md:py-18 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center'>
        <div className='content md:pr-4 pt-4'>
          <h3 className='text-xl md:text-3xl font-bold text-red-700 mb-4'>{t("mission_title")}</h3>
          <span className='font-bold text-blue-950'>{t("mission_quote")}</span>
          <p className='text-justify text-blue-950'>{t("mission_para1")}</p>
          <p className='text-justify text-blue-950'>{t("mission_para2")}</p>
        </div>
        <div>
          <Image src='/img/about-mission.webp' width={600} height={400} alt='about mission' className='rounded-2xl' />
        </div>
      </div>

      {/* Thoughts */}
      <div className='bg-[#ecf4fc] mt-8 mb-16 py-18 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center'>
        <div>
          <Image src='/img/about-thought.webp' width={600} height={400} alt='about thought' className='rounded-2xl' />
        </div>
        <div className='content md:pl-4 pt-4 text-center md:text-start'>
          <h3 className='text-xl md:text-3xl font-bold text-red-700 mb-4'>{t("thoughts_title")}</h3>
          <span className='font-bold text-blue-950'>{t("thoughts_quote")}</span>
          <p className='text-justify text-blue-950'>{t("thoughts_para")}</p>
        </div>
      </div>
    </>
  )
}

export default Page
