"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { HeroCarousel } from "./hero-carousel";
import { motion, useScroll, useTransform } from "framer-motion";

import { ProjectCardCarousel } from "./project-card-carousel";
import { PaymentSimulator } from "./payment-simulator";
import { SmartWhatsapp } from "./smart-whatsapp";
import { Header } from "./header";
import { Star, Target, Eye, Briefcase, ShieldCheck, Handshake, Heart, Users, Lightbulb, TrendingUp, CheckCircle, FileText, BadgeCheck } from "lucide-react";

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
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };
  
  const { scrollYProgress } = useScroll();

  return (
    <main className="corporate-site">
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-1 z-[100] bg-orange-500/80"
      />
      <Header />
      
      <section className="corp-hero" id="inicio">
        <motion.div 
          className="corp-hero-copy !py-10 md:!py-16 lg:!py-20"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="eyebrow light !mb-2"><span></span> Santa Cruz de la Sierra</motion.p>
          <motion.h1 variants={fadeUp} className="!text-4xl md:!text-5xl lg:!text-6xl !leading-tight !mb-4 !mt-0">Un terreno puede ser<br/><em>el comienzo de algo grande.</em></motion.h1>
          <motion.p variants={fadeUp} className="!text-base !mb-6 !mt-2">En Prospera desarrollamos proyectos urbanísticos para quienes quieren vivir mejor, invertir con criterio o dejar patrimonio. Te ayudamos a entender cada opción y avanzar con una condición que sí puedas sostener.</motion.p>
          <motion.div variants={fadeUp} className="hero-actions flex gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="button primary !py-3 !px-6 !text-sm" onClick={() => window.location.href = '#proyectos'}>Encontrá tu proyecto <span>↓</span></motion.button>
            <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }} whileTap={{ scale: 0.95 }} className="button ghost !py-3 !px-6 !text-sm" onClick={() => window.location.href = '#nosotros'}>Conocé Prospera</motion.button>
          </motion.div>
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
          <motion.p variants={fadeUp} className="about-lead">Prospera es una empresa de desarrollos inmobiliarios situada en Santa Cruz de la Sierra, Bolivia.</motion.p>
          <motion.p variants={fadeUp}>Los proyectos de desarrollo inmobiliario que se gestionan en Prospera son analizados con criterios de rentabilidad, seguridad jurídica, ubicación y entorno, potencialidad y proyección de las zonas de desarrollo.</motion.p>
          <motion.p variants={fadeUp}>Las garantías en la gestión del desarrollo de proyectos inmobiliarios en Prospera suponen tener las cautelas necesarias para poder generar confianza y seguridad a nuestros inversores.</motion.p>
          <motion.p variants={fadeUp}>La aprobación de los proyectos se hace imperativa antes de continuar con las fases de ingeniería y arquitectura. Nuestros expertos en el área de proyectos, analizan las posibilidades inversoras de nuestros clientes y asociados para garantizar una gestión transparente y rentable en la que ambas partes acuerdan asumir los riesgos propios de cada inversión.</motion.p>
          <motion.p variants={fadeUp}>La gestión de riesgos en el ámbito de las inversiones en Bolivia debe tener en cuenta varios factores: La evolución del sector, la proyección económica y sobre todo la rigurosidad de la gestión de las garantías de transmisión de la propiedad y la aprobación correcta de los proyectos.</motion.p>
        </div>
      </motion.section>

      {/* NUEVA SECCIÓN: Misión, Visión, Valores */}
      <section className="bg-stone-50 py-32 border-t border-stone-200 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>

        <motion.div 
          className="max-w-7xl mx-auto px-6 space-y-24 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200/50 mb-6">
              <Star className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-semibold tracking-wider uppercase text-xs">Nuestra Esencia</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6">Los cimientos de nuestro trabajo</motion.h2>
          </div>

          {/* Misión y Visión */}
          <div className="flex flex-col gap-12">
            <motion.div variants={fadeUp} className="group bg-white rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-[55%] p-10 md:p-16 flex flex-col justify-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-8 relative z-10">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Misión</h3>
                <p className="text-stone-600 leading-relaxed text-lg">Desarrollar e implementar soluciones de inversión confiables, seguras y rentables en el sector inmobiliario para nuestros clientes e inversionistas, en función a sus necesidades y expectativas; mediante una gestión innovadora y eficiente de nuestros recursos y procesos.</p>
              </div>
              <div className="md:w-[45%] min-h-[350px] relative overflow-hidden">
                <img src="/hero/slide1.png" alt="Misión Prospera" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-30 md:opacity-100 w-1/4"></div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="group bg-white rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row-reverse">
              <div className="md:w-[55%] p-10 md:p-16 flex flex-col justify-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mb-8 relative z-10">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Visión</h3>
                <p className="text-stone-600 leading-relaxed text-lg">Somos un referente sólido, confiable e innovador que gestiona inversiones en el sector inmobiliario, superando las expectativas de nuestros clientes y generando una atractiva rentabilidad para nuestros inversionistas.</p>
              </div>
              <div className="md:w-[45%] min-h-[350px] relative overflow-hidden">
                <img src="/hero/slide2.png" alt="Visión Prospera" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent opacity-30 md:opacity-100 w-1/4 right-0"></div>
              </div>
            </motion.div>
          </div>

          {/* Valores */}
          <motion.div variants={fadeUp}>
            <div className="text-center mb-12">
              <h3 className="text-4xl font-serif text-stone-900">Nuestros Valores</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Valor Cards */}
              {[
                { icon: Briefcase, title: "Profesionalismo", text: "Aplicar habilidades y experiencia de todos en el logro de los objetivos." },
                { icon: ShieldCheck, title: "Transparencia", text: "Comportamiento honesto e íntegro en todas nuestras actividades." },
                { icon: Handshake, title: "Compromiso", text: "Entregar todo nuestro esfuerzo, ética y profesionalismo." },
                { icon: Heart, title: "Enfoque al cliente", text: "Dirigir nuestras acciones a superar las expectativas." },
                { icon: Users, title: "Respeto", text: "Aceptar otros puntos de vista, opiniones y creencias." },
                { icon: Lightbulb, title: "Innovación", text: "Búsqueda continua de nuevas alternativas que den soluciones." },
                { icon: Users, title: "Trabajo en equipo", text: "Fomentar la colaboración efectiva alineada con un objetivo común." },
                { icon: TrendingUp, title: "Mejora continua", text: "Propuestas que permitan mejorar el desempeño de procesos." },
                { icon: BadgeCheck, title: "Confiabilidad", text: "Proporcionar seguridad e inspirar confianza a clientes." },
                { icon: CheckCircle, title: "Disciplina", text: "Constancia en el cumplimiento de responsabilidades y normativas." },
              ].map((val, idx) => (
                <div key={idx} className="group bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center mb-5 text-orange-500 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
                    <val.icon className="w-6 h-6" />
                  </div>
                  <strong className="text-stone-900 block mb-2 text-[15px]">{val.title}</strong>
                  <p className="text-xs text-stone-500 leading-relaxed">{val.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Política de Calidad */}
          <motion.div variants={fadeUp} className="rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl group">
            <img src="/hero/slide3.png" alt="Política de Calidad" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out" />
            <div className="absolute inset-0 bg-stone-900/85 backdrop-blur-[2px]"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-[100px] -z-0 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
              <div className="lg:w-[40%]">
                <div className="w-16 h-16 bg-white/10 text-orange-400 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Política de la Calidad</h3>
                <p className="text-stone-300 text-lg leading-relaxed">
                  Nuestra empresa busca dar soluciones de inversión confiables, seguras y rentables en el sector inmobiliario para nuestros clientes e inversionistas.
                </p>
              </div>
              
              <div className="lg:w-[60%]">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md h-full flex flex-col justify-center">
                  <p className="text-white font-medium mb-8 text-lg">Para cumplir con este propósito, nos comprometemos a:</p>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      "Fortalecer la capacidad de ventas.",
                      "Estandarizar procesos para seguimiento y mejora continua.",
                      "Mantener una estructura formal ajustada al propósito.",
                      "Promover una cultura coherente con nuestros valores.",
                      "Desarrollar proyectos que permitan mayor plusvalía.",
                      "Cumplir con lo comprometido a clientes e inversionistas.",
                      "Cumplir con los requisitos legales y reglamentarios."
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <CheckCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                        <span className="text-stone-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

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
          <motion.button variants={fadeUp} className="button dark" onClick={() => window.open('https://wa.me/59177820003', '_blank')}>Ver un proyecto en vivo <span>→</span></motion.button>
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
          <motion.button variants={fadeUp} className="button work-button" onClick={() => window.open('https://wa.me/59177820003', '_blank')}>Quiero ser parte de Prospera <span>→</span></motion.button>
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
        <button className="button primary" onClick={() => window.open('https://wa.me/59177820003', '_blank')}>Encontrar una opción para mí <span>→</span></button>
      </motion.section>
    </main>
  );
}
