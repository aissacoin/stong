
import React, { useState, useEffect } from 'react';
import { Binary, Copy, Trash2, Check, RefreshCw, Cpu } from 'lucide-react';

export const BinaryCipherTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isBinaryToText, setIsBinaryToText] = useState(false);
  const [copied, setCopied] = useState(false);

  // Utility for Numerals to ensure 1234567890
  const toStd = (s: string) => {
    return s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  };

  const textToBinary = (text: string) => {
    return text.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
      return toStd(binary);
    }).join(' ');
  };

  const binaryToText = (bin: string) => {
    try {
      const cleanBin = toStd(bin).replace(/[^01\s]/g, '');
      return cleanBin.split(/\s+/).filter(b => b.length > 0).map(b => {
        return String.fromCharCode(parseInt(b, 2));
      }).join('');
    } catch (e) {
      return "Invalid Binary Registry Entry";
    }
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    if (isBinaryToText) {
      setOutput(binaryToText(input));
    } else {
      setOutput(textToBinary(input));
    }
  }, [input, isBinaryToText]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  const toggleMode = () => {
    setIsBinaryToText(!isBinaryToText);
    setInput(output); // Switch content for convenience
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Binary Archive Node</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Foundational Logic Transceiver</p>
          </div>
        </div>
        
        <button 
          onClick={toggleMode}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-[#D4AF37] tracking-widest hover:bg-[#D4AF37]/10 transition-all"
        >
          <RefreshCw size={14} /> Switch Protocol
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">
            Input: {isBinaryToText ? "Binary Stream (0101)" : "Standard Manuscript"}
          </label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 bg-black border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-[#D4AF37] transition-all placeholder-white/5 resize-none tabular-nums"
            placeholder={isBinaryToText ? "Enter binary sequences..." : "Enter text to encode into binary logic..."}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">
              Registry Output
            </label>
            <div className="flex gap-2">
              <button 
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                title="Wipe Memory"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all text-[9px] font-black uppercase tracking-widest ${
                  copied 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                  : 'bg-white/5 border-white/10 text-[#D4AF37] hover:bg-white/10'
                } disabled:opacity-20`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Archived" : "Capture"}
              </button>
            </div>
          </div>
          <div className="w-full min-h-[128px] bg-black/60 border border-[#D4AF37]/20 rounded-2xl p-6 text-[#D4AF37] text-lg font-mono break-all tabular-nums leading-relaxed shadow-inner">
            {output || <span className="opacity-10 italic text-sm">Transceiver awaiting signals...</span>}
          </div>
        </div>

        <div className="bg-[#D4AF37]/5 p-4 rounded-2xl border border-[#D4AF37]/10">
          <p className="text-[8px] font-bold text-[#D4AF37]/60 uppercase tracking-widest leading-loose text-center italic">
            Binary precision node verified. Numerical integrity set to standard 1234567890 format.
          </p>
        </div>
      </div>
    </div>
  );
};
