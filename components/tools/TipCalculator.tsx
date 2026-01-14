
import React, { useState, useEffect } from 'react';
import { Coins, Users, CreditCard, ShieldCheck, Zap, Info, Wallet, Plus, Minus, Receipt } from 'lucide-react';

export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  
  const [results, setResults] = useState({
    totalTip: 0,
    totalBill: 0,
    tipPerPerson: 0,
    totalPerPerson: 0
  });

  // Protocol: Force Standard Numerals (1234567890)
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculate = () => {
    const bill = parseFloat(toStd(String(billAmount))) || 0;
    const tip = parseFloat(toStd(String(tipPercentage))) || 0;
    const people = Math.max(1, parseInt(toStd(String(peopleCount))) || 1);

    const totalTip = bill * (tip / 100);
    const totalBill = bill + totalTip;
    const tipPerPerson = totalTip / people;
    const totalPerPerson = totalBill / people;

    setResults({
      totalTip,
      totalBill,
      tipPerPerson,
      totalPerPerson
    });
  };

  useEffect(() => {
    calculate();
  }, [billAmount, tipPercentage, peopleCount]);

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, current: number, amount: number, min: number = 0) => {
    setter(Math.max(min, current + amount));
  };

  const tipOptions = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-yellow-500 selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-500">
              <Coins size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Gratuity Precision Master</h2>
              <p className="text-[9px] font-bold text-yellow-500/40 uppercase tracking-[0.4em]">Service Equilibrium Node</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Standard 1234567890 Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {/* Bill Amount */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Total Manuscript Bill</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-yellow-500/30 font-black">$</div>
                  <input 
                    type="number" 
                    value={billAmount || ''} 
                    onChange={(e) => setBillAmount(parseFloat(toStd(e.target.value)) || 0)}
                    className="w-full bg-black border border-white/5 rounded-2xl py-6 pl-12 pr-6 text-white text-3xl font-black outline-none focus:border-yellow-500/40 transition-all shadow-inner tabular-nums"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tip Percentage */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Gratuity Scale (%)</label>
                <div className="grid grid-cols-5 gap-2">
                  {tipOptions.map(pct => (
                    <button 
                      key={pct}
                      onClick={() => setTipPercentage(pct)}
                      className={`py-3 rounded-xl text-[10px] font-black transition-all ${tipPercentage === pct ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {toStd(pct)}%
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-black/60 border border-white/5 p-4 rounded-2xl gap-4 shadow-inner">
                   <button onClick={() => adjust(setTipPercentage, tipPercentage, -1)} className="p-2 text-yellow-500 hover:bg-white/5 rounded-lg"><Minus size={16}/></button>
                   <span className="text-xl font-black text-white tabular-nums">{toStd(tipPercentage)}%</span>
                   <button onClick={() => adjust(setTipPercentage, tipPercentage, 1)} className="p-2 text-yellow-500 hover:bg-white/5 rounded-lg"><Plus size={16}/></button>
                </div>
              </div>

              {/* Split Count */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Split Division (People)</label>
                <div className="flex items-center justify-between bg-black/60 border border-white/5 p-4 rounded-2xl gap-4 shadow-inner">
                   <Users className="text-yellow-500/30" size={20} />
                   <button onClick={() => adjust(setPeopleCount, peopleCount, -1, 1)} className="p-2 text-yellow-500 hover:bg-white/5 rounded-lg"><Minus size={16}/></button>
                   <span className="text-2xl font-black text-white tabular-nums">{toStd(peopleCount)}</span>
                   <button onClick={() => adjust(setPeopleCount, peopleCount, 1)} className="p-2 text-yellow-500 hover:bg-white/5 rounded-lg"><Plus size={16}/></button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500 italic">Financial Summary Registry</label>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-8 overflow-hidden group shadow-inner flex flex-col justify-center gap-8">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="p-8 bg-yellow-500/5 border border-yellow-500/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500/60 italic">Gratuity Per Person</span>
                    <div className="text-4xl font-black text-white italic tabular-nums">${toStd(results.tipPerPerson.toFixed(2))}</div>
                  </div>
                  <div className="p-8 bg-yellow-500 border border-yellow-500 shadow-[0_20px_50px_rgba(234,179,8,0.2)] rounded-[2.5rem] flex flex-col items-center text-center space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-black/60 italic">Total Per Person</span>
                    <div className="text-4xl font-black text-black italic tabular-nums">${toStd(results.totalPerPerson.toFixed(2))}</div>
                  </div>
               </div>

               <div className="relative z-10 space-y-4">
                 <div className="flex justify-between items-center px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Receipt size={14} className="text-gray-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Total Registry Tip</span>
                    </div>
                    <span className="text-lg font-black text-white tabular-nums italic">${toStd(results.totalTip.toFixed(2))}</span>
                 </div>
                 <div className="flex justify-between items-center px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Wallet size={14} className="text-gray-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Total Consolidated Bill</span>
                    </div>
                    <span className="text-lg font-black text-white tabular-nums italic">${toStd(results.totalBill.toFixed(2))}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Instant Gratuity Logic</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Split Transaction Module</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Non-Invasive Processing</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-yellow-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-yellow-500">
               <Receipt size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Archival Tip Math</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Gratuity Precision Master utilizes a **Individualized Scalar Algorithm**. By deconstructing the total manuscript bill into a base asset value and applying a dynamic percentage multiplier, the engine resolves the cumulative gratuity before dividing the total across the identified user nodes (People). This ensures 100% mathematical equilibrium, preventing fractional discrepancies during high-fidelity group settlement sessions."
            </p>
         </div>
      </div>
    </div>
  );
};
