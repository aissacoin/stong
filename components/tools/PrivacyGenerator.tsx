
import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, Download, Trash2, FileText, Landmark, Globe, ShieldCheck, Zap, Info, ScrollText } from 'lucide-react';

export const PrivacyGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    siteName: 'StrongTools',
    domain: 'www.strongtools.site',
    email: 'registry@strongtools.site',
    country: 'United Kingdom',
    usesCookies: true,
    usesAdsense: true
  });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePolicy = () => {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const text = `PRIVACY POLICY MANUSCRIPT
Effective Date: ${date}

1. INSTITUTIONAL IDENTITY
This Privacy Policy governs the digital registry of ${formData.siteName}, accessible via ${formData.domain}. Your data sovereignty is our primary mandate.

2. DATA COLLECTION PROTOCOLS
We collect information only when necessary to facilitate high-fidelity utility cycles. 
- Technical Node Data: Browser type, temporal coordinates (timestamp), and referral registries.
${formData.usesCookies ? '- Cookie Archives: We utilize cryptographic cookies to enhance your session stability.' : ''}

3. THIRD-PARTY HANDSHAKES
${formData.usesAdsense ? 'Our registry utilizes Google AdSense. As a third-party vendor, Google employs the DoubleClick cookie protocol to serve targeted informational displays based on your temporal history across the web.' : 'No third-party data exchange protocols are currently active.'}

4. USER RIGHTS & JURISDICTION
Under global standards including GDPR and CCPA, you retain the absolute right to:
- Access your local data logs.
- Request erasure of your archival presence.
- Object to automated neural processing.

5. REGISTRY GOVERNANCE
For all inquiries regarding this manuscript, dispatch a correspondence to: ${formData.email}
Jurisdiction: ${formData.country} Official Registry.`;

    setOutput(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Institutional Privacy Architect</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Legal Manuscript Synthesizer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Compliance Verified MMXXV</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Config Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Archival Parameters</label>
              <div className="space-y-3">
                 <input 
                  value={formData.siteName} 
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  placeholder="Website Name"
                 />
                 <input 
                  value={formData.domain} 
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  placeholder="URL / Domain"
                 />
                 <input 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
                  placeholder="Registry Contact Email"
                 />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button 
                onClick={() => setFormData({...formData, usesCookies: !formData.usesCookies})}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${formData.usesCookies ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/5 text-gray-500'}`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest">Cookie Usage</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${formData.usesCookies ? 'bg-[#D4AF37]' : 'bg-white/10'}`}></div>
               </button>
               <button 
                onClick={() => setFormData({...formData, usesAdsense: !formData.usesAdsense})}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${formData.usesAdsense ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/5 text-gray-500'}`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest">AdSense Node</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${formData.usesAdsense ? 'bg-[#D4AF37]' : 'bg-white/10'}`}></div>
               </button>
            </div>

            <button
              onClick={generatePolicy}
              className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
            >
              <ScrollText size={24} /> Synthesize Manuscript
            </button>
          </div>

          {/* Viewport Side */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Archival Output</label>
              <div className="flex gap-3">
                <button onClick={() => setOutput('')} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-[#D4AF37]'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Sealed' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group shadow-inner min-h-[400px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               <textarea
                readOnly
                value={output}
                className="relative z-10 w-full h-full bg-transparent border-0 text-gray-300 font-serif text-lg leading-relaxed outline-none resize-none custom-scrollbar italic"
                placeholder="Awaiting synthesis parameters..."
               />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Jurisdiction Aware</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Global Compliance Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Veritas Logic Shield</span>
          </div>
        </div>
      </div>
    </div>
  );
};
