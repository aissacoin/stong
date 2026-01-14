
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, ShieldCheck, Zap, Target, Plus, Minus, Check } from 'lucide-react';

const UNIT_DATA = {
  Length: {
    units: [
      { name: 'Meters', factor: 1, symbol: 'm' },
      { name: 'Kilometers', factor: 1000, symbol: 'km' },
      { name: 'Centimeters', factor: 0.01, symbol: 'cm' },
      { name: 'Millimeters', factor: 0.001, symbol: 'mm' },
      { name: 'Miles', factor: 1609.34, symbol: 'mi' },
      { name: 'Feet', factor: 0.3048, symbol: 'ft' },
      { name: 'Inches', factor: 0.0254, symbol: 'in' }
    ]
  },
  Weight: {
    units: [
      { name: 'Kilograms', factor: 1, symbol: 'kg' },
      { name: 'Grams', factor: 0.001, symbol: 'g' },
      { name: 'Milligrams', factor: 0.000001, symbol: 'mg' },
      { name: 'Pounds', factor: 0.453592, symbol: 'lb' },
      { name: 'Ounces', factor: 0.0283495, symbol: 'oz' }
    ]
  }
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<'Length' | 'Weight'>('Length');
  const [inputValue, setInputValue] = useState<string>('10');
  const [fromUnit, setFromUnit] = useState(UNIT_DATA.Length.units[0]);
  const [results, setResults] = useState<{ name: string; value: string; symbol: string }[]>([]);

  // Force standard numerals 1234567890
  const sanitizeNumber = (val: string) => {
    return val.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]).replace(/[^0-9.]/g, '');
  };

  const adjustValue = (amount: number) => {
    const current = parseFloat(sanitizeNumber(inputValue)) || 0;
    const next = Math.max(0, current + amount);
    setInputValue(String(next));
  };

  useEffect(() => {
    setFromUnit(UNIT_DATA[category].units[0]);
  }, [category]);

  useEffect(() => {
    const numValue = parseFloat(sanitizeNumber(inputValue)) || 0;
    const baseValue = numValue * fromUnit.factor;
    const currentUnits = UNIT_DATA[category].units;
    
    const newResults = currentUnits.map(u => ({
      name: u.name,
      symbol: u.symbol,
      value: (baseValue / u.factor).toLocaleString('en-US', { 
        maximumFractionDigits: 4,
        useGrouping: false
      })
    }));

    setResults(newResults);
  }, [inputValue, fromUnit, category]);

  return (
    <div className="space-y-16">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <ArrowRightLeft size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Unit Converter</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Universal Metric Registry</p>
            </div>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            {(['Length', 'Weight'] as const).map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-gray-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8">
          {/* Input Interface */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Archival Metric Input</label>
              
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(sanitizeNumber(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-[2rem] p-8 text-[#D4AF37] text-4xl font-black outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner tabular-nums"
                    placeholder="0"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <select
                      value={fromUnit.name}
                      onChange={(e) => setFromUnit(UNIT_DATA[category].units.find(u => u.name === e.target.value)!)}
                      className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white outline-none cursor-pointer hover:border-[#D4AF37]/40 transition-all appearance-none"
                    >
                      {UNIT_DATA[category].units.map(u => <option key={u.name} value={u.name}>{u.symbol}</option>)}
                    </select>
                  </div>
                </div>

                {/* Incremental Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => adjustValue(-1)}
                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
                  >
                    <Minus size={18} className="group-active:scale-75 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Decrease</span>
                  </button>
                  <button 
                    onClick={() => adjustValue(1)}
                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all group"
                  >
                    <Plus size={18} className="group-active:scale-75 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Increase</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#D4AF37]/5 border border-dashed border-[#D4AF37]/20 rounded-[2.5rem] flex items-center gap-6">
                <Target size={40} className="text-[#D4AF37]/40 shrink-0" />
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Handshake Integrity</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Calculations utilize IEEE-754 standards for high-precision decimal scaling in the {category.toLowerCase()} dimension.</p>
                </div>
            </div>
          </div>

          {/* Computed Results Matrix */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">Registry Equivalents</h3>
              <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#D4AF37]/20"></div>)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 flex-grow">
              {results.map((res, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] group hover:border-[#D4AF37]/40 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#D4AF37] transition-colors">{res.name}</span>
                      <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded text-white/20">{res.symbol}</div>
                  </div>
                  <div className="text-2xl font-black text-white tabular-nums tracking-tighter truncate">{res.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-[#D4AF37]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">1234567890 Numeral Integrity Verified</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-[#D4AF37]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Zero-Latency Client-Side Engine Ready</p>
           </div>
        </div>
      </div>
    </div>
  );
};
