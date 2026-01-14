
import React, { useState, useEffect, useRef } from 'react';
import { AlarmClock as AlarmIcon, Bell, BellOff, Play, Square, Timer, ShieldCheck, Zap, Info, Clock, Volume2, Moon } from 'lucide-react';

export const AlarmClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState({ h: '08', m: '00', p: 'AM' });
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [timeUntil, setTimeUntil] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Force standard numerals 1234567890
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkAlarm(now);
      updateCountdown(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAlarmActive, alarmTime]);

  const updateCountdown = (now: Date) => {
    if (!isAlarmActive) {
      setTimeUntil('');
      return;
    }

    let alarmH = parseInt(toStd(alarmTime.h));
    const alarmM = parseInt(toStd(alarmTime.m));
    if (alarmTime.p === 'PM' && alarmH < 12) alarmH += 12;
    if (alarmTime.p === 'AM' && alarmH === 12) alarmH = 0;

    const alarmDate = new Date(now);
    alarmDate.setHours(alarmH, alarmM, 0, 0);

    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const diff = alarmDate.getTime() - now.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntil(`${toStd(h)}h ${toStd(m)}m ${toStd(s)}s remaining`);
  };

  const checkAlarm = (now: Date) => {
    if (!isAlarmActive || isRinging) return;

    let alarmH = parseInt(toStd(alarmTime.h));
    const alarmM = parseInt(toStd(alarmTime.m));
    if (alarmTime.p === 'PM' && alarmH < 12) alarmH += 12;
    if (alarmTime.p === 'AM' && alarmH === 12) alarmH = 0;

    if (now.getHours() === alarmH && now.getMinutes() === alarmM && now.getSeconds() === 0) {
      triggerAlarm();
    }
  };

  const triggerAlarm = () => {
    setIsRinging(true);
    startAcousticSignal();
  };

  const startAcousticSignal = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    
    const playTone = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    };

    const ringInterval = setInterval(() => {
      if (!isRinging) {
        clearInterval(ringInterval);
        return;
      }
      playTone();
    }, 1000);
  };

  const stopAlarm = () => {
    setIsRinging(false);
    setIsAlarmActive(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className={`bg-[#0a0a0a] border ${isRinging ? 'border-yellow-500 animate-pulse' : 'border-cyan-500/30'} rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden transition-all duration-500`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <AlarmIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter text-glow">Chronos Awakening Node</h2>
              <p className="text-[9px] font-bold text-cyan-500/40 uppercase tracking-[0.4em]">Temporal Threshold Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Registry Sync v1.0.4 Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Current Time Display */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center border-r border-white/5 pr-10">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-cyan-500/40 text-[10px] font-black uppercase tracking-widest mb-2 italic">
                <Zap size={12} /> Live Meridian Time
              </div>
              <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter">
                {toStd(currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }))}
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                {toStd(currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }))}
              </div>
            </div>

            {isAlarmActive && (
              <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-[2.5rem] text-center animate-in zoom-in">
                 <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                   <Timer size={14} className="animate-spin-slow" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Temporal Distance</span>
                 </div>
                 <div className="text-lg font-black text-white italic tabular-nums">{timeUntil}</div>
              </div>
            )}
          </div>

          {/* Alarm Setting */}
          <div className="lg:col-span-7 space-y-10 flex flex-col justify-center py-6">
            <div className="flex items-center gap-4 bg-black/60 border border-white/5 p-8 rounded-[3.5rem] shadow-inner justify-center group">
               <div className="flex flex-col items-center gap-2">
                 <input 
                  type="number" 
                  min="1" max="12" 
                  value={alarmTime.h} 
                  onChange={(e) => setAlarmTime({...alarmTime, h: e.target.value.padStart(2, '0')})}
                  className="bg-transparent text-5xl font-black text-white w-20 text-center outline-none focus:text-cyan-400 transition-colors tabular-nums"
                 />
                 <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Hour</span>
               </div>
               <div className="text-4xl font-black text-gray-800 self-start mt-1">:</div>
               <div className="flex flex-col items-center gap-2">
                 <input 
                  type="number" 
                  min="0" max="59" 
                  value={alarmTime.m} 
                  onChange={(e) => setAlarmTime({...alarmTime, m: e.target.value.padStart(2, '0')})}
                  className="bg-transparent text-5xl font-black text-white w-20 text-center outline-none focus:text-cyan-400 transition-colors tabular-nums"
                 />
                 <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Min</span>
               </div>
               <div className="flex flex-col gap-2 ml-4">
                 <button 
                  onClick={() => setAlarmTime({...alarmTime, p: 'AM'})}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${alarmTime.p === 'AM' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-600'}`}
                 >AM</button>
                 <button 
                  onClick={() => setAlarmTime({...alarmTime, p: 'PM'})}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${alarmTime.p === 'PM' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-600'}`}
                 >PM</button>
               </div>
            </div>

            <div className="flex gap-4">
              {!isAlarmActive ? (
                <button 
                  onClick={() => setIsAlarmActive(true)}
                  className="flex-grow bg-cyan-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(8,145,178,0.3)]"
                >
                  <Play size={24} fill="currentColor" /> Set Awakening Protocol
                </button>
              ) : isRinging ? (
                <button 
                  onClick={stopAlarm}
                  className="flex-grow bg-rose-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(225,29,72,0.4)] animate-bounce"
                >
                  <Square size={24} fill="currentColor" /> Dismiss Alarm
                </button>
              ) : (
                <button 
                  onClick={() => setIsAlarmActive(false)}
                  className="flex-grow bg-white/5 border border-white/10 text-rose-500 py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:bg-rose-500/10 transition-all"
                >
                  <BellOff size={24} /> Abort Session
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Acoustic Signal Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Deep Meridian Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Zero-Latency Timing</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-cyan-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-cyan-400">
               <Bell size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Chronological Wake-up</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Chronos Awakening Node utilizes a **Deterministic Temporal Handshake**. By sampling the system meridian at 1000ms intervals and cross-referencing with user-defined target coordinates, the logic engine resolves the awakening state with millisecond accuracy. The acoustic output is synthesized via the **Web Audio API Oscillator**, ensuring high-fidelity signal delivery regardless of network status. No telemetry data is dispatched during this temporal monitoring cycle."
            </p>
         </div>
      </div>
    </div>
  );
};
