'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  _id: string;
  name: string | { en: string; hi: string };
  rank: string | { en: string; hi: string };
  year: string | { en: string; hi: string };
  image: {
    url: string;
    public_url: string;
    public_id: string;
  };
  quote: string | { en: string; hi: string };
  background: string | { en: string; hi: string };
  attempts: string | { en: string; hi: string };
  optional: string | { en: string; hi: string };
}

const parseValue = (value: any, lang: string) => {
  if (!value) return '';
  try {
    if (typeof value === 'object' && (value.en || value.hi)) {
      return value[lang] || value.en || '';
    }
    if (typeof value === 'string' && value.startsWith('{')) {
      const parsed = JSON.parse(value);
      return parsed[lang] || parsed.en || value;
    }
    return value;
  } catch {
    return value;
  }
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language; // "en" or "hi"

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/admin/testimonials', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const nextTestimonial = () => {
    if (isSliding || testimonials.length === 0) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsSliding(false);
    }, 150);
  };

  const prevTestimonial = () => {
    if (isSliding || testimonials.length === 0) return;
    setIsSliding(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsSliding(false);
    }, 150);
  };

  return (
    <section className="py-0 md:py-5">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl px-3 font-bold text-[#040c33] mb-1">
            {t('successStoriesTitle')}{' '}
            <span className="text-[#f43144] mt-1 md:mt-2">
              {t('successStoriesHighlight')}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-blue-950 leading-relaxed px-3">
            {t('mockInterview')}
          </p>
          <p className="text-lg md:text-xl text-blue-950 leading-relaxed px-3">
            {t('successStoriesDesc')}
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative md:px-0 px-2">
          <div className="bg-[#040c33] rounded-2xl md:rounded-3xl shadow-xl relative overflow-hidden min-h-[300px]">
            {loading ? (
              // Skeleton Loader
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-12">
                <div className="md:w-2/5 text-center">
                  <Skeleton circle width={160} height={160} />
                  <div className="mt-4 space-y-2">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={160} height={32} />
                  </div>
                </div>
                <div className="md:w-3/5 space-y-4">
                  <Skeleton count={3} height={24} />
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                  </div>
                </div>
              </div>
            ) : (
              // Actual Testimonials
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="w-full flex-shrink-0 p-6 sm:p-8 md:p-12">
                      {/* Testimonial Content */}
                      <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-center relative z-10">
                        {/* Profile Image and Basic Info */}
                        <div className="md:col-span-2 text-center">
                          <div className="relative inline-block mb-4 md:mb-6">
                            <Image
                              width={400}
                              height={400}
                              src={testimonial.image?.url || '/default-avatar.jpg'}
                              alt={parseValue(testimonial.name, lang)}
                              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full mx-auto shadow-lg border-4 border-rose-100 object-cover"
                            />
                          </div>
                          <div className="space-y-2 md:space-y-3">
                            <h3 className="text-[18px] md:text-3xl font-bold text-gray-50">
                              {parseValue(testimonial.name, lang)}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                              <span className="bg-[#f43144] text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-lg">
                                {parseValue(testimonial.rank, lang)}
                              </span>
                              <span className="bg-white/15 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-lg">
                                {parseValue(testimonial.year, lang)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quote and Details */}
                        <div className="md:col-span-3 space-y-4 md:space-y-6">
                          <div>
                            <Quote className="w-8 h-8 md:w-12 md:h-12 text-orange-300 mb-3 md:mb-4" />
                            <blockquote className="text-lg md:text-xl text-gray-50 leading-relaxed italic px-9 md:px-6">
                              &quot;{parseValue(testimonial.quote, lang)}&quot;
                            </blockquote>
                          </div>

                          <div className="hidden md:grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                              <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{t('background')}</h4>
                              <p className="text-gray-600 text-xs md:text-sm">
                                {parseValue(testimonial.background, lang)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
                              <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{t('attempts')}</h4>
                              <p className="text-gray-600 text-xs md:text-sm">
                                {parseValue(testimonial.attempts, lang)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl sm:col-span-2 md:col-span-1">
                              <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{t('optional')}</h4>
                              <p className="text-gray-600 text-xs md:text-sm">
                                {parseValue(testimonial.optional, lang)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevTestimonial}
                  disabled={isSliding || testimonials.length === 0}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-rose-700 hover:text-white transition-all duration-300 group z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>

                <button
                  onClick={nextTestimonial}
                  disabled={isSliding || testimonials.length === 0}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-rose-700 hover:text-white transition-all duration-300 group z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
