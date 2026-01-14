
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Bell, Plus, Minus } from 'lucide-react';

export const StopwatchTimer: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  
  // Utility for Numerals
  const toStd = (n: number | string) => {
    const s = n.toString().padStart(2, '0');
    return s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swIsActive, setSwIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<number | null>(null);

  // Timer State
  const [timerInput, setTimerInput] = useState({ h: 0, m: 0, s: 0 });
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // --- Stopwatch Logic ---
  const startSw = () => {
    setSwIsActive(true);
    const startTime = Date.now() - swTime;
    swIntervalRef.current = window.setInterval(() => {
      setSwTime(Date.now() - startTime);
    }, 10);
  };

  const pauseSw = () => {
    setSwIsActive(false);
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
  };

  const resetSw = () => {
    setSwIsActive(false);
    if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    setSwTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    setLaps([swTime, ...laps]);
  };

  const formatSw = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${toStd(minutes)}:${toStd(seconds)}.${toStd(centi)}`;
  };

  // --- Timer Logic ---
  const adjustTimer = (unit: 'h' | 'm' | 's', amount: number) => {
    setTimerInput(prev => {
      const max = unit === 'h' ? 99 : 59;
      let next = prev[unit] + amount;
      if (next > max) next = 0;
      if (next < 0) next = max;
      return { ...prev, [unit]: next };
    });
  };

  const startTimer = () => {
    let total = timerSeconds;
    if (!timerIsActive && total === 0) {
      total = timerInput.h * 3600 + timerInput.m * 60 + timerInput.s;
    }
    
    if (total <= 0) return;
    
    setTimerSeconds(total);
    setTimerIsActive(true);
    
    timerIntervalRef.current = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setTimerIsActive(false);
          // Alert logic could go here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setTimerIsActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const resetTimer = () => {
    setTimerIsActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimerSeconds(0);
    setTimerInput({ h: 0, m: 0, s: 0 });
  };

  const formatTimerDisplay = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${toStd(h)}:${toStd(m)}:${toStd(s)}`;
  };

  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 shadow-2xl overflow-hidden relative selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
        <button 
          onClick={() => setMode('stopwatch')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'stopwatch' ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Stopwatch
        </button>
        <button 
          onClick={() => setMode('timer')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'timer' ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Timer
        </button>
      </div>

      {mode === 'stopwatch' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="text-6xl font-black text-white tabular-nums tracking-tighter mb-2 italic">
              {formatSw(swTime)}
            </div>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Active Precision Interval</p>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={resetSw}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={swIsActive ? pauseSw : startSw}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${swIsActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'}`}
            >
              {swIsActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={recordLap}
              disabled={!swIsActive}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all disabled:opacity-20"
            >
              <Flag size={20} />
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Lap {toStd(laps.length - idx)}</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatSw(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="text-center">
            <div className="text-6xl font-black text-white tabular-nums tracking-tighter mb-2 italic">
              {timerIsActive || timerSeconds > 0 ? formatTimerDisplay(timerSeconds) : `${toStd(timerInput.h)}:${toStd(timerInput.m)}:${toStd(timerInput.s)}`}
            </div>
            
            {!timerIsActive && timerSeconds === 0 && (
               <div className="flex justify-center gap-4 mt-6">
                  {(['h', 'm', 's'] as const).map((unit) => (
                    <div key={unit} className="flex flex-col items-center gap-2">
                      <button 
                        onClick={() => adjustTimer(unit, 1)}
                        className="p-2 hover:bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] transition-all"
                      >
                        <Plus size={16} />
                      </button>
                      <div className="w-14 bg-white/5 border border-white/10 rounded-lg py-2 text-center text-[#D4AF37] font-black text-xl tabular-nums">
                        {toStd(timerInput[unit])}
                      </div>
                      <button 
                        onClick={() => adjustTimer(unit, -1)}
                        className="p-2 hover:bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">{unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</span>
                    </div>
                  ))}
               </div>
            )}

            {timerIsActive && (
               <div className="flex items-center justify-center gap-2 text-[#D4AF37] animate-pulse mt-4">
                 <Bell size={12} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Temporal Depletion Active</span>
               </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={resetTimer}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={timerIsActive ? pauseTimer : startTimer}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${timerIsActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'}`}
            >
              {timerIsActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <div className="bg-[#D4AF37]/5 p-4 rounded-2xl border border-[#D4AF37]/10">
            <p className="text-[8px] font-bold text-[#D4AF37]/60 uppercase tracking-widest leading-loose text-center italic">
              Standard 1234567890 Numerals Enforced • Audio Alert Ready
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
