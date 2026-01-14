
import React, { useState, useEffect } from 'react';
import { Radio, Copy, Check } from 'lucide-react';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': '/'
};

export const MorseCodeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const translate = input.toUpperCase().split('').map(char => MORSE_MAP[char] || char).join(' ');
    setOutput(translate);
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio className="text-[#D4AF37]" size={28} />
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Morse Encoder</h2>
        </div>
        <button 
          onClick={handleCopy}
          className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'}`}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>

      <div className="space-y-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/10 resize-none h-24 text-sm"
          placeholder="Enter text to transmit..."
        />
        <div className="p-6 bg-black/60 border border-[#D4AF37]/20 rounded-2xl min-h-[100px] break-all font-mono text-[#D4AF37] text-lg leading-relaxed shadow-inner">
          {output || <span className="opacity-20 italic">Signals will appear here...</span>}
        </div>
      </div>
    </div>
  );
};
