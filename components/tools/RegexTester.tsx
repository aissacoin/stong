
import React, { useState, useEffect, useMemo } from 'react';
// Added ShieldCheck to imports
import { SearchCode, Sparkles, Loader2, Info, Check, AlertTriangle, Code, Play, Wand2, Lightbulb, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}');
  const [testString, setTestString] = useState('Contact us at support@strongtools.site or admin@example.com');
  const [flags, setFlags] = useState('g');
  const [explanation, setExplanation] = useState('');
  const [loadingExplainer, setLoadingExplainer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Match logic
  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      setError(null);
      const regex = new RegExp(pattern, flags);
      const found = [];
      let match;
      
      // If global flag is not present, we can't use exec in a loop
      if (!flags.includes('g')) {
        match = regex.exec(testString);
        if (match) found.push(match);
      } else {
        while ((match = regex.exec(testString)) !== null) {
          found.push(match);
          if (match.index === regex.lastIndex) regex.lastIndex++; // Prevent infinite loop
        }
      }
      return found;
    } catch (e: any) {
      setError(e.message);
      return [];
    }
  }, [pattern, testString, flags]);

  const highlightMatches = () => {
    if (!pattern || error || matches.length === 0) return testString;
    
    let lastIndex = 0;
    const parts = [];
    
    // Sort matches by index to handle them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      // Add text before match
      parts.push(testString.substring(lastIndex, match.index));
      // Add highlighted match
      parts.push(
        <span key={i} className="bg-orange-500/30 border-b-2 border-orange-400 text-orange-200 px-0.5 rounded-sm font-bold shadow-sm">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    });
    
    // Add remaining text
    parts.push(testString.substring(lastIndex));
    return parts;
  };

  const getAIExplanation = async () => {
    if (!pattern || loadingExplainer) return;
    setLoadingExplainer(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain this Regular Expression in detail but briefly: /${pattern}/${flags}`,
        config: {
          systemInstruction: "You are a Senior Software Engineer. Explain what each part of the Regex does in bullet points. Use simple language. Focus on the logic. Return only the explanation.",
        }
      });
      setExplanation(response.text || "Failed to generate explanation.");
    } catch (err) {
      setExplanation("Archival Error: Linguistic neural node is unresponsive.");
    } finally {
      setLoadingExplainer(false);
    }
  };

  const commonPatterns = [
    { name: 'Email', regex: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}' },
    { name: 'Phone', regex: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
    { name: 'URL', regex: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Date (YYYY-MM-DD)', regex: '\\d{4}-\\d{2}-\\d{2}' }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-orange-500 selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
            <SearchCode size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Regex Tester</h2>
            <p className="text-[9px] font-bold text-orange-500/40 uppercase tracking-[0.4em]">Pattern Validation & AI Explainer</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonPatterns.map(p => (
            <button 
              key={p.name}
              onClick={() => setPattern(p.regex)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 hover:border-orange-500/30 transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-7 space-y-6">
          {/* Regex Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Expression</label>
              <div className="flex gap-4">
                {['g', 'i', 'm'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)}
                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${flags.includes(f) ? 'text-orange-400' : 'text-gray-600'}`}
                  >
                    {f === 'g' ? 'Global' : f === 'i' ? 'Insensitive' : 'Multiline'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/40 font-mono text-xl">/</span>
              <input 
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-2xl py-6 pl-10 pr-16 text-orange-400 font-mono text-sm outline-none focus:border-orange-500/40 transition-all shadow-inner"
                placeholder="[a-z]+"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500/40 font-mono text-xl">/{flags}</span>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] italic font-bold">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
          </div>

          {/* Test String Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Test String</label>
            <div className="relative">
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full h-48 bg-black border border-white/5 rounded-[2rem] p-6 text-white text-sm outline-none focus:border-orange-500/40 transition-all placeholder-white/5 resize-none shadow-inner custom-scrollbar"
                placeholder="Insert text to test your expression..."
              />
              <div className="absolute bottom-4 right-6 text-[8px] font-black uppercase tracking-widest text-orange-500/40">
                {matches.length} Matches Found
              </div>
            </div>
          </div>

          <button
            onClick={getAIExplanation}
            disabled={loadingExplainer || !pattern}
            className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-20"
          >
            {loadingExplainer ? <Loader2 className="animate-spin" size={18}/> : <Wand2 size={18}/>}
            AI Regex Explainer
          </button>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Visual Highlight Output */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden h-[300px] flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-6 italic">Live Match Result</h3>
            <div className="flex-grow overflow-auto custom-scrollbar bg-black/40 rounded-2xl border border-white/5 p-6 text-sm leading-relaxed text-gray-300 font-mono break-all">
              {highlightMatches()}
            </div>
          </div>

          {/* AI Explanation Area */}
          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-[2.5rem] min-h-[160px] relative overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400 mb-4 italic flex items-center gap-2">
              <Lightbulb size={12} /> AI Logic Analysis
            </h3>
            <div className="text-[11px] text-orange-200/70 italic leading-loose whitespace-pre-wrap overflow-y-auto custom-scrollbar max-h-48">
              {loadingExplainer ? (
                <div className="flex flex-col items-center justify-center h-20 opacity-50 animate-pulse">
                  <Loader2 className="animate-spin mb-2" />
                  <span>Decoding Pattern Architecture...</span>
                </div>
              ) : explanation ? (
                explanation
              ) : (
                <span className="opacity-20 italic">Trigger AI explainer to decode the regex structure.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-40">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Code size={14} className="text-orange-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">JavaScript Engine</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Play size={14} className="text-orange-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Real-time Matching</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <ShieldCheck size={14} className="text-orange-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Safe Execution</span>
        </div>
      </div>
    </div>
  );
};
