
import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';

export const AgeCalc: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split('T')[0];
  });
  const [age, setAge] = useState<{y: number, m: number, d: number} | null>(null);

  useEffect(() => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth > now) return setAge({y: 0, m: 0, d: 0});

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAge({y: years, m: months, d: days});
  }, [birthDate]);

  return (
    <div className="max-w-xs mx-auto space-y-4 bg-[#141414] p-6 rounded-[2rem] border border-[#D4AF37]/20 shadow-xl">
      <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
        <UserCheck size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Chronos Baseline</span>
      </div>
      <input 
        type="date" 
        value={birthDate}
        max={new Date().toISOString().split('T')[0]}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full bg-black border border-white/10 rounded-xl p-4 text-[#D4AF37] outline-none focus:border-[#D4AF37] font-bold text-sm"
      />
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
          <div className="text-2xl font-black text-white leading-none">{age?.y || 0}</div>
          <div className="text-[7px] uppercase text-white/30 font-black mt-1">Years</div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
          <div className="text-2xl font-black text-white leading-none">{age?.m || 0}</div>
          <div className="text-[7px] uppercase text-white/30 font-black mt-1">Months</div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
          <div className="text-2xl font-black text-white leading-none">{age?.d || 0}</div>
          <div className="text-[7px] uppercase text-white/30 font-black mt-1">Days</div>
        </div>
      </div>
    </div>
  );
};
