"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

interface PromoData {
  active: boolean;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export function PromoPopup({ promo }: { promo: PromoData | null }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if promo is active and user hasn't closed it recently
    if (promo?.active) {
      const closed = sessionStorage.getItem("promo_closed");
      if (!closed) {
        // Small delay so it feels natural after loading
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [promo]);

  function closePopup() {
    setIsVisible(false);
    sessionStorage.setItem("promo_closed", "true");
  }

  if (!promo || !promo.active) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={closePopup}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full grid md:grid-cols-2 z-10"
          >
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-stone-900 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div 
              className="h-48 md:h-full bg-stone-200 bg-cover bg-center"
              style={{ backgroundImage: `url('${promo.imageUrl}')` }}
            />
            
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                Anuncio
              </div>
              <h3 className="font-serif text-3xl text-stone-900 mb-4 leading-tight">{promo.title}</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">{promo.description}</p>
              
              <a 
                href={promo.ctaLink} 
                onClick={closePopup}
                className="bg-stone-900 text-white text-center px-6 py-4 rounded-full font-medium hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {promo.ctaText} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
