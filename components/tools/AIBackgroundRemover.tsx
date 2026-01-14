
import React, { useState, useRef } from 'react';
import { Eraser, Upload, Download, Trash2, ShieldCheck, Zap, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const PRESET_COLORS = [
  { name: 'Transparent', hex: 'transparent' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Studio Grey', hex: '#374151' }
];

export const AIBackgroundRemover: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [isolatedSubjectUrl, setIsolatedSubjectUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previewBgColor, setPreviewBgColor] = useState('transparent');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Source limit exceeded: 5MB maximum.");
        return;
      }
      if (originalPreview) URL.revokeObjectURL(originalPreview);
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalPreview(url);
      setIsolatedSubjectUrl(null);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Direct Reference Masking Logic: Preserves 100% of original pixels
  const compositeOriginalWithMask = (originalUrl: string, aiKeyedUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const originalImg = new Image();
      const aiImg = new Image();
      
      originalImg.onload = () => {
        aiImg.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return resolve(aiKeyedUrl);

          canvas.width = originalImg.width;
          canvas.height = originalImg.height;

          // 1. Get AI mask data (where the background is replaced by Magenta)
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          tempCtx?.drawImage(aiImg, 0, 0, canvas.width, canvas.height);
          const aiData = tempCtx?.getImageData(0, 0, canvas.width, canvas.height).data;

          // 2. Draw ORIGINAL raw image data
          ctx.drawImage(originalImg, 0, 0);
          const finalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = finalImageData.data;

          if (aiData) {
            for (let i = 0; i < data.length; i += 4) {
              const r = aiData[i];
              const g = aiData[i + 1];
              const b = aiData[i + 2];
              
              // Direct detection of AI-generated background (Magenta #FF00FF)
              const isMagenta = (r > 200 && b > 200 && g < 100);
              
              if (isMagenta) {
                data[i + 3] = 0; // Zero Alpha: The original pixel becomes perfectly transparent
              }
            }
          }

          ctx.putImageData(finalImageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        aiImg.src = aiKeyedUrl;
      };
      originalImg.src = originalUrl;
    });
  };

  const removeBackground = async () => {
    if (!originalFile || !originalPreview || processing) return;

    setProcessing(true);
    setError(null);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const base64Data = await fileToBase64(originalFile);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: originalFile.type,
              },
            },
            {
              text: "Isolate the subject. Replace the entire background with solid Magenta #FF00FF. Keep the subject exactly as it appears in the source.",
            },
          ],
        },
      });

      let aiBase64 = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          aiBase64 = part.inlineData.data;
          break;
        }
      }

      if (!aiBase64) throw new Error("Synthesis Failure");

      // Apply the AI mask to the ORIGINAL raw image pixels to ensure zero quality loss
      const finalResult = await compositeOriginalWithMask(
        originalPreview, 
        `data:image/png;base64,${aiBase64}`
      );
      
      setIsolatedSubjectUrl(finalResult);
      setPreviewBgColor('transparent'); 
      
    } catch (err: any) {
      console.error(err);
      setError("ISOLATION FAILURE: The engine could not map the subject. Try an image with higher contrast.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!isolatedSubjectUrl) return;
    const link = document.createElement('a');
    link.href = isolatedSubjectUrl;
    link.download = `Raw_Quality_Isolated_${Date.now()}.png`;
    link.click();
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setIsolatedSubjectUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <Eraser size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Raw Pixel BG Remover</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Original Quality Preservation</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Source-Pixel Integrity</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">1. Visual Source</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-52 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${originalPreview ? 'border-[#D4AF37]/40' : 'border-white/5 hover:border-[#D4AF37]/40'}`}
              >
                {originalPreview ? (
                   <img src={originalPreview} className="w-full h-full object-cover opacity-60" alt="Source" />
                ) : (
                  <>
                    <Upload size={32} className="text-gray-700 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inject Frame</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            </div>

            <button
              onClick={removeBackground}
              disabled={processing || !originalFile}
              className="w-full bg-[#D4AF37] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Zeroing Background...
                </>
              ) : (
                <>
                  <Zap size={24} />
                  Execute Clean Isolation
                </>
              )}
            </button>

            {isolatedSubjectUrl && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic px-2">Backdrop Testing</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => setPreviewBgColor(col.hex)}
                      className={`h-10 rounded-xl border transition-all ${previewBgColor === col.hex ? 'border-[#D4AF37] scale-110 shadow-lg' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                      style={{ background: col.hex === 'transparent' ? 'repeating-conic-gradient(#333 0% 25%, #111 0% 50%) 50% / 8px 8px' : col.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in">
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Pure Subject Result</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div 
              className="relative flex-grow border border-white/5 rounded-[3.5rem] p-10 flex items-center justify-center min-h-[450px] overflow-hidden transition-colors duration-500 shadow-inner"
              style={{ backgroundColor: previewBgColor === 'transparent' ? '#000' : previewBgColor }}
            >
               {previewBgColor === 'transparent' && (
                  <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '16px 16px' }}></div>
               )}
               
               {isolatedSubjectUrl ? (
                 <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <img 
                      src={isolatedSubjectUrl} 
                      className="max-w-full max-h-full rounded-2xl shadow-2xl"
                      alt="Isolated Result" 
                    />
                    <div className="absolute top-0 right-0 p-4">
                      <div className="px-4 py-2 bg-emerald-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                        <Check size={12} /> Original Pixels Restored
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <ImageIcon size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Precise Mapping</p>
                 </div>
               )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!isolatedSubjectUrl}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(5,150,105,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Download Original Quality PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
