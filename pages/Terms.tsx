
import React from 'react';
import { Gavel, AlertTriangle, ShieldAlert, ScrollText, CheckCircle2, Bookmark, Landmark, Terminal } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-32 pb-32 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-5xl mx-auto px-6 space-y-20">
        
        {/* Header Section */}
        <header className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] mb-4 shadow-xl">
            <Gavel size={18} /> Professional Usage Agreement
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic font-serif-scholarly leading-none">
            Terms of <span className="text-[#D4AF37] text-glow">Engagement</span>
          </h1>
          <p className="text-xl text-gray-400 italic max-w-2xl mx-auto leading-relaxed">
            "By accessing the vault, you acknowledge the parameters of our digital instruments and the limits of our scholarly registry."
          </p>
          <div className="flex justify-center gap-2 pt-4">
            {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/20"></div>)}
          </div>
        </header>

        {/* Content Modules */}
        <div className="space-y-12">
          
          {/* Informational Nature */}
          <section className="glass-3d rounded-[3.5rem] p-12 md:p-16 border border-[#D4AF37]/20 bg-white/[0.01] relative overflow-hidden group">
            <Landmark className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4AF37] rotate-12" size={300} />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <AlertTriangle size={28} />
                <h2 className="text-2xl font-black uppercase tracking-widest italic">1. Informational Usage Only</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-400 space-y-6 text-lg leading-relaxed italic">
                <p>
                  StrongTools provides a suite of digital instruments for <strong className="text-white">informational and educational purposes</strong>. While we strive for absolute precision, results from our calculators, converters, and AI chronicles should not be considered definitive professional, medical, financial, or legal advice.
                </p>
                <p>
                  The user assumes full responsibility for any actions taken based on the data generated within this registry.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="glass-3d rounded-[3rem] p-12 bg-black/40 border border-white/5 space-y-6 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <Terminal size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest italic">2. Registry Integrity</h3>
              </div>
              <p className="text-gray-400 leading-relaxed italic">
                We grant you a non-exclusive right to utilize our tools. Any attempt to scrape, reverse-engineer, or disrupt the sovereign logic of our instruments is a violation of this engagement.
              </p>
            </section>

            <section className="glass-3d rounded-[3rem] p-12 bg-black/40 border border-white/5 space-y-6 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <ShieldAlert size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest italic">3. Liability Limits</h3>
              </div>
              <p className="text-gray-400 leading-relaxed italic">
                StrongTools shall not be liable for any direct, indirect, or consequential damages resulting from the use or inability to use the instruments provided in this vault.
              </p>
            </section>
          </div>

          {/* AI Content Policy */}
          <section className="glass-3d rounded-[3.5rem] p-12 border border-[#D4AF37]/10 bg-[#D4AF37]/5 space-y-8">
            <div className="flex items-center gap-4 text-[#D4AF37]">
              <ScrollText size={28} />
              <h2 className="text-2xl font-black uppercase tracking-widest italic">4. Intellectual Property & AI</h2>
            </div>
            <div className="prose prose-invert max-w-none text-gray-400 text-lg italic">
              <p>
                All articles and manuscripts generated within our "Chronicles" section are synthesized using AI. These are the property of StrongTools. Any republication of this content must include a clear, canonical backlink to our archive.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 size={18} className="text-[#D4AF37]" />
                  <span className="text-xs uppercase font-black tracking-widest">Verify Results</span>
                </div>
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 size={18} className="text-[#D4AF37]" />
                  <span className="text-xs uppercase font-black tracking-widest">No Commercial Scraping</span>
                </div>
              </div>
            </div>
          </section>

          {/* Closing Summary */}
          <footer className="text-center space-y-6 pt-12">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-black mx-auto shadow-2xl">
              <Bookmark size={24} />
            </div>
            <p className="text-gray-500 italic font-medium">
              These terms are effective as of the current meridian. Continued access to the vault constitutes acceptance of these protocols.
            </p>
            <div className="pt-8 border-t border-white/5 opacity-30 text-[9px] font-black uppercase tracking-[1em]">
              Archival Governance v4.0.0 • StrongTools.site
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};
