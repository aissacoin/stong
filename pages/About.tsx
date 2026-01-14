
import React from 'react';
import { Landmark, ScrollText, ShieldCheck, Target, Users, Zap, Award, Crown, Compass, BookOpen, Diamond, Star } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 space-y-40">
        
        {/* Superior Hero Section */}
        <div className="text-center space-y-12 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[14px] font-black uppercase tracking-[0.8em] mb-4 shadow-[0_0_60px_rgba(212,175,55,0.15)] backdrop-blur-xl">
            <Crown size={20} /> Est. MMXXIV • Sovereignty in Logic
          </div>
          <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-[0.85] italic mb-10">
            <span className="block opacity-20 text-white">THE SUPREME</span>
            <span className="text-[#D4AF37] text-glow relative">
              StrongTools
              <div className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full opacity-50"></div>
            </span> 
            <span className="block opacity-20 text-white">ARCHIVE</span>
          </h1>
          <p className="text-3xl md:text-5xl font-light text-gray-300 italic max-w-5xl mx-auto leading-tight tracking-tight">
            "A sanctuary where the absolute rigor of mathematics meets the pinnacle of digital aesthetic excellence."
          </p>
        </div>

        {/* The Institutional Mandate */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/30 to-transparent rounded-[5rem] blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000"></div>
          <div className="relative bg-[#141414] border border-[#D4AF37]/30 rounded-[5rem] p-20 md:p-32 shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-24 overflow-hidden">
            <div className="absolute -top-20 -right-20 p-20 opacity-[0.03] pointer-events-none rotate-[25deg] text-[#D4AF37]">
              <Landmark size={800} strokeWidth={0.5} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-12 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-[#D4AF37] rounded-3xl flex items-center justify-center text-black shadow-2xl">
                     <Award size={40} />
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black text-[#D4AF37] uppercase tracking-tighter italic">Institutional Mandate</h2>
                </div>
                <p className="text-2xl md:text-3xl text-gray-200 leading-[1.7] font-medium italic first-letter:text-9xl first-letter:font-black first-letter:text-[#D4AF37] first-letter:mr-6 first-letter:float-left first-letter:leading-[0.75]">
                  StrongTools.site is not merely a utility portal; it is a curated sanctuary for the discerning professional. In an era of digital noise, we provide the silence of absolute data, wrapped in an interface designed for those who demand uncompromising accuracy.
                </p>
                <p className="text-xl text-gray-500 leading-relaxed font-light">
                  Every instrument in our sovereign vault—from the high-fidelity Weather Oracle to our cryptographic Scribe Counter—undergoes rigorous verification against global computational benchmarks. We serve the architects, the analysts, and the visionaries who understand that the quality of their tools dictates the quality of their outcome.
                </p>
                <div className="pt-10 flex gap-4">
                  <div className="px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Veritas</div>
                  <div className="px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Aequitas</div>
                  <div className="px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Fidelitas</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-10">
                <div className="glass-3d p-12 rounded-[3.5rem] border border-[#D4AF37]/20 flex items-start gap-8 group/item hover:border-[#D4AF37] transition-all duration-500 bg-black/40">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover/item:scale-110 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all duration-500 shadow-xl">
                    <Zap size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-3">Sub-Pixel Perfection</h3>
                    <p className="text-lg text-gray-500 italic leading-relaxed">Engineered for sub-millisecond logical processing and visual precision that respects the professional eye.</p>
                  </div>
                </div>
                <div className="glass-3d p-12 rounded-[3.5rem] border border-[#D4AF37]/20 flex items-start gap-8 group/item hover:border-[#D4AF37] transition-all duration-500 bg-black/40">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover/item:scale-110 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all duration-500 shadow-xl">
                    <ShieldCheck size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-3">Absolute Data Privacy</h3>
                    <p className="text-lg text-gray-500 italic leading-relaxed">No tracking. No telemetry. Your data remains local to your browser, protected by our foundational Privacy Pact.</p>
                  </div>
                </div>
                <div className="glass-3d p-12 rounded-[3.5rem] border border-[#D4AF37]/20 flex items-start gap-8 group/item hover:border-[#D4AF37] transition-all duration-500 bg-black/40">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover/item:scale-110 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all duration-500 shadow-xl">
                    <Diamond size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-3">The Aureate Standard</h3>
                    <p className="text-lg text-gray-500 italic leading-relaxed">A design language rooted in gold and depth, reflecting the inherent value of information precision.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founders Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center space-y-8 group">
            <div className="w-32 h-32 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto shadow-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-700 relative">
              <Star className="absolute top-0 right-0 text-[#D4AF37] animate-pulse" size={24} />
              <Compass size={56} strokeWidth={1} />
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter text-white">Guiding Meridian</h4>
            <p className="text-gray-500 text-lg italic leading-relaxed px-8 font-light">
              Our algorithms are cross-referenced with IEEE standards to ensure every decimal point is a crystalline statement of truth.
            </p>
          </div>
          <div className="text-center space-y-8 group">
            <div className="w-32 h-32 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto shadow-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-700">
              <ScrollText size={56} strokeWidth={1} />
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter text-white">Archival Legacy</h4>
            <p className="text-gray-500 text-lg italic leading-relaxed px-8 font-light">
              We preserve the history of measurement, providing a scholarly context that enriches the utility of modern digital instruments.
            </p>
          </div>
          <div className="text-center space-y-8 group">
            <div className="w-32 h-32 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto shadow-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-700">
              <Target size={56} strokeWidth={1} />
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter text-white">Mathematical Rigor</h4>
            <p className="text-gray-500 text-lg italic leading-relaxed px-8 font-light">
              Design is not a decorative layer; it is the logical foundation. A beautiful tool is, by definition, a more efficient tool.
            </p>
          </div>
        </div>

        {/* Institutional Footer */}
        <div className="pt-32 border-t border-[#D4AF37]/20 text-center space-y-10">
          <div className="flex justify-center items-center gap-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
            <BookOpen className="text-[#D4AF37]/40" size={32} />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>
          <p className="text-[#D4AF37]/30 text-[12px] font-black uppercase tracking-[1.5em] italic">
            StrongTools Master Registry • Sovereign Edition v4.0
          </p>
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
