
import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, ShieldCheck, Zap, Info, FileSearch, Loader2, Check, AlertCircle } from 'lucide-react';

export const PDFToWord: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setFileName(file.name);
    setDocxBlob(null);

    try {
      // 1. Load PDFJS and extract text
      const pdfjs = await import('https://esm.sh/pdfjs-dist@4.0.379');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let pagesContent: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        pagesContent.push(pageText);
      }

      // 2. Build DOCX using docx library via dynamic import
      const docxLib = await import('https://esm.sh/docx@8.5.0');
      const { Document, Packer, Paragraph, TextRun, PageBreak } = docxLib;

      const children = pagesContent.flatMap((content, index) => {
        const p = new Paragraph({
          children: [new TextRun(content)],
        });
        // Add page break if not the last page
        return index < pagesContent.length - 1 ? [p, new Paragraph({ children: [new PageBreak()] })] : [p];
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      setDocxBlob(blob);
      setSuccess(true);
    } catch (err: any) {
      console.error("PDF to Word Conversion Failure:", err);
      setError("Logical Synthesis Failure: The document is either encrypted or its internal structure is incompatible with our local extraction node.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!docxBlob) return;
    const url = URL.createObjectURL(docxBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace('.pdf', '')}_Sovereign.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFileName('');
    setDocxBlob(null);
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-400">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign PDF to Word</h2>
              <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">Local-First Manuscript Synthesis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Zero-Upload Privacy Protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">1. Registry Ingestion (PDF)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-64 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${fileName ? 'border-pink-500/40' : 'border-white/5 hover:border-pink-500/40'}`}
              >
                {loading ? (
                   <div className="flex flex-col items-center gap-4 animate-pulse">
                     <Loader2 size={48} className="text-pink-500 animate-spin" />
                     <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Archival Transcription in Progress...</span>
                   </div>
                ) : fileName ? (
                   <div className="text-center p-8 space-y-2">
                     <Check size={48} className="text-emerald-400 mx-auto" />
                     <p className="text-xs text-white font-black uppercase truncate max-w-[300px]">{fileName}</p>
                     <span className="text-[8px] text-gray-500 font-black uppercase">Document Identified</span>
                   </div>
                ) : (
                  <>
                    <Upload size={40} className="text-gray-700 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center px-12">Inject PDF Scroll for Decryption</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in">
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">2. Synthesized Result</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center min-h-[300px] overflow-hidden group shadow-inner">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {success ? (
                 <div className="relative z-10 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                      <Zap size={40} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Word Archive Sealed</h3>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Local Memory Transcription Successful</p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      <Download size={18} /> Download Editable DOCX
                    </button>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <FileSearch size={80} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Synthesis</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">In-Memory Transformation</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Full Text Integrity</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Archival Data Protection</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-pink-500/5 border-2 border-dashed border-pink-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-pink-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-pink-500">
               <FileSearch size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Archival Decryption</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Sovereign PDF to Word utility utilizes a two-tier extraction protocol. First, the **PDF.js Lexical Engine** parses the document's coordinate system to retrieve raw unicode strings. Second, the **Aureate DOCX Synthesis Engine** re-maps this data into a structured OpenXML manuscript. This entire cycle is performed within the user's browser sandbox, ensuring that sensitive institutional scrolls remain under the owner's absolute control."
            </p>
         </div>
      </div>
    </div>
  );
};
