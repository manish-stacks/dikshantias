"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/component/admin/AdminLayout";
import {
  Users,
  BookOpen,
  MessageSquare,
  FileText,
  Bell,
  CheckCircle,
  Globe,
  Download,
  Smile,
  Star,
  Award,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Calculate max index for dots navigation
  const maxIndex = Math.max(0, Math.ceil(toppers.length / itemsPerView) - 1);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
    else setAuthorized(true);

    // Handle responsive items per view
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!authorized)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="relative flex space-x-3 mb-4">
            <div className="w-5 h-5 bg-[#e94e4e] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-[#f97316] rounded-full animate-bounce delay-150"></div>
            <div className="w-5 h-5 bg-[#facc15] rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#1C398E] via-[#2E4BAF] via-[#3C5FD1] to-[#5B7FFF] rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden text-white">

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold drop-shadow-lg flex items-center gap-2">
            Good to see you, Dikshant IAS
            <Smile size={32} className="text-white-400 animate-bounce" />
          </h1>
          <p className="text-white/90 text-lg drop-shadow-sm">See today’s insights and stay ahead of your goals.</p>

          {/* Colorful Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="#"
              target="_blank"
              className="bg-gradient-to-tr from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Globe size={18} />
              हिंदी वेबसाइट पर जाए
            </a>
            <a
              href=""
              target="_blank"
              className="bg-gradient-to-tr from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Globe size={18} />
              VISIT OUR ENGLISH WEBSITE
            </a>
            <a
              href=""
              target="_blank"
              className="bg-gradient-to-tr from-[#ED2988] to-[#9C1F64] hover:from-[#d61f76] hover:to-[#7d1750] text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              DOWNLOAD DIKSHANT LEARNING APP
            </a>

          </div>
        </div>

        {/* Top-right activity buttons */}
        <div className="flex gap-4 mt-5 sm:mt-0">
          <button className="bg-gradient-to-tr from-purple-400 to-pink-500 p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-transform duration-300">
            <Star size={28} className="text-white" />
          </button>
          <button className="bg-gradient-to-tr from-orange-400 to-yellow-500 p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-transform duration-300">
            <Award size={28} className="text-white" />
          </button>
          <button className="bg-gradient-to-tr from-red-400 to-pink-500 p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-transform duration-300">
            <Heart size={28} className="text-white" />
          </button>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full animate-pulse blur-2xl"></div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={<Users size={28} />} title="Students" value="1200+" colors={["from-blue-400", "to-blue-600"]} />
        <Card icon={<BookOpen size={28} />} title="Courses" value="35" colors={["from-green-400", "to-green-600"]} />
        <Card icon={<MessageSquare size={28} />} title="Enquiries" value="6" colors={["from-purple-400", "to-purple-600"]} />
        <Card icon={<FileText size={28} />} title="Blogs" value="50" colors={["from-red-400", "to-red-600"]} />
        <Card
          icon={<span className="text-2xl font-bold text-white-500">₹</span>}
          title="Revenue"
          value="12,500"
          colors={["from-yellow-400", "to-yellow-600"]}
        />
        <Card icon={<CheckCircle size={28} />} title="Completed Tasks" value="120" colors={["from-teal-400", "to-teal-600"]} />
        <Card icon={<Bell size={28} />} title="Notifications" value="8" colors={["from-pink-400", "to-pink-600"]} />
        <Card icon={<Users size={28} />} title="Active Users" value="350" colors={["from-indigo-400", "to-indigo-600"]} />
      </div>

      {/* Result Section */}

    </AdminLayout>
  );
}

interface Topper {
  id: number;
  name: string;
  service: string;
  year: string;
  rank: number;
  image: string;
}

const toppers: Topper[] = [
  {
    id: 1,
    name: "Gamini Singla",
    service: "CSE Result",
    year: "2021",
    rank: 3,
    image: "/img/result/gamini-result.jpg",
  },
  {
    id: 2,
    name: "Aishwarya Verma",
    service: "CSE Result",
    year: "2021",
    rank: 4,
    image: "/img/result/aishwarya-result.jpg",
  },
  {
    id: 3,
    name: "Yaksh Chaudhary",
    service: "CSE Result",
    year: "2021",
    rank: 6,
    image: "/img/result/yaksh-chaudhary.jpg",
  },
  {
    id: 4,
    name: "Preetam Verma",
    service: "CSE Result",
    year: "2021",
    rank: 9,
    image: "/img/result/pritum-result.jpg",
  },
  {
    id: 5,
    name: "Shruti Sharma",
    service: "CSE Result",
    year: "2021",
    rank: 1,
    image: "/img/result/shruti-sharma-result.jpg",
  },
  {
    id: 6,
    name: "Arjun Reddy",
    service: "IFS",
    year: "2023",
    rank: 34,
    image: "/img/result/gamini-result.jpg",
  },
];

// Card Component
function Card({
  icon,
  title,
  value,
  colors,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  colors: [string, string];
}) {
  return (
    <div
      className={`bg-gradient-to-r ${colors[0]} ${colors[1]} text-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-xl hover:scale-105 transition-transform duration-200`}
    >
      <div className="bg-white/20 p-3 rounded-xl shadow-sm flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
