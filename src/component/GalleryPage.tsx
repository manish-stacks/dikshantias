'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface GalleryItem {
  _id: string;
  title: string;
  alt: string;
  active: boolean;
  image: {
    url: string;
    public_url: string;
    public_id: string;
  };
}

const GalleryPage: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/admin/gallery', {
          cache: 'no-store',
        });
        const data: GalleryItem[] = await res.json();

        // filter only active images
        const activeImages = data.filter((item) => item.active);
        setGalleryImages(activeImages);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openModal = (src: string, alt: string) => {
    setSelectedImage(src);
    setSelectedAlt(alt);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedAlt(null);
  };

  return (
    <div className="py-12">
      <div className="container max-w-7xl mx-auto px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-center mb-12 text-gray-900">
          Our Portfolio
        </h1>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-lg shadow-xl border-8 border-white"
              >
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <motion.div
                key={image._id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-xl cursor-pointer border-8 border-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => openModal(image.image.url, image.alt)}
              >
                <Image
                  src={image.image.url}
                  alt={image.alt || image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Popup */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="relative max-w-4xl w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage}
                  alt={selectedAlt || 'Gallery Image'}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg"
                  sizes="100vw"
                />
                <button
                  className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;
