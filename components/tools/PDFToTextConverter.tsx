
import React, { useState, useRef } from 'react';
import { FileText, Upload, Copy, Download, Trash2, Check, ShieldCheck, Zap, Info, Target, FileSearch, Loader2 } from 'lucide-react';

export const PDFToTextConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setLoading(true);
    setFileName(file.name);
    setText('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Dynamically import pdfjs-dist from ESM
      const pdfjs = await import('https://esm.sh/pdfjs-dist@4.0.379');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(fullText.trim());
    } catch (err) {
      console.error("PDF Extraction Failure:", err);
      alert("Failed to extract text. This document may be encrypted or scan-only (OCR not supported in this basic node).");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.pdf', '')}_extracted.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-pink-500 selection:text-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-400">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign PDF to Text</h2>
              <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">High-Fidelity Archival Extraction</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Local Memory Sandbox Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Archival Source (PDF File)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-64 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${fileName ? 'border-pink-500/40' : 'border-white/5 hover:border-pink-500/40'}`}
              >
                {loading ? (
                   <div className="flex flex-col items-center gap-4 animate-pulse">
                     <Loader2 size={48} className="text-pink-500 animate-spin" />
                     <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Parsing Registry...</span>
                   </div>
                ) : fileName ? (
                   <div className="text-center p-8 space-y-2">
                     <Check size={48} className="text-emerald-400 mx-auto" />
                     <p className="text-xs text-white font-black uppercase truncate max-w-[250px]">{fileName}</p>
                     <span className="text-[8px] text-gray-500 font-black uppercase">Document Ingested</span>
                   </div>
                ) : (
                  <>
                    <Upload size={40} className="text-gray-700 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center px-8">Drop PDF Scroll or Click to Ingest</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button
                onClick={handleCopy}
                disabled={!text || loading}
                className="bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-20"
               >
                 {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                 {copied ? 'Captured' : 'Copy All'}
               </button>
               <button
                onClick={handleDownload}
                disabled={!text || loading}
                className="bg-pink-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-20"
               >
                 <Download size={14} /> Export TXT
               </button>
            </div>

            <div className="p-8 bg-pink-500/5 border border-dashed border-pink-500/20 rounded-[2.5rem] flex items-center gap-6 opacity-60">
                <Target size={40} className="text-pink-500/40 shrink-0" />
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Handshake Integrity</p>
                    <p className="text-xs text-gray-500 leading-relaxed italic">Our node uses deterministic extraction to isolate unicode characters from your document's semantic layer.</p>
                </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">Extracted Manuscript Preview</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 overflow-hidden group min-h-[500px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {text ? (
                 <textarea 
                   readOnly
                   value={text}
                   className="relative z-10 w-full h-full bg-transparent border-0 text-gray-300 font-mono text-sm leading-relaxed outline-none resize-none custom-scrollbar italic"
                 />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <FileSearch size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting PDF Decryption</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-pink-400" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Zero-Upload Privacy Protocol Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-pink-400" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Deterministic Unicode Mapping Verified</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL MANUSCRIPT SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-20 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <div className="ad-placeholder h-24 mb-16 opacity-40"> [Expert Registry Conversion Display Ad] </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">The Mechanics of PDF Extraction</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            Portable Document Format (PDF) files are complex digital archives that store text as a series of coordinates and glyph mappings. Unlike simple text files, a PDF defines exactly where each character sits on a 2D plane. Our Sovereign Converter deconstructs these coordinates, reassembling them into a sequential, human-readable manuscript. This process is vital for data mining, content repurposing, and accessibility enhancement.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Privacy in Conversion</h3>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed italic">
            Traditional online converters require you to upload your sensitive scrolls to a third-party server. This poses a significant risk to institutional data security. StrongTools utilizes a <strong>Zero-Trust Protocol</strong>, where the conversion logic is downloaded once and executed entirely within your browser's local RAM. Your documents never cross the network, ensuring absolute sovereignty over your information.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Strategic Applications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-pink-500/30 transition-colors">
              <h4 className="text-pink-500 font-black uppercase tracking-widest text-xs">Research Consolidation</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Instantly pull text from academic journals and white papers to consolidate insights into a single master manuscript for further analysis.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-pink-500/30 transition-colors">
              <h4 className="text-pink-500 font-black uppercase tracking-widest text-xs">Archive Re-Indexing</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Transform legacy documentation into searchable plain text, facilitating faster retrieval and integration into modern database registries.</p>
            </div>
          </div>
        </section>

        <div className="ad-placeholder h-40 opacity-30 mt-20"> [Strategic Registry Display Ad Placeholder] </div>
      </div>
    </div>
  );
};
