
import React, { useState, useEffect } from 'react';
import { CalendarRange, ArrowRight, History, Clock, ShieldCheck, Zap, Info, Timer, Calendar } from 'lucide-react';

export const DaysBetweenDates: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    remDays: number;
    months: number;
    years: string;
    hours: number;
    minutes: number;
  } | null>(null);

  // Utility for Numerals
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setResult(null);
      return;
    }

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = (totalDays / 365.25).toFixed(2);
    
    const hours = totalDays * 24;
    const minutes = hours * 60;

    setResult({
      days: totalDays,
      weeks,
      remDays,
      months: Math.abs(months),
      years: toStd(years),
      hours,
      minutes
    });
  };

  useEffect(() => {
    calculate();
  }, [startDate, endDate]);

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-cyan-500 selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <CalendarRange size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Chronos Distance Node</h2>
              <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.4em]">Temporal Gap Synthesis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">Standard 1234567890 Calibrated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Origin Date (Start)</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30" size={18} />
                   <input 
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 pl-12 text-white font-black text-lg outline-none focus:border-cyan-500/40 transition-all tabular-nums"
                  />
                </div>
              </div>

              <div className="flex justify-center py-2">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
                   <ArrowRight size={20} className="rotate-90 lg:rotate-0" />
                 </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Destination Date (End)</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30" size={18} />
                   <input 
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 pl-12 text-white font-black text-lg outline-none focus:border-cyan-500/40 transition-all tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-cyan-500/5 border border-dashed border-cyan-500/20 rounded-[2.5rem] flex items-center gap-6">
                <Timer size={40} className="text-cyan-500/40 shrink-0" />
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Real-Time Delta</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Engine calculates distance across Gregorian leaps and monthly fluctuations instantly.</p>
                </div>
            </div>
          </div>

          {/* Results Visualizer */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Temporal Result Archive</label>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-8 overflow-hidden group shadow-inner min-h-[350px] flex flex-col justify-center">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {result ? (
                 <div className="relative z-10 space-y-10 animate-in fade-in duration-700">
                    <div className="text-center">
                       <div className="text-7xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-2xl">{toStd(result.days.toLocaleString())}</div>
                       <div className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-500 mt-2">Total Solar Days</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                          <div className="text-2xl font-black text-white tabular-nums italic">{toStd(result.weeks)}w {toStd(result.remDays)}d</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Calendar Breakdown</div>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                          <div className="text-2xl font-black text-white tabular-nums italic">{toStd(result.months)} Moons</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Approx. Months</div>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                          <div className="text-2xl font-black text-white tabular-nums italic">{result.years} Cycles</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Solar Years</div>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                          <div className="text-2xl font-black text-cyan-500 tabular-nums italic">{toStd(result.hours.toLocaleString())}h</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Total Hours</div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <CalendarRange size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Temporal Ingestion</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Zero-Latency Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-cyan-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Gregorian Precision</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Local-First Privacy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-cyan-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-cyan-400">
               <History size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Archival Date Math</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Chronos Distance Node utilizes the standard **ECMAScript Date Object** for millisecond-level subtraction. By normalizing input coordinates to Midnight UTC, we eliminate time-zone skewing, ensuring the solar day count is absolute. This instrument accounts for leap years automatically, providing a master-registry level of accuracy for archival or professional scheduling purposes."
            </p>
         </div>
      </div>
    </div>
  );
};
