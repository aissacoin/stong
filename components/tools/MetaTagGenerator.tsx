
import React, { useState, useEffect } from 'react';
import { Code2, Copy, Check, Globe, Share2, ShieldCheck, Zap, Info, Terminal, Monitor, Smartphone, Layout } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    title: 'StrongTools | Digital Utility Archive',
    description: 'Access high-precision digital instruments and AI productivity tools.',
    keywords: 'tools, utility, calculators, generators',
    author: 'StrongTools Scribes',
    url: 'https://www.strongtools.site',
    image: 'https://www.strongtools.site/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image'
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = `<!-- Primary Meta Tags -->
<title>${formData.title}</title>
<meta name="title" content="${formData.title}">
<meta name="description" content="${formData.description}">
<meta name="keywords" content="${formData.keywords}">
<meta name="author" content="${formData.author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${formData.ogType}">
<meta property="og:url" content="${formData.url}">
<meta property="og:title" content="${formData.title}">
<meta property="og:description" content="${formData.description}">
<meta property="og:image" content="${formData.image}">

<!-- Twitter -->
<meta property="twitter:card" content="${formData.twitterCard}">
<meta property="twitter:url" content="${formData.url}">
<meta property="twitter:title" content="${formData.title}">
<meta property="twitter:description" content="${formData.description}">
<meta property="twitter:image" content="${formData.image}">`;
    setGeneratedCode(code);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <Code2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Meta Architect</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Algorithmic Header Synthesizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Search Indexing Protocol V1.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Configuration Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 h-[500px] overflow-y-auto custom-scrollbar pr-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Document Authority (Title)</label>
                <input 
                  name="title" value={formData.title} onChange={handleChange}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  placeholder="The primary identity of your node..."
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1">
                  <span>Limit: 60 Chars</span>
                  <span className={formData.title.length > 60 ? 'text-rose-500' : 'text-emerald-500/60'}>{formData.title.length} Chars</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Scholarly Abstract (Description)</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner h-24 resize-none"
                  placeholder="Provide a high-fidelity summary..."
                />
                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1">
                  <span>Limit: 160 Chars</span>
                  <span className={formData.description.length > 160 ? 'text-rose-500' : 'text-emerald-500/60'}>{formData.description.length} Chars</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Semantic Keywords</label>
                <input 
                  name="keywords" value={formData.keywords} onChange={handleChange}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  placeholder="Keyword coordinates, comma separated..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Meridian URL</label>
                  <input 
                    name="url" value={formData.url} onChange={handleChange}
                    className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-[10px] outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Asset Image Link</label>
                  <input 
                    name="image" value={formData.image} onChange={handleChange}
                    className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-[10px] outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/60 italic mb-2">
                   <Share2 size={12}/> Social Graph Protocol
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <select name="ogType" value={formData.ogType} onChange={handleChange} className="bg-black border border-white/5 rounded-xl p-3 text-[10px] text-white font-black uppercase outline-none cursor-pointer">
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="profile">Profile</option>
                   </select>
                   <select name="twitterCard" value={formData.twitterCard} onChange={handleChange} className="bg-black border border-white/5 rounded-xl p-3 text-[10px] text-white font-black uppercase outline-none cursor-pointer">
                      <option value="summary">Twitter Summary</option>
                      <option value="summary_large_image">Twitter Large</option>
                   </select>
                 </div>
              </div>
            </div>
          </div>

          {/* Code Output Viewport */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Synthesized Registry Output</label>
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-[#D4AF37]'}`}
              >
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Sealed' : 'Copy Code'}</span>
              </button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-8 overflow-hidden group shadow-inner">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none rotate-12">
                  <Terminal size={300} />
               </div>
               
               <div className="relative z-10 h-full">
                  <pre className="text-emerald-400/90 font-mono text-[11px] leading-relaxed custom-scrollbar h-full overflow-auto whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
               </div>
            </div>

            {/* Live Preview Card Simulator */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 italic">Global Social Preview Simulator</span>
              <div className="bg-black/40 rounded-3xl overflow-hidden border border-white/5 group hover:border-[#D4AF37]/30 transition-all">
                <div className="aspect-[1.91/1] bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img src={formData.image} alt="OG Preview" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]" onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800")}/>
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest truncate">{formData.url.replace(/https?:\/\//, '')}</p>
                  <h4 className="text-white font-black italic truncate">{formData.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 italic">"{formData.description}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Instant Synthesis</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Spider Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Responsive Analytics</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37]/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4AF37] rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-[#D4AF37]">
               <Layout size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Semantic Architecture</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Sovereign Meta Architect utilizes an **Algorithmic Document Handshake**. By constructing specific key-value pairs within the document `<head>`, we provide web crawlers (Spiders) with a deterministic map of your node's identity. This ensures that indexing algorithms can parse your categorical intent with zero ambiguity, while Open Graph protocols synchronize visual assets for high-ratio social distribution."
            </p>
         </div>
      </div>
    </div>
  );
};
