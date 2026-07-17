"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { ArrowLeft, Check } from "lucide-react";
import { ProjectMap } from "./project-map";

export function ProjectDetail({ project, allProjects, onSelectProject, onBack }: { project: Project; allProjects?: Project[]; onSelectProject: (p: Project) => void; onBack: () => void }) {
  const [visitorLocation, setVisitorLocation] = useState<"scz" | "bol" | "ext">("scz");
  const [visitType, setVisitType] = useState<"virtual" | "presencial">("virtual");

  // Simulator state
  const [simValue, setSimValue] = useState(5230);
  const [simInitial, setSimInitial] = useState(100);
  const [simTerm, setSimTerm] = useState(7);
  
  // Fórmulas ficticias (basadas en la captura)
  const balance = simValue - simInitial;
  // If rate is 0% like in the screenshot
  const monthly = balance > 0 && simTerm > 0 ? balance / (simTerm * 12) : 0;

  // Render the floating back button
  const FloatingBack = () => (
    <div className="fixed bottom-8 left-8 z-50">
      <button onClick={onBack} className="bg-stone-900 text-white hover:bg-stone-800 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl">
        <ArrowLeft className="w-4 h-4" /> Todos los proyectos
      </button>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#f4efe5]">
      <FloatingBack />

      {/* HEADER NAVBAR */}
      <header className="flex items-center justify-between px-8 py-6 bg-[#f4efe5] border-b border-[#e9e2d5]">
        <div className="flex items-center gap-4">
          <img src={project.logo || "/brand/prospera.png"} alt="Prospera" className="h-8 object-contain" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none text-stone-900">{project.name}</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest mt-1">Un proyecto de Prospera</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-10 text-[10px] font-bold text-stone-900 uppercase tracking-widest">
          <a href="#plano" className="hover:text-orange-600 transition-colors">Plano</a>
          <a href="#simulador" className="hover:text-orange-600 transition-colors">Formas de compra</a>
          <a href="#confianza" className="hover:text-orange-600 transition-colors">Confianza</a>
          <a href="#agenda" className="hover:text-orange-600 transition-colors">Agenda</a>
        </nav>
        <button className="border border-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors">
          Agendar visita
        </button>
      </header>

      {/* 1. HERO SECTION */}
      <section className="bg-[#463323] text-[#f4efe5] min-h-[85vh] flex flex-col lg:flex-row relative overflow-hidden">
        {/* Background dots pattern would go here using CSS or an SVG */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center relative z-10">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] mb-12 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#db7844]"></span>
            SANTA CRUZ, BOLIVIA
          </div>
          
          <h1 className="font-serif text-6xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
            Tu terreno,<br/>
            <em className="text-[#db7844] italic">claro desde</em><br/>
            <em className="text-[#db7844] italic">cualquier lugar.</em>
          </h1>
          
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-8">
            {project.family} - {project.short}
          </div>
          
          <p className="text-lg max-w-md opacity-90 leading-relaxed mb-12 font-light">
            Conocé {project.name} con información verificable, un recorrido real y acompañamiento humano antes de tomar una decisión.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <a href="#plano" className="bg-[#db7844] hover:bg-[#c46838] text-white px-8 py-5 font-bold text-xs flex justify-between items-center transition-colors min-w-[200px]">
              Ver el plano real <span className="font-serif text-lg leading-none">↓</span>
            </a>
            <a href="#agenda" className="border border-white/20 hover:bg-white/5 text-white px-8 py-5 font-bold text-xs flex gap-3 justify-center items-center transition-colors">
              <span className="w-5 h-5 rounded-full border border-white/50 flex items-center justify-center text-[8px]">▶</span>
              Visita virtual en vivo
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-auto border-t border-white/10 pt-10">
            <div>
              <div className="font-serif text-3xl lg:text-4xl font-bold text-[#db7844] mb-2">360º</div>
              <div className="text-[9px] uppercase tracking-widest opacity-60">Recorrido guiado</div>
            </div>
            <div>
              <div className="font-serif text-3xl lg:text-4xl font-bold text-[#db7844] mb-2">1 a 1</div>
              <div className="text-[9px] uppercase tracking-widest opacity-60">Asesoría humana</div>
            </div>
            <div>
              <div className="font-serif text-2xl lg:text-3xl font-bold text-[#db7844] mb-2 mt-1">2 opciones</div>
              <div className="text-[9px] uppercase tracking-widest opacity-60">Visita virtual o presencial</div>
            </div>
          </div>
        </div>
        
        {/* RIGHT SIDE 3D MAP VISUAL */}
        <div className="lg:w-1/2 relative bg-[#8b7e64] overflow-hidden min-h-[400px]">
           <img 
             src={project.gallery && project.gallery.length > 0 ? project.gallery[0] : (project.plan || "/images/about.png")} 
             alt="Vista aérea" 
             className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#463323] opacity-60"></div>
           
           {/* Marker overlay based on screenshot */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-[#db7844] w-40 h-24 opacity-70 transform -skew-x-12 rotate-12 shadow-[0_20px_50px_rgba(219,120,68,0.5)] border border-white/20"></div>
              <div className="absolute -top-16 -right-24 bg-white p-5 shadow-2xl flex items-center gap-4">
                 <div className="w-5 h-5 rounded-full bg-[#db7844] shadow-[0_0_15px_rgba(219,120,68,0.6)]"></div>
                 <div>
                   <div className="font-bold text-stone-900 text-lg">{project.name}</div>
                   <div className="text-[9px] text-stone-500 uppercase tracking-widest">Explorar ubicación</div>
                 </div>
              </div>
           </div>
           
           <div className="absolute top-10 right-10">
             <button className="bg-[#33261c] text-[#f4efe5] text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-3 flex items-center gap-3">
               RECORRIDO AÉREO <span className="opacity-50 font-normal">DEMO</span>
             </button>
           </div>
        </div>
      </section>

      {/* 2. DESDE DÓNDE NOS VISITAS */}
      <section className="bg-[#f4efe5] py-32 px-8 lg:px-24" id="agenda">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-8 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#db7844]"></span>
            UNA EXPERIENCIA PARA VOS
          </div>
          <h2 className="font-serif text-5xl lg:text-7xl text-stone-900 mb-6 tracking-tight">
            ¿Desde dónde nos visitás?
          </h2>
          <p className="text-stone-600 mb-16 text-lg">La información y el siguiente paso cambian según tu ubicación.</p>
          
          <div className="flex flex-col md:flex-row border-b border-[#e9e2d5]">
            <button 
              onClick={() => setVisitorLocation("scz")}
              className={`flex-1 p-8 text-sm font-bold flex items-center gap-4 transition-colors ${visitorLocation === "scz" ? "bg-[#33261c] text-white" : "bg-transparent text-stone-900 hover:bg-[#e9e2d5]"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${visitorLocation === "scz" ? "bg-white/10" : "bg-stone-200"}`}>SC</span>
              Estoy en Santa Cruz
            </button>
            <button 
              onClick={() => setVisitorLocation("bol")}
              className={`flex-1 p-8 text-sm font-bold flex items-center gap-4 transition-colors ${visitorLocation === "bol" ? "bg-[#db7844] text-white" : "bg-transparent text-stone-900 hover:bg-[#e9e2d5]"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${visitorLocation === "bol" ? "bg-white/20" : "bg-stone-200"}`}>BO</span>
              Estoy en otra ciudad de Bolivia
            </button>
            <button 
              onClick={() => setVisitorLocation("ext")}
              className={`flex-1 p-8 text-sm font-bold flex items-center gap-4 transition-colors ${visitorLocation === "ext" ? "bg-[#33261c] text-white" : "bg-transparent text-stone-900 hover:bg-[#e9e2d5]"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${visitorLocation === "ext" ? "bg-white/10" : "bg-stone-200"}`}>INT</span>
              Estoy fuera de Bolivia
            </button>
          </div>

          <div className="bg-[#e9e2d5] p-16 flex flex-col md:flex-row items-center justify-between gap-12 mb-32">
            <div className="max-w-2xl">
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-4">
                 {visitorLocation === "scz" ? "SANTA CRUZ" : visitorLocation === "bol" ? "LA PAZ, ORURO Y TODO EL PAÍS" : "EUROPA, USA Y RESTO DEL MUNDO"}
               </div>
               <p className="font-serif text-3xl text-stone-900 leading-tight">
                 Primero hacemos una videollamada, revisamos mapa y documentos, y luego coordinamos tu visita.
               </p>
            </div>
            <button className="bg-[#33261c] hover:bg-black text-white px-8 py-5 font-bold text-xs flex gap-4 items-center whitespace-nowrap transition-colors">
              Coordinar visita asistida <span>→</span>
            </button>
          </div>
          
          {/* Formulario Conocé a tu manera */}
          <div className="flex flex-col lg:flex-row gap-20 items-start">
             <div className="lg:w-1/2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-8 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-[#db7844]"></span>
                  TU SIGUIENTE PASO
                </div>
                <h2 className="font-serif text-5xl lg:text-7xl text-stone-900 mb-6 tracking-tight">
                  Conocé {project.name}<br/>
                  <em className="text-[#db7844] italic">a tu manera.</em>
                </h2>
                <p className="text-stone-600 mb-16 max-w-md text-lg">Elegí una visita, contanos dónde estás y un asesor confirmará el horario por WhatsApp.</p>
                
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-full bg-[#524436] flex items-center justify-center text-white font-serif text-xl">P</div>
                   <div>
                     <div className="font-bold text-stone-900">Equipo Prospera</div>
                     <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Orientación comercial y coordinación de visitas</div>
                   </div>
                   <div className="ml-auto text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-stone-500">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>Disponible
                   </div>
                </div>
             </div>
             
             <div className="lg:w-1/2 bg-white shadow-2xl border-t-[6px] border-[#33261c] w-full">
                <div className="flex border-b border-stone-200">
                   <button onClick={() => setVisitType("virtual")} className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest ${visitType === "virtual" ? "bg-[#33261c] text-white" : "text-stone-500 hover:text-stone-900 bg-stone-50"}`}>Visita virtual</button>
                   <button onClick={() => setVisitType("presencial")} className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest ${visitType === "presencial" ? "bg-[#33261c] text-white" : "text-stone-500 hover:text-stone-900 bg-stone-50"}`}>Visita presencial</button>
                </div>
                
                <div className="p-10">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-10">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-900 tracking-[0.2em] mb-4">Nombre</label>
                      <input type="text" placeholder="Tu nombre" className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#db7844] text-stone-900 placeholder:text-stone-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-900 tracking-[0.2em] mb-4">WhatsApp</label>
                      <input type="text" placeholder="+591 ..." className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#db7844] text-stone-900 placeholder:text-stone-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-900 tracking-[0.2em] mb-4">¿Dónde estás?</label>
                      <select className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#db7844] text-stone-500">
                        <option>Seleccionar ciudad o país</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-900 tracking-[0.2em] mb-4">Objetivo</label>
                      <select className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#db7844] text-stone-500">
                        <option>¿Qué querés lograr?</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-stone-900 tracking-[0.2em] mb-4">Horario preferido</label>
                      <input type="text" placeholder="dd/mm/aaaa --:--" className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#db7844] text-stone-900 placeholder:text-stone-400" />
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#db7844] hover:bg-[#c46838] text-white font-bold py-5 text-sm transition-colors flex items-center justify-center gap-4">
                    Solicitar visita {visitType === "virtual" ? "virtual" : "presencial"} <span>→</span>
                  </button>
                  <p className="text-[9px] text-stone-400 text-center mt-6 uppercase tracking-widest leading-relaxed">Al confirmar, aceptás ser contactado para coordinar esta solicitud. No se realiza ningún pago desde este formulario.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. PLANO INTERACTIVO Y PESTAÑAS DE PROYECTOS */}
      <section className="bg-[#f4efe5] pt-12 pb-32 border-t border-[#e9e2d5]" id="plano">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-serif text-5xl lg:text-7xl text-stone-900 mb-6 tracking-tight">
              Elegí el lote.<br/>
              <em className="text-[#db7844] italic">Después simulá la compra.</em>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl">Recorré el plano oficial, identificá cada estado por color y hacé clic en cualquier pin. La ficha cargará el precio al contado del lote y lo enviará al simulador.</p>
          </div>

          {/* PROJECT TABS */}
          {allProjects && (
            <div className="flex overflow-x-auto border border-[#e9e2d5] bg-white mb-10 shadow-sm">
              {allProjects.map((p) => (
                <button 
                  key={p.key}
                  onClick={() => onSelectProject(p)}
                  className={`flex-1 py-8 px-6 flex items-center justify-center gap-4 border-r border-[#e9e2d5] transition-colors whitespace-nowrap min-w-[200px] ${project.key === p.key ? "border-b-4 border-b-[#db7844]" : "hover:bg-stone-50"}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${project.key === p.key ? "bg-[#db7844] text-white" : "border border-stone-200 text-stone-400"}`}>
                    {p.key === 'la-fortuna' ? 'LF' : p.key.replace('campo-grande-', 'CG')}
                  </span>
                  <span className={`text-sm font-bold ${project.key === p.key ? "text-stone-900" : "text-stone-500"}`}>{p.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* MAP AND INSTRUCTIONS CONTAINER */}
          <div className="flex flex-col lg:flex-row bg-white shadow-xl min-h-[600px]">
             {/* LEFT SIDE MAP */}
             <div className="lg:w-3/4 p-6 flex flex-col border-r border-stone-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.2em] mb-2">MÓDULO DE TERRENOS Y PLANOS</div>
                    <h3 className="font-serif text-3xl text-stone-900">{project.name}</h3>
                  </div>
                  {/* Fake Legend */}
                  <div className="hidden md:flex items-center gap-6 text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6db33f]"></span> Disponible</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e3241b]"></span> Vendido</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#4078c0]"></span> Reservado</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#999999]"></span> Bloqueado</div>
                  </div>
                </div>
                {/* INJECT THE MAP HERE */}
                <div className="flex-1 bg-stone-100 relative min-h-[600px]">
                   <ProjectMap planImage={project.plan} projectId={project.systemId?.toString()} />
                </div>
             </div>
             
             {/* RIGHT SIDE INSTRUCTIONS */}
             <div className="lg:w-1/4 bg-[#e9e2d5] p-10 flex flex-col">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#db7844] mb-6">
                  SELECCIONÁ UN PIN
                </div>
                <h3 className="font-serif text-3xl text-stone-900 mb-6">Elegí un terreno en el plano</h3>
                <p className="text-sm text-stone-600 mb-12">Una etapa madura del macroproyecto para comparar ubicación y oportunidades según disponibilidad.</p>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[9px] text-stone-500 font-bold shrink-0">01</div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs mb-1">Acercá el plano</div>
                      <div className="text-xs text-stone-500">Usá los controles del módulo para enfocar una zona.</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[9px] text-stone-500 font-bold shrink-0">02</div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs mb-1">Hacé clic en un pin</div>
                      <div className="text-xs text-stone-500">Verás manzano, lote, superficie, precio y estado.</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[9px] text-stone-500 font-bold shrink-0">03</div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs mb-1">Simulá la compra</div>
                      <div className="text-xs text-stone-500">La web cargará el valor del lote automáticamente.</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-[9px] text-stone-400 mt-auto pt-12 uppercase tracking-widest leading-relaxed">Los estados pueden cambiar. Prospera debe confirmar el lote antes de cualquier pago o reserva.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. VIDEO Y ESTADO DEL PROYECTO */}
      <section className="bg-[#f4efe5] px-8 lg:px-24 pb-32">
         <div className="flex flex-col lg:flex-row max-w-7xl mx-auto shadow-2xl">
            <div className="lg:w-1/2 bg-[#525244] text-[#f4efe5] p-12 lg:p-20 relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 w-96 h-96 border-[40px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
               <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-10 hover:bg-white hover:text-stone-900 transition-colors cursor-pointer relative z-10">
                 <span className="text-[10px]">↗</span>
               </div>
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-6 relative z-10">RECORRIDO REAL</div>
               <h2 className="font-serif text-4xl lg:text-5xl mb-6 relative z-10">Video aéreo y visita 360º</h2>
               <p className="opacity-80 mb-20 max-w-sm relative z-10">Reemplazar esta vista demo con tomas reales, fecha de captura y puntos de referencia.</p>
               <a href="#agenda" className="text-xs font-bold uppercase tracking-widest flex items-center justify-between border-b border-white/20 pb-4 hover:border-white transition-colors relative z-10">
                 Reservar recorrido guiado <span>→</span>
               </a>
            </div>
            
            <div className="lg:w-1/2 bg-white p-12 lg:p-20 flex flex-col justify-center">
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-6">ACTUALIZACIÓN CONTROLADA</div>
               <h2 className="font-serif text-4xl text-stone-900 mb-16">Estado del proyecto</h2>
               
               <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                   <span className="font-bold text-sm text-stone-900">Ubicación y accesos</span>
                   <span className="text-[10px] text-stone-900 font-bold tracking-widest uppercase">Verificable</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                   <span className="font-bold text-sm text-stone-900">Documentación</span>
                   <span className="text-[10px] text-stone-500 font-bold tracking-widest uppercase">Consulta guiada</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                   <span className="font-bold text-sm text-stone-900">Inventario</span>
                   <span className="text-[10px] text-[#db7844] font-bold tracking-widest uppercase">Sujeto a confirmación</span>
                 </div>
               </div>
               <p className="text-[9px] text-stone-400 mt-12 uppercase tracking-widest leading-relaxed">La versión final debe mostrar fecha de corte y responsable de cada dato.</p>
            </div>
         </div>
      </section>

      {/* 5. SIMULADOR FINANCIERO */}
      <section className="bg-[#463323] text-[#f4efe5] py-32 px-8 lg:px-24" id="simulador">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
           <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-8 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#db7844]"></span>
                SIMULACIÓN FINANCIERA VERIFICADA
              </div>
              <h2 className="font-serif text-5xl lg:text-7xl mb-8 tracking-tight">
                Del pin a una<br/>
                <em className="text-[#db7844] italic">cuota ficticia.</em>
              </h2>
              <p className="text-lg opacity-80 mb-20 max-w-md">Seleccioná un pin en el plano para cargar automáticamente su valor al contado, o usá el monto referencial para explorar una cuota.</p>
              
              <div className="space-y-12">
                <div className="flex gap-8 border-b border-white/10 pb-8">
                  <div className="text-[#db7844] font-bold text-[10px] mt-1">01</div>
                  <div>
                    <div className="font-bold text-white mb-2 text-lg">Seleccioná un lote</div>
                    <div className="text-sm opacity-70">El pin aporta manzano, lote, superficie, precio y estado.</div>
                  </div>
                </div>
                <div className="flex gap-8 border-b border-white/10 pb-8">
                  <div className="text-[#db7844] font-bold text-[10px] mt-1">02</div>
                  <div>
                    <div className="font-bold text-white mb-2 text-lg">Definí inicial y plazo</div>
                    <div className="text-sm opacity-70">Probá una condición ficticia de 1 a 10 años.</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-[#db7844] font-bold text-[10px] mt-1">03</div>
                  <div>
                    <div className="font-bold text-white mb-2 text-lg">Confirmá la cotización</div>
                    <div className="text-sm opacity-70">Un asesor revisa inventario, descuentos y condiciones vigentes.</div>
                  </div>
                </div>
              </div>
           </div>
           
           {/* CALCULATOR PANEL */}
           <div className="lg:w-1/2 bg-[#f4efe5] text-stone-900 p-12 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-stone-200 pb-6 mb-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">SIMULADOR DEL SISTEMA</div>
                <div className="bg-[#33261c] text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">{project.key === 'la-fortuna' ? 'LF' : project.key.replace('campo-grande-', 'CG')}</div>
              </div>
              
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Valor del terreno a simular</div>
                  <div className="font-serif text-3xl font-bold text-stone-900">USD {simValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <input type="range" min="3000" max="15000" step="100" value={simValue} onChange={e => {
                  const val = Number(e.target.value);
                  setSimValue(val);
                  if (simInitial > val) setSimInitial(val);
                }} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#33261c]" />
                <div className="text-[9px] text-stone-400 mt-3 uppercase tracking-widest">Rango registrado: USD 3,015 - 10,705</div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Cuota inicial</div>
                  <div className="font-serif text-2xl font-bold text-stone-900">USD {simInitial.toLocaleString()}</div>
                </div>
                <input type="range" min="0" max={simValue} step="100" value={simInitial} onChange={e => setSimInitial(Number(e.target.value))} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#db7844]" />
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Plazo</div>
                  <div className="font-serif text-2xl font-bold text-stone-900">{simTerm} años</div>
                </div>
                <input type="range" min="1" max="10" value={simTerm} onChange={e => setSimTerm(Number(e.target.value))} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#db7844]" />
              </div>

              <div className="bg-[#e9e2d5] p-8 mb-10">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-500 mb-2 tracking-widest">Saldo a financiar</div>
                    <div className="font-bold text-stone-900">USD {balance > 0 ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-500 mb-2 tracking-widest">Tasa anual aplicada</div>
                    <div className="font-bold text-stone-900">0 %</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-500 mb-2 tracking-widest">Número de cuotas</div>
                    <div className="font-bold text-stone-900">{simTerm * 12}</div>
                  </div>
                </div>
                
                <div className="border-t border-stone-300 pt-8">
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-500 mb-4">CUOTA MENSUAL ESTIMADA*</div>
                  <div className="flex items-end gap-3 text-[#db7844]">
                    <div className="font-serif text-6xl font-bold tracking-tight">USD {monthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs font-bold pb-2">/mes</div>
                  </div>
                  <p className="text-[9px] text-stone-500 mt-6 leading-relaxed uppercase tracking-widest">
                    *Cuota fija calculada con sistema francés, igual que el generador interno. No incluye seguro, descuentos, reserva ni conversión a bolivianos.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start mb-10 border border-emerald-100 bg-emerald-50/50 p-4">
                 <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5"><Check className="w-3 h-3" /></div>
                 <div>
                   <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 mb-1">Fórmula contrastada</div>
                   <div className="text-[9px] text-stone-500 leading-relaxed uppercase tracking-widest">Verificada contra planes de pago generados por el sistema el 12/07/2026. La disponibilidad y condición comercial final deben confirmarse con un asesor.</div>
                 </div>
              </div>
              
              <a href="#plano" className="block w-full bg-[#db7844] hover:bg-[#c46838] text-white text-center font-bold py-5 text-xs transition-colors uppercase tracking-[0.2em]">
                Elegir un lote en el plano <span className="ml-2">→</span>
              </a>
           </div>
        </div>
      </section>
      
      {/* 6. COMPRAR A DISTANCIA */}
      <section className="bg-[#1f1a17] text-[#f4efe5] py-32 px-8 lg:px-24">
         <div className="max-w-7xl mx-auto">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-8 flex items-center gap-4">
               <span className="w-8 h-[1px] bg-[#db7844]"></span>
               COMPRAR A DISTANCIA
            </div>
            <h2 className="font-serif text-5xl lg:text-7xl mb-6 tracking-tight">Cerca, aunque estés lejos.</h2>
            <p className="text-lg opacity-80 mb-20 max-w-xl">Una ruta humana para vos y para quienes te ayudan a decidir.</p>
            
            <div className="grid md:grid-cols-4 border-t border-white/10">
               <div className="p-10 border-b md:border-b-0 md:border-r border-white/10 relative hover:bg-white/5 transition-colors">
                  <div className="text-[#db7844] text-[10px] font-bold mb-12">01</div>
                  <h3 className="font-serif text-3xl font-bold mb-4">Explorá</h3>
                  <p className="text-sm opacity-70 leading-relaxed">Ubicación, recorrido y estado actual en un solo lugar.</p>
               </div>
               <div className="p-10 border-b md:border-b-0 md:border-r border-white/10 relative hover:bg-white/5 transition-colors">
                  <div className="text-[#db7844] text-[10px] font-bold mb-12">02</div>
                  <h3 className="font-serif text-3xl font-bold mb-4">Conversá</h3>
                  <p className="text-sm opacity-70 leading-relaxed">Un asesor entiende tu objetivo y responde con claridad.</p>
               </div>
               <div className="p-10 border-b md:border-b-0 md:border-r border-white/10 relative hover:bg-white/5 transition-colors">
                  <div className="text-[#db7844] text-[10px] font-bold mb-12">03</div>
                  <h3 className="font-serif text-3xl font-bold mb-4">Verificá</h3>
                  <p className="text-sm opacity-70 leading-relaxed">Revisá documentos, disponibilidad y condiciones vigentes.</p>
               </div>
               <div className="p-10 relative hover:bg-white/5 transition-colors">
                  <div className="text-[#db7844] text-[10px] font-bold mb-12">04</div>
                  <h3 className="font-serif text-3xl font-bold mb-4">Visitá</h3>
                  <p className="text-sm opacity-70 leading-relaxed">Elegí recorrido presencial o videollamada desde el terreno.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 7. CENTRO DE CONFIANZA */}
      <section className="bg-[#f4efe5] pt-32 pb-24 border-t border-[#e9e2d5]" id="confianza">
         <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-500 mb-8 flex items-center justify-center gap-4">
                  <span className="w-8 h-[1px] bg-stone-300"></span>
                  CENTRO DE CONFIANZA
                  <span className="w-8 h-[1px] bg-stone-300"></span>
               </div>
               <h2 className="font-serif text-5xl lg:text-7xl text-stone-900 mb-6 tracking-tight">
                  Todo lo importante,<br/>
                  <em className="text-[#db7844] italic">antes de avanzar.</em>
               </h2>
               <p className="text-stone-500 text-lg max-w-2xl mx-auto">Un espacio diseñado para responder las preguntas que más pesan cuando comprás desde otra ciudad o país</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
               <div className="bg-[#fcfaf7] border border-[#e9e2d5] p-10 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#db7844] flex items-center justify-center text-[9px] font-bold text-[#db7844] mb-8 uppercase tracking-widest">DOC</div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-4">Documentación del proyecto</h3>
                  <p className="text-sm text-stone-500 mb-12">Índice simple y documentos aprobados para consulta.</p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-900">Ver índice →</div>
               </div>
               <div className="bg-[#fcfaf7] border border-[#e9e2d5] p-10 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#db7844] flex items-center justify-center text-[9px] font-bold text-[#db7844] mb-8 uppercase tracking-widest">ARC</div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-4">Contrato explicado</h3>
                  <p className="text-sm text-stone-500 mb-12">Qué significa cada etapa, obligación y condición.</p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-900">Entender el proceso →</div>
               </div>
               <div className="bg-[#fcfaf7] border border-[#e9e2d5] p-10 hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#db7844] flex items-center justify-center text-[9px] font-bold text-[#db7844] mb-8 uppercase tracking-widest">RX</div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-4">Pagos seguros</h3>
                  <p className="text-sm text-stone-500 mb-12">Canales empresariales, comprobantes y trazabilidad.</p>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-900">Cómo pagar →</div>
               </div>
            </div>
            
            <div className="bg-[#e9e2d5] p-8 flex items-start gap-6 max-w-4xl mx-auto">
               <div className="w-8 h-8 rounded-full bg-[#525244] text-white flex items-center justify-center shrink-0 mt-1"><Check className="w-4 h-4" /></div>
               <div>
                  <h4 className="font-bold text-stone-900 text-lg mb-2">Una regla simple de seguridad</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">Los asesores orientan y acompañan, no reciben dinero. Todo pago debe realizarse por canales oficialmente aprobados y generar respaldo.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
