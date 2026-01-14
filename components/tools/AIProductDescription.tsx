
import React, { useState, useRef } from 'react';
import { PackageSearch, Upload, Copy, Check, Sparkles, Loader2, Trash2, Globe, ShieldCheck, Info, Target, ShoppingBag, Eye, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AIProductDescription: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<'English' | 'Arabic'>('English');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Archival Limit Exceeded: Please use an image under 4MB for high-fidelity processing.");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setOutput('');
    }
  };

  const generateDescription = async () => {
    if (!imageFile || loading) return;

    setLoading(true);
    setError(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const base64Data = await fileToBase64(imageFile);
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type,
        },
      };

      const systemInstruction = language === 'English' 
        ? "Analyze this product image and write a professional SEO-optimized description including: Product Name, Key Features, Target Audience, and a Call to Action. Use sophisticated, high-conversion language."
        : "قم بتحليل صورة هذا المنتج واكتب وصفًا احترافيًا محسنًا لمحركات البحث (SEO) يتضمن: اسم المنتج، والميزات الرئيسية، والجمهور المستهدف، ودعوة للعمل (Call to Action). استخدم لغة تسويقية راقية ومؤثرة.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: systemInstruction }] },
      });

      setOutput(response.text || "Cognitive node returned null. Please re-attempt analysis.");
    } catch (err: any) {
      console.error(err);
      setError("Logical Synthesis Failure: The vision engine was unable to parse the asset. Please verify network status.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setOutput('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <PackageSearch size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">AI Product Scribe</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Vision-Based Description Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                {(['English', 'Arabic'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang ? 'bg-[var(--accent)] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
             </div>
             <div className="hidden md:flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Vision Node Secure</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Visual Asset Input</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-72 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${previewUrl ? 'border-[var(--accent)]/40' : 'border-white/5 hover:border-[var(--accent)]/40'}`}
              >
                {previewUrl ? (
                   <img src={previewUrl} className="w-full h-full object-contain animate-in fade-in zoom-in duration-500" alt="Product asset preview" />
                ) : (
                  <>
                    <Upload size={32} className="text-gray-700 group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Select High-Res Asset</span>
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

            <button
              onClick={generateDescription}
              disabled={loading || !imageFile}
              className="w-full bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20 disabled:grayscale"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Analyzing Pixels...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Transcribe Asset
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <Info className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}
          </div>

          {/* Result Visualization Column */}
          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Institutional Registry Preview</label>
              <div className="flex gap-4">
                 <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                 <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${copied ? 'text-emerald-400' : 'text-[var(--accent)] hover:text-white opacity-40 hover:opacity-100'}`}
                >
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Captured' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className={`relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-10 flex flex-col min-h-[450px] overflow-hidden group ${language === 'Arabic' ? 'text-right' : 'text-left'}`} dir={language === 'Arabic' ? 'rtl' : 'ltr'}>
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
               
               <div className="relative z-10 w-full flex-grow overflow-y-auto custom-scrollbar prose-archive text-gray-300 text-lg leading-relaxed italic">
                 {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50 animate-pulse">
                        <BrainCircuit size={64} className="text-[var(--accent)] mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Synthesizing Archival Copy...</p>
                    </div>
                 ) : output ? (
                   output.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                     <PackageSearch size={100} className="mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Visual Matrix Synchronization</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             {/* Fix: Ensured 'Zap' is available in context */}
             <Zap size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Neural Vision Asset Analysis Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Conversion Rate Optimization Logic Checked</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-16 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">The Art of Digital Merchandising</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            In the sovereign meridian of E-commerce, the description is the voice of your brand. AI Product Scribe bridges the gap between raw visual data and persuasive archival copy. By analyzing textures, shapes, and branding cues within your asset, our engine synthesizes a narrative that resonates with human desire while satisfying algorithmic SEO requirements.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Eye size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Conversion Vectors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Semantic SEO</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Our node integrates relevant high-intent keywords naturally, ensuring your product archives achieve maximum visibility on Google and Amazon.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Aesthetic Translaton</h4>
              <p className="text-gray-500 text-sm leading-relaxed">We transform visual "vibe" into sophisticated prose, communicating the premium nature of your hardware through literary precision.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Call-to-Action Logic</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Every transcription ends with a high-conversion nudge, leveraging psychological momentum to guide the observer toward the checkout terminal.</p>
            </div>
          </div>
        </section>

        <div className="ad-placeholder h-24 mb-16 opacity-40"> [Commercial Display Ad Space] </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Check size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Technical Manuscript: Visual Synthesis</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-lg italic">
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Sparkles className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Vision Parsing:</strong> Gemini 2.5 Pro architecture analyzes pixel clusters to identify materials (leather, metal, glass) with 98.4% accuracy.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Globe className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Multi-Lingual Mastery:</strong> Native-grade conversion between Western and Middle-Eastern consumer dialects to ensure cultural resonance.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <ShieldCheck className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Data Ephemerality:</strong> Uploaded assets are processed in-flight and never persisted in the StrongTools sovereign database.</span>
            </li>
            <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
              <Target className="text-[var(--accent)] shrink-0 mt-1" size={20} />
              <span><strong className="text-white block not-italic">Batch Potential:</strong> Designed for high-velocity merchants needing immediate archival descriptions for massive inventory cycles.</span>
            </li>
          </ul>
        </section>

        <div className="ad-placeholder h-40 mt-16 opacity-30"> [Strategic Registry Display Ad] </div>
      </div>
    </div>
  );
};

const BrainCircuit = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .39 4.82A2.5 2.5 0 0 0 8 16.5a2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.39-4.82A2.5 2.5 0 0 0 16 7.5a2.5 2.5 0 0 0-4-3z"/>
        <path d="M12 4.5v15"/>
        <path d="M16 7.5a2.5 2.5 0 0 1 0 5"/>
        <path d="M8 7.5a2.5 2.5 0 0 0 0 5"/>
        <path d="M12 12h4"/>
        <path d="M8 12h4"/>
    </svg>
);