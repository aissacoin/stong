
import React, { useState, useRef } from 'react';
import { FileImage, Upload, Download, Trash2, Check, ShieldCheck, Zap, Info, FileSearch, Loader2, ImageIcon, LayoutGrid } from 'lucide-react';

export const PDFImageExtractor: React.FC = () => {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setLoading(true);
    setError(null);
    setFileName(file.name);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Dynamically import pdfjs-dist from ESM
      const pdfjs = await import('https://esm.sh/pdfjs-dist@4.0.379');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const extractedImages: { url: string; name: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const operatorList = await page.getOperatorList();
        
        const validImages = [
          pdfjs.OPS.paintImageXObject,
          pdfjs.OPS.paintInlineImageXObject,
          pdfjs.OPS.paintImageXObjectRepeat
        ];

        for (let j = 0; j < operatorList.fnArray.length; j++) {
          if (validImages.includes(operatorList.fnArray[j])) {
            const imageName = operatorList.argsArray[j][0];
            try {
              const image = await page.objs.get(imageName);
              if (image && image.data) {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const imageData = ctx.createImageData(image.width, image.height);
                  
                  // Conversion logic for different pixel formats
                  if (image.data.length === image.width * image.height * 3) {
                    // RGB format
                    for (let k = 0, l = 0; k < image.data.length; k += 3, l += 4) {
                      imageData.data[l] = image.data[k];
                      imageData.data[l+1] = image.data[k+1];
                      imageData.data[l+2] = image.data[k+2];
                      imageData.data[l+3] = 255;
                    }
                  } else {
                    // RGBA or other formats
                    imageData.data.set(image.data);
                  }
                  
                  ctx.putImageData(imageData, 0, 0);
                  extractedImages.push({
                    url: canvas.toDataURL('image/png'),
                    name: `extracted_p${i}_img${j}.png`
                  });
                }
              }
            } catch (objError) {
              console.warn("Skip non-image object", imageName);
            }
          }
        }
      }

      if (extractedImages.length === 0) {
        setError("No extractable image assets were found in this PDF registry.");
      } else {
        setImages(extractedImages);
      }
    } catch (err) {
      console.error("PDF Image Extraction Failure:", err);
      setError("Logical Synthesis Failure: The document structure is encrypted or incompatible with our extraction node.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  const handleClear = () => {
    setImages([]);
    setFileName('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
              <FileImage size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">PDF Image Extractor</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Visual Asset Decoupling Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Local RAM Processing Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Archival Source (PDF File)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-64 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${fileName ? 'border-[#D4AF37]/40' : 'border-white/5 hover:border-[#D4AF37]/40'}`}
              >
                {loading ? (
                   <div className="flex flex-col items-center gap-4 animate-pulse">
                     <Loader2 size={48} className="text-[#D4AF37] animate-spin" />
                     <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Decoding Visual Matrix...</span>
                   </div>
                ) : fileName ? (
                   <div className="text-center p-8 space-y-2">
                     <Check size={48} className="text-emerald-400 mx-auto" />
                     <p className="text-xs text-white font-black uppercase truncate max-w-[250px]">{fileName}</p>
                     <span className="text-[8px] text-gray-500 font-black uppercase italic">Handshake Successful</span>
                   </div>
                ) : (
                  <>
                    <Upload size={40} className="text-gray-700 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center px-8">Drop PDF Scroll or Click to Ingest</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in">
                <Info className="text-rose-500 shrink-0" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}

            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4">
               <div className="flex items-center gap-3 text-gray-400">
                 <Zap size={16} className="text-[#D4AF37]" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Protocol Intelligence</span>
               </div>
               <p className="text-[10px] text-gray-500 leading-relaxed italic font-medium">
                 Extract high-resolution visual objects from PDF containers. This node supports RGB and grayscale decompression protocols.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic">Decoupled Assets ({images.length})</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black border border-white/5 rounded-[3.5rem] p-6 overflow-hidden group shadow-inner min-h-[450px]">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               {images.length > 0 ? (
                 <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar h-full max-h-[500px] pr-2">
                   {images.map((img, i) => (
                     <div key={i} className="group/item relative aspect-square bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all">
                        <img src={img.url} className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-opacity" alt="Extracted Asset" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                           <button 
                            onClick={() => downloadImage(img.url, img.name)}
                            className="p-3 bg-[#D4AF37] text-black rounded-full hover:scale-110 transition-transform shadow-xl"
                           >
                              <Download size={16} />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                   <ImageIcon size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Decryption</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
