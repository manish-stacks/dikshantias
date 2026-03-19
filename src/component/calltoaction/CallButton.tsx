'use client';

import { useNotificationWeb } from '@/hooks/use-notification-web';
import Link from 'next/link';
import React from 'react';
import { FaPhoneAlt, FaBell } from 'react-icons/fa';

const CallButton: React.FC = () => {
  const { unreadCount,notifications } = useNotificationWeb();
  console.log(notifications)
  return (
    <div className="fixed right-4 bottom-10 z-50 flex flex-col items-center gap-4">

      {/* 🔔 Notification Bell */}
      <div className="relative">
        <Link href={"/notifications"}>
          <button
          className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-500 text-white shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce"
        >
          <FaBell className="text-2xl md:text-3xl animate-[wiggle_1s_ease-in-out_infinite]" />
        </button>
        </Link>
      

        {/* 🔴 Badge */}
        {notifications.length> 0 ? (
           <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {notifications.length> 0 ? notifications.length : null}
        </span>
        ):null}
       
      </div>

      {/* 📞 Call Button */}
      <a
        href="tel:+919312511015"
        className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 text-white shadow-lg animate-pulse hover:scale-105 transition-transform duration-300"
        aria-label="Call Now"
      >
        <FaPhoneAlt className="text-2xl md:text-3xl" />
      </a>

      {/* ✨ Custom Wiggle Animation */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-6deg); }
        }
      `}</style>

    </div>
  );
};

export default CallButton;