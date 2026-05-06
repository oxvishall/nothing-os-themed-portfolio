'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  shape?: 'circle' | 'rect';
}

export default function ImageLightbox({ src, alt, isOpen, onClose, shape = 'rect' }: ImageLightboxProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors"
            aria-label="Close preview"
          >
            <HiX size={20} />
          </button>

          {/* Image */}
          <motion.img
            src={src}
            alt={alt}
            className={`relative z-10 shadow-2xl ${
              shape === 'circle'
                ? 'w-72 h-72 rounded-full object-cover border-2 border-white/20'
                : 'max-w-[90vw] max-h-[90vh] rounded-2xl object-contain'
            }`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            onClick={e => e.stopPropagation()} // prevent close when clicking image
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
