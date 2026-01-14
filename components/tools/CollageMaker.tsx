
import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Upload, Download, Trash2, ShieldCheck, Zap, Info, Palette, Maximize2, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface CollageImage {
  id: string;
  url: string;
  file: File;
  imgElement: HTMLImageElement;
}

export const CollageMaker: React.FC = () => {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [padding, setPadding] = useState(20);
  const [borderRadius, setBorderRadius] = useState(20);
  const [bgColor, setBgColor] = useState('#000000');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Fix: Explicitly cast as File[] and handle items correctly
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    if (images.length + files.length > 6) {
      alert("Institutional Protocol: Limit of 6 manuscripts per collage session.");
      return;
    }

    files.forEach((file: File) => {
      // Fix: Ensured the URL is generated from the File object directly (fixing line 33)
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        // Fix: Provided all required File properties by passing the original file object (fixing line 40)
        const newImg: CollageImage = {
          id: Math.random().toString(36).substr(2, 9),
          url,
          file: file,
          imgElement: img
        };
        setImages(prev => [...prev, newImg]);
      };
      img.src = url;
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const drawCollage = () => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed High-Res Output
    canvas.width = 1600;
    canvas.height = 1200;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const count = images.length;
    let cols = 1;
    let rows = 1;

    if (count > 4) { cols = 3; rows = 2; }
    else if (count > 2) { cols = 2; rows = 2; }
    else if (count === 2) { cols = 2; rows = 1; }

    const slotWidth = canvas.width / cols;
    const slotHeight = canvas.height / rows;

    images.forEach((img, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * slotWidth + padding;
      const y = row * slotHeight + padding;
      const w = slotWidth - (padding * 2);
      const h = slotHeight - (padding * 2);

      // Draw rounded rect clip
      ctx.save();
      ctx.beginPath();
      const r = Math.min(borderRadius, w / 2, h / 2);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.clip();

      // Object fit: Cover logic
      const imgW = img.imgElement.width;
      const imgH = img.imgElement.height;
      const ratio = Math.max(w / imgW, h / imgH);
      const drawW = imgW * ratio;
      const drawH = imgH * ratio;
      const offsetX = x + (w - drawW) / 2;
      const offsetY = y + (h - drawH) / 2;

      ctx.drawImage(img.imgElement, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    });

    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    drawCollage();
  }, [images, padding, borderRadius, bgColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `Sovereign_Collage_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-8 max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-400">
              <LayoutGrid size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Photo Collage Architect</h2>
              <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">Multi-Asset Visual Synthesis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Zero-Upload Privacy Protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">1. Registry Ingestion (Max 6)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer h-40 bg-black border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-pink-500/40 transition-all overflow-hidden"
              >
                <Upload size={32} className="text-gray-700 group-hover:text-pink-500 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inject Vision Scrolls</span>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 animate-in fade-in">
                {images.map(img => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6 bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Padding</label>
                    <span className="text-[10px] font-bold text-pink-500 tabular-nums">{padding}px</span>
                 </div>
                 <input type="range" min="0" max="100" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-pink-500" />
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Curvature</label>
                    <span className="text-[10px] font-bold text-pink-500 tabular-nums">{borderRadius}px</span>
                 </div>
                 <input type="range" min="0" max="200" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full accent-pink-500" />
               </div>

               <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block">Backdrop Color</label>
                  <div className="flex gap-2">
                    {['#000000', '#ffffff', '#D4AF37', '#1a1a1a', '#fbcfe8'].map(c => (
                      <button 
                        key={c} 
                        onClick={() => setBgColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${bgColor === c ? 'border-pink-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-full bg-transparent border-0 p-0 cursor-pointer overflow-hidden" />
                  </div>
               </div>
            </div>
          </div>

          {/* Result Viewport */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">2. Synthesized Architecture</label>
              <button onClick={() => setImages([])} className="text-gray-600 hover:text-rose-500 transition-colors"><Maximize2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-6 flex items-center justify-center min-h-[500px] overflow-hidden group shadow-inner">
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '30px 30px' }}></div>
               
               {previewUrl ? (
                 <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                    <img 
                      src={previewUrl} 
                      className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
                      alt="Collage Preview" 
                    />
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <LayoutGrid size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Digital Assets</p>
                 </div>
               )}
               <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
              onClick={handleDownload}
              disabled={!previewUrl || images.length === 0}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(5,150,105,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Export Synthesized PNG
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Browser-Native Canvas Composite</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Dynamic Geometry Mapping</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-pink-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Non-Invasive Processing</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-pink-500/5 border-2 border-dashed border-pink-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-pink-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-pink-500">
               <Zap size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Visual Merging</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Collage Architect utilizes an **Algorithmic Grid Mapping** protocol. By calculating the total asset count, the engine divides the 1600x1200 high-fidelity viewport into symmetrical quadrants. Each image is then mapped using a 'Cover-Fit' interpolation algorithm, ensuring that no pixel is distorted while maintaining compositional harmony. The final export is a 32-bit RGBA bitstream rendered entirely within your browser's isolated memory."
            </p>
         </div>
      </div>
    </div>
  );
};
