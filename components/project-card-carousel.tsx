"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectCardCarousel({ images, fallback }: { images: string[], fallback: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = images && images.length > 0 ? images.slice(0, 4) : [fallback];

  if (displayImages.length <= 1) {
    return (
      <img 
        src={displayImages[0]} 
        alt="Proyecto" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
    );
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-stone-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${displayImages[currentIndex]})` }}
        />
      </AnimatePresence>

      {/* Mini Controls */}
      <div className={`absolute inset-0 flex items-center justify-between p-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={prevSlide}
          className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-800 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={nextSlide}
          className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-800 transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Mini Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {displayImages.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
