"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Popup {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: {
    url: string;
  };
  primaryButton?: {
    text?: string;
    link?: string;
  };
  secondaryButton?: {
    text?: string;
    link?: string;
  };
  active: boolean;
}

export default function HomePopup() {
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState<Popup | null>(null);

  useEffect(() => {
    fetch("/api/admin/popup")
      .then((res) => res.json())
      .then((data) => {
        const activePopup = data.find((p: Popup) => p.active);
        if (activePopup) {
          setPopup(activePopup);

          setTimeout(() => {
            setShow(true);
          }, 800);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!show || !popup) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white text-center py-3 text-lg font-extrabold">
          {popup.title}
        </div>
        {/* Image */}
        {popup.image?.url &&
          (popup.secondaryButton?.link ? (
            <a
              href={popup.secondaryButton.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-center bg-white cursor-pointer"
            >
              <Image
                src={popup.image.url}
                alt={popup.title}
                width={800}
                height={1000}
                className="w-full h-auto max-h-[55vh] object-contain hover:opacity-95 transition"
                priority
              />
            </a>
          ) : (
            <div className="w-full flex justify-center bg-white">
              <Image
                src={popup.image.url}
                alt={popup.title}
                width={800}
                height={1000}
                className="w-full h-auto max-h-[55vh] object-contain"
                priority
              />
            </div>
          ))}
        {/* Content */}
        <div className="p-3 md:p-4 text-center">
          {popup.subtitle && (
            <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-2">
              {popup.subtitle}
            </h2>
          )}

          {popup.description && (
            <p className="text-gray-600 text-sm md:text-base mb-4">
              {popup.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {popup.primaryButton?.text && popup.primaryButton?.link && (
              <a
                href={popup.primaryButton.link}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm md:text-base transition"
              >
                {popup.primaryButton.text}
              </a>
            )}

            {popup.secondaryButton?.text && popup.secondaryButton?.link && (
              <a
                href={popup.secondaryButton.link}
                className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg text-sm md:text-base transition"
              >
                {popup.secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
