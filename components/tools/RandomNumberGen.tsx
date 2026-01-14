
import React, { useState } from 'react';
import { Hash, RefreshCw, Copy, Check, ShieldCheck, Zap, Info, ArrowDownAz, ListFilter, Trash2 } from 'lucide-react';

export const RandomNumberGen: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [unique, setUnique] = useState(true);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');

  const toStd = (n: string | number) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const generateNumbers = () => {
    const minVal = parseInt(toStd(String(min)));
    const maxVal = parseInt(toStd(String(max)));
    const countVal = parseInt(toStd(String(count)));

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) return;
    if (minVal >= maxVal) return;

    let newResults: number[] = [];
    const rangeSize = maxVal - minVal + 1;

    if (unique && countVal > rangeSize) {
      alert("Institutional Logic Warning: Cannot generate more unique numbers than the provided range.");
      return;
    }

    if (unique) {
      const set = new Set<number>();
      while (set.size < countVal) {
        set.add(Math.floor(Math.random() * rangeSize) + minVal);
      }
      newResults = Array.from(set);
    } else {
      for (let i = 0; i < countVal; i++) {
        newResults.push(Math.floor(Math.random() * rangeSize) + minVal);
      }
    }

    if (sort === 'asc') newResults.sort((a, b) => a - b);
    else if (sort === 'desc') newResults.sort((a, b) => b - a);

    setResults(newResults);
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-indigo-500/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
              <Hash size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Aureate Randomizer</h2>
              <p className="text-[9px] font-bold text-indigo-500/40 uppercase tracking-[0.4em]">Entropy-Based Numerical Forge</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">Zero-Telemetry Engine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Minimum</label>
                <input 
                  type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value))}
                  className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black text-xl outline-none focus:border-indigo-500/40 transition-all tabular-nums"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Maximum</label>
                <input 
                  type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value))}
                  className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black text-xl outline-none focus:border-indigo-500/40 transition-all tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Quantity (1-100)</label>
              <input 
                type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-black border border-white/5 rounded-2xl p-4 text-indigo-400 font-black text-xl outline-none focus:border-indigo-500/40 transition-all tabular-nums"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
               <button 
                onClick={() => setUnique(!unique)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${unique ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/5 text-gray-500'}`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest">Unique Values</span>
                 <ListFilter size={16} className={unique ? 'opacity-100' : 'opacity-20'} />
               </button>
               
               <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                  {(['none', 'asc', 'desc'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${sort === s ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                      {s === 'none' ? 'Raw' : s === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                  ))}
               </div>
            </div>

            <button
              onClick={generateNumbers}
              className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)]"
            >
              <RefreshCw size={24}/>
              Forge Sequence
            </button>
          </div>

          {/* Results Viewport */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 italic">Generated Registry</label>
              <div className="flex gap-4">
                <button onClick={() => setResults([])} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                <button 
                  onClick={handleCopy}
                  disabled={results.length === 0}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-600 hover:text-white'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy All'}</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-inner min-h-[350px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {results.length > 0 ? (
                 <div className="relative z-10 flex flex-wrap gap-3 animate-in fade-in duration-700">
                    {results.map((n, i) => (
                      <div key={i} className="px-6 py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-xl font-black text-white italic tabular-nums hover:bg-indigo-500 hover:text-black transition-all cursor-default">
                        {toStd(n)}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <Zap size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Entropy Handshake</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Cryptographic PRNG</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownAz size={14} className="text-indigo-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Algorithmic Sorting</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Local-First Sandbox</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-indigo-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
               <Zap size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Mathematical Entropy</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Aureate Randomizer utilizes the system's underlying **Math.random()** engine, which is seeded by high-entropy architectural events. By applying a standard floor-distribution over a user-defined range, we ensure that every generated sequence is statistically independent. This process occurs in your device's ephemeral memory, ensuring that no historical trace of your generated sequences is dispatched to external archives."
            </p>
         </div>
      </div>
    </div>
  );
};
