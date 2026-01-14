
import React from 'react';
import { ShieldCheck, Lock, Eye, Scale, Globe, Database, FileText, Landmark, Cookie } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-32 pb-32 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-5xl mx-auto px-6 space-y-20">
        
        {/* Header Section */}
        <header className="text-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] mb-4 shadow-xl">
            <ShieldCheck size={18} /> Sovereign Privacy Protocol
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic font-serif-scholarly leading-none">
            Privacy <span className="text-[#D4AF37] text-glow">Pact</span>
          </h1>
          <p className="text-xl text-gray-400 italic max-w-2xl mx-auto leading-relaxed">
            "Transparency is the cornerstone of trust. Our commitment to your data sovereignty is absolute and verified."
          </p>
          <div className="flex justify-center gap-2 pt-4">
            {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/20"></div>)}
          </div>
        </header>

        {/* Main Content Sections */}
        <div className="space-y-12">
          
          {/* AdSense & Advertising Compliance */}
          <section className="glass-3d rounded-[3.5rem] p-12 md:p-16 border border-[#D4AF37]/20 bg-white/[0.01] relative overflow-hidden group">
            <Landmark className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4AF37] rotate-12 group-hover:opacity-[0.06] transition-opacity" size={300} />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <Globe size={28} />
                <h2 className="text-2xl font-black uppercase tracking-widest italic">1. Advertising & Cookies (AdSense)</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-400 space-y-6 text-lg leading-relaxed italic">
                <p>
                  StrongTools utilizes <strong className="text-white">Google AdSense</strong> to maintain our digital registry. Google, as a third-party vendor, uses cookies to serve ads on this site. Google's use of the <strong className="text-[#D4AF37]">DoubleClick cookie</strong> enables it and its partners to serve ads to our users based on their visit to StrongTools and other sites on the Internet.
                </p>
                <div className="flex items-start gap-4 p-6 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                  <Cookie className="text-[#D4AF37] shrink-0" size={24} />
                  <p className="text-sm">
                    Users may opt out of personalized advertising by visiting 
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline mx-1 hover:text-white transition-colors">Google Ad Settings</a>. 
                    Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting 
                    <a href="http://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline ml-1 hover:text-white transition-colors">aboutads.info</a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Local Data Sovereignty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="glass-3d rounded-[3rem] p-12 bg-black/40 border border-white/5 space-y-6 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <Database size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest italic">2. Data Locality</h3>
              </div>
              <p className="text-gray-400 leading-relaxed italic">
                We do not maintain centralized databases of your input data. All utility results are stored within your browser's <strong className="text-white">Local Storage</strong> to facilitate AM/PM content cycles. No personal identifiable information (PII) is transmitted to our servers during tool usage.
              </p>
            </section>

            <section className="glass-3d rounded-[3rem] p-12 bg-black/40 border border-white/5 space-y-6 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <FileText size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest italic">3. AI Content Clause</h3>
              </div>
              <p className="text-gray-400 leading-relaxed italic">
                The manuscripts found in our Chronicles are synthesized by advanced <strong className="text-white">Generative AI (Gemini 3 Pro & OpenRouter)</strong>. This content is for informational and scholarly purposes only. StrongTools does not claim these insights as medical, legal, or financial advice.
              </p>
            </section>
          </div>

          {/* User Rights (GDPR/CCPA) */}
          <section className="glass-3d rounded-[3.5rem] p-12 border border-[#D4AF37]/10 bg-[#D4AF37]/5 space-y-10">
            <div className="flex items-center gap-4 text-[#D4AF37]">
              <Scale size={28} />
              <h2 className="text-2xl font-black uppercase tracking-widest italic">4. Governance & User Rights (GDPR/CCPA)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-black text-xs uppercase tracking-widest">Right to Access</h4>
                <p className="text-sm text-gray-500 italic">You have the right to request copies of your local data logs at any time via your browser settings.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-black text-xs uppercase tracking-widest">Right to Erasure</h4>
                <p className="text-sm text-gray-500 italic">Clearing your browser cache immediately terminates our temporary link to your utility history.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-black text-xs uppercase tracking-widest">Right to Object</h4>
                <p className="text-sm text-gray-500 italic">You may object to the processing of your data by disabling non-essential cookies in your preference center.</p>
              </div>
            </div>
          </section>

          {/* Institutional Contact */}
          <footer className="text-center space-y-6 pt-12">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black mx-auto shadow-2xl">
              <Lock size={24} />
            </div>
            <p className="text-gray-500 italic font-medium">
              For inquiries regarding our archival security, contact the Registry Scribe at:
              <br />
              <span className="text-white font-black uppercase tracking-widest text-lg mt-2 inline-block">aissaline31@animepa.me</span>
            </p>
            <div className="pt-8 border-t border-white/5 opacity-30 text-[9px] font-black uppercase tracking-[1em]">
              Sovereign Registry Edition v4.0.2 • Verified MMXXIV
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};
