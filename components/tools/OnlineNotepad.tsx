
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Copy, Trash2, Download, Save, Check, History, ShieldCheck, Zap, Info, AlignLeft, Hash, Clock } from 'lucide-react';

export const OnlineNotepad: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem('st_notepad_registry') || '';
  });
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Stats Logic
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const lines = content.split('\n').filter(l => l.length > 0).length;
  const readTime = Math.ceil(words / 200);

  // Standard Numerals Protocol
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('st_notepad_registry', content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sovereign_Manuscript_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("Archival Warning: This will wipe the current registry. Proceed?")) {
      setContent('');
      localStorage.removeItem('st_notepad_registry');
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Notepad</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Secure Manuscript Drafting Unit</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${saved ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                {saved ? <Check size={12} /> : <Save size={12} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{saved ? 'Registry Updated' : 'Auto-Sync Active'}</span>
             </div>
             <button onClick={handleClear} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-600 hover:text-rose-500 hover:border-rose-500/30 transition-all"><Trash2 size={18}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-9 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="relative w-full h-[500px] bg-black border border-white/10 rounded-[2.5rem] p-10 text-gray-200 text-lg leading-relaxed outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner custom-scrollbar italic"
                placeholder="Begin penning your sovereign manuscript here... Your content is saved locally in the browser registry."
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
             <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6">
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2"><AlignLeft size={12}/> Words</div>
                      <span className="text-white tabular-nums">{toStd(words)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2"><Hash size={12}/> Characters</div>
                      <span className="text-white tabular-nums">{toStd(chars)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2"><History size={12}/> Lines</div>
                      <span className="text-white tabular-nums">{toStd(lines)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                      <div className="flex items-center gap-2"><Clock size={12}/> Read Time</div>
                      <span className="text-white tabular-nums">{toStd(readTime)}m</span>
                   </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                   <button 
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] transition-all ${copied ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                   >
                     {copied ? <Check size={16}/> : <Copy size={16}/>}
                     {copied ? 'Captured' : 'Copy All'}
                   </button>
                   <button 
                    onClick={handleDownload}
                    className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] transition-all shadow-lg shadow-[#D4AF37]/20"
                   >
                     <Download size={16}/> Export .txt
                   </button>
                </div>
             </div>

             <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-[2rem] p-6">
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-loose italic">
                  Registry Handshake: Data is processed client-side. No telemetry is dispatched to external nodes. Standard 1234567890 numerals enforced.
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Local-First Sandbox</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Zero-Latency Drafting</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Persistent Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
