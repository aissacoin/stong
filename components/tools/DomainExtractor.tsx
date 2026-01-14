
import React, { useState, useEffect } from 'react';
import { Globe2, Copy, Trash2, Check, Download, ListFilter, ArrowDownAz, ShieldCheck, Zap, Info, FileSearch, Target, ZapOff, Filter } from 'lucide-react';

type ExtensionFilter = 'all' | '.com' | '.net' | '.site' | '.org';

export const DomainExtractor: React.FC = () => {
  const [input, setInput] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedExt, setSelectedExt] = useState<ExtensionFilter>('all');
  const [options, setOptions] = useState({
    removeDuplicates: true,
    alphabetical: true,
    removeWww: false
  });

  const extractDomains = () => {
    if (!input.trim()) {
      setDomains([]);
      return;
    }

    // Dynamic regex based on extension selection
    let regexPattern = '(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]';
    if (selectedExt !== 'all') {
      // Escape the dot and match the specific extension at the end
      const ext = selectedExt.replace('.', '\\.');
      regexPattern = `(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+${ext.replace('\\.', '')}`;
    }
    
    const regex = new RegExp(regexPattern, 'gi');
    let matches = input.match(regex) || [];

    matches = matches.map(d => d.toLowerCase());

    if (options.removeWww) {
      matches = matches.map(d => d.replace(/^www\./, ''));
    }

    if (options.removeDuplicates) {
      matches = Array.from(new Set(matches));
    }

    if (options.alphabetical) {
      matches.sort();
    }

    setDomains(matches);
  };

  useEffect(() => {
    extractDomains();
  }, [input, options, selectedExt]);

  const handleCopy = () => {
    if (domains.length === 0) return;
    navigator.clipboard.writeText(domains.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (domains.length === 0) return;
    const blob = new Blob([domains.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `strongtools_domains_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const extensions: ExtensionFilter[] = ['all', '.com', '.net', '.site', '.org'];

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <Globe2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Domain Extractor</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Advanced Text Harvesting Unit</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'removeDuplicates', label: 'Unique Only', icon: <ListFilter size={12}/> },
              { id: 'alphabetical', label: 'Sort A-Z', icon: <ArrowDownAz size={12}/> },
              { id: 'removeWww', label: 'Strip WWW', icon: <ZapOff size={12}/> }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                  options[opt.id as keyof typeof options] 
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]' 
                  : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* EXTENSION FILTER SELECTOR */}
        <div className="mb-8 p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">
            <Filter size={14} /> Filter Extension:
          </div>
          <div className="flex flex-wrap gap-2">
            {extensions.map(ext => (
              <button
                key={ext}
                onClick={() => setSelectedExt(ext)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                  selectedExt === ext 
                  ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                  : 'bg-black border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {ext}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Input Source Text</label>
              <button onClick={() => setInput('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={14}/></button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 bg-black border border-white/5 rounded-[2rem] p-6 text-white font-mono text-sm outline-none focus:border-[var(--accent)]/40 transition-all placeholder-white/5 resize-none shadow-inner custom-scrollbar"
              placeholder="Paste logs, emails, or raw text here..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">
                {selectedExt === 'all' ? 'Harvested Domains' : `Extracted ${selectedExt} Domains`} ({domains.length})
              </label>
              <button 
                onClick={handleCopy}
                disabled={domains.length === 0}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[var(--accent)] hover:text-white opacity-40 hover:opacity-100'}`}
              >
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy List'}</span>
              </button>
            </div>
            <div className="relative w-full h-80 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-[2rem] p-6 text-[var(--accent)] font-mono text-xs overflow-y-auto custom-scrollbar leading-relaxed shadow-inner">
              {domains.length > 0 ? (
                <div className="space-y-1">
                  {domains.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors group">
                      <span className="opacity-20 text-[8px] group-hover:opacity-100">{i + 1}</span>
                      {d}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                  <FileSearch size={48} />
                  <span className="italic text-xs uppercase tracking-widest font-black text-center px-4">
                    {selectedExt === 'all' 
                      ? 'Awaiting Input' 
                      : `No ${selectedExt} domains detected in source`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={downloadTxt}
          disabled={domains.length === 0}
          className="w-full bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
        >
          <Download size={24}/>
          Export Cleaned List (.txt)
        </button>
      </div>

      {/* ENGLISH DESCRIPTION SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-16 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        {/* Section 1: What is it */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">What is the Domain Extractor?</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            The Domain Extractor is a high-precision utility designed to parse unformatted text blocks and isolate valid domain names. By utilizing advanced Regular Expression (Regex) patterns, this tool filters out noise such as HTML tags, sentences, and symbols to provide a clean list of hostnames (e.g., example.com) from sources like server logs, scraped data, or email headers.
          </p>
        </section>

        {/* Section 2: Use Cases */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Primary Use Cases</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Mailing List Cleanup</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Extract unique domain providers from massive email lists to analyze your subscriber demographics or clean up bounce-prone addresses.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Competitor Analysis</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Scan research papers, PDFs, or industry articles to quickly identify all external organizations and competitors mentioned by their URLs.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Log File Analysis</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Sift through complex server or network logs to extract visiting domains and outgoing link requests for security or traffic auditing.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Key Features */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Zap size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Advanced Tool Features</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-lg italic">
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Deduplication:</strong> Automatically identifies and removes duplicate entries to ensure your exported list contains only unique domains.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Alphabetical Sorting:</strong> Instant organization of your data from A to Z, making large lists manageable and easy to navigate.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Strip WWW Bypassing:</strong> Optional cleaning to remove "www." prefixes, allowing for a standardized domain list regardless of the source formatting.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Check className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Instant Local Processing:</strong> Your data never leaves your browser. All extractions happen on your machine for maximum security and speed.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
};
