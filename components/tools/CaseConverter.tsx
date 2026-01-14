
import React, { useState } from 'react';
import { Type, Copy, Trash2, Check, ArrowRightLeft, Info, Target, Zap, ShieldCheck, FileText } from 'lucide-react';

type CaseType = 'UPPER' | 'LOWER' | 'TITLE' | 'SENTENCE' | 'CAMEL' | 'PASCAL';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type: CaseType) => {
    if (!text.trim()) return;

    let result = text;
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    switch (type) {
      case 'UPPER':
        result = text.toUpperCase();
        break;
      case 'LOWER':
        result = text.toLowerCase();
        break;
      case 'TITLE':
        result = text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        break;
      case 'SENTENCE':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, s => s.toUpperCase());
        break;
      case 'CAMEL':
        result = words.map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
        break;
      case 'PASCAL':
        result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        break;
    }
    setText(result);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText('');

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <Type size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Case Converter</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Linguistic Topology Modifier</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Grammatical Integrity Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input/Output Registry */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <div className="flex justify-between items-center px-4 mb-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Target Manuscript</label>
                 <div className="flex gap-4">
                    <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors" title="Wipe Registry"><Trash2 size={16}/></button>
                    <button onClick={handleCopy} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'text-emerald-400' : 'text-gray-600 hover:text-[var(--accent)]'}`}>
                      {copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Captured' : 'Copy'}
                    </button>
                 </div>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 bg-black border border-white/5 rounded-[2.5rem] p-8 text-white text-lg font-medium outline-none focus:border-[var(--accent)]/40 transition-all shadow-inner placeholder-white/5 resize-none italic custom-scrollbar"
                placeholder="Place your prose or code here for topological restructuring..."
              />
            </div>
          </div>

          {/* Transformation Protocols */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic mb-3 px-2">Active Protocols</label>
            
            {[
              { id: 'UPPER', label: 'Uppercase', desc: 'ALL CAPS' },
              { id: 'LOWER', label: 'Lowercase', desc: 'all small' },
              { id: 'TITLE', label: 'Title Case', desc: 'Capitalize Each Word' },
              { id: 'SENTENCE', label: 'Sentence case', desc: 'Capitalize first letter' },
              { id: 'CAMEL', label: 'camelCase', desc: 'softwareVariableNaming' },
              { id: 'PASCAL', label: 'PascalCase', desc: 'SoftwareClassNaming' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => convert(p.id as CaseType)}
                className="group relative flex flex-col items-start p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-[var(--accent)]/40 transition-all hover:bg-[var(--accent)]/5 text-left"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-[var(--accent)] transition-colors">{p.label}</span>
                  <ArrowRightLeft size={12} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest italic">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Zero-Latency Topological Transformation</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Regex-Driven Semantic Accuracy</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL MANUSCRIPT SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-20 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <div className="ad-placeholder h-24 mb-16 opacity-40"> [Expert Linguistic Registry Display Ad] </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic text-glow">The Topology of Text</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            In the modern digital meridian, the "Case" of a word is more than an aesthetic choice—it is a functional directive. Whether you are drafting a scholarly manuscript in <strong>Title Case</strong> to command authority, or engineering a software module using <strong>camelCase</strong> to adhere to architectural standards, the Sovereign Case Converter ensures your topology is crystalline and consistent.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Strategic Case Applications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Title Case (Archival Standard)</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Perfect for book titles, blog headlines, and official scrolls. This pattern capitalizes every significant word, providing a rhythmic and prestigious visual hierarchy.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Camel & Pascal (Logic Standards)</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Fundamental for developers. camelCase is the sovereign standard for variables in JavaScript and Java, while PascalCase denotes the identity of Classes and Types.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <FileText size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Technical Manuscript: Logical Flow</h3>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed italic">
            Our instrument utilizes high-performance string manipulation logic to ensure accuracy even with complex punctuation.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-lg italic">
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Boundary Awareness:</strong> Sentence case correctly identifies delimiters like periods, question marks, and exclamation points.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">De-Space Synthesis:</strong> Programming patterns (Camel/Pascal) automatically remove whitespace to create valid identifiers.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Privacy Assurance:</strong> Like all instruments in the StrongTools vault, transformations occur locally. Your manuscript never enters our cloud.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Institutional Export:</strong> Rapid capture protocol allows for instant copying of transformed results into your primary workspace.</span>
            </li>
          </ul>
        </section>

        <div className="ad-placeholder h-40 opacity-30 mt-20"> [Strategic Linguistic Ad Placeholder] </div>
      </div>
    </div>
  );
};
