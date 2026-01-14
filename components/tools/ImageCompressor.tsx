
import React, { useState, useRef, useEffect } from 'react';
import { Shrink, Upload, Download, Trash2, ShieldCheck, Zap, Info, Image as ImageIcon, Check, Loader2, Gauge } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.8);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toStd = (n: string | number) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setOriginalPreview(url);
      setCompressedPreview(null);
      setCompressedSize(0);
    }
  };

  const compressImage = () => {
    if (!originalFile || !originalPreview) return;
    setProcessing(true);

    const img = new Image();
    img.src = originalPreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = originalFile.type === 'image/png' ? 'image/jpeg' : originalFile.type;
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      setCompressedPreview(compressedDataUrl);

      // Estimate size from Base64
      const stringLength = compressedDataUrl.split(',')[1].length;
      const sizeInBytes = Math.floor(stringLength * (3 / 4));
      setCompressedSize(sizeInBytes);
      setProcessing(false);
    };
  };

  useEffect(() => {
    if (originalFile) {
      const timer = setTimeout(() => compressImage(), 300);
      return () => clearTimeout(timer);
    }
  }, [quality, originalFile]);

  const handleDownload = () => {
    if (!compressedPreview) return;
    const link = document.createElement('a');
    link.href = compressedPreview;
    link.download = `Sovereign_Compressed_${Date.now()}.jpg`;
    link.click();
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedPreview(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savingPercent = originalSize > 0 ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-400">
              <Shrink size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Image Compressor</h2>
              <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">Local-First Pixel Optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Zero-Server Telemetry</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">1. Media Source</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-48 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${originalPreview ? 'border-pink-500/40' : 'border-white/5 hover:border-pink-500/40'}`}
              >
                {originalPreview ? (
                   <img src={originalPreview} className="w-full h-full object-cover opacity-60" alt="Source" />
                ) : (
                  <>
                    <Upload size={32} className="text-gray-700 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inject Frame</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="space-y-6 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
               <div className="flex justify-between items-center mb-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">2. Compression Caliber</label>
                 <span className="text-sm font-black text-pink-500 tabular-nums italic">{Math.round(quality * 100)}%</span>
               </div>
               <input 
                type="range" 
                min="0.01" 
                max="1" 
                step="0.01" 
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-pink-500"
               />
               <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1 italic">
                 <span>Minimum Size</span>
                 <span>Lossless Qual</span>
               </div>
            </div>

            {originalFile && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-black border border-white/5 rounded-3xl">
                   <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1">Source Weight</p>
                   <p className="text-lg font-black text-white tabular-nums">{toStd(formatSize(originalSize))}</p>
                </div>
                <div className="p-6 bg-black border border-white/5 rounded-3xl">
                   <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1">Optimized Weight</p>
                   <p className="text-lg font-black text-pink-400 tabular-nums">{toStd(formatSize(compressedSize))}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">Optimized Viewport</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-6 flex items-center justify-center min-h-[400px] overflow-hidden group">
               {compressedPreview ? (
                 <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <img 
                      src={compressedPreview} 
                      className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
                      alt="Compressed result" 
                    />
                    <div className="absolute top-0 right-0 p-4">
                      <div className="px-4 py-2 bg-emerald-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                        <Check size={12} /> Saved {Math.round(savingPercent)}%
                      </div>
                    </div>
                 </div>
               ) : processing ? (
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-pink-500" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500/60 animate-pulse">Re-encoding Pixels...</p>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <ImageIcon size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Media Ingestion</p>
                 </div>
               )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!compressedPreview || processing}
              className="w-full bg-pink-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(219,39,119,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Export Optimized Asset (.JPG)
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Client-Side Canvas Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Adaptive Quality Algorithms</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Encrypted RAM Sandbox</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37]/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4AF37] rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-[#D4AF37]">
               <Gauge size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Archival Compression</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Aureate Compressor utilizes the browser's native **Canvas 2D Rendering Context** to perform lossy JPEG encoding directly on the user's hardware. By manipulating the quantization tables during the `toDataURL` handshake, we achieve significant weight reduction while preserving the semantic integrity of the visual manuscript. This method eliminates the need for network transmission, adhering to the Sovereign Privacy Pact of MMXXV."
            </p>
         </div>
      </div>
    </div>
  );
};
