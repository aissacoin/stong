
import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Upload, Copy, Check, Trash2, ShieldCheck, Zap, Info, Palette, Eye, Crosshair } from 'lucide-react';

export const ColorPickerFromImage: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState({ hex: '#000000', rgb: '0, 0, 0' });
  const [selectedColor, setSelectedColor] = useState({ hex: '#D4AF37', rgb: '212, 175, 55' });
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, show: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setPreviewUrl(url);
        extractPalette(img);
      };
      img.src = url;
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const extractPalette = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(img, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;
    
    const colors: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 40) { // Sample pixels
      const hex = rgbToHex(data[i], data[i+1], data[i+2]);
      colors[hex] = (colors[hex] || 0) + 1;
    }

    const sorted = Object.entries(colors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(c => c[0]);
    
    setPalette(sorted);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!image || !canvasRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * image.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * image.height);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setHoverColor({ hex, rgb: `${pixel[0]}, ${pixel[1]}, ${pixel[2]}` });
    
    setMagnifierPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
    updateMagnifier(x, y);
  };

  const updateMagnifier = (x: number, y: number) => {
    if (!image || !magnifierCanvasRef.current) return;
    const mCanvas = magnifierCanvasRef.current;
    const mCtx = mCanvas.getContext('2d');
    if (!mCtx) return;

    mCanvas.width = 100;
    mCanvas.height = 100;
    mCtx.imageSmoothingEnabled = false;
    
    // Zoom into specific area
    const zoomSize = 10;
    mCtx.drawImage(image, x - zoomSize/2, y - zoomSize/2, zoomSize, zoomSize, 0, 0, 100, 100);
    
    // Draw crosshair
    mCtx.strokeStyle = 'white';
    mCtx.lineWidth = 1;
    mCtx.strokeRect(45, 45, 10, 10);
  };

  const handleColorSelect = () => {
    setSelectedColor(hoverColor);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleClear = () => {
    setImage(null);
    setPreviewUrl(null);
    setPalette([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[3rem] p-8 max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-500">
              <Pipette size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Aureate Color Picker</h2>
              <p className="text-[9px] font-bold text-yellow-500/40 uppercase tracking-[0.4em]">Visual Chromatic Extraction</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Local Buffer Processing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Workspace Side */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Manuscript Viewport</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div 
              className="relative bg-black/60 border border-white/5 rounded-[3.5rem] flex items-center justify-center min-h-[500px] overflow-hidden group shadow-inner cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMagnifierPos(p => ({ ...p, show: false }))}
              onClick={handleColorSelect}
            >
               {previewUrl ? (
                 <>
                   <img 
                    src={previewUrl} 
                    className="max-w-full max-h-[600px] rounded-xl object-contain select-none pointer-events-none"
                    alt="Source" 
                   />
                   <canvas ref={canvasRef} className="hidden" />
                   
                   {magnifierPos.show && (
                     <div 
                      className="absolute pointer-events-none border-2 border-white rounded-full overflow-hidden shadow-2xl z-50"
                      style={{ 
                        left: magnifierPos.x - 50, 
                        top: magnifierPos.y - 120,
                        width: 100,
                        height: 100
                      }}
                     >
                       <canvas ref={magnifierCanvasRef} />
                       <div className="absolute inset-0 border-[10px] border-black/20"></div>
                     </div>
                   )}
                 </>
               ) : (
                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center opacity-10 space-y-6 hover:opacity-20 transition-opacity cursor-pointer p-20"
                 >
                   <Upload size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Inject Archival Image Scroll</p>
                 </div>
               )}
               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Data Side */}
          <div className="lg:col-span-4 space-y-8 flex flex-col">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-xl">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-yellow-500/60">
                    <Crosshair size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Live Detection</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl border border-white/10 shadow-inner" style={{ backgroundColor: hoverColor.hex }}></div>
                    <div className="space-y-1">
                      <div className="text-xl font-black text-white italic tabular-nums">{hoverColor.hex}</div>
                      <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">RGB: {hoverColor.rgb}</div>
                    </div>
                  </div>
               </div>

               <div className="h-px bg-white/5"></div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-yellow-500">
                    <Pipette size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-glow">Captured Registry</span>
                  </div>
                  <div 
                    className="p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-6 transition-all duration-500"
                    style={{ backgroundColor: `${selectedColor.hex}15` }}
                  >
                    <div className="w-24 h-24 rounded-[2rem] shadow-2xl border-4 border-white/10" style={{ backgroundColor: selectedColor.hex }}></div>
                    
                    <div className="w-full space-y-3">
                      <button 
                        onClick={() => handleCopy(selectedColor.hex, 'hex')}
                        className="w-full bg-black/40 border border-white/5 hover:border-yellow-500/40 p-4 rounded-xl flex justify-between items-center transition-all group"
                      >
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">HEX</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white tabular-nums italic">{selectedColor.hex}</span>
                          {copiedField === 'hex' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-gray-700 group-hover:text-yellow-500" />}
                        </div>
                      </button>

                      <button 
                        onClick={() => handleCopy(`rgb(${selectedColor.rgb})`, 'rgb')}
                        className="w-full bg-black/40 border border-white/5 hover:border-yellow-500/40 p-4 rounded-xl flex justify-between items-center transition-all group"
                      >
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">RGB</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white tabular-nums italic">{selectedColor.rgb}</span>
                          {copiedField === 'rgb' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-gray-700 group-hover:text-yellow-500" />}
                        </div>
                      </button>
                    </div>
                  </div>
               </div>
            </div>

            {palette.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 flex-grow animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 text-yellow-500/60">
                    <Palette size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Dominant Archive Palette</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {palette.map((c, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedColor({ hex: c, rgb: '---' })} // Simplified for palette
                        className="aspect-square rounded-2xl border border-white/10 hover:scale-110 transition-transform shadow-lg"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Direct Pixel Handshake</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">High-Ratio Loupe View</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Zero-Server Analysis</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-12 bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 rounded-[4rem] relative overflow-hidden group">
         <Info className="absolute -bottom-10 -right-10 opacity-[0.03] text-yellow-500 rotate-12" size={300} />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-yellow-500">
               <Pipette size={24} />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter font-serif-scholarly">Technical Protocol: Chromatic Sampling</h3>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed italic">
              "The Aureate Color Picker utilizes a **Virtual Canvas Re-mapping** protocol. By rendering the visual manuscript into an isolated 2D context, we can query the specific RGBA bitstream of any spatial coordinate (X, Y). The palette extractor utilizes a statistical quantization algorithm, sampling the image at key intervals to identify the high-entropy chromatic clusters that define the asset's visual identity."
            </p>
         </div>
      </div>
    </div>
  );
};
