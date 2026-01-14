
import React, { useState, useEffect } from 'react';
import { History, ArrowRightLeft, Landmark, Info, Target, Zap, Check, Scale, Ruler, Waves } from 'lucide-react';

type Era = 'Ancient Rome' | 'Ancient Egypt' | 'Obscure Science';

interface Unit {
  name: string;
  factor: number; // to base (meters or grams)
  symbol: string;
}

const UNITS_BY_ERA: Record<Era, Record<string, Unit[]>> = {
  'Ancient Rome': {
    Length: [
      { name: 'Digitus (Finger)', factor: 0.0185, symbol: 'dig' },
      { name: 'Palmus (Hand)', factor: 0.074, symbol: 'pal' },
      { name: 'Pes (Foot)', factor: 0.296, symbol: 'pes' },
      { name: 'Cubitus (Cubit)', factor: 0.444, symbol: 'cub' },
      { name: 'Passus (Pace)', factor: 1.48, symbol: 'pas' },
      { name: 'Stadium', factor: 185, symbol: 'st' },
      { name: 'Mille Passus (Mile)', factor: 1480, symbol: 'mi' }
    ],
    Weight: [
      { name: 'Uncia (Ounce)', factor: 27.29, symbol: 'un' },
      { name: 'Libra (Pound)', factor: 327.45, symbol: 'lib' }
    ]
  },
  'Ancient Egypt': {
    Length: [
      { name: 'Royal Cubit', factor: 0.524, symbol: 'rc' },
      { name: 'Small Cubit', factor: 0.45, symbol: 'sc' },
      { name: 'Remen', factor: 0.37, symbol: 'rem' },
      { name: 'Palm', factor: 0.075, symbol: 'pal' },
      { name: 'Digit', factor: 0.0187, symbol: 'dig' }
    ],
    Weight: [
      { name: 'Deben', factor: 91, symbol: 'deb' },
      { name: 'Kite', factor: 9.1, symbol: 'kt' }
    ]
  },
  'Obscure Science': {
    Length: [
      { name: 'Parsec', factor: 3.086e16, symbol: 'pc' },
      { name: 'Angstrom', factor: 1e-10, symbol: 'Å' },
      { name: 'Smoot', factor: 1.7018, symbol: 'smt' },
      { name: 'League', factor: 4828.03, symbol: 'lea' }
    ],
    Miscellaneous: [
      { name: 'Barn (Area)', factor: 1e-28, symbol: 'b' },
      { name: 'Shake (Time)', factor: 1e-8, symbol: 'sh' }
    ]
  }
};

export const RareConverter: React.FC = () => {
  const [era, setEra] = useState<Era>('Ancient Rome');
  const [category, setCategory] = useState<string>('Length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(UNITS_BY_ERA['Ancient Rome']['Length'][0]);
  const [results, setResults] = useState<{ name: string; value: string; symbol: string }[]>([]);

  // Standard Numerals Enforcement (1234567890)
  const toStd = (s: string) => {
    return s.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]).replace(/[^0-9.]/g, '');
  };

  useEffect(() => {
    const categories = Object.keys(UNITS_BY_ERA[era]);
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [era]);

  useEffect(() => {
    const currentUnits = UNITS_BY_ERA[era][category];
    if (!currentUnits.find(u => u.name === fromUnit.name)) {
      setFromUnit(currentUnits[0]);
    }
  }, [category, era]);

  useEffect(() => {
    const numValue = parseFloat(toStd(inputValue)) || 0;
    const baseValue = numValue * fromUnit.factor;
    const currentUnits = UNITS_BY_ERA[era][category];
    
    const newResults = currentUnits.map(u => ({
      name: u.name,
      symbol: u.symbol,
      value: (baseValue / u.factor).toLocaleString('en-US', { 
        maximumFractionDigits: 6,
        useGrouping: false 
      })
    }));

    const metricLabel = category === 'Weight' ? 'Grams' : 'Meters';
    const metricSymbol = category === 'Weight' ? 'g' : 'm';
    newResults.push({
        name: `Modern ${metricLabel}`,
        symbol: metricSymbol,
        value: baseValue.toLocaleString('en-US', { 
          maximumFractionDigits: 6,
          useGrouping: false
        })
    });

    setResults(newResults);
  }, [inputValue, fromUnit, era, category]);

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <History size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Rare Unit Repository</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Archaic Metric Chronology</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <Check size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">1234567890 Numerals Enforced</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Metric Dimension</label>
                <div className="flex gap-2">
                    {Object.keys(UNITS_BY_ERA[era]).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'bg-black border-white/5 text-gray-500 hover:border-white/20'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Input Value (Standard Digits)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(toStd(e.target.value))}
                  className="w-full bg-black border border-white/5 rounded-2xl p-6 text-[var(--accent)] text-2xl font-black outline-none focus:border-[var(--accent)]/40 transition-all shadow-inner tabular-nums"
                  placeholder="0"
                />
                <select
                  value={fromUnit.name}
                  onChange={(e) => setFromUnit(UNITS_BY_ERA[era][category].find(u => u.name === e.target.value)!)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white outline-none appearance-none cursor-pointer"
                >
                  {UNITS_BY_ERA[era][category].map(u => <option key={u.name} value={u.name}>{u.symbol}</option>)}
                </select>
              </div>
            </div>

            <div className="p-8 bg-[var(--accent)]/5 border border-dashed border-[var(--accent)]/20 rounded-[2.5rem] flex items-center gap-6">
                <Scale size={40} className="text-[var(--accent)]/40 shrink-0" />
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Handshake Protocol</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Numerals filtered to standard Latin range (0-9) to maintain archival integrity.</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-[20deg]">
              <Landmark size={300} />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] mb-4 italic">Computed Equivalents</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {results.map((res, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] group hover:border-[var(--accent)]/40 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[var(--accent)] transition-colors">{res.name}</span>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-700 tabular-nums">{res.symbol}</div>
                    </div>
                    <div className="text-2xl font-black text-white tabular-nums tracking-tighter truncate">{res.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Landmark size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Standard Numerals 1234567890 Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Linguistic Translation Filter Enabled</p>
           </div>
        </div>
      </div>
    </div>
  );
};
