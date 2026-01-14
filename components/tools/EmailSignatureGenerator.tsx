
import React, { useState, useRef } from 'react';
import { PenLine, User, Briefcase, Phone, Mail, Globe, Linkedin, Twitter, Copy, Check, ShieldCheck, Zap, Info, Trash2, Code } from 'lucide-react';

export const EmailSignatureGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Alexander Sterling',
    title: 'Senior Technical Scribe',
    company: 'StrongTools Institutional Archive',
    phone: '+1 234 567 890',
    email: 'alexander@strongtools.site',
    website: 'www.strongtools.site',
    linkedin: 'linkedin.com/in/strongtools',
    twitter: 'twitter.com/strongtools',
    accentColor: '#D4AF37'
  });
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copySignature = async () => {
    if (!signatureRef.current) return;
    
    try {
      const type = "text/html";
      const blob = new Blob([signatureRef.current.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <PenLine size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Email Signature Architect</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Institutional Identity Forge</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Cross-Platform Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Editor Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Identity Parameters</label>
              <div className="grid grid-cols-1 gap-3">
                 <div className="relative">
                   <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                   <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-white/5 rounded-xl p-3 pl-10 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all" placeholder="Full Name" />
                 </div>
                 <div className="relative">
                   <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                   <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-black border border-white/5 rounded-xl p-3 pl-10 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all" placeholder="Professional Title" />
                 </div>
                 <div className="relative">
                   <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                   <input name="company" value={formData.company} onChange={handleChange} className="w-full bg-black border border-white/5 rounded-xl p-3 pl-10 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all" placeholder="Organization" />
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Communication Nodes</label>
              <div className="grid grid-cols-1 gap-3">
                 <div className="relative">
                   <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                   <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-white/5 rounded-xl p-3 pl-10 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all" placeholder="Phone Number" />
                 </div>
                 <div className="relative">
                   <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                   <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-white/5 rounded-xl p-3 pl-10 text-white text-xs outline-none focus:border-[#D4AF37]/40 transition-all" placeholder="Email Address" />
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Aesthetic Protocol</label>
               <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                 <input type="color" name="accentColor" value={formData.accentColor} onChange={handleChange} className="w-10 h-10 bg-transparent border-0 cursor-pointer" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Accent: {formData.accentColor}</span>
               </div>
            </div>

            <button
              onClick={copySignature}
              className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
              {copied ? 'Signature Vaulted' : 'Copy Formatted Signature'}
            </button>
          </div>

          {/* Viewport Side */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Visual Identity Preview</label>
              <button onClick={() => setShowCode(!showCode)} className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                <Code size={16}/>
              </button>
            </div>
            
            <div className="relative flex-grow bg-white border border-gray-200 rounded-[3.5rem] p-12 flex items-center justify-center min-h-[350px] shadow-inner overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '20px 20px' }}></div>
               
               {showCode ? (
                 <pre className="relative z-10 w-full h-full bg-gray-900 text-emerald-400 p-6 rounded-2xl text-[10px] overflow-auto font-mono whitespace-pre-wrap">
                   {signatureRef.current?.innerHTML}
                 </pre>
               ) : (
                 <div ref={signatureRef} className="relative z-10 w-full animate-in zoom-in duration-500">
                    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Montserrat, Arial, sans-serif', color: '#1a1a1a', textAlign: 'left' }}>
                      <tr>
                        <td style={{ paddingRight: '20px', borderRight: `3px solid ${formData.accentColor}` }}>
                           <div style={{ width: '80px', height: '80px', backgroundColor: formData.accentColor, borderRadius: '15px', color: '#000', display: 'flex', alignItems: 'center', justifyCenter: 'center', textAlign: 'center', fontWeight: '900', fontSize: '32px', lineHeight: '80px' }}>
                             {formData.name.charAt(0)}
                           </div>
                        </td>
                        <td style={{ paddingLeft: '20px' }}>
                           <div style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '2px', color: '#000' }}>{formData.name}</div>
                           <div style={{ fontSize: '12px', fontWeight: '600', color: formData.accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{formData.title}</div>
                           <div style={{ fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '8px' }}>{formData.company}</div>
                           
                           <table cellPadding="0" cellSpacing="0" style={{ fontSize: '11px' }}>
                              <tr>
                                <td style={{ paddingBottom: '4px' }}>
                                  <span style={{ fontWeight: '800', color: formData.accentColor, marginRight: '8px' }}>M</span>
                                  <span style={{ color: '#444' }}>{formData.phone}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingBottom: '4px' }}>
                                  <span style={{ fontWeight: '800', color: formData.accentColor, marginRight: '8px' }}>E</span>
                                  <a href={`mailto:${formData.email}`} style={{ color: '#444', textDecoration: 'none' }}>{formData.email}</a>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span style={{ fontWeight: '800', color: formData.accentColor, marginRight: '8px' }}>W</span>
                                  <a href={`https://${formData.website}`} style={{ color: '#444', textDecoration: 'none' }}>{formData.website}</a>
                                </td>
                              </tr>
                           </table>
                        </td>
                      </tr>
                    </table>
                 </div>
               )}
            </div>
            
            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-3xl flex items-start gap-4">
               <Info size={20} className="text-[#D4AF37] shrink-0 mt-0.5" />
               <p className="text-[9px] text-gray-400 leading-relaxed italic">
                 "To apply your signature, click 'Copy Signature' and paste it directly into your email provider's signature settings (Gmail Settings > General > Signature). Ensure 'Rich Text' mode is active in your provider."
               </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Cross-Client Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">No External Images</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Rich-Text Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
