"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowRight, UserCircle } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const links = [
    { label: "Inicio", href: "#" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Proyectos", href: "#proyectos-section" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${isScrolled ? 'bg-stone-900/80 backdrop-blur-xl border border-white/10 shadow-2xl px-6 py-3' : 'bg-transparent px-2 py-2'}`}>
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className={`font-serif text-2xl font-bold tracking-tighter ${isScrolled ? 'text-white' : 'text-stone-900'} transition-colors`}>
                Prospera
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <a key={link.label} href={link.href} className={`text-sm font-bold tracking-widest uppercase transition-colors hover:text-orange-500 ${isScrolled ? 'text-stone-300' : 'text-stone-700'}`}>
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a href="/admin" className={`flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-colors hover:text-orange-500 ${isScrolled ? 'text-stone-400' : 'text-stone-500'}`}>
                <UserCircle className="w-5 h-5" /> Admin
              </a>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center gap-2 text-sm">
                Asesoría <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full ${isScrolled ? 'text-white' : 'text-stone-900'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/95 backdrop-blur-xl flex flex-col justify-center items-center">
          <nav className="flex flex-col items-center gap-8">
            {links.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif text-white hover:text-orange-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="/admin" className="mt-8 flex items-center gap-2 text-stone-400 hover:text-orange-500 font-bold uppercase tracking-widest">
              <UserCircle className="w-5 h-5" /> Ingreso Administrador
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
