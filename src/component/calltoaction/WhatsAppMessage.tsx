'use client';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';


const WhatsAppMessage: React.FC = () => {
    return (
        <div className="fixed left-4 bottom-10 z-50">         
                <a
                    href="https://wa.me/917428092240"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 md:w-15 md:h-15 rounded-full bg-green-500 text-white shadow-lg animate-pulse hover:scale-105 transition-transform duration-300"
                    aria-label="Chat on WhatsApp"
                >
                    <FaWhatsapp className="text-3xl md:text-4xl" />
                </a>
        </div>
    );
};

export default WhatsAppMessage;
