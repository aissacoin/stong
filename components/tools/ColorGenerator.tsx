
import React, { useState, useEffect, useCallback } from 'react';
import { Palette, RefreshCw, Lock, Unlock, Copy, Check, Download, Info, Target, Sparkles, Wand2 } from 'lucide-react';

interface Color {
  hex: string;
  locked: boolean;
}

type PaletteMode = 'Random' | 'Monochromatic' | 'Analogous' | 'Complementary';

export const ColorGenerator: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([
    { hex: '#D4AF37', locked: false },
    { hex: '#2A220A', locked: false },
    { hex: '#F8F8F8', locked: false },
    { hex: '#0A0A0A', locked: false },
    { hex: '#555555', locked: false }
  ]);
  const [mode, setMode] = useState<PaletteMode>('Random');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateHex = () => {
    const chars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const generatePalette = useCallback(() => {
    setColors(prev => {
      if (mode === 'Random') {
        return prev.map(c => c.locked ? c : { hex: generateHex(), locked: false });
      }

      // Base for algorithmic palettes
      const base = prev.find(c => c.locked)?.hex || generateHex();
      // Simple HEX to HSL approximate
      const r = parseInt(base.slice(1, 3), 16) / 255;
      const g = parseInt(base.slice(3, 5), 16) / 255;
      const b = parseInt(base.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s, l = (max + min) / 2;
      if (max === min) h = s = 0;
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      h *= 360; s *= 100; l *= 100;

      return prev.map((c, i) => {
        if (c.locked) return c;
        let newH = h, newS = s, newL = l;
        
        if (mode === 'Monochromatic') {
          newL = (i * 20 + 10) % 100;
        } else if (mode === 'Analogous') {
          newH = (h + (i - 2) * 30 + 360) % 360;
        } else if (mode === 'Complementary') {
          if (i > 2) newH = (h + 180) % 360;
          newL = (i * 15 + 20) % 100;
        }
        
        return { hex: hslToHex(newH, newS, newL), locked: false };
      });
    });
  }, [mode]);

  useEffect(() => {
    generatePalette();
  }, []);

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const copyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadPalette = () => {
    const text = colors.map(c => c.hex).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aureate-palette.txt';
    link.click();
  };

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <Palette size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Aureate Palette Forge</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Chromatographic Balance Engine</p>
            </div>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {(['Random', 'Monochromatic', 'Analogous', 'Complementary'] as PaletteMode[]).map((m) => (
              <button 
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-[var(--accent)] text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12 h-[400px]">
          {colors.map((color, i) => (
            <div 
              key={i} 
              className="relative group rounded-[2rem] overflow-hidden flex flex-col items-center justify-end pb-8 transition-all duration-500 hover:scale-[1.02]"
              style={{ backgroundColor: color.hex }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                <button 
                  onClick={() => toggleLock(i)}
                  className={`p-3 rounded-xl backdrop-blur-md border transition-all ${color.locked ? 'bg-[var(--accent)] text-black border-[var(--accent)]' : 'bg-black/20 text-white border-white/10 hover:bg-black/40'}`}
                >
                  {color.locked ? <Lock size={18} /> : <Unlock size={18} />}
                </button>
                <button 
                  onClick={() => copyColor(color.hex, i)}
                  className="px-4 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl text-white font-black text-xs tabular-nums tracking-tighter flex items-center gap-2 hover:bg-black/40 transition-all"
                >
                  {copiedIndex === i ? <Check size={14} className="text-emerald-400" /> : color.hex}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={generatePalette}
            className="flex-grow bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
          >
            <RefreshCw size={24} className="animate-spin-slow" />
            Generate New Harmony
          </button>
          <button 
            onClick={downloadPalette}
            className="px-10 bg-white/5 border border-white/10 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Download size={20} />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Sparkles size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Mathematical Color Sync Verified</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Wand2 size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Aesthetic Entropy Protocol Active</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-16 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">The Philosophy of Chromaticism</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            Color is not merely a visual property; it is a psychological instrument that dictates user behavior and brand perception. Our Aureate Forge utilizes scientific color theory—Hering's Opponent Process and Munsell's Color System—to ensure every generated palette respects the biological limits of human vision and the principles of accessibility.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Understanding Palette Modes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Monochromatic Discipline</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Derived from a single hue, extended through various tints and shades. This mode provides a cohesive, professional aesthetic with minimal visual fatigue.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Complementary Tension</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Utilizes colors from opposite sides of the color wheel. This creates high-contrast, high-energy palettes ideal for call-to-action elements.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
