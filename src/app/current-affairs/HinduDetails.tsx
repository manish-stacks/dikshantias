'use client';

import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

function decodeHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&nbsp;/g, ' ');
}

interface HinduDetailsProps {
  title: string;
  content?: string;
  onClose?: () => void;
  imageUrl?: string;
  imageAlt?: string;
}

const HinduDetails: React.FC<HinduDetailsProps> = ({ title, content, onClose, imageUrl, imageAlt }) => {
  const decodedContent = decodeHtml(content);

  return (
    <div className="bg-[#F1F5F9] shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00072c]">{title}</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 transition duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mb-6">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            width={1200}
            height={200}
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Body */}
      {decodedContent ? (
        //         <div
        //   className="max-w-none text-gray-800 leading-relaxed space-y-6 [&>h1]:text-2xl [&>h2]:text-xl [&>p]:mb-5"
        //   dangerouslySetInnerHTML={{ __html: decodedContent }}
        // />

        <div
          className="
            max-w-none text-gray-800 leading-relaxed space-y-8
            [&>h1]:text-3xl [&>h1]:mt-10 [&>h1]:mb-6
            [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-5
            [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-4
            [&>p]:mb-6
            [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6
            [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6
            [&>li]:mb-3
            [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-6
            [&>img]:rounded-lg [&>img]:my-8
          "
          dangerouslySetInnerHTML={{ __html: decodedContent }}
        />


      ) : (
        <p className="text-gray-500 italic">No content available.</p>
      )}
    </div>
  );
};

export default HinduDetails;
