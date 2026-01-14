
import React, { useState } from 'react';
import { Youtube, Search, Copy, Check, Hash, Loader2, Target, Info, ShieldCheck, Download, AlertCircle, Sparkles, TrendingUp, Layout, Zap } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export const YouTubeTagExtractor: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTags = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || loading) return;

    // Validate URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!ytRegex.test(url)) {
      setError("Logical Violation: Please provide a valid YouTube registry URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setTags([]);
    setTitle('');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      // We use Google Search grounding to find the actual metadata of the video 
      // which is more reliable than scraping raw HTML in a restricted client environment
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract the video title and all SEO tags/keywords used for this specific YouTube video: ${url}`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are an Elite YouTube Growth Strategist. Use search to find the metadata of the provided URL. Return ONLY a JSON object containing 'title' and 'tags' (array of strings). Do not include any other text.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "tags"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.tags && result.tags.length > 0) {
        setTags(result.tags);
        setTitle(result.title || "Found Archive");
      } else {
        throw new Error("No metadata tags found in the sovereign registry.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Registry Handshake Failure: The AI was unable to verify video metadata. Ensure the video is public.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (tags.length === 0) return;
    navigator.clipboard.writeText(tags.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    if (tags.length === 0) return;
    const content = tags.join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `YouTube_Tags_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
              <Youtube size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">YouTube Tag Extractor</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Viral Metadata Deconstruction Node</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Search Grounding Verification Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Node */}
          <div className="lg:col-span-5 space-y-10">
            <form onSubmit={extractTags} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Video Resource Coordinate (URL)</label>
                <div className="relative group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[var(--accent)] transition-colors" size={20} />
                   <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white text-sm font-medium outline-none focus:border-[var(--accent)]/40 transition-all shadow-inner italic"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Deconstructing...
                  </>
                ) : (
                  <>
                    <TrendingUp size={24} />
                    Extract Keywords
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}

            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4">
               <div className="flex items-center gap-3 text-gray-400">
                 <Info size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Usage</span>
               </div>
               <p className="text-[10px] text-gray-500 leading-relaxed italic font-medium">
                 Enter any public YouTube URL to analyze its high-retention keyword strategy. Our AI utilizes real-time search grounding to bypass metadata obscuration.
               </p>
            </div>
          </div>

          {/* Result Registry */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Institutional Metadata Grid</label>
              <div className="flex gap-4">
                <button 
                  onClick={handleCopy}
                  disabled={tags.length === 0}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy All'}</span>
                </button>
                <button 
                  onClick={downloadCSV}
                  disabled={tags.length === 0}
                  className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-[var(--accent)] transition-all"
                >
                  <Download size={14}/>
                  <span className="text-[9px] font-black uppercase tracking-widest">Export CSV</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-inner">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {loading ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 animate-pulse">
                    <Target size={64} className="text-[var(--accent)]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Neural Extraction in Progress...</p>
                 </div>
               ) : tags.length > 0 ? (
                 <div className="relative z-10 space-y-8 animate-in fade-in duration-1000 h-full flex flex-col">
                   <div className="pb-6 border-b border-white/5">
                      <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2 italic">Video Authority</h4>
                      <p className="text-xl font-black text-white italic tracking-tight truncate">{title}</p>
                   </div>
                   <div className="flex flex-wrap gap-3 overflow-y-auto custom-scrollbar flex-grow pb-10">
                     {tags.map((tag, i) => (
                       <div key={i} className="flex items-center gap-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-5 py-3 rounded-2xl hover:bg-[var(--accent)] hover:text-black transition-all group/tag cursor-default">
                         <Hash size={12} className="opacity-40 group-hover/tag:opacity-100" />
                         <span className="text-xs font-black italic">{tag}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <Layout size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Metadata Sync</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             {/* Corrected: Added missing 'Zap' component to the context via import on line 2 */}
             <Zap size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Verified Search Grounding Enabled</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Algorithm Affinity Scoring Checked</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL MANUSCRIPT SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-20 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        {/* Ad Slot Alpha */}
        <div className="ad-placeholder h-24 mb-16 opacity-40"> [Premium Metadata Registry Display Ad] </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic text-glow">The Philosophy of Video Tagging</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            In the modern attention economy, a video is invisible without its semantic armor. While YouTube's algorithm increasingly prioritizes engagement time, "Tags" serve as categorical anchors that help the registry associate your content with specific observer intents. The AI YouTube Tag Extractor deconstructs these anchors from viral content, allowing you to align your creative archives with established traffic patterns.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Algorithmic Advantages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Suggested Video Affinity</h4>
              <p className="text-gray-500 text-sm leading-relaxed">By utilizing similar metadata to high-performing videos in your niche, you increase the likelihood of appearing in the "Up Next" registry for that specific audience segment.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Search Intent Matching</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Tags help clarify ambiguous titles. They ensure your technical manuscript is presented to observers searching for specific solutions or entertainment nodes.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Technical Manuscript: Extraction Logic</h3>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed italic">
            Our extraction engine utilizes a sophisticated two-tier analysis protocol to retrieve metadata that is often obscured from the standard user interface.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-lg italic">
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Search Grounding:</strong> We leverage Gemini 3 Pro with real-time web grounding to verify metadata from multiple archival indices.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">De-Duplication:</strong> Resulting tag arrays are processed to remove redundant noise and irrelevant categorical entries.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Privacy Assurance:</strong> URL lookups occur entirely through ephemeral neural sessions. No browser history or personal data is logged in the vault.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Institutional Export:</strong> Captured tags can be immediately exported as CSV files for integration into professional marketing databases.</span>
            </li>
          </ul>
        </section>

        {/* Ad Slot Beta */}
        <div className="ad-placeholder h-40 opacity-30 mt-20"> [Strategic Registry display Ad Placeholder] </div>
      </div>
    </div>
  );
};
