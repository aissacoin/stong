
import React, { useState } from 'react';
import { ImageIcon, Search, Download, Copy, Check, Loader2, Globe, ShieldCheck, Zap, AlertCircle, LayoutGrid, FileText, ExternalLink, Info } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export const WebsiteImageExtractor: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractImages = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || loading) return;

    // Basic URL Validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError("Logical Violation: Invalid URL format detected.");
      return;
    }

    setLoading(true);
    setError(null);
    setImages([]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Examine the website at this URL and extract all direct image source links (PNG, JPG, WEBP): ${url}`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are a Technical Web Crawler. Use search grounding to find the actual image assets of the provided URL. Return ONLY a JSON object containing an 'images' array of strings (URLs).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              images: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["images"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.images && result.images.length > 0) {
        // Filter out obviously broken or relative paths if any
        const absoluteImages = result.images.filter((img: string) => img.startsWith('http'));
        setImages(absoluteImages);
      } else {
        throw new Error("No image assets found in the sovereign registry for this URL.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Registry Handshake Failure: The AI was unable to scrape the assets. The site may be protected by firewall or requires authorization.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (images.length === 0) return;
    navigator.clipboard.writeText(images.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadList = () => {
    if (images.length === 0) return;
    const blob = new Blob([images.join('\n')], { type: 'text/plain' });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = `strongtools_extracted_images_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <ImageIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Website Image Extractor</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Asset Harvesting & Neural Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Search Grounding Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8">
          <div className="lg:col-span-5 space-y-10">
            <form onSubmit={extractImages} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Domain Coordinate (URL)</label>
                <div className="relative group">
                   <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                   <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white text-sm font-medium outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner italic"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Crawling Assets...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Harvest Images
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
                 {/* Fixed: Info icon is now imported and defined */}
                 <Info size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Usage</span>
               </div>
               <p className="text-[10px] text-gray-500 leading-relaxed italic font-medium">
                 Enter any public website URL to retrieve its visual registry. Our AI bypasses standard scraping limits using search-grounded logic to identify high-res source files.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Visual Asset Registry ({images.length})</label>
              <div className="flex gap-4">
                <button 
                  onClick={handleCopyAll}
                  disabled={images.length === 0}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">Copy All URLs</span>
                </button>
                <button 
                  onClick={downloadList}
                  disabled={images.length === 0}
                  className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-[#D4AF37] transition-all"
                >
                  <Download size={14}/>
                  <span className="text-[9px] font-black uppercase tracking-widest">Export List</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black border border-white/5 rounded-[3.5rem] p-6 overflow-hidden group shadow-inner min-h-[400px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {loading ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 animate-pulse">
                    <LayoutGrid size={64} className="text-[#D4AF37]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Neural Asset Extraction in Progress...</p>
                 </div>
               ) : images.length > 0 ? (
                 <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar h-full max-h-[500px] pr-2">
                   {images.map((img, i) => (
                     <div key={i} className="group/item relative aspect-square bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all">
                        <img src={img} className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-opacity" alt="Extracted Asset" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                           <a href={img} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#D4AF37] text-black rounded-full hover:scale-110 transition-transform">
                              <ExternalLink size={16} />
                           </a>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <LayoutGrid size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Domain Data Stream</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
