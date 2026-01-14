
import React, { useState, useEffect } from 'react';
import { Network, Plus, Trash2, Download, Copy, Check, ShieldCheck, Zap, Info, Globe, FileCode, ArrowRight } from 'lucide-react';

interface SitemapURL {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const SitemapGenerator: React.FC = () => {
  const [urls, setUrls] = useState<SitemapURL[]>([
    { id: '1', loc: 'https://www.example.com/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' }
  ]);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    urls.forEach(url => {
      if (url.loc.trim()) {
        xml += `  <url>\n`;
        xml += `    <loc>${url.loc.trim()}</loc>\n`;
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += `  </url>\n`;
      }
    });
    
    xml += `</urlset>`;
    setOutput(xml);
  };

  useEffect(() => {
    generateSitemap();
  }, [urls]);

  const addUrl = () => {
    setUrls([...urls, { 
      id: Date.now().toString(), 
      loc: '', 
      lastmod: new Date().toISOString().split('T')[0], 
      changefreq: 'weekly', 
      priority: '0.5' 
    }]);
  };

  const removeUrl = (id: string) => {
    if (urls.length > 1) setUrls(urls.filter(u => u.id !== id));
  };

  const updateUrl = (id: string, field: keyof SitemapURL, value: string) => {
    setUrls(urls.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSitemap = () => {
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <Network size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Sitemap Architect</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Institutional Indexing Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">W3C Standard Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Editor Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">URL Registry</label>
              <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{urls.length} Nodes Active</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
              {urls.map((url) => (
                <div key={url.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 group hover:border-[#D4AF37]/30 transition-all animate-in slide-in-from-left-2">
                  <div className="flex gap-4">
                    <div className="flex-grow space-y-1">
                      <div className="relative">
                        <Globe size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                          value={url.loc}
                          onChange={(e) => updateUrl(url.id, 'loc', e.target.value)}
                          placeholder="https://www.yourdomain.com/page"
                          className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeUrl(url.id)} className="text-gray-700 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest ml-1">Frequency</label>
                      <select 
                        value={url.changefreq}
                        onChange={(e) => updateUrl(url.id, 'changefreq', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none cursor-pointer"
                      >
                        <option value="always">Always</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest ml-1">Priority</label>
                      <select 
                        value={url.priority}
                        onChange={(e) => updateUrl(url.id, 'priority', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none cursor-pointer"
                      >
                        <option value="1.0">1.0 (Critical)</option>
                        <option value="0.8">0.8 (High)</option>
                        <option value="0.5">0.5 (Normal)</option>
                        <option value="0.3">0.3 (Low)</option>
                        <option value="0.1">0.1 (Archival)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest ml-1">Modified</label>
                      <input 
                        type="date"
                        value={url.lastmod}
                        onChange={(e) => updateUrl(url.id, 'lastmod', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-[10px] text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addUrl}
              className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-3 text-gray-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all"
            >
              <Plus size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Append URL Node</span>
            </button>
          </div>

          {/* Output Side */}
          <div className="lg:col-span-5 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">XML Manuscript</label>
              <div className="flex gap-4">
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-[#D4AF37]'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-8 overflow-hidden group shadow-inner min-h-[400px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               <textarea
                readOnly
                value={output}
                className="relative z-10 w-full h-full bg-transparent border-0 text-emerald-400/80 font-mono text-[11px] leading-relaxed outline-none resize-none custom-scrollbar"
               />
            </div>

            <button
              onClick={downloadSitemap}
              className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
            >
              <Download size={24} /> Export sitemap.xml
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Instant Synthesis</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCode size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">W3C Schema Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Universal Indexing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
