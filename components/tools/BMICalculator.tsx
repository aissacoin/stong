
import React, { useState, useEffect } from 'react';
import { Scale, Info, Plus, Minus, Activity } from 'lucide-react';

export const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [result, setResult] = useState<{ bmi: string; status: string } | null>(null);

  // Utility for Numerals to ensure 1234567890
  const toStd = (n: number | string) => {
    const s = n.toString().padStart(2, '0');
    return s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  const calculateBMI = () => {
    if (weight > 0 && height > 0) {
      const hMeter = height / 100;
      const bmiValue = (weight / (hMeter * hMeter)).toFixed(1);
      let status = '';
      const bmiFloat = parseFloat(bmiValue);
      
      if (bmiFloat < 18.5) status = 'Underweight';
      else if (bmiFloat < 25) status = 'Normal Weight';
      else if (bmiFloat < 30) status = 'Overweight';
      else status = 'Obese';
      
      setResult({ bmi: toStd(bmiValue), status });
    } else {
      setResult(null);
    }
  };

  const adjust = (type: 'w' | 'h', amount: number) => {
    if (type === 'w') setWeight(prev => Math.max(0, prev + amount));
    else setHeight(prev => Math.max(0, prev + amount));
  };

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-xl mx-auto shadow-[0_0_80px_rgba(212,175,55,0.1)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Bio-Metric Analyzer</h2>
          <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Physiological Equilibrium Scale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weight Control */}
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2 text-center">Weight (KG)</label>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
            <button 
              onClick={() => adjust('w', -1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-black text-white tabular-nums">{toStd(weight)}</span>
            <button 
              onClick={() => adjust('w', 1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Height Control */}
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-2 text-center">Height (CM)</label>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
            <button 
              onClick={() => adjust('h', -1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              <Minus size={16} />
            </button>
            <span className="text-3xl font-black text-white tabular-nums">{toStd(height)}</span>
            <button 
              onClick={() => adjust('h', 1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {result ? (
        <div className="mt-12 p-8 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2.5rem] text-center animate-in zoom-in duration-500">
          <div className="text-5xl font-black text-[#D4AF37] mb-2 tabular-nums tracking-tighter italic">{result.bmi}</div>
          <div className="text-[10px] uppercase tracking-[0.5em] text-white font-black opacity-60">{result.status}</div>
          
          <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            <div className={`h-full ${parseFloat(result.bmi) < 18.5 ? 'bg-blue-400 w-[20%]' : parseFloat(result.bmi) < 25 ? 'bg-emerald-400 w-[40%]' : parseFloat(result.bmi) < 30 ? 'bg-orange-400 w-[70%]' : 'bg-rose-500 w-[100%]'}`}></div>
          </div>
        </div>
      ) : (
        <div className="mt-12 p-8 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting Metric Input for Analysis</p>
        </div>
      )}
      
      <div className="flex items-start gap-4 mt-8 px-4 opacity-40">
         <Info size={14} className="mt-1 text-[#D4AF37] shrink-0" />
         <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-loose italic">
           Standard 1234567890 Numerals Enforced. This registry module serves as a digital estimator; professional medical consultation is advised for comprehensive physiology.
         </p>
      </div>
    </div>
  );
};
