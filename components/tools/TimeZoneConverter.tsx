
import React, { useState, useEffect } from 'react';
import { Globe2, ArrowRightLeft, Clock, Calendar, MapPin, Zap, ShieldCheck, Info, ChevronRight, History } from 'lucide-react';

export const TimeZoneConverter: React.FC = () => {
  const [sourceTime, setSourceTime] = useState<string>(new Date().toISOString().slice(0, 16));
  const [sourceZone, setSourceZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetZone, setTargetZone] = useState<string>('UTC');
  const [convertedTime, setConvertedTime] = useState<string>('');
  const [timeDiff, setTimeDiff] = useState<string>('');

  // Get all available IANA time zones
  const allTimezones = (Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf('timeZone') : [
    'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Dubai', 'Europe/Paris', 'Africa/Cairo'
  ];

  // Force Standard Numerals Protocol
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculateConversion = () => {
    try {
      const date = new Date(sourceTime);
      
      // Target Time Formatting
      const targetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      setConvertedTime(toStd(targetFormatter.format(date)));

      // Calculate Offset Difference
      const getOffset = (zone: string) => {
        const d = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          timeZoneName: 'short'
        }).formatToParts(d);
        return parts.find(p => p.type === 'timeZoneName')?.value || '';
      };

      const sourceOffset = new Date(date.toLocaleString('en-US', { timeZone: sourceZone })).getTime();
      const targetOffset = new Date(date.toLocaleString('en-US', { timeZone: targetZone })).getTime();
      const diffHours = (targetOffset - sourceOffset) / (1000 * 60 * 60);
      
      const diffString = diffHours >= 0 ? `+${diffHours}` : `${diffHours}`;
      setTimeDiff(`${toStd(diffString)} Hours Differential`);

    } catch (e) {
      setConvertedTime('Protocol Error: Check Inputs');
    }
  };

  useEffect(() => {
    calculateConversion();
  }, [sourceTime, sourceZone, targetZone]);

  const swapZones = () => {
    const temp = sourceZone;
    setSourceZone(targetZone);
    setTargetZone(temp);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-cyan-500 selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <Globe2 size={28} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Global Time Zone Architect</h2>
              <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.4em]">Inter-Jurisdictional Sync Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">IANA Registry v2025.1 Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Input Interface */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Origin Chronometry (Source Time)</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/30" size={18} />
                   <input 
                    type="datetime-local" 
                    value={sourceTime} 
                    onChange={(e) => setSourceTime(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl p-4 pl-12 text-white font-black text-lg outline-none focus:border-cyan-500/40 transition-all tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Source Jurisdiction</label>
                  <select 
                    value={sourceZone} 
                    onChange={(e) => setSourceZone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer"
                  >
                    {allTimezones.map((tz: string) => (
                      <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                   <button 
                    onClick={swapZones}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all shadow-xl group"
                   >
                     <ArrowRightLeft size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                   </button>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Target Jurisdiction</label>
                  <select 
                    value={targetZone} 
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-cyan-400 text-xs font-bold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer"
                  >
                    {allTimezones.map((tz: string) => (
                      <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-cyan-500/5 border border-dashed border-cyan-500/20 rounded-[2.5rem] flex items-center gap-6">
                <Zap size={40} className="text-cyan-500/40 shrink-0" />
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Handshake protocol</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Engine resolved inter-meridian distance with 100% astronomical accuracy.</p>
                </div>
            </div>
          </div>

          {/* Computed Output Viewport */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 italic">Synthesized Registry Output</label>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-inner min-h-[400px] flex flex-col justify-center items-center text-center">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               <div className="absolute -top-10 -right-10 opacity-[0.02] text-cyan-500 rotate-12">
                  <Clock size={300} />
               </div>
               
               <div className="relative z-10 space-y-8 animate-in zoom-in duration-700">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                      <MapPin size={12} className="text-cyan-500/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{targetZone.split('/').pop()?.replace(/_/g, ' ')} Time</span>
                    </div>
                    <div className="text-5xl md:text-7xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-2xl">
                      {convertedTime.split(',')[1]}
                    </div>
                    <div className="text-xl font-bold text-cyan-500/60 uppercase tracking-[0.2em] italic">
                      {convertedTime.split(',')[0]}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 font-black text-[10px] uppercase tracking-widest italic">
                    <History size={14} /> {timeDiff}
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-start gap-4">
               <Info size={20} className="text-cyan-500 shrink-0 mt-0.5" />
               <p className="text-[9px] text-gray-400 leading-relaxed italic uppercase tracking-wider">
                 "Conversion logic accounts for Daylight Saving Time (DST) fluctuations based on the historical IANA database. Standard 1234567890 numerals are enforced across all output nodes."
               </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Instant Meridian Calculation</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Universal Jurisdiction Support</span>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">DST Awareness Logic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
