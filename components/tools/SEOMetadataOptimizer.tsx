
import { useState } from 'react';
import { Search, Sparkles, Loader2, Copy, Check, Globe, Layout, Type, ShieldCheck, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type as SchemaType } from "@google/genai";

export const SEOMetadataOptimizer = () => {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; meta: string; suggestions: string[] } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const optimizeSEO = async () => {
    if (!keyword.trim() || loading) return;

    setLoading(true);
    setError(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze and optimize SEO for:
Keyword: ${keyword}
Context: ${description || 'General optimization'}`,
        config: {
          systemInstruction: "You are an Elite SEO Strategist. Generate a compelling, high-CTR Page Title (max 60 chars) and a Meta Description (max 160 chars). Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING, description: "SEO Title under 60 characters" },
              meta: { type: SchemaType.STRING, description: "Meta description under 160 characters" },
              suggestions: { 
                type: SchemaType.ARRAY, 
                items: { type: SchemaType.STRING },
                description: "3 semantic keywords"
              }
            },
            required: ["title", "meta", "suggestions"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to reach the SEO optimization engine. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
            <Search size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">SEO Metadata Optimizer</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Search Engine Visibility Protocol</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Primary Keyword / Focus</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 shadow-inner"
              placeholder="e.g., Best Online Tools 2025"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Page Content Summary (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-black border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/5 resize-none shadow-inner"
              placeholder="Describe what the page is about for better optimization..."
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs italic font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            onClick={optimizeSEO}
            disabled={loading || !keyword.trim()}
            className="w-full bg-[#D4AF37] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-20"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
            {loading ? 'Analyzing Keywords...' : 'Generate Optimized Metadata'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden h-full min-h-[300px]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-6 italic">Google Search Preview</h3>
            
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Search Engine Result Card */}
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 space-y-2">
                  <div className="text-blue-400 text-xl font-medium hover:underline cursor-pointer truncate">{result.title}</div>
                  <div className="text-emerald-500 text-xs flex items-center gap-1">
                    https://www.strongtools.site/ <Globe size={10}/>
                  </div>
                  <div className="text-gray-400 text-sm leading-relaxed line-clamp-2">{result.meta}</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-xl group">
                    <div className="truncate pr-4 flex-grow">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Optimized Title</p>
                      <p className="text-xs text-white truncate">{result.title}</p>
                    </div>
                    <button onClick={() => copyToClipboard(result.title, 'title')} className="text-[#D4AF37] hover:text-white transition-colors">
                      {copied === 'title' ? <Check size={16}/> : <Copy size={16}/>}
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-xl group">
                    <div className="pr-4 flex-grow">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Meta Description</p>
                      <p className="text-xs text-white leading-relaxed line-clamp-2">{result.meta}</p>
                    </div>
                    <button onClick={() => copyToClipboard(result.meta, 'meta')} className="text-[#D4AF37] hover:text-white transition-colors">
                      {copied === 'meta' ? <Check size={16}/> : <Copy size={16}/>}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-10 space-y-4">
                <Layout size={64} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Awaiting Analysis Protocol</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-40">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Type size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Title: 60 Chars Max</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Search size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Semantic Latency Check</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Algorithm Compliant</span>
        </div>
      </div>
    </div>
  );
};
