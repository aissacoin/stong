
import React, { useState } from 'react';
import { Languages, Sparkles, Loader2, Copy, Check, Trash2, Wand2, ShieldCheck, Info } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

type StyleMode = 'Professional' | 'Casual' | 'Academic';

export const GrammarFixer: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<StyleMode>('Professional');

  const fixGrammar = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Fix the following text in its original language. Use a ${style} tone.\nTEXT: "${input}"`,
        config: {
          systemInstruction: "You are an expert polyglot editor. Fix grammar, spelling, and punctuation. Detect the language automatically. Return a JSON object with 'fixedText' and a brief 'changesSummary' (English).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fixedText: { type: Type.STRING },
              changesSummary: { type: Type.STRING }
            },
            required: ["fixedText", "changesSummary"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setOutput(data.fixedText);
      setExplanation(data.changesSummary);
    } catch (err) {
      console.error(err);
      setOutput("Archival Error: Failed to synchronize with the linguistic node.");
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

  const isRTL = (text: string) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <Languages size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Polyglot Grammar Fixer</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Universal Linguistic Correction Node</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {(['Professional', 'Casual', 'Academic'] as StyleMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setStyle(m)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                style === m ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Original Manuscript</label>
            <button onClick={() => setInput('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={14}/></button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir={isRTL(input) ? 'rtl' : 'ltr'}
            className="w-full h-72 bg-black border border-white/5 rounded-[2rem] p-6 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner"
            placeholder="Paste text in any language (Arabic, Italian, German, etc.)..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Corrected Prose</label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[#D4AF37] hover:text-white opacity-40 hover:opacity-100'}`}
            >
              {copied ? <Check size={14}/> : <Copy size={14}/>}
              <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div 
            dir={isRTL(output) ? 'rtl' : 'ltr'}
            className="relative w-full h-72 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2rem] p-6 text-gray-200 text-sm overflow-y-auto custom-scrollbar leading-relaxed italic shadow-inner"
          >
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] animate-pulse">Analyzing Linguistic Syntax...</p>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="opacity-10 italic">Awaiting transmission for archival correction...</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={fixGrammar}
          disabled={loading || !input.trim()}
          className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
        >
          {loading ? <Loader2 className="animate-spin" size={24}/> : <Wand2 size={24}/>}
          Refine Manuscript
        </button>

        {explanation && (
          <div className="animate-in fade-in slide-in-from-bottom-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-4">
            <Info className="text-indigo-400 shrink-0" size={20} />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Changes Summary</h4>
              <p className="text-xs text-gray-400 leading-relaxed italic">{explanation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Multi-Language Discovery</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Contextual Precision</span>
        </div>
      </div>
    </div>
  );
};
