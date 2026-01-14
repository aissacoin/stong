
import React, { useState } from 'react';
import { DatabaseZap, Sparkles, Loader2, Copy, Check, Trash2, Wand2, Terminal, Code2, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const SQLFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatSQL = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Format this SQL query to be highly readable, properly indented, and standard-compliant. SQL:\n\n${input}`,
        config: {
          systemInstruction: "You are an expert Database Administrator. Reformat the provided SQL query. Use uppercase for keywords like SELECT, FROM, JOIN, WHERE. Add proper line breaks and indentation. Return ONLY the formatted SQL code without markdown backticks.",
        }
      });

      setOutput(response.text?.trim() || "Error: SQL Engine unresponsive.");
    } catch (err) {
      console.error(err);
      setOutput("Archival Error: Failed to synchronize with the database logic node.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <DatabaseZap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">SQL Query Formatter</h2>
            <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-[0.4em]">Advanced SQL Beautification Node</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <Terminal size={14} className="text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Standard ANSI SQL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Messy Raw Query</label>
            <button onClick={() => setInput('')} className="text-gray-600 hover:text-rose-400 transition-colors"><Trash2 size={14}/></button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border border-white/5 rounded-[2rem] p-6 text-emerald-100 font-mono text-xs outline-none focus:border-emerald-500/40 transition-all placeholder-white/5 resize-none shadow-inner"
            placeholder="select * from users where id=1 and status='active' group by name..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Formatted SQL Code</label>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-emerald-500 hover:text-white opacity-40 hover:opacity-100'}`}
            >
              {copied ? <Check size={14}/> : <Copy size={14}/>}
              <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="relative w-full h-80 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 text-emerald-400 font-mono text-xs overflow-y-auto custom-scrollbar leading-relaxed shadow-inner">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-sm">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Refining Query Logic...</p>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="opacity-10 italic">Awaiting SQL input for beautification...</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={formatSQL}
          disabled={loading || !input.trim()}
          className="w-full bg-emerald-500 text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] disabled:opacity-20"
        >
          {loading ? <Loader2 className="animate-spin" size={24}/> : <Wand2 size={24}/>}
          Beautify SQL Query
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Syntax Aware</span>
        </div>
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">ANSI-92 Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">High Readability</span>
        </div>
      </div>
    </div>
  );
};
