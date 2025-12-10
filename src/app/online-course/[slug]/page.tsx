'use client'

import React, { useState, useEffect } from 'react';

import { useParams } from "next/navigation";
import { Star, Clock, Users, Globe, Smartphone, Infinity, Book, CalendarDays, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';


type Course = {
    _id: string;
    title: string;
    slug: string;
    courseMode: string;
    shortContent: string;
    content: string;
    image: { url: string; alt: string };
    price: number;
    originalPrice: number;
    duration: string;
    lectures: number;
    languages: string;
    badge?: string;
    badgeColor?: string;
    demoVideo?: string;
    videos?: string[];
    features?: string[];
    createdAt: string;
};

interface BtnTypes {
    id: string;
    label: string;
    isActive: boolean;
    onClick: (id: number | string) => void;
}
const CoursePage = () => {
    const [activeTab, setActiveTab] = useState<string>('description');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const { slug } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchCourse = async () => {
            try {
                const res = await fetch(
                    `/api/admin/frontend/courses/${slug}`,
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("Failed to fetch course");
                const data = await res.json();
                setCourse(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [slug]);


    const TabButton = ({ id, label, isActive, onClick }: BtnTypes) => (
        <button
            onClick={() => onClick(id)}
            className={`py-2 font-bold text-lg border-b-2 transition-colors ${isActive ? 'border-red-500 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
        >
            {label}
        </button>
    );

    const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Review submitted:', { reviewerName, reviewRating, reviewText });
        setIsReviewModalOpen(false);
        setReviewRating(0);
        setReviewText('');
        setReviewerName('');
    };

   if (loading) {
  return (
   <div className="container max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-blue-100 rounded-2xl p-6 mb-6 flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1">
          <Skeleton height={30} width="50%" className="mb-4" />
          <div className="flex items-center gap-4 mb-4">
            <Skeleton circle height={20} width={20} />
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={16} />
          </div>
          <div className="flex gap-3">
            <Skeleton height={30} width={80} />
            <Skeleton height={30} width={100} />
          </div>
        </div>

        {/* Course Image */}
        <div className="w-full lg:w-1/3">
          <Skeleton height={200} className="rounded-xl" />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Overview */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4 text-gray-600">
            <Skeleton width={150} height={20} />
          </h2>
          <Skeleton count={6} height={16} className="mb-2" />
        </div>

        {/* Right: Price & Details */}
        <div className="w-full lg:w-1/3 bg-white shadow rounded-xl p-6">
          <Skeleton height={30} width="50%" className="mb-4" /> {/* Price */}
          <ul className="space-y-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Skeleton circle height={20} width={20} />
                  <Skeleton width="70%" height={16} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
    return (
        <div>
            {/* Header */}
            <div className="container max-w-7xl mx-auto bg-blue-100 -mt-14 md:mt-4 rounded-2xl py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#040c33] mb-4">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-blue-950 mb-4">
                                <p>A course by <span className='font-bold'>Dikshant IAS</span></p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-blue-900 mb-4">
                                <div className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>
                                        {new Date(course.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>

                                </div>
                                <div className="flex items-center gap-1">
                                    <Book className="w-4 h-4" />
                                    <span>No of hours - {course.lectures}  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    <span>{course.languages}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full">
                                    <span>{course.courseMode}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 mb-1" />
                                    <span>4.5 Review</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-80">
                            <Image
                                width={600}
                                height={600}
                                src={course.image?.url}
                                alt={course.image?.alt || course.title}
                                className="w-full rounded-lg shadow-lg border-5 border-slate-50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content */}
                    <div className="flex-1">
                        {/* Navigation Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex gap-8">
                                <TabButton
                                    id="description"
                                    label="Course Overview"
                                    isActive={activeTab === 'description'}
                                    onClick={() => setActiveTab}
                                />
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'description' && (
                            <div>
                                {/* Course Description */}
                                <div
                                    className="
                                        prose 
                                        prose-gray 
                                        sm:prose-base 
                                        lg:prose-lg 
                                        xl:prose-xl 
                                        max-w-none 
                                        text-justify 
                                        leading-relaxed

                                        [&_p]:mb-4
                                        [&_ul]:ml-6
                                        [&_ul]:list-disc
                                        [&_ol]:ml-6
                                        [&_ol]:list-decimal
                                        [&_li]:mb-2

                                        [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:font-bold
                                        [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:font-semibold
                                        [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-semibold

                                        [&_img]:rounded-lg
                                        [&_img]:shadow
                                        [&_img]:my-4

                                        [&_a]:text-blue-600
                                        hover:[&_a]:underline
                                    "
                                    >
                                    {parse(course.content)}
                                    </div>


                                {/* Course Videos */}
                                <div className="w-full mb-8 mt-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        Course Videos
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {course.videos?.map((videoUrl, index) => {
  let embedUrl = videoUrl;

  if (videoUrl.includes("watch?v=")) {
    embedUrl = videoUrl.replace("watch?v=", "embed/");
  } else if (videoUrl.includes("youtu.be/")) {
    embedUrl = videoUrl.replace("youtu.be/", "www.youtube.com/embed/");
  }

  return (
    <div key={index} className="text-center">
      <iframe
        width="100%"
        height="200"
        className="rounded-xl"
        src={embedUrl}
        title={`Video Class ${index + 1}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <h3 className="font-bold mt-2 text-blue-500">
        Video Class {index + 1}
      </h3>
    </div>
  );
})}

                                    </div>
                                </div>

                                {/* Reviews Section */}
                                <div className="mt-12 bg-slate-50 px-2 py-4">
                                    <h3 className="text-xl font-semibold mb-6">Reviews</h3>
                                    <div className="flex items-center gap-8 mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-gray-900 mb-2">5</div>
                                            <div className="flex text-yellow-400 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-current" />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-600">1 rating</div>
                                        </div>
                                        <div className="flex-1 max-w-md">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <div key={star} className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm w-4">{star}</span>
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${star === 5 ? 'bg-yellow-400 w-full' : 'bg-gray-200 w-0'}`}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">
                                                        {star === 5 ? '100%' : '0%'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 mb-8"
                                    >
                                        Write A Review
                                    </button>
                                    <div className="border-t pt-6">
                                        <div className="flex items-start gap-4">
                                            {/* <Image
                                                width={1920}
                                                height={500}
                                                src="/api/placeholder/50/50"
                                                alt="Keith Son"
                                                className="w-12 h-12 rounded-full"
                                            /> */}
                                            <div className="flex-1">
                                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                                <h4 className="font-semibold text-[#040c33]">Vijay Verma</h4>
                                                                                                <div className="flex text-yellow-400">
                                                                                                    {[...Array(5)].map((_, i) => (
                                                                                                        <Star key={i} className="w-4 h-4 fill-current" />
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="text-sm text-blue-950 mb-2">Course Review</div>
                                                                                           <p className="text-blue-950 text-sm">
                                                                                            "This course exceeded my expectations! The instructor explained complex topics in a clear and engaging way, with practical examples that I could immediately apply. The content was well-structured, and the exercises helped reinforce my learning. I feel much more confident in my skills now and would highly recommend this course to anyone looking to level up."
                                                                                            </p>
                                            
                                                                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="w-full lg:w-80">
                        <div className="lg:sticky lg:top-8">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative">
                                    <button onClick={() => setIsVideoModalOpen(true)}>
                                        <Image
                                            width={700}
                                            height={700}
                                            src={course.image?.url}
                                            alt={course.image?.alt || course.title}
                                            className="w-full h-auto object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full animate-ping flex items-center justify-center">
                                                <PlayIcon className='text-white hover:cursor-pointer' />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="text-3xl font-bold text-[#040c33] mb-6">₹ {course.price}/ <del className='text-gray-400'>₹ {course.originalPrice}/</del></div>
                                    {/* <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold mb-6 hover:bg-slate-700 transition-colors">
                                        Start Now
                                    </button> */}
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center gap-3">
                                            <Book className="w-4 h-4 text-red-700" />
                                            <span className="text-blue-950">Number of hours : {course.lectures}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-red-700" />
                                            <span className="text-blue-950">Duration: {course.duration}</span>
                                        </div>
                                       
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-red-700" />
                                            <span className="text-blue-950">Language: {course.languages}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="w-4 h-4 text-red-700" />
                                            <span className="text-blue-950">Available on the app</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Infinity className="w-4 h-4 text-red-700" />
                                            <span className="text-blue-950">Unlimited access forever</span>
                                        </div>
                                    </div>
                                    <button className="mt-5 w-full bg-[#0d0d48] text-white py-3 rounded-lg font-semibold mb-6 hover:bg-red-700 transition-colors">
                                        Buy Now
                                    </button>
                                    <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold mb-6 hover:bg-red-700 transition-colors">
                                        Book Counseling Session
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 bg-gradient-to-br from-gray-900 to-red-900 rounded-lg overflow-hidden text-white">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2">Newest offer</h3>
                                    <p className="text-sm text-gray-300 mb-4">
                                        Create a landing page for this course to maximize Conversions.
                                    </p>
                                    <div className="relative mb-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            src="/img/offer.png"
                                            alt="Thumbnails preview"
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                    <button className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition-colors">
                                        View more
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsReviewModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className={`text-2xl ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows={4}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {isVideoModalOpen && course?.demoVideo && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-black rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="absolute top-1 right-1 text-gray-50 hover:cursor-pointer"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Responsive YouTube Video */}
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={course.demoVideo.replace("watch?v=", "embed/")}
                                title="Course Preview Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
              )}
        </div>
    );
};
export default CoursePage;