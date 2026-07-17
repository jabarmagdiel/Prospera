"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function PaymentSimulator() {
  const [amount, setAmount] = useState(15000);
  const [years, setYears] = useState(3);
  const [downPayment, setDownPayment] = useState(10); // 10%

  // Basic calculation: Total - downPayment, divided by months. No interest for simplicity, or 0% interest for direct financing.
  const principal = amount - (amount * (downPayment / 100));
  const months = years * 12;
  const monthlyPayment = principal / months;

  return (
    <motion.section 
      className="py-24 bg-white border-y border-stone-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Copy Section */}
        <div>
          <p className="eyebrow"><span></span> Opciones a tu medida</p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mt-4 mb-6 leading-tight">
            Descubrí lo accesible que es <em>invertir en tu futuro.</em>
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            En Prospera ofrecemos financiamiento directo a sola firma, sin trámites bancarios engorrosos. Usá nuestro simulador para encontrar una cuota mensual que se ajuste a tu realidad.
          </p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-stone-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">✓</span>
              Sin intereses (0%) a corto plazo.
            </li>
            <li className="flex items-center gap-3 text-sm text-stone-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">✓</span>
              Aprobación inmediata a sola firma.
            </li>
            <li className="flex items-center gap-3 text-sm text-stone-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">✓</span>
              Plazos flexibles hasta 5 años.
            </li>
          </ul>
        </div>

        {/* Interactive Simulator */}
        <div className="bg-stone-50 rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -z-0 opacity-50"></div>
          
          <div className="relative z-10">
            <h3 className="font-serif text-2xl text-stone-800 mb-8">Simulador de Cuotas</h3>
            
            <div className="space-y-8">
              {/* Slider 1: Amount */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Valor del Terreno</label>
                  <span className="text-xl font-bold text-stone-900">$us {amount.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min="8000" 
                  max="40000" 
                  step="1000" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              {/* Slider 2: Down Payment */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Cuota Inicial (%)</label>
                  <span className="text-xl font-bold text-stone-900">{downPayment}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="5" 
                  value={downPayment} 
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              {/* Slider 3: Years */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Plazo</label>
                  <span className="text-xl font-bold text-stone-900">{years} {years === 1 ? 'año' : 'años'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            {/* Results */}
            <div className="mt-10 p-6 bg-stone-900 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Tu cuota mensual estimada</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif">$us {Math.round(monthlyPayment)}</span>
                  <span className="text-stone-400 text-sm">/ mes</span>
                </div>
                <p className="text-stone-500 text-[10px] mt-2 leading-tight max-w-[200px]">Simulación referencial sin intereses. Sujeto a aprobación de crédito directo.</p>
              </div>
              <button className="button primary !bg-orange-600 hover:!bg-orange-700 whitespace-nowrap w-full md:w-auto">
                Consultar plan
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
