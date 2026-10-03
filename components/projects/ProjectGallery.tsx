"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectVisual } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectGalleryProps {
  visuals: ProjectVisual[];
}

export function ProjectGallery({ visuals }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleVisualEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ visualIndex: number }>;
      if (
        customEvent.detail.visualIndex >= 0 && 
        customEvent.detail.visualIndex < visuals.length
      ) {
        setCurrentIndex(customEvent.detail.visualIndex);
      }
    };
    window.addEventListener("show-project-visual", handleVisualEvent);
    return () => window.removeEventListener("show-project-visual", handleVisualEvent);
  }, [visuals.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % visuals.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + visuals.length) % visuals.length);

  if (!visuals || visuals.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-background/50 border border-white/5 group">
      <div className="relative h-64 md:h-96 w-full flex items-center justify-center bg-black/20">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={visuals[currentIndex].src}
            alt={visuals[currentIndex].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-full max-h-full object-contain"
          />
        </AnimatePresence>
      </div>

      {visuals.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {visuals.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
