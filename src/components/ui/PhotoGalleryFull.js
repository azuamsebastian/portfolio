'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import photos from '@/data/photos.json';

function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/92 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-8 z-[1001] w-10 h-10 flex items-center justify-center text-white/60 hover:text-white text-2xl transition-colors"
        aria-label="Close"
      >
        &times;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-[1001] w-12 h-12 flex items-center justify-center border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/15 hover:border-white/40 transition-all text-xl"
        aria-label="Previous"
      >
        &#8249;
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex].full}
          alt={images[currentIndex].alt}
          loading="lazy"
          style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
        />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-[1001] w-12 h-12 flex items-center justify-center border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/15 hover:border-white/40 transition-all text-xl"
        aria-label="Next"
      >
        &#8250;
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white/60 tracking-widest">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}

export default function PhotoGalleryFull() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const navigate = useCallback((direction) => {
    setLightboxIndex((prev) => (prev + direction + photos.length) % photos.length);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {photos.map((photo, i) => (
          <div
            key={i}
            className={`${photo.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'} relative overflow-hidden bg-surface cursor-pointer`}
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={photo.thumb}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              loading={i < 8 ? 'eager' : 'lazy'}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
