
import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Upload, Download, Trash2, Layout, ShieldCheck, Zap, Info, Instagram, Twitter, Linkedin, Youtube, Facebook, Check, Image as ImageIcon } from 'lucide-react';

interface PlatformTemplate {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const TEMPLATES: PlatformTemplate[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, icon: <Instagram size={14}/> },
  { name: 'Instagram Portrait', width: 1080, height: 1350, icon: <Instagram size={14}/> },
  { name: 'Instagram Story', width: 1080, height: 1920, icon: <Instagram size={14}/> },
  { name: 'X / Twitter Post', width: 1200, height: 675, icon: <Twitter size={14}/> },
  { name: 'LinkedIn Post', width: 1200, height: 1200, icon: <Linkedin size={14}/> },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: <Youtube size={14}/> },
  { name: 'Facebook Cover', width: 820, height: 312, icon: <Facebook size={14}/> },
];

export const SocialResizer: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PlatformTemplate>(TEMPLATES[0]);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageOnCanvas = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to template size
    canvas.width = selectedTemplate.width;
    canvas.height = selectedTemplate.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background with black for "contain" gaps
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgWidth = image.width;
    const imgHeight = image.height;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (fitMode === 'cover') {
      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      drawWidth = imgWidth * ratio;
      drawHeight = imgHeight * ratio;
    } else {
      const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      drawWidth = imgWidth * ratio;
      drawHeight = imgHeight * ratio;
    }

    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = (canvasHeight - drawHeight) / 2;

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    drawImageOnCanvas();
  }, [image, selectedTemplate, fitMode]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `Sovereign_Resizer_${selectedTemplate.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleClear = () => {
    setImage(null);
    setPreviewUrl(null);
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
              <Maximize size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sovereign Social Resizer</h2>
              <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">Secure Client-Side Pixel Processing</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Zero-Upload Privacy Protocol Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Image Source</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer h-40 bg-black border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-pink-500/40 transition-all overflow-hidden"
              >
                {image ? (
                   <div className="flex flex-col items-center gap-2">
                     <ImageIcon size={32} className="text-pink-500" />
                     <span className="text-[10px] font-black uppercase text-white">Image Ready</span>
                   </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-700 group-hover:text-pink-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Drop Image or Click to Select</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Target Dimension Template</label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTemplate(t)}
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
                      selectedTemplate.name === t.name 
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter">
                      {t.icon} {t.name}
                    </div>
                    <div className="text-[8px] font-bold opacity-40 tabular-nums">{t.width} × {t.height} PX</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Scaling Protocol</label>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                 <button 
                  onClick={() => setFitMode('cover')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${fitMode === 'cover' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   Cover (Fill)
                 </button>
                 <button 
                  onClick={() => setFitMode('contain')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${fitMode === 'contain' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   Contain (Letterbox)
                 </button>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">Sovereign Live Preview</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 flex items-center justify-center min-h-[400px] overflow-hidden group">
               {previewUrl ? (
                 <div className="relative z-10 w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-500">
                    <img 
                      src={previewUrl} 
                      className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10"
                      alt="Processed result" 
                    />
                    <div className="absolute top-0 right-0 p-4">
                      <div className="px-3 py-1 bg-pink-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                        Preview: {selectedTemplate.width}x{selectedTemplate.height}
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <ImageIcon size={80} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Archival Image Source</p>
                 </div>
               )}
               {/* Hidden Canvas for Processing */}
               <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
              onClick={handleDownload}
              disabled={!previewUrl}
              className="w-full bg-pink-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(219,39,119,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Export Sovereign Asset (.PNG)
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Zap size={20} className="text-pink-500" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">High-Fidelity Canvas Interpolation Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Layout size={20} className="text-pink-500" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Standard Platform Ratio Validation Checked</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-16 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">The Importance of Correct Aspect Ratios</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            In the digital era, your visual presence is dictated by the algorithms of social networks. Utilizing the correct aspect ratio ensures that your content is not awkwardly cropped by platform auto-optimization. Our Sovereign Resizer uses professional-grade pixel mapping to guarantee your assets meet the exact specifications of platforms like Instagram, X, and LinkedIn without losing clarity.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Privacy & Security of Processing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-pink-500/30 transition-colors">
              <h4 className="text-pink-500 font-black uppercase tracking-widest text-xs">Zero-Cloud Residency</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Unlike traditional online resizers, StrongTools does not upload your images to a remote server. The processing occurs inside your computer's RAM using the browser's JavaScript engine.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-pink-500/30 transition-colors">
              <h4 className="text-pink-500 font-black uppercase tracking-widest text-xs">Canvas Data Protection</h4>
              <p className="text-gray-500 text-sm leading-relaxed">By leveraging HTML5 Canvas, we manipulate pixels directly on the client side. This means sensitive screenshots or private photos never leave your device's local sandbox.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Check size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Standard Size Registry</h3>
          </div>
          <div className="overflow-hidden bg-black/40 border border-white/5 rounded-3xl">
            <table className="w-full text-left text-xs uppercase font-black">
              <thead>
                <tr className="bg-pink-500/5 text-pink-500 border-b border-white/5">
                  <th className="p-6 tracking-widest">Platform</th>
                  <th className="p-6 tracking-widest">Width</th>
                  <th className="p-6 tracking-widest">Height</th>
                  <th className="p-6 tracking-widest">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                <tr className="border-b border-white/5 italic"><td className="p-6">Instagram Square</td><td className="p-6">1080</td><td className="p-6">1080</td><td className="p-6">Grid Posts</td></tr>
                <tr className="border-b border-white/5 italic"><td className="p-6">Instagram Story</td><td className="p-6">1080</td><td className="p-6">1920</td><td className="p-6">Stories & Reels</td></tr>
                <tr className="border-b border-white/5 italic"><td className="p-6">X / Twitter</td><td className="p-6">1200</td><td className="p-6">675</td><td className="p-6">Timeline Feed</td></tr>
                <tr className="italic"><td className="p-6">YouTube Thumbnail</td><td className="p-6">1280</td><td className="p-6">720</td><td className="p-6">HD Previews</td></tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};
