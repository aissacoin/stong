
import React, { useState, useMemo } from 'react';
import { BarChart3, Search, Trash2, Info, Target, Zap, ShieldCheck, AlertTriangle, FileText, LayoutGrid, Check, Percent } from 'lucide-react';

interface DensityResult {
  keyword: string;
  count: number;
  density: number;
}

const STOP_WORDS = new Set([
  'the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'i', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'not', 'word', 'but', 'what', 'some', 'we', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'up', 'use', 'your', 'how', 'said', 'an', 'each', 'she', 'which', 'do', 'how', 'their', 'if', 'will', 'about', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'no', 'way', 'could', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'its', 'now', 'find'
]);

export const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [phraseLength, setPhraseLength] = useState<1 | 2 | 3>(1);
  const [minCount, setMinCount] = useState(1);

  // Force standard numerals 1234567890
  const formatNum = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const analysis = useMemo(() => {
    if (!text.trim()) return { results: [], totalWords: 0 };

    // Clean text and split into words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
    
    const totalWordsCount = words.length;
    const frequency: Record<string, number> = {};

    if (phraseLength === 1) {
      words.forEach(word => {
        if (!STOP_WORDS.has(word)) {
          frequency[word] = (frequency[word] || 0) + 1;
        }
      });
    } else {
      for (let i = 0; i <= words.length - phraseLength; i++) {
        const phrase = words.slice(i, i + phraseLength).join(' ');
        const wordsInPhrase = phrase.split(' ');
        // Only count if the phrase contains at least one meaningful word
        if (wordsInPhrase.some(w => !STOP_WORDS.has(w))) {
          frequency[phrase] = (frequency[phrase] || 0) + 1;
        }
      }
    }

    const results: DensityResult[] = Object.entries(frequency)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: (count / (totalWordsCount > 0 ? totalWordsCount : 1)) * 100
      }))
      .filter(r => r.count >= minCount)
      .sort((a, b) => b.count - a.count);

    return { results, totalWords: totalWordsCount };
  }, [text, phraseLength, minCount]);

  const getIntensityColor = (density: number) => {
    if (density > 4) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    if (density > 2.5) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="space-y-16">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Keyword Density Checker</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Lexical Distribution Node</p>
            </div>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            {[1, 2, 3].map((l) => (
              <button 
                key={l}
                onClick={() => setPhraseLength(l as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${phraseLength === l ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                {l} Word{l > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-8">
          {/* Input Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Target Manuscript</label>
                <button onClick={() => setText('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={16}/></button>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 bg-black border border-white/10 rounded-[2.5rem] p-8 text-white text-lg font-medium outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner placeholder-white/5 resize-none italic custom-scrollbar"
                placeholder="Paste your professional prose here for algorithmic deconstruction..."
              />
            </div>

            <div className="p-8 bg-[#D4AF37]/5 border border-dashed border-[#D4AF37]/20 rounded-[2.5rem] space-y-4">
               <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">Analysis Sensitivity</span>
                  <span className="text-xs font-black text-[#D4AF37] tabular-nums">{minCount}+ Occurrences</span>
               </div>
               <input 
                  type="range" min="1" max="10" step="1" value={minCount}
                  onChange={(e) => setMinCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
               />
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] italic">Lexical Registry</h3>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> {formatNum(analysis.totalWords)} Total Words
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {analysis.results.length > 0 ? (
                analysis.results.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-[#D4AF37]/40 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                      <div className="text-sm font-black text-white italic tracking-tight">{res.keyword}</div>
                      <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Frequency: {formatNum(res.count)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tabular-nums border ${getIntensityColor(res.density)} shadow-sm`}>
                        {formatNum(res.density.toFixed(2))}%
                      </div>
                      {res.density > 4 && (
                        <div title="Stuffing Hazard Detected" className="text-rose-500 animate-pulse">
                          <AlertTriangle size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                  <BarChart3 size={80} className="mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Awaiting Ingestion for Processing</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-blue-400" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">1234567890 Numeral Integrity Verified</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-blue-400" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Deterministic LSI Evaluation Engine</p>
           </div>
        </div>
      </div>
    </div>
  );
};
