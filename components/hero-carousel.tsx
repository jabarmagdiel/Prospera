"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/hero/slide1.png",
  "/hero/slide2.png",
  "/hero/slide3.png"
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div className="corp-hero-stage hero-carousel-container w-full h-full relative overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {images[currentIndex].endsWith(".mp4") ? (
          <motion.video
            key={`video-${currentIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.6 },
              opacity: { duration: 0.6 }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            src={images[currentIndex]}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <motion.div
            key={`img-${currentIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.6 },
              opacity: { duration: 0.6 }
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          />
        )}
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <button className="carousel-control prev z-10 absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors backdrop-blur-sm" onClick={prevSlide} aria-label="Anterior">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button className="carousel-control next z-10 absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors backdrop-blur-sm" onClick={nextSlide} aria-label="Siguiente">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Dots */}
      <div className="carousel-indicators absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10 w-full">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-12 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
