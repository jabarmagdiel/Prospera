"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { ArrowLeft, Check, MapPin, Calendar, Clock, User, Phone, Globe, Video, Send, Compass } from "lucide-react";
import { ProjectMap } from "./project-map";

export function ProjectDetail({ project, allProjects, onSelectProject, onBack }: { project: Project; allProjects?: Project[]; onSelectProject: (p: Project) => void; onBack: () => void }) {
  const [visitorLocation, setVisitorLocation] = useState<"scz" | "bol" | "ext">("scz");
  const [visitType, setVisitType] = useState<"virtual" | "presencial">("virtual");

  // Selected Lot State for side-by-side view
  const [selectedLot, setSelectedLot] = useState<{
    manzano?: string;
    lote?: string;
    superficie?: string;
    estado?: string;
    id?: string;
    precio?: string;
  } | null>({
    manzano: "17",
    lote: "12",
    superficie: "300 m²",
    estado: "Disponible",
    id: "#8496",
    precio: "7.500"
  });

  // Simulator state
  const [simValue, setSimValue] = useState(7500);
  const [simInitial, setSimInitial] = useState(100);
  const [simTerm, setSimTerm] = useState(7);
  
  // Tabla de tasas según especificación del usuario:
  // 1-5 años: 12%, 6 años: 12.5%, 7 años: 13%, 8 años: 13.5%, 9 años: 14%, 10 años: 15%
  const getAnnualRate = (years: number) => {
    if (years <= 5) return 0.12;
    if (years === 6) return 0.125;
    if (years === 7) return 0.13;
    if (years === 8) return 0.135;
    if (years === 9) return 0.14;
    return 0.15;
  };

  const annualRate = getAnnualRate(simTerm);
  const annualRateDisplay = `${(annualRate * 100).toString().replace('.', ',')} %`;
  
  const balance = simValue - simInitial;
  const numMonths = simTerm * 12;
  const monthlyRate = annualRate / 12;
  
  // Sistema Francés de amortización: P = Saldo * [ r * (1+r)^n ] / [ (1+r)^n - 1 ]
  const monthly = balance > 0 && numMonths > 0 
    ? (monthlyRate > 0 
        ? balance * (monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1) 
        : balance / numMonths)
    : 0;

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
          <h1 className="font-serif text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
            Tu inversión segura<br/>
            <em className="text-[#db7844] italic">desde cualquier locación.</em>
          </h1>
          
          <p className="text-lg max-w-md opacity-90 leading-relaxed mb-12 font-light">
            Conocé {project.name} con información verificable, un recorrido real y acompañamiento humano antes de tomar una decisión.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#plano" className="bg-[#db7844] hover:bg-[#c46838] text-white px-8 py-5 font-bold text-xs flex justify-between items-center transition-colors min-w-[200px]">
              Ver el plano real <span className="font-serif text-lg leading-none">↓</span>
            </a>
            <a href="#agenda" className="border border-white/20 hover:bg-white/5 text-white px-8 py-5 font-bold text-xs flex gap-3 justify-center items-center transition-colors">
              <span className="w-5 h-5 rounded-full border border-white/50 flex items-center justify-center text-[8px]">▶</span>
              Visita virtual en vivo
            </a>
          </div>
        </div>
        
        {/* RIGHT SIDE VIDEO VISUAL */}
        <div className="lg:w-1/2 relative bg-[#33261c] overflow-hidden min-h-[400px]">
           <video
             src={(project as any).video || "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-41551-large.mp4"}
             autoPlay
             loop
             muted
             playsInline
             className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
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
               RECORRIDO AÉREO <span className="opacity-50 font-normal">VIDEO HD</span>
             </button>
           </div>
        </div>
      </section>      {/* 3. PLANO INTERACTIVO Y PESTAÑAS DE PROYECTOS */}
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
            <div className="flex overflow-x-auto border border-[#e9e2d5] bg-white mb-10 shadow-sm rounded-2xl p-2 gap-2">
              {allProjects.map((p) => {
                const isActive = project.key === p.key;
                return (
                  <button 
                    key={p.key}
                    onClick={() => onSelectProject(p)}
                    className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 rounded-xl transition-all whitespace-nowrap min-w-[180px] cursor-pointer ${
                      isActive 
                        ? "bg-[#463323] text-white shadow-md" 
                        : "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-[#db7844] text-white shadow-sm" : "bg-stone-100 text-stone-500 border border-stone-200"
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-bold tracking-wide ${isActive ? "text-white" : "text-stone-700"}`}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* MAP AND LOT DETAIL CONTAINER */}
          <div className="flex flex-col lg:flex-row bg-white shadow-xl min-h-[600px] rounded-3xl overflow-hidden border border-[#e9e2d5]">
             {/* LEFT SIDE MAP */}
             <div className="lg:w-2/3 p-6 flex flex-col border-r border-stone-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.2em] mb-2">MÓDULO DE TERRENOS Y PLANOS</div>
                    <h3 className="font-serif text-3xl text-stone-900">{project.name}</h3>
                  </div>
                  {/* Legend */}
                  <div className="hidden md:flex items-center gap-6 text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6db33f]"></span> Disponible</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#e3241b]"></span> Vendido</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#4078c0]"></span> Reservado</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#999999]"></span> Bloqueado</div>
                  </div>
                </div>
                {/* INJECT THE MAP HERE */}
                <div className="flex-1 bg-stone-100 relative min-h-[600px]">
                   <ProjectMap 
                     planImage={project.plan} 
                     projectId={project.systemId?.toString()} 
                     onSelectLot={(lot) => {
                       setSelectedLot(lot);
                       if (lot && lot.precio) {
                         var rawStr = String(lot.precio).replace(/[^0-9\.,]/g, '');
                         if (rawStr.includes(',') && rawStr.includes('.')) {
                           rawStr = rawStr.replace(/,/g, '');
                         } else if (rawStr.includes('.') && rawStr.split('.')[1].length === 3) {
                           rawStr = rawStr.replace(/\./g, '');
                         } else if (rawStr.includes(',')) {
                           rawStr = rawStr.replace(/,/g, '.');
                         }
                         var parsedPrice = parseFloat(rawStr);
                         if (!isNaN(parsedPrice) && parsedPrice > 0) {
                           setSimValue(parsedPrice);
                         }
                       }
                     }}
                   />
                </div>
             </div>
             
             {/* RIGHT SIDE SIDE-BY-SIDE LOT DETAILS PANEL */}
             <div className="lg:w-1/3 bg-[#f4efe5] p-8 lg:p-10 flex flex-col justify-between border-l border-[#e9e2d5] relative overflow-hidden">
                {selectedLot ? (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Status Badge */}
                      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#db7844] mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#db7844]"></span>
                        {(selectedLot.estado || "DISPONIBLE").toUpperCase()}
                      </div>

                      {/* Project Name Subtitle */}
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-8">
                        {project.name}
                      </div>

                      {/* Large Title */}
                      <h3 className="font-serif text-4xl lg:text-5xl text-stone-900 leading-tight mb-8">
                        Manzano {selectedLot.manzano || "17"}<br/>
                        Lote {selectedLot.lote || "12"}
                      </h3>

                      {/* Key Value Table Rows */}
                      <div className="border-t border-[#e3dcd0] pt-6 space-y-4 mb-8 text-sm">
                        <div className="flex justify-between items-center py-2.5 border-b border-[#e3dcd0]">
                          <span className="text-stone-600">Superficie</span>
                          <span className="font-semibold text-stone-900">{selectedLot.superficie || "300 m²"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-[#e3dcd0]">
                          <span className="text-stone-600">Estado registrado</span>
                          <span className="font-semibold text-stone-900">{selectedLot.estado || "Disponible"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-[#e3dcd0]">
                          <span className="text-stone-600">Identificador</span>
                          <span className="font-mono text-xs text-stone-600 font-semibold">{selectedLot.id || "#8496"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Footer */}
                    <div className="border-t border-[#e3dcd0] pt-6 mt-auto">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                        COTIZACIÓN AL CONTADO REGISTRADA
                      </div>
                      <div className="font-serif text-4xl lg:text-5xl font-bold text-[#db7844] mb-3">
                        USD {selectedLot.precio || "7.500"}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-light">
                        Valor informado por el módulo para este lote. No constituye reserva.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#db7844] mb-6">
                        SELECCIONÁ UN LOTE
                      </div>
                      <h3 className="font-serif text-3xl text-stone-900 mb-6">Explorá el plano interactivo</h3>
                      <p className="text-sm text-stone-600 mb-8 leading-relaxed">Hacé clic en cualquier manzana o lote en el plano para desplegar la información y cotización registrada.</p>
                    </div>
                    <p className="text-[9px] text-stone-400 mt-auto pt-12 uppercase tracking-widest leading-relaxed">
                      Los estados pueden cambiar. Prospera debe confirmar el lote antes de cualquier pago o reserva.
                    </p>
                  </div>
                )}
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
                <input type="range" min="2000" max={Math.max(25000, Math.ceil(simValue))} step="50" value={simValue} onChange={e => {
                  const val = Number(e.target.value);
                  setSimValue(val);
                  if (simInitial > val) setSimInitial(val);
                }} className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#33261c]" />
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
                    <div className="font-bold text-stone-900">{annualRateDisplay}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-stone-500 mb-2 tracking-widest">Número de cuotas</div>
                    <div className="font-bold text-stone-900">{simTerm * 12}</div>
                  </div>
                </div>
                
                <div className="border-t border-stone-300 pt-8">
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-500 mb-4">CUOTA MENSUAL ESTIMADA</div>
                  <div className="flex items-end gap-3 text-[#db7844]">
                    <div className="font-serif text-6xl font-bold tracking-tight">USD {monthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs font-bold pb-2">/mes</div>
                  </div>
                </div>
              </div>
              
              <a href="#agenda" className="block w-full bg-[#db7844] hover:bg-[#c46838] text-white text-center font-bold py-5 text-xs transition-colors uppercase tracking-[0.2em]">
                Agendar visita para este proyecto <span className="ml-2">→</span>
              </a>
           </div>
        </div>
      </section>

      {/* 5.5. AGENDAR VISITA / CITA (UBICADO DEBAJO DEL SIMULADOR) */}
      <section className="bg-[#f4efe5] py-28 px-8 lg:px-24 border-t border-[#e9e2d5]" id="agenda">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            
            {/* LEFT SIDE COPY */}
            <div className="lg:w-1/2">
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#db7844] mb-6 flex items-center gap-3">
                 <span className="w-6 h-[1px] bg-[#db7844]"></span>
                 TU SIGUIENTE PASO
               </div>
               
               <h2 className="font-serif text-5xl lg:text-6xl text-stone-900 mb-6 leading-tight">
                 Conocé {project.name}<br/>
                 <em className="text-[#db7844] italic">a tu manera.</em>
               </h2>
               
               <p className="text-stone-600 text-lg mb-12 max-w-lg leading-relaxed">
                 Elegí una visita, contanos dónde estás y un asesor confirmará el horario por WhatsApp para guiarte en vivo o en terreno.
               </p>

               {/* TEAM BADGE */}
               <div className="inline-flex items-center gap-4 bg-[#e9e2d5] p-4 rounded-2xl border border-[#d8d0c2]">
                 <div className="w-12 h-12 rounded-full bg-[#33261c] text-white flex items-center justify-center font-serif text-xl font-bold">
                   P
                 </div>
                 <div>
                   <div className="font-bold text-stone-900 text-sm">Equipo Prospera</div>
                   <div className="text-[10px] text-stone-500 uppercase tracking-widest">Orientación comercial y coordinación de visitas</div>
                 </div>
                 <div className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disponible
                 </div>
               </div>
            </div>

            {/* RIGHT SIDE FORM CARD WITH ICONS */}
            <div className="lg:w-1/2 w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#e3dcd0]">
               {/* TYPE SELECTION TABS */}
               <div className="flex border-b border-stone-200">
                  <button 
                    onClick={() => setVisitType("virtual")}
                    className={`flex-1 py-5 px-6 font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${
                      visitType === "virtual" 
                        ? "bg-[#33261c] text-white" 
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#db7844]" />
                    Visita Virtual
                  </button>
                  <button 
                    onClick={() => setVisitType("presencial")}
                    className={`flex-1 py-5 px-6 font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all ${
                      visitType === "presencial" 
                        ? "bg-[#33261c] text-white" 
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#db7844]" />
                    Visita Presencial
                  </button>
               </div>

               {/* FORM BODY */}
               <form onSubmit={(e) => { e.preventDefault(); alert("¡Solicitud enviada! Un asesor te contactará por WhatsApp."); }} className="p-8 lg:p-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {/* NOMBRE */}
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                           <User className="w-3.5 h-3.5 text-[#db7844]" /> Nombre completo
                        </label>
                        <input 
                           type="text" 
                           placeholder="Tu nombre y apellido" 
                           required 
                           className="w-full bg-[#f9f7f4] border border-stone-200 p-3.5 text-sm text-stone-900 rounded-xl focus:outline-none focus:border-[#db7844] transition-colors"
                        />
                     </div>

                     {/* WHATSAPP */}
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                           <Phone className="w-3.5 h-3.5 text-[#db7844]" /> WhatsApp
                        </label>
                        <input 
                           type="tel" 
                           defaultValue="+591 " 
                           required 
                           className="w-full bg-[#f9f7f4] border border-stone-200 p-3.5 text-sm text-stone-900 rounded-xl focus:outline-none focus:border-[#db7844] transition-colors font-mono"
                        />
                     </div>

                     {/* UBICACIÓN */}
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                           <Globe className="w-3.5 h-3.5 text-[#db7844]" /> ¿Dónde estás?
                        </label>
                        <select 
                           value={visitorLocation} 
                           onChange={(e) => setVisitorLocation(e.target.value as any)}
                           className="w-full bg-[#f9f7f4] border border-stone-200 p-3.5 text-sm text-stone-900 rounded-xl focus:outline-none focus:border-[#db7844] transition-colors cursor-pointer"
                        >
                           <option value="scz">Santa Cruz</option>
                           <option value="bol">Resto de Bolivia</option>
                           <option value="ext">Exterior / Fuera de Bolivia</option>
                        </select>
                     </div>

                     {/* OBJETIVO */}
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                           <Compass className="w-3.5 h-3.5 text-[#db7844]" /> Objetivo
                        </label>
                        <select className="w-full bg-[#f9f7f4] border border-stone-200 p-3.5 text-sm text-stone-900 rounded-xl focus:outline-none focus:border-[#db7844] transition-colors cursor-pointer">
                           <option>Inversión a futuro</option>
                           <option>Vivienda propia</option>
                           <option>Quinta / Recreación</option>
                        </select>
                     </div>
                  </div>

                  {/* HORARIO PREFERIDO */}
                  <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#db7844]" /> Horario o fecha preferida
                     </label>
                     <input 
                        type="text" 
                        placeholder="Ej. Mañana por la tarde / Sábado 10:00 AM" 
                        className="w-full bg-[#f9f7f4] border border-stone-200 p-3.5 text-sm text-stone-900 rounded-xl focus:outline-none focus:border-[#db7844] transition-colors"
                     />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button 
                     type="submit" 
                     className="w-full bg-[#db7844] hover:bg-[#c46838] text-white font-bold py-5 rounded-xl text-xs uppercase tracking-[0.2em] transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                     Solicitar visita {visitType === "virtual" ? "virtual" : "presencial"} <Send className="w-4 h-4 ml-1" />
                  </button>

                  <p className="text-[9px] text-stone-400 text-center leading-relaxed uppercase tracking-widest pt-2">
                     Al confirmar, aceptás ser contactado para coordinar esta solicitud. No se realiza ningún pago desde este formulario.
                  </p>
                </form>
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
