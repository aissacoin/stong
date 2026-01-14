
import React, { useState, useEffect } from 'react';
import { Percent, Plus, Minus, Hash, Activity } from 'lucide-react';

export const PercentageCalc: React.FC = () => {
  const [val1, setVal1] = useState<number>(0);
  const [val2, setVal2] = useState<number>(0);
  const [result, setResult] = useState<string>("0.00");

  // Standard Numerals Enforcement (1234567890)
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  useEffect(() => {
    const calculation = (val1 / 100) * val2;
    setResult(toStd(calculation.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })));
  }, [val1, val2]);

  const adjust = (target: 'val1' | 'val2', amount: number) => {
    if (target === 'val1') setVal1(prev => Math.max(0, prev + amount));
    else setVal2(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-xl mx-auto shadow-[0_0_80px_rgba(212,175,55,0.1)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
          <Percent size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Ratio Analysis Node</h2>
          <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Mathematical Fiscal Equilibrium</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Percentage Value */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2 text-center italic">Percentage (%)</label>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
              <button 
                onClick={() => adjust('val1', -1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-black text-white tabular-nums">{toStd(val1)}</span>
              <button 
                onClick={() => adjust('val1', 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Base Value */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2 text-center italic">Of Base Amount</label>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
              <button 
                onClick={() => adjust('val2', -10)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-black text-white tabular-nums">{toStd(val2)}</span>
              <button 
                onClick={() => adjust('val2', 10)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Result Area */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[var(--accent)] opacity-[0.03] blur-3xl rounded-full"></div>
          <div className="relative p-10 bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 rounded-[3rem] text-center shadow-inner">
            <div className="flex items-center justify-center gap-3 mb-4 text-[#D4AF37]/40 font-black uppercase text-[9px] tracking-[0.5em]">
              <Activity size={12} /> Calculated Quotient
            </div>
            <div className="text-6xl md:text-8xl font-black text-[#D4AF37] tabular-nums tracking-tighter italic drop-shadow-2xl">
              {result}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/20"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-start gap-4 px-4 opacity-40">
           <Hash size={14} className="mt-1 text-[#D4AF37] shrink-0" />
           <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-loose italic">
             Precision logic active. Values adjusted via increments of 1 and 10 units. Standard 1234567890 numerals strictly enforced across all mathematical outputs.
           </p>
        </div>
      </div>
    </div>
  );
};
