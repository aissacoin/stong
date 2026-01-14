
import React, { useState } from 'react';
import { Youtube, Sparkles, Loader2, Copy, Check, Trash2, Video, ListChecks, PlayCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const YouTubeScriptGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Engaging');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateScript = async () => {
    if (!topic.trim() || loading) return;

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Generate a full, viral-ready YouTube script for the topic: "${topic}". 
    Target Audience: ${audience || 'General'}. 
    Tone: ${tone}.
    
    The script must include:
    1. Attention-grabbing Title options.
    2. A high-retention Hook (first 30 seconds).
    3. Organized segments with visual cues.
    4. Call to Action (CTA) and Outro.
    
    Structure the response clearly for a creator.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert YouTube Content Strategist who understands algorithm retention and audience psychology. You write scripts that sound human, exciting, and professional.",
          temperature: 0.85
        }
      });

      setOutput(response.text || "Failed to generate script.");
    } catch (err) {
      console.error(err);
      setOutput("Error synchronizing with the creative engine.");
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
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
            <Youtube size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">YouTube Script Forge</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Viral Narrative Generator</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Video Topic or Concept</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-24 bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner"
              placeholder="e.g., The Future of AI in 2025..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 shadow-inner"
              placeholder="e.g., Tech enthusiasts, Students..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all appearance-none cursor-pointer"
            >
              <option>Engaging & Energetic</option>
              <option>Informative & Educational</option>
              <option>Professional & Corporate</option>
              <option>Witty & Humorous</option>
              <option>Mysterious & Suspenseful</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 flex flex-col h-full">
           <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Script Output</label>
            <div className="flex gap-2">
              <button onClick={() => setOutput('')} className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[#D4AF37] hover:text-white'}`}
              >
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="relative flex-grow bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2rem] p-6 text-gray-200 text-sm overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap shadow-inner min-h-[300px]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] animate-pulse">Architecting Narrative...</p>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="opacity-10 italic">Awaiting creative prompt to begin the forge...</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={generateScript}
        disabled={loading || !topic.trim()}
        className="w-full bg-red-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:bg-red-500 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(239,68,68,0.3)] disabled:opacity-20 disabled:grayscale"
      >
        {loading ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24}/>}
        Forge Viral Script
      </button>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-2">
          <PlayCircle size={14} className="text-red-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Retention Optimized</span>
        </div>
        <div className="flex items-center gap-2">
          <ListChecks size={14} className="text-red-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Segmented Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <Video size={14} className="text-red-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Visual Cues Included</span>
        </div>
      </div>
    </div>
  );
};
