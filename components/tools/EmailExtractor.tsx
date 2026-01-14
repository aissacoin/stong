
import React, { useState, useEffect } from 'react';
import { Mail, Copy, Trash2, Check, Download, ListFilter, ArrowDownAz, ShieldCheck, Zap, Info, FileSearch, Target } from 'lucide-react';

export const EmailExtractor: React.FC = () => {
  const [input, setInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    removeDuplicates: true,
    alphabetical: true
  });

  const extractEmails = () => {
    if (!input.trim()) {
      setEmails([]);
      return;
    }

    // High-precision Email Regex
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    let matches = input.match(regex) || [];

    // Normalize to lowercase
    matches = matches.map(e => e.toLowerCase());

    if (options.removeDuplicates) {
      matches = Array.from(new Set(matches));
    }

    if (options.alphabetical) {
      matches.sort();
    }

    setEmails(matches);
  };

  useEffect(() => {
    extractEmails();
  }, [input, options]);

  const handleCopy = () => {
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (emails.length === 0) return;
    const blob = new Blob([emails.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `strongtools_emails_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <Mail size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Email Scribe Extractor</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">High-Fidelity Communication Harvesting</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'removeDuplicates', label: 'Unique Only', icon: <ListFilter size={12}/> },
              { id: 'alphabetical', label: 'Sort A-Z', icon: <ArrowDownAz size={12}/> }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                  options[opt.id as keyof typeof options] 
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                  : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Source Manuscript (Raw Text)</label>
              <button onClick={() => setInput('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={14}/></button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 bg-black border border-white/5 rounded-[2rem] p-6 text-white font-mono text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner custom-scrollbar"
              placeholder="Paste content here to harvest email coordinates..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Harvested Registry ({emails.length})</label>
              <button 
                onClick={handleCopy}
                disabled={emails.length === 0}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[#D4AF37] hover:text-white opacity-40 hover:opacity-100'}`}
              >
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy List'}</span>
              </button>
            </div>
            <div className="relative w-full h-80 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2rem] p-6 text-[#D4AF37] font-mono text-xs overflow-y-auto custom-scrollbar leading-relaxed shadow-inner italic">
              {emails.length > 0 ? (
                <div className="space-y-1">
                  {emails.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
                      <span className="opacity-20 text-[8px]">{i + 1}</span>
                      {e}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                  <FileSearch size={48} />
                  <span className="italic text-xs uppercase tracking-widest font-black text-center px-4">Awaiting Archival Data Stream</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={downloadTxt}
          disabled={emails.length === 0}
          className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
        >
          <Download size={24}/>
          Export Harvested Archive (.txt)
        </button>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Local RAM Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Regex 128-bit Logic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
