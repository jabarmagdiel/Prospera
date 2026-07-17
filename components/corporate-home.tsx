"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { HeroCarousel } from "./hero-carousel";
import { motion } from "framer-motion";

import { ProjectCardCarousel } from "./project-card-carousel";
import { PaymentSimulator } from "./payment-simulator";
import { SmartWhatsapp } from "./smart-whatsapp";

export function CorporateHome({ onOpenProject, content, projects }: { onOpenProject: (project: Project) => void, content?: any, projects?: any[] }) {
  const [toast, setToast] = useState("");

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3600);
  }

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger: any = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="corporate-site">
      <header className="corp-header">
        <a className="corp-brand" href="#inicio" aria-label="Prospera, inicio">
          <img src="/brand/prospera.png" alt="Prospera Desarrollos Inmobiliarios"/>
        </a>
        <nav aria-label="Navegación de Prospera">
          <a href="#proyectos">Proyectos</a>
          <a href="#nosotros">Quiénes somos</a>
          <a href="#distancia">Comprar desde lejos</a>
          <a href="#trabaja">Trabajá con nosotros</a>
        </nav>
        <button className="corp-contact">Hablar con un asesor</button>
      </header>
      
      <section className="corp-hero" id="inicio">
        <motion.div 
          className="corp-hero-copy"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="eyebrow light"><span></span> Santa Cruz de la Sierra</p>
          <h1>Un terreno puede ser<br/><em>el comienzo de algo grande.</em></h1>
          <p>En Prospera desarrollamos proyectos urbanísticos para quienes quieren vivir mejor, invertir con criterio o dejar patrimonio. Te ayudamos a entender cada opción y avanzar con una condición que sí puedas sostener.</p>
          <div className="hero-actions">
            <button className="button primary">Encontrá tu proyecto <span>↓</span></button>
            <button className="button ghost">Conocé Prospera</button>
          </div>
        </motion.div>
        <HeroCarousel />
      </section>

      <motion.section 
        className="about-prospera" 
        id="nosotros"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="about-mark"
        >
          <span>P</span><i>PROSPERA</i>
        </motion.div>
        <div className="about-copy">
          <motion.p variants={fadeUp} className="eyebrow"><span></span> Quiénes somos</motion.p>
          <motion.h2 variants={fadeUp}>Planificamos tierra.<br/><em>Impulsamos futuro.</em></motion.h2>
          <motion.p variants={fadeUp} className="about-lead">Prospera Desarrollos Inmobiliarios es una empresa cruceña dedicada a planificar, gestionar y comercializar proyectos urbanísticos.</motion.p>
          <motion.p variants={fadeUp}>Trabajamos cada desarrollo desde una mirada integral: entendemos el territorio, ordenamos la propuesta y acompañamos al cliente para que pueda saber dónde compra, cómo avanza y cuál proyecto responde mejor a su realidad.</motion.p>
          <motion.div variants={fadeUp} className="about-principles">
            <div><b>Claridad</b><span>Para entender antes de decidir.</span></div>
            <div><b>Posibilidad</b><span>Para encontrar una entrada que puedas sostener.</span></div>
            <div><b>Visión</b><span>Para transformar una compra en patrimonio.</span></div>
          </motion.div>
        </div>
      </motion.section>

      <section className="portfolio-section" id="proyectos">
        <motion.div 
          className="portfolio-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div>
            <p className="eyebrow"><span></span> Proyectos Prospera</p>
            <h2>No todos buscan lo mismo.<br/><em>Tu proyecto también puede ser distinto.</em></h2>
          </div>
          <p className="portfolio-note">Hay quienes compran para vivir, quienes quieren entrar antes a una zona con crecimiento y quienes piensan en el patrimonio de su familia. Empezá por lo que querés lograr.</p>
        </motion.div>

