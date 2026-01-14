
import React, { useState, useEffect } from 'react';
import { QrCode, Download, Type as TypeIcon, Sparkles, Palette } from 'lucide-react';

const SIMPLE_COLORS = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'yellow', name: 'Yellow', hex: '#FEF08A' },
  { id: 'green', name: 'Green', hex: '#BBF7D0' },
  { id: 'purple', name: 'Purple', hex: '#E9D5FF' },
  { id: 'blue', name: 'Blue', hex: '#BAE6FD' },
  { id: 'pink', name: 'Pink', hex: '#FBCFE8' },
  { id: 'orange', name: 'Orange', hex: '#FFEDD5' },
  { id: 'gray', name: 'Gray', hex: '#E5E7EB' },
  { id: 'cream', name: 'Cream', hex: '#FEF3C7' },
  { id: 'cyan', name: 'Cyan', hex: '#CFFAFE' }
];

export const QRGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState(SIMPLE_COLORS[0]);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (text.trim()) {
      const encoded = encodeURIComponent(text);
      const bgColorClean = selectedColor.hex.replace('#', '');
      // Force QR code color to black (#000000)
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&color=000000&bgcolor=${bgColorClean}&margin=10`);
    } else {
      setQrUrl('');
    }
  }, [text, selectedColor]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `Sovereign_QR_${selectedColor.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden transition-all duration-700">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
            <QrCode size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">QR Architect</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Archival Generation Node</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Input and Selection Column */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2 flex items-center gap-2">
              <TypeIcon size={12} /> Entry Protocol (Link or Text)
            </label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 bg-black border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-[#D4AF37] transition-all placeholder-white/5 resize-none shadow-inner"
              placeholder="Type or paste your data here..."
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] italic px-2 flex items-center gap-2">
              <Palette size={12} /> Select Your Background Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {SIMPLE_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${
                    selectedColor.id === color.id 
                    ? 'border-[#D4AF37] scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                    : 'border-white/5 hover:border-white/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="w-6 h-6 rounded-full border border-black/10 bg-black/5 flex items-center justify-center">
                    {selectedColor.id === color.id && <div className="w-2 h-2 rounded-full bg-black"></div>}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-black/80">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display and Download Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div 
            className="relative aspect-square flex items-center justify-center p-12 border rounded-[3rem] transition-all duration-700 shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] overflow-hidden"
            style={{ backgroundColor: selectedColor.hex }}
          >
            {qrUrl ? (
              <div className="relative z-10 animate-in zoom-in duration-500">
                <img 
                  src={qrUrl} 
                  alt="Sovereign QR Code" 
                  className="w-full max-w-[220px] filter contrast-125 mix-blend-multiply" 
                />
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-20">
                <QrCode size={64} className="mx-auto text-black" />
                <p className="text-[10px] font-black uppercase tracking-widest italic text-black">Awaiting Input</p>
              </div>
            )}
            
            <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-30">
              <Sparkles size={10} className="text-black" />
              <span className="text-[8px] font-black uppercase tracking-widest text-black">Registry verified</span>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            disabled={!qrUrl}
            className="w-full bg-[#D4AF37] text-black py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-3 mt-auto"
          >
            <Download size={16} /> Export Archival PNG
          </button>
        </div>
      </div>

      <div className="mt-12 p-4 bg-black/40 border border-dashed border-white/10 rounded-2xl text-center">
        <p className="text-[8px] font-bold text-[#D4AF37]/60 uppercase tracking-widest leading-loose italic">
          Logic: Sovereign Black Encoding • Background: {selectedColor.name} Frame • Standard 1234567890 Numerals Compliant
        </p>
      </div>
    </div>
  );
};
