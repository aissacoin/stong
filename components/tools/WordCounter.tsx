
import React, { useState } from 'react';
import { FileText, Copy, Trash2, Clock, Hash, AlignLeft, Check } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const readingTime = Math.ceil(words / 200) || 0;

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-[2.5rem] p-8 max-w-4xl mx-auto shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20">
            <FileText className="text-[#D4AF37]" size={28} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Scribe Counter</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleClear}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-rose-400 hover:border-rose-400/50 transition-all group"
            title="Clear Archive"
          >
            <Trash2 size={20} className="group-active:scale-90 transition-transform" />
          </button>
          <button 
            onClick={handleCopy}
            className={`px-6 py-3 border rounded-xl transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest ${
              copied 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black shadow-lg shadow-[#D4AF37]/5'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Captured' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="relative w-full h-72 bg-black border border-[#D4AF37]/20 rounded-[2rem] p-8 text-[#D4AF37] text-lg leading-relaxed focus:outline-none focus:border-[#D4AF37] transition-all placeholder-[#D4AF37]/10 custom-scrollbar resize-none shadow-inner"
            placeholder="Place your manuscript here for high-fidelity analytical verification..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/50 border border-[#D4AF37]/10 p-6 rounded-3xl text-center group hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
             <Hash className="text-[#D4AF37]/30 mx-auto mb-2 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all" size={20} />
             <div className="text-3xl font-black text-white tabular-nums">{words}</div>
             <div className="text-[9px] uppercase font-bold text-[#D4AF37]/60 tracking-[0.3em] mt-2">Word Count</div>
          </div>
          <div className="bg-black/50 border border-[#D4AF37]/10 p-6 rounded-3xl text-center group hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
             <AlignLeft className="text-[#D4AF37]/30 mx-auto mb-2 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all" size={20} />
             <div className="text-3xl font-black text-white tabular-nums">{chars}</div>
             <div className="text-[9px] uppercase font-bold text-[#D4AF37]/60 tracking-[0.3em] mt-2">Characters</div>
          </div>
          <div className="bg-black/50 border border-[#D4AF37]/10 p-6 rounded-3xl text-center group hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
             <FileText className="text-[#D4AF37]/30 mx-auto mb-2 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all" size={20} />
             <div className="text-3xl font-black text-white tabular-nums">{sentences}</div>
             <div className="text-[9px] uppercase font-bold text-[#D4AF37]/60 tracking-[0.3em] mt-2">Sentences</div>
          </div>
          <div className="bg-black/50 border border-[#D4AF37]/10 p-6 rounded-3xl text-center group hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
             <Clock className="text-[#D4AF37]/30 mx-auto mb-2 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all" size={20} />
             <div className="text-3xl font-black text-white tabular-nums">{readingTime}m</div>
             <div className="text-[9px] uppercase font-bold text-[#D4AF37]/60 tracking-[0.3em] mt-2">Read Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};
