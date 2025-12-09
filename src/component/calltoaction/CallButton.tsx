'use client';

import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const CallButton: React.FC = () => {
  return (
    <div className="fixed right-4 bottom-10 z-50">
      <a
        href="tel:+919999999999"
        className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 text-white shadow-lg animate-pulse hover:scale-105 transition-transform duration-300"
        aria-label="Call Now"
      >
        <FaPhoneAlt className="text-2xl md:text-3xl" />
      </a>
    </div>
  );
};

export default CallButton;