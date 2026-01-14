
import React, { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Zap, Info, ShieldCheck, Target, Youtube, Wand2, AlertTriangle, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AIThumbnailForge: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'IDLE' | 'ENHANCING' | 'GENERATING'>('IDLE');
  const [error, setError] = useState<string | null>(null);

  const forgeThumbnail = async () => {
    if (!userPrompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setPhase('ENHANCING');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      // PHASE 1: Prompt Augmentation & Enhancement
      const enhancementResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a world-class YouTube Thumbnail Designer. Expand this concept into a technical prompt for image generation. Focus on high contrast, cinematic lighting, and 4K clarity.
        Concept: "${userPrompt}"
        Return ONLY the enhanced prompt.`,
      });

      const finalPrompt = enhancementResponse.text || userPrompt;
      setPhase('GENERATING');

      // PHASE 2: Visual Synthesis using the Nano Banana Image model
      // This is more stable and faster for our architectural environment
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `${finalPrompt}, professional youtube thumbnail style, viral thumbnail aesthetics, ultra-detailed, sharp focus, vibrant colors, expressive.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          }
        },
      });

      // PHASE 3: Content Extraction & Base64 Mapping
      let base64Data = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
      } else {
        throw new Error("Empty Neural Frame");
      }

    } catch (err: any) {
      console.error("Forge Failure:", err);
      setError("ARCHIVE SYNERGY FAILURE: The generation node was unable to complete the synthesis. This typically happens due to safety filter triggers or temporary network desynchronization. Try a more descriptive, non-sensitive prompt.");
    } finally {
      setLoading(false);
      setPhase('IDLE');
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `Aureate_Thumbnail_Forge_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-16">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
              <Youtube size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">AI YouTube Thumbnail Forge</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Neural Visual Synthesis Core v9.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Sovereign Direct-Link Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Visual Concept Ingestion</label>
              <textarea 
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
                className="w-full bg-black border border-white/5 rounded-[2rem] p-6 text-white text-lg font-medium outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner placeholder-white/5 resize-none italic"
                placeholder="Describe your vision (e.g., A scientist holding a glowing energy orb in a dark futuristic lab)..."
              />
            </div>

            <button
              onClick={forgeThumbnail}
              disabled={loading || !userPrompt.trim()}
              className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  {phase === 'ENHANCING' ? 'Calibrating Logic...' : 'Synthesizing Pixels...'}
                </>
              ) : (
                <>
                  <Wand2 size={24} />
                  Forge Visual Asset
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Synthesized Asset Registry</label>
              <button onClick={() => setGeneratedImage(null)} className="text-gray-600 hover:text-rose-500 transition-colors"><ImageIcon size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black border border-white/5 rounded-[3.5rem] p-4 flex items-center justify-center min-h-[400px] overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {generatedImage ? (
                 <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group/img">
                      <img 
                        src={generatedImage} 
                        className="w-full h-full object-cover transition-transform duration-[10s] group-hover/img:scale-105"
                        alt="Neural Result" 
                      />
                      <div className="absolute top-0 right-0 p-4">
                        <div className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                          <Check size={12} /> Synthesis Verified
                        </div>
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <ImageIcon size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Pixel Forge</p>
                 </div>
               )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!generatedImage}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(5,150,105,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Export Isolated Archive
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-[#D4AF37]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Neural Prompt Augmentation Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-[#D4AF37]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Direct Binary Synthesis Enabled</p>
           </div>
        </div>
      </div>
    </div>
  );
};
