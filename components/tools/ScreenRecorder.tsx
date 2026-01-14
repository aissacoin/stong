
import React, { useState, useRef } from 'react';
import { MonitorPlay, Square, Play, Download, Trash2, Mic, MicOff, ShieldCheck, Zap, Info, Loader2 } from 'lucide-react';

export const ScreenRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: audioEnabled
      });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
      };

      recorder.start();
      setRecording(true);
      setVideoUrl(null);
    } catch (err) {
      console.error("Display Capture Failed:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const downloadRecording = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `Sovereign_Capture_${Date.now()}.webm`;
    link.click();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <MonitorPlay size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Screen Recorder</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Browser-Native Archival Node</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${audioEnabled ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-500'}`}
             >
               {audioEnabled ? <Mic size={14}/> : <MicOff size={14}/>}
               <span className="text-[9px] font-black uppercase tracking-widest">{audioEnabled ? 'Audio Linked' : 'Silent Mode'}</span>
             </button>
             <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Local Memory Storage</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12">
            <div className="relative bg-black border border-white/5 rounded-[3.5rem] p-4 min-h-[400px] flex items-center justify-center overflow-hidden group shadow-inner">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {recording ? (
                 <div className="relative z-10 text-center space-y-8 animate-pulse">
                    <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.2)]">
                      <div className="w-6 h-6 bg-rose-500 rounded-sm"></div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Capture Active</h3>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Writing bitstream to ephemeral registry...</p>
                    </div>
                 </div>
               ) : videoUrl ? (
                 <video src={videoUrl} controls className="relative z-10 max-w-full max-h-[500px] rounded-2xl shadow-2xl border border-white/10" />
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <MonitorPlay size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Media Stream Handshake</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
           {!recording ? (
             <button 
              onClick={startRecording}
              className="flex-grow bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
             >
               <Play size={24} fill="currentColor" /> Initialize Capture
             </button>
           ) : (
             <button 
              onClick={stopRecording}
              className="flex-grow bg-rose-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(225,29,72,0.3)]"
             >
               <Square size={24} fill="currentColor" /> Finalize Registry
             </button>
           )}
           {videoUrl && (
             <button 
              onClick={downloadRecording}
              className="px-10 bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3"
             >
               <Download size={20} /> Export .webm
             </button>
           )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Direct Buffer Handshake</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Hardware Accelerated</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Zero-Server Transmission</span>
          </div>
        </div>
      </div>
    </div>
  );
};
