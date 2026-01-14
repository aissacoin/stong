
import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Trash2, Check, Hash, FileText, Layout, Info, ShieldCheck, Zap, Layers, Type, AlignLeft } from 'lucide-react';

type DocumentStyle = 'Academic (Double Spaced)' | 'Single Spaced' | 'Novel (1.5 Spaced)' | 'Creative (Handwritten Sim)';

const STYLE_WORDS_PER_PAGE: Record<DocumentStyle, number> = {
  'Academic (Double Spaced)': 275,
  'Single Spaced': 550,
  'Novel (1.5 Spaced)': 320,
  'Creative (Handwritten Sim)': 200
};

export const WordCounterPerPage: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [docStyle, setDocStyle] = useState<DocumentStyle>('Academic (Double Spaced)');
  const [copied, setCopied] = useState(false);

  // Utility for Numerals
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    paragraphs: text.split('\n').filter(p => p.trim().length > 0).length,
    pages: 0
  };

  stats.pages = Math.max(1, Math.ceil(stats.words / STYLE_WORDS_PER_PAGE[docStyle]));

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Registry Archival Warning: Clear all current lexical data?")) {
      setText('');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Lexical Volume Architect</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Manuscript Density Estimator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Standard Numerals Protocol Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Typography Preset</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(STYLE_WORDS_PER_PAGE) as DocumentStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setDocStyle(style)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      docStyle === style 
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-lg' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{style}</span>
                    <Layers size={14} className={docStyle === style ? 'opacity-100' : 'opacity-20'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 italic">Total Pages</span>
                  <div className="text-4xl font-black text-white italic tabular-nums">{toStd(stats.pages)}</div>
               </div>
               <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 italic">Word Count</span>
                  <div className="text-4xl font-black text-[#D4AF37] italic tabular-nums">{toStd(stats.words)}</div>
               </div>
               <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 italic">Characters</span>
                  <div className="text-xl font-black text-white italic tabular-nums">{toStd(stats.chars.toLocaleString())}</div>
               </div>
               <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:border-[#D4AF37]/40 transition-all">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 italic">Paragraphs</span>
                  <div className="text-xl font-black text-white italic tabular-nums">{toStd(stats.paragraphs)}</div>
               </div>
            </div>

            <div className="p-8 bg-[#D4AF37]/5 border border-dashed border-[#D4AF37]/20 rounded-[2.5rem] flex items-center gap-6">
                <Info size={32} className="text-[#D4AF37]/40 shrink-0" />
                <p className="text-[10px] text-gray-500 leading-relaxed italic">Estimates are based on standard 12pt font size with 1-inch margins on A4/Letter manuscripts.</p>
            </div>
          </div>

          {/* Text Area */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Manuscript Input Terminal</label>
              <div className="flex gap-3">
                <button onClick={handleClear} className="p-2 text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                <button onClick={handleCopy} className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-[#D4AF37]'}`}>
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-1 shadow-inner group">
               <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-[450px] bg-transparent border-0 rounded-[3.2rem] p-10 text-gray-300 text-lg leading-relaxed outline-none resize-none custom-scrollbar italic placeholder-white/5"
                placeholder="Begin penning your sovereign manuscript here... Analytical engine will calculate volume in real-time."
               />
               <div className="absolute bottom-10 right-10 flex gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse delay-150"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Live Lexical Stream</span>
          </div>
          <div className="flex items-center gap-2">
            <Layout size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Volume Topology Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <Type size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Typographic Accuracy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37]/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4AF37] rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-[#D4AF37]">
               <AlignLeft size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Volume Mapping</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Lexical Volume Architect utilizes a **Standardized Words-Per-Page (WPP) Algorithm**. Academic standards traditionally mandate 250-300 words for double-spaced manuscripts, while professional publishing registries estimate 500-550 for single-spaced layouts. This instrument deconstructs your input stream into individual lexical units, filtering out null delimiters to provide a high-fidelity projection of physical manuscript volume."
            </p>
         </div>
      </div>
    </div>
  );
};