<div className="max-w-7xl mx-auto mt-12 mb-12 px-6">
  {projects && projects.length > 0 ? (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((p: any, idx: number) => (
        <motion.div variants={fadeUp} key={p.key || idx} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group" onClick={() => onOpenProject(p)}>
          <div className="h-56 overflow-hidden relative">
            <ProjectCardCarousel images={p.gallery || []} fallback={p.logo || "/images/about.png"} />
            <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20 pointer-events-none">{p.family}</div>
          </div>
          <div className="p-6">
            <h3 className="font-serif text-2xl text-stone-900 mb-2">{p.name}</h3>
            <p className="text-sm text-stone-600 mb-6 line-clamp-2">{p.description || p.short}</p>
            <div className="flex items-center text-orange-600 font-medium text-sm gap-2 group-hover:gap-3 transition-all">
              Ver detalles <span className="font-bold">→</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  ) : (
    <p className="text-center text-stone-500">No hay proyectos disponibles</p>
  )}
</div>

      <motion.p 
        className="portfolio-note text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        La disponibilidad, condiciones y estado de cada proyecto se confirman individualmente al momento de la consulta.
      </motion.p>
      </section>

      <PaymentSimulator />
      
      <motion.section 
        className="prospera-value" 
        id="respaldo"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.div variants={fadeUp} className="value-intro">
          <p className="eyebrow light"><span></span> Una decisión importante merece claridad</p>
          <h2>Comprar terreno no debería sentirse<br/><em>como un salto a ciegas.</em></h2>
          <p>Por eso te ayudamos a comparar, preguntar, visitar y entender la opción antes de avanzar.</p>
        </motion.div>
        <div className="value-grid">
          <motion.article variants={fadeUp}><span>01</span><h3>Entendé</h3><p>Conocé qué propone cada proyecto y para quién puede funcionar mejor.</p></motion.article>
          <motion.article variants={fadeUp}><span>02</span><h3>Compará</h3><p>Revisá ubicación, etapa, formas de compra y disponibilidad vigente.</p></motion.article>
          <motion.article variants={fadeUp}><span>03</span><h3>Conocé</h3><p>Visitá el terreno o recorré el proyecto en vivo por videollamada.</p></motion.article>
          <motion.article variants={fadeUp}><span>04</span><h3>Decidí</h3><p>Avanzá cuando la opción tenga sentido para tu objetivo y presupuesto.</p></motion.article>
        </div>
      </motion.section>
      
      <motion.section 
        className="remote-section" 
        id="distancia"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="remote-map"
        >
          <span className="origin">SCZ</span><i className="flight flight-a"></i><i className="flight flight-b"></i><i className="flight flight-c"></i><span className="destination d1">LPB</span><span className="destination d2">MAD</span><span className="destination d3">MIA</span>
        </motion.div>
        <div className="remote-copy">
          <motion.p variants={fadeUp} className="eyebrow"><span></span> Tu decisión puede empezar desde cualquier lugar</motion.p>
          <motion.h2 variants={fadeUp}>Primero conocé.<br/><em>Después decidí si querés viajar.</em></motion.h2>
          <motion.p variants={fadeUp}>Si vivís en La Paz, Oruro o fuera de Bolivia, un asesor puede mostrarte el proyecto desde el terreno, responder tus preguntas e incorporar a tu familia en la videollamada.</motion.p>
          <motion.button variants={fadeUp} className="button dark">Ver un proyecto en vivo <span>→</span></motion.button>
        </div>
      </motion.section>
      
      <motion.section 
        className="work-section" 
        id="trabaja"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <div className="work-copy">
          <motion.p variants={fadeUp} className="eyebrow light"><span></span> Trabajá con nosotros</motion.p>
          <motion.h2 variants={fadeUp}>El futuro también se construye<br/><em>con las personas correctas.</em></motion.h2>
          <motion.p variants={fadeUp}>En Prospera valoramos la claridad, el compromiso, el trabajo en equipo y las ganas de crecer. Si te interesa aportar al desarrollo inmobiliario de Santa Cruz, queremos conocerte.</motion.p>
          <motion.button variants={fadeUp} className="button work-button">Quiero ser parte de Prospera <span>→</span></motion.button>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="work-visual"
        >
          <span className="work-word">CRECER</span>
          <div><b>Equipo</b><b>Compromiso</b><b>Futuro</b></div>
        </motion.div>
      </motion.section>
      
      <motion.section 
        className="corp-contact-section" 
        id="contacto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img src="/brand/prospera.png" alt="Prospera Desarrollos Inmobiliarios"/>
        <div>
          <p className="eyebrow"><span></span> Contanos qué querés construir</p>
          <h2>Tu primera decisión es empezar a mirar.</h2>
          <p>Decinos si buscás vivienda, inversión o patrimonio. Un asesor te ayudará a comparar proyectos sin apurarte.</p>
        </div>
        <button className="button primary">Encontrar una opción para mí <span>→</span></button>
      </section>
    </main>
  );
}
