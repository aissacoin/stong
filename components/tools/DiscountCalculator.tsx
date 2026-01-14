
import React, { useState, useEffect } from 'react';
import { Tag, Receipt, TrendingDown, ShieldCheck, Zap, Info, Landmark, Minus, Plus, Wallet } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0);
  
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  // Force Standard Numerals (1234567890)
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculate = () => {
    const p = parseFloat(toStd(String(originalPrice))) || 0;
    const d1 = parseFloat(toStd(String(discountPercent))) || 0;
    const d2 = parseFloat(toStd(String(additionalDiscount))) || 0;
    const t = parseFloat(toStd(String(taxPercent))) || 0;

    // Apply primary discount
    const afterD1 = p - (p * (d1 / 100));
    // Apply secondary discount on top (stackable)
    const afterD2 = afterD1 - (afterD1 * (d2 / 100));
    // Apply tax
    const afterTax = afterD2 + (afterD2 * (t / 100));

    setFinalPrice(afterTax);
    setTotalSavings(p - afterD2);
  };

  useEffect(() => {
    calculate();
  }, [originalPrice, discountPercent, taxPercent, additionalDiscount]);

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, current: number, amount: number, min: number = 0) => {
    setter(Math.max(min, current + amount));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-emerald-500 selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <Tag size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fiscal Discount Architect</h2>
              <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-[0.4em]">Transactional Equilibrium Solver</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Standard Numerals Protocol Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {/* Original Price */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Original Asset Price</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/30 font-black">$</div>
                  <input 
                    type="number" value={originalPrice} onChange={(e) => setOriginalPrice(parseFloat(toStd(e.target.value)) || 0)}
                    className="w-full bg-black border border-white/5 rounded-2xl py-6 pl-12 pr-6 text-white text-3xl font-black outline-none focus:border-emerald-500/40 transition-all shadow-inner tabular-nums"
                  />
                </div>
              </div>

              {/* Discount Percentage */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Primary Discount (%)</label>
                <div className="flex items-center justify-between bg-black/60 border border-white/5 p-4 rounded-3xl gap-4 shadow-inner">
                  <button onClick={() => adjust(setDiscountPercent, discountPercent, -5)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"><Minus size={18}/></button>
                  <div className="flex-grow text-center">
                    <span className="text-3xl font-black text-white tabular-nums">{toStd(discountPercent)}%</span>
                  </div>
                  <button onClick={() => adjust(setDiscountPercent, discountPercent, 5)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"><Plus size={18}/></button>
                </div>
              </div>

              {/* Additional Discount Toggle/Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Stackable Discount (%)</label>
                <input 
                  type="range" min="0" max="100" step="1" value={additionalDiscount}
                  onChange={(e) => setAdditionalDiscount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1 italic">
                  <span>No Stack</span>
                  <span className="text-emerald-500/60">Active: {toStd(additionalDiscount)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Analysis */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Financial Summary Archive</label>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-inner flex flex-col justify-center gap-10">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               <div className="relative z-10 text-center animate-in zoom-in duration-500">
                  <div className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 mb-2">Final Settlement Price</div>
                  <div className="text-8xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-2xl">
                    ${toStd(finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                  </div>
               </div>

               <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-emerald-500/30 transition-all flex flex-col items-center text-center">
                    <TrendingDown size={20} className="text-emerald-500/40 mb-3" />
                    <div className="text-2xl font-black text-white tabular-nums italic">${toStd(totalSavings.toFixed(2))}</div>
                    <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Archive Total Savings</div>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-emerald-500/30 transition-all flex flex-col items-center text-center">
                    <Receipt size={20} className="text-emerald-500/40 mb-3" />
                    <div className="text-2xl font-black text-white tabular-nums italic">{toStd(((totalSavings/originalPrice)*100).toFixed(1))}%</div>
                    <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Total Logic Reduction</div>
                  </div>
               </div>

               {/* Visualization of Savings */}
               <div className="relative z-10 space-y-2">
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
                    <span>Final Price</span>
                    <span>Total Discount Saved</span>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${(finalPrice/originalPrice)*100}%` }}></div>
                    <div className="h-full bg-emerald-500/20" style={{ width: `${(totalSavings/originalPrice)*100}%` }}></div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Instant Math Handshake</span>
          </div>
          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Tax-Inclusive Modeling</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Fiscal Accuracy MMXXV</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-emerald-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-emerald-400">
               <Receipt size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Archival Discounting</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Fiscal Discount Architect utilizes a **Compounded Reduction Algorithm**. Unlike simple linear subtractions, this instrument supports 'Stackable Logic,' applying secondary reductions to the already diminished subtotal—mirroring the sophisticated promotional structures used in global trade registries. All arithmetic is resolved with absolute IEEE-754 precision to ensure that even the smallest fractional savings are accounted for."
            </p>
         </div>
      </div>
    </div>
  );
};
