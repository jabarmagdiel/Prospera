"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { HeroCarousel } from "./hero-carousel";
import { motion, useScroll, useTransform } from "framer-motion";

import { ProjectCardCarousel } from "./project-card-carousel";
import { PaymentSimulator } from "./payment-simulator";
import { SmartWhatsapp } from "./smart-whatsapp";
import { Header } from "./header";
import { Star, Target, Eye, Briefcase, ShieldCheck, Handshake, Heart, Users, Lightbulb, TrendingUp, CheckCircle, FileText, BadgeCheck, MapPin, Building2, Award, ArrowRight } from "lucide-react";

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
      
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="corp-hero" id="inicio">
        <motion.div 
          className="corp-hero-copy !py-10 md:!py-16 lg:!py-20"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="eyebrow light !mb-2"><span></span> Santa Cruz de la Sierra</motion.p>
          <motion.h1 variants={fadeUp} className="!text-4xl md:!text-5xl lg:!text-6xl !leading-tight !mb-4 !mt-0">
            Un terreno puede ser<br/><em>el comienzo de algo grande.</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="!text-base !mb-6 !mt-2">
            En Prospera desarrollamos proyectos urbanísticos para quienes quieren vivir mejor, invertir con criterio o dejar patrimonio. Te ayudamos a entender cada opción y avanzar con una condición que sí puedas sostener.
          </motion.p>
          <motion.div variants={fadeUp} className="hero-actions flex gap-4">
            <button className="button primary !py-3 !px-6 !text-sm" tabIndex={0} onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}>Encontrá tu proyecto <span>↓</span></button>
            <button className="button ghost !py-3 !px-6 !text-sm" tabIndex={0} onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}>Conocé Prospera</button>
          </motion.div>
        </motion.div>
        <HeroCarousel />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <motion.section
        className="bg-stone-900 py-10 border-b border-stone-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "4+", label: "Proyectos activos", icon: Building2 },
            { value: "10 años", label: "En el mercado boliviano", icon: Award },
            { value: "Santa Cruz", label: "Sede principal", icon: MapPin },
            { value: "100%", label: "Financiamiento directo", icon: CheckCircle },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2">
              <stat.icon className="w-6 h-6 text-orange-500 mb-1" />
              <span className="text-3xl font-serif text-white font-bold">{stat.value}</span>
              <span className="text-xs text-stone-400 uppercase tracking-widest">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── QUIÉNES SOMOS ─────────────────────────────────────── */}
      <motion.section
        className="bg-[#faf8f4] py-24 md:py-32"
        id="nosotros"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Imagen */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] relative">
              <img
                src="/hero/slide1.png"
                alt="Equipo Prospera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white rounded-3xl px-6 py-4 shadow-xl">
              <span className="text-3xl font-serif font-bold block">+10</span>
              <span className="text-xs font-bold tracking-widest uppercase opacity-90">años de experiencia</span>
            </div>
            {/* Second image overlap */}
            <div className="absolute -top-6 -left-6 w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl hidden md:block">
              <img src="/hero/slide3.png" alt="Proyecto Prospera" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Texto */}
          <div>
            <motion.p variants={fadeUp} className="eyebrow"><span></span> Quiénes somos</motion.p>
            <motion.h2 variants={fadeUp} className="about-copy-h2 font-serif text-4xl md:text-5xl text-stone-900 mt-4 mb-6 leading-tight">
              Planificamos tierra.<br/><em className="font-serif italic text-orange-600 not-italic">Impulsamos futuro.</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-stone-700 text-lg font-medium mb-4 leading-relaxed">
              Prospera es una empresa de desarrollos inmobiliarios situada en Santa Cruz de la Sierra, Bolivia.
            </motion.p>
            <motion.p variants={fadeUp} className="text-stone-500 leading-relaxed mb-4">
              Analizamos cada proyecto con criterios de rentabilidad, seguridad jurídica, ubicación y proyección, para garantizar inversiones transparentes y rentables para nuestros clientes e inversionistas.
            </motion.p>
            <motion.p variants={fadeUp} className="text-stone-500 leading-relaxed mb-8">
              La gestión de riesgos, la aprobación rigurosa de proyectos y la rigurosidad jurídica son los pilares que nos permiten ofrecer confianza y seguridad en cada operación.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Seguridad jurídica
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Financiamiento directo
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Asesoría personalizada
              </div>
            </motion.div>
            <motion.button
              variants={fadeUp}
              className="mt-8 flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all text-sm"
              onClick={() => window.open('https://wa.me/59177820003', '_blank')}
            >
              Hablá con un asesor <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ── MISIÓN / VISIÓN / VALORES (resumido) ─────────────── */}
      <section className="bg-stone-50 py-24 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200/50 mb-4">
              <Star className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-semibold tracking-wider uppercase text-xs">Nuestra Esencia</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif text-stone-900">Los cimientos de nuestro trabajo</motion.h2>
          </motion.div>

          {/* Misión y Visión */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="group bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-[55%] p-10 flex flex-col justify-center">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-4">Misión</h3>
                <p className="text-stone-600 leading-relaxed text-base">Desarrollar e implementar soluciones de inversión confiables, seguras y rentables en el sector inmobiliario mediante una gestión innovadora y eficiente.</p>
              </div>
              <div className="md:w-[45%] min-h-[280px] relative overflow-hidden">
                <img src="/hero/slide1.png" alt="Misión Prospera" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="group bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row-reverse">
              <div className="md:w-[55%] p-10 flex flex-col justify-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-4">Visión</h3>
                <p className="text-stone-600 leading-relaxed text-base">Ser un referente sólido, confiable e innovador que gestiona inversiones inmobiliarias, superando las expectativas de clientes e inversionistas.</p>
              </div>
              <div className="md:w-[45%] min-h-[280px] relative overflow-hidden">
                <img src="/hero/slide2.png" alt="Visión Prospera" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
              </div>
            </motion.div>
          </motion.div>

          {/* Valores — compacto */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.h3 variants={fadeUp} className="text-3xl font-serif text-stone-900 text-center mb-10">Nuestros Valores</motion.h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: Briefcase, title: "Profesionalismo" },
                { icon: ShieldCheck, title: "Transparencia" },
                { icon: Handshake, title: "Compromiso" },
                { icon: Heart, title: "Enfoque al cliente" },
                { icon: Users, title: "Respeto" },
                { icon: Lightbulb, title: "Innovación" },
                { icon: Users, title: "Trabajo en equipo" },
                { icon: TrendingUp, title: "Mejora continua" },
                { icon: BadgeCheck, title: "Confiabilidad" },
                { icon: CheckCircle, title: "Disciplina" },
              ].map((val, idx) => (
                <motion.div key={idx} variants={fadeUp} className="group bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3 text-orange-500 group-hover:bg-orange-50 group-hover:scale-110 transition-all duration-300">
                    <val.icon className="w-5 h-5" />
                  </div>
                  <strong className="text-stone-800 text-sm leading-tight">{val.title}</strong>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Política de Calidad */}
          <motion.div
            className="mt-16 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <img src="/hero/slide3.png" alt="Política de Calidad" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s] ease-out" />
            <div className="absolute inset-0 bg-stone-900/85 backdrop-blur-[2px]" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-[38%]">
                <div className="w-14 h-14 bg-white/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-4xl font-serif text-white mb-4 leading-tight">Política de la Calidad</h3>
                <p className="text-stone-300 leading-relaxed">Nuestra empresa busca dar soluciones de inversión confiables, seguras y rentables para nuestros clientes e inversionistas.</p>
              </div>
              <div className="lg:w-[62%]">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                  <p className="text-white font-medium mb-6">Nos comprometemos a:</p>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      "Fortalecer la capacidad de ventas.",
                      "Estandarizar procesos para seguimiento y mejora continua.",
                      "Mantener una estructura formal ajustada al propósito.",
                      "Promover una cultura coherente con nuestros valores.",
                      "Desarrollar proyectos que permitan mayor plusvalía.",
                      "Cumplir con lo comprometido a clientes e inversionistas.",
                      "Cumplir con los requisitos legales y reglamentarios."
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="text-stone-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROYECTOS ─────────────────────────────────────────── */}
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
      
      {/* ── RESPALDO / PROCESO ───────────────────────────────── */}
      {/* ── RESPALDO / PROCESO ───────────────────────────────── */}
      <motion.section 
        className="py-24 bg-stone-900 text-white relative overflow-hidden" 
        id="respaldo"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* Ambient light glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-6">
                <ShieldCheck className="w-4 h-4" />
                Una decisión importante merece claridad
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Comprar terreno no debería sentirse <span className="italic text-orange-400">como un salto a ciegas.</span>
              </h2>
              <p className="text-stone-300 text-lg max-w-2xl leading-relaxed">
                Por eso te acompañamos en cada paso con información transparente, asesoría personalizada y recorridos en vivo antes de tomar cualquier decisión.
              </p>
            </motion.div>

            {/* Feature Highlight Box / Image on the right to fill empty space */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <div className="bg-stone-800/80 border border-stone-700/80 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-white">Garantía Prospera</h4>
                    <p className="text-stone-400 text-xs">Transparencia y respaldo jurídico total</p>
                  </div>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  Verificamos cada aspecto técnico y legal para que tu inversión esté 100% resguardada desde el primer día.
                </p>
                <div className="pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs text-stone-400">
                  <span>Asesoría gratuita</span>
                  <button onClick={() => window.open('https://wa.me/59177820003', '_blank')} className="text-orange-400 font-medium hover:underline flex items-center gap-1">Sin compromisos →</button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4 Process Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Entendé",
                desc: "Conocé qué propone cada proyecto, su ubicación estratégica y para quién funciona mejor.",
                icon: Lightbulb
              },
              {
                num: "02",
                title: "Compará",
                desc: "Revisá las etapas de desarrollo, modalidades de pago y opciones de plusvalía a futuro.",
                icon: TrendingUp
              },
              {
                num: "03",
                title: "Conocé",
                desc: "Visitá el terreno en persona o realizá un recorrido interactivo guiado por videollamada.",
                icon: Eye
              },
              {
                num: "04",
                title: "Decidí",
                desc: "Avanzá con total tranquilidad cuando la alternativa se ajuste a tu plan y presupuesto.",
                icon: CheckCircle
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group bg-stone-800/50 border border-stone-700/60 hover:border-orange-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl text-orange-400/80 font-bold">{step.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-stone-700/50 text-stone-300 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3">{step.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
