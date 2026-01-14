
import React, { useState, useEffect } from 'react';
import { Globe, Clock, Search, MapPin, Zap } from 'lucide-react';

export const WorldClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Default Major Capitals
  const capitals = [
    { name: 'London', zone: 'Europe/London' },
    { name: 'New York', zone: 'America/New_York' },
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'Dubai', zone: 'Asia/Dubai' },
    { name: 'Paris', zone: 'Europe/Paris' },
    { name: 'Cairo', zone: 'Africa/Cairo' },
  ];

  // Get all available timezones
  const allTimezones = (Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf('timeZone') : [];

  // Utility for Numerals
  const toStd = (s: string | number) => {
    return String(s).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatInZone = (date: Date, zone: string) => {
    const timeStr = date.toLocaleTimeString('en-US', {
      timeZone: zone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return toStd(timeStr);
  };

  const formatDateInZone = (date: Date, zone: string) => {
    return date.toLocaleDateString('en-US', {
      timeZone: zone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
            <Globe size={28} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Chronos Global Node</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Universal Meridian Synchronization</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={18} />
          <select 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full bg-black border border-[#D4AF37]/20 rounded-xl py-3 pl-12 pr-4 text-white text-xs font-bold outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
          >
            {allTimezones.map((zone: string) => (
              <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Selected Clock */}
      <div className="mb-12 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 opacity-[0.03] text-[#D4AF37] group-hover:scale-110 transition-transform">
          <Clock size={200} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-2 italic flex items-center justify-center gap-2">
            <MapPin size={12} /> {selectedZone.split('/').pop()?.replace(/_/g, ' ')}
          </p>
          <div className="text-7xl md:text-8xl font-black text-white tabular-nums tracking-tighter italic mb-4">
            {formatInZone(currentTime, selectedZone)}
          </div>
          <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{formatDateInZone(currentTime, selectedZone)}</p>
        </div>
      </div>

      {/* Global Capitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {capitals.map((cap) => (
          <div 
            key={cap.name}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest group-hover:text-[#D4AF37] transition-colors">{cap.name}</span>
              <Clock size={14} className="text-[#D4AF37]/20" />
            </div>
            <div className="text-2xl font-black text-white tabular-nums tracking-tight">
              {formatInZone(currentTime, cap.zone).split(':').slice(0, 2).join(':')}
            </div>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">
              {formatDateInZone(currentTime, cap.zone)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-black/40 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-4 opacity-50">
        <Zap size={14} className="text-[#D4AF37]" />
        <p className="text-[8px] font-bold text-white uppercase tracking-widest italic">
          High-Fidelity UTC Handshake Active • Standard 1234567890 Numerals Enforced
        </p>
      </div>
    </div>
  );
};
