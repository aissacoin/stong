
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, History, Target, Zap, ShieldCheck, Info, UserCheck, Star, Activity, Heart, Timer, Plus, Minus } from 'lucide-react';

interface TemporalAge {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  nextBirthday: number;
}

export const AgeOracle: React.FC = () => {
  const [year, setYear] = useState<number>(1999);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [age, setAge] = useState<TemporalAge | null>(null);
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Force Standard Numerals Protocol
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculateAge = () => {
    const birth = new Date(year, month - 1, day);
    const now = new Date();
    
    if (birth > now || isNaN(birth.getTime())) {
      setAge(null);
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));

    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const nextDiff = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setAge({ years, months, days, totalDays, totalHours, nextBirthday: nextDiff });
    setLiveSeconds(Math.floor(totalMs / 1000));
  };

  useEffect(() => {
    calculateAge();
    const interval = setInterval(calculateAge, 1000);
    return () => clearInterval(interval);
  }, [year, month, day]);

  const adjust = (type: 'y' | 'm' | 'd', val: number) => {
    if (type === 'y') setYear(prev => Math.max(1900, Math.min(new Date().getFullYear(), prev + val)));
    if (type === 'm') setMonth(prev => {
      let next = prev + val;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
    if (type === 'd') setDay(prev => {
      let next = prev + val;
      if (next > 31) return 1;
      if (next < 1) return 31;
      return next;
    });
  };

  const handleManualInput = (type: 'y' | 'm' | 'd', value: string) => {
    const cleanValue = parseInt(toStd(value)) || 0;
    if (type === 'y') setYear(cleanValue);
    if (type === 'm') setMonth(Math.min(12, Math.max(1, cleanValue)));
    if (type === 'd') setDay(Math.min(31, Math.max(1, cleanValue)));
  };

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3.5rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <UserCheck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Aureate Age Oracle</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Precise Temporal Bio-Registry</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <Clock size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">1234567890 Numerals Enforced</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Tri-Axis Input Node */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Temporal Ingestion (Origin Date)</label>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Year Controller */}
                <div className="bg-black/60 border border-white/5 p-4 rounded-3xl flex items-center justify-between gap-4">
                  <button onClick={() => adjust('y', -1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"><Minus size={16}/></button>
                  <div className="flex-grow text-center">
                    <input 
                      type="text" value={year} onChange={(e) => handleManualInput('y', e.target.value)}
                      className="bg-transparent text-white text-3xl font-black text-center w-full outline-none tabular-nums"
                    />
                    <div className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Year</div>
                  </div>
                  <button onClick={() => adjust('y', 1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"><Plus size={16}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Month Controller */}
                  <div className="bg-black/60 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                    <button onClick={() => adjust('m', -1)} className="p-2 text-[#D4AF37] hover:bg-white/5 rounded-lg"><Minus size={14}/></button>
                    <div className="text-center">
                      <input 
                        type="text" value={month} onChange={(e) => handleManualInput('m', e.target.value)}
                        className="bg-transparent text-white text-xl font-black text-center w-12 outline-none tabular-nums"
                      />
                      <div className="text-[7px] font-black uppercase text-gray-600 tracking-widest">Month</div>
                    </div>
                    <button onClick={() => adjust('m', 1)} className="p-2 text-[#D4AF37] hover:bg-white/5 rounded-lg"><Plus size={14}/></button>
                  </div>
                  {/* Day Controller */}
                  <div className="bg-black/60 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                    <button onClick={() => adjust('d', -1)} className="p-2 text-[#D4AF37] hover:bg-white/5 rounded-lg"><Minus size={14}/></button>
                    <div className="text-center">
                      <input 
                        type="text" value={day} onChange={(e) => handleManualInput('d', e.target.value)}
                        className="bg-transparent text-white text-xl font-black text-center w-12 outline-none tabular-nums"
                      />
                      <div className="text-[7px] font-black uppercase text-gray-600 tracking-widest">Day</div>
                    </div>
                    <button onClick={() => adjust('d', 1)} className="p-2 text-[#D4AF37] hover:bg-white/5 rounded-lg"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[var(--accent)]/5 border border-dashed border-[var(--accent)]/20 rounded-[2.5rem] space-y-4">
               <div className="flex items-center gap-3 text-[var(--accent)]">
                 <History size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Temporal Milestone Log</span>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Lifespan Days</span>
                   <span className="text-lg font-black text-white tabular-nums">{age?.totalDays.toLocaleString() || '---'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Archival Hours</span>
                   <span className="text-lg font-black text-white tabular-nums">{age?.totalHours.toLocaleString() || '---'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Next Anniversary In</span>
                   <span className="text-lg font-black text-[var(--accent)] tabular-nums">{age?.nextBirthday || '---'} Days</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Results Visualizer */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-[20deg]">
              <Star size={300} />
            </div>

            {age ? (
              <div className="relative z-10 space-y-12 animate-in fade-in zoom-in duration-700">
                <div className="grid grid-cols-3 gap-6">
                   <div className="text-center p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-[var(--accent)]/30 transition-all">
                      <div className="text-5xl md:text-6xl font-black text-white tabular-nums italic tracking-tighter mb-2">{age.years}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cycles (Years)</div>
                   </div>
                   <div className="text-center p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-[var(--accent)]/30 transition-all">
                      <div className="text-5xl md:text-6xl font-black text-white tabular-nums italic tracking-tighter mb-2">{age.months}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Moons (Months)</div>
                   </div>
                   <div className="text-center p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-[var(--accent)]/30 transition-all">
                      <div className="text-5xl md:text-6xl font-black text-white tabular-nums italic tracking-tighter mb-2">{age.days}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Days</div>
                   </div>
                </div>

                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-8 rounded-[2rem] text-center space-y-3">
                   <div className="text-[9px] font-black uppercase tracking-[0.6em] text-[var(--accent)]/60">Sovereign Live Counter (Seconds)</div>
                   <div className="text-4xl md:text-5xl font-mono font-black text-[var(--accent)] tabular-nums tracking-widest overflow-hidden">
                     {liveSeconds.toLocaleString()}
                   </div>
                   <div className="flex justify-center gap-2 opacity-20">
                     {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: `${i*200}ms` }}></div>)}
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                <Timer size={80} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Verify Temporal Integrity Above</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">1234567890 Precision Formatting Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Manual Manuscript Ingestion Enabled</p>
           </div>
        </div>
      </div>
    </div>
  );
};
