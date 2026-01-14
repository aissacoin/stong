
import React, { useState } from 'react';
import { UserCheck, Sparkles, Loader2, Copy, Check, Trash2, BrainCircuit, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type HumanizeMode = 'Natural' | 'Academic' | 'Creative';

export const AIHumanizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<HumanizeMode>('Natural');

  const humanizeText = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const instructions = {
      Natural: "Rewrite the following text to sound like a real person wrote it. Use casual yet professional English, vary sentence lengths (burstiness), and add subtle emotional nuances. Avoid common AI patterns like lists or overused transitions.",
      Academic: "Paraphrase the text to maintain a sophisticated scholarly tone while ensuring it sounds like original human thought. Improve vocabulary complexity but avoid 'robotic' structures.",
      Creative: "Transform this text into an engaging, story-like prose. Use metaphors, rich adjectives, and a distinct personal voice. Make it highly unpredictable for AI detectors."
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `TEXT TO HUMANIZE:\n${input}`,
        config: {
          systemInstruction: instructions[mode],
          temperature: 0.9,
          topP: 0.95
        }
      });

      setOutput(response.text || "Protocol failed to generate humanized text.");
    } catch (err) {
      console.error(err);
      setOutput("Archival Error: Failed to synchronize with the human cognition module.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">AI Text Humanizer</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Cognitive Paraphrasing Engine</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {(['Natural', 'Academic', 'Creative'] as HumanizeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                mode === m ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Raw AI Manuscript</label>
            <button onClick={() => setInput('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={14}/></button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border border-white/5 rounded-[2rem] p-6 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner"
            placeholder="Paste AI-generated text here (ChatGPT, Claude, etc.)..."
          />
        </div>

        {/* Output Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Humanized Output</label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[#D4AF37] hover:text-white opacity-40 hover:opacity-100'}`}
            >
              {copied ? <Check size={14}/> : <Copy size={14}/>}
              <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy'}</span>
            </button>
          </div>
          <div className="relative w-full h-80 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2rem] p-6 text-gray-200 text-sm overflow-y-auto custom-scrollbar leading-relaxed italic shadow-inner">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] animate-pulse">Humanizing Text Protocol...</p>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="opacity-10 italic">Awaiting neural transformation...</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={humanizeText}
          disabled={loading || !input.trim()}
          className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20 disabled:grayscale"
        >
          {loading ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24}/>}
          Transmute to Human Prose
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Detection Bypass Active</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Natural Burstiness Enabled</span>
        </div>
      </div>
    </div>
  );
};
