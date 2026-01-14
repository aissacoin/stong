
import React, { useState, useEffect } from 'react';
import { Timer, Utensils, Moon, Sun, Info, Target, Zap, Check, ArrowRight, ShieldCheck, Flame, Clock } from 'lucide-react';

export const IFC_Calculator: React.FC = () => {
  const [startHour, setStartHour] = useState<number>(20);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [startAmPm, setStartAmPm] = useState<'AM' | 'PM'>('PM');
  const [protocol, setProtocol] = useState(16);
  const [schedule, setSchedule] = useState<{ fastStart: string, fastEnd: string, windowStart: string, windowEnd: string } | null>(null);

  // Force Standard Numerals Protocol (1234567890)
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculateSchedule = () => {
    let militaryHour = startHour;
    if (startAmPm === 'PM' && startHour < 12) militaryHour += 12;
    if (startAmPm === 'AM' && startHour === 12) militaryHour = 0;

    const start = new Date();
    start.setHours(militaryHour, startMinute, 0, 0);

    const end = new Date(start.getTime() + protocol * 60 * 60 * 1000);
    const windowEnd = new Date(end.getTime() + (24 - protocol) * 60 * 60 * 1000);

    const format = (d: Date) => {
      let h = d.getHours();
      const m = d.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; // the hour '0' should be '12'
      return `${toStd(h)}:${toStd(m.toString().padStart(2, '0'))} ${ampm}`;
    };

    setSchedule({
      fastStart: format(start),
      fastEnd: format(end),
      windowStart: format(end),
      windowEnd: format(windowEnd)
    });
  };

  useEffect(() => {
    calculateSchedule();
  }, [startHour, startMinute, startAmPm, protocol]);

  const protocols = [
    { label: '14:10', fast: 14, desc: 'Beginner' },
    { label: '16:8', fast: 16, desc: 'Leangains' },
    { label: '18:6', fast: 18, desc: 'Intermediate' },
    { label: '20:4', fast: 20, desc: 'Warrior' }
  ];

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <Timer size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fasting Protocol Architect</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Metabolic Window Synchronizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <Check size={14} className="text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">1234567890 & AM/PM System Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Select Your Fasting Protocol</label>
              <div className="grid grid-cols-2 gap-3">
                {protocols.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setProtocol(p.fast)}
                    className={`p-4 rounded-2xl border transition-all text-left group ${
                      protocol === p.fast 
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <div className="text-lg font-black tracking-tight mb-1">{toStd(p.label)}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest opacity-40">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Start Time (Last Meal)</label>
              <div className="flex gap-3 bg-black border border-white/5 rounded-2xl p-4 shadow-inner">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[8px] font-black text-gray-600 uppercase text-center">Hour</span>
                  <select 
                    value={startHour} 
                    onChange={(e) => setStartHour(parseInt(toStd(e.target.value)))}
                    className="bg-[#111] border border-white/10 rounded-xl p-3 text-[var(--accent)] text-xl font-black outline-none appearance-none text-center cursor-pointer tabular-nums"
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                      <option key={h} value={h}>{toStd(h)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[8px] font-black text-gray-600 uppercase text-center">Minute</span>
                  <select 
                    value={startMinute} 
                    onChange={(e) => setStartMinute(parseInt(toStd(e.target.value)))}
                    className="bg-[#111] border border-white/10 rounded-xl p-3 text-[var(--accent)] text-xl font-black outline-none appearance-none text-center cursor-pointer tabular-nums"
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{toStd(m.toString().padStart(2, '0'))}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[8px] font-black text-gray-600 uppercase text-center">Period</span>
                  <div className="flex bg-[#111] border border-white/10 rounded-xl p-1 h-full">
                    <button 
                      onClick={() => setStartAmPm('AM')}
                      className={`flex-1 rounded-lg text-[10px] font-black transition-all ${startAmPm === 'AM' ? 'bg-[var(--accent)] text-black' : 'text-gray-500 hover:text-white'}`}
                    >AM</button>
                    <button 
                      onClick={() => setStartAmPm('PM')}
                      className={`flex-1 rounded-lg text-[10px] font-black transition-all ${startAmPm === 'PM' ? 'bg-[var(--accent)] text-black' : 'text-gray-500 hover:text-white'}`}
                    >PM</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-[20deg]">
              <Target size={200} />
            </div>

            {schedule && (
              <div className="space-y-10 relative z-10 animate-in fade-in duration-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[var(--accent)]">
                    <Moon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Fasting Window</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-black text-white italic tabular-nums">{schedule.fastStart}</div>
                    <ArrowRight size={20} className="text-gray-700" />
                    <div className="text-2xl md:text-3xl font-black text-white italic tabular-nums">{schedule.fastEnd}</div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" style={{ width: `${(protocol/24)*100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <Utensils size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Eating Window</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="text-2xl md:text-3xl font-black italic tabular-nums">{schedule.windowStart}</div>
                    <ArrowRight size={20} className="text-gray-700 opacity-20" />
                    <div className="text-2xl md:text-3xl font-black italic tabular-nums">{schedule.windowEnd}</div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40" style={{ width: `${((24-protocol)/24)*100}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">1234567890 Precision Numerals Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Clock size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">AM/PM Temporal Registry Sync</p>
           </div>
        </div>
      </div>
    </div>
  );
};
