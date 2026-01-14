
import React, { useState, useEffect, useCallback } from 'react';
import { TOOLS } from '../constants';
import { renderToolLogic } from './Home';
import { getArchivedContent, getCycleMetadata } from '../services/geminiService';
import { 
  ArrowLeft, 
  Loader2, 
  BookOpen, 
  History, 
  HelpCircle, 
  Zap,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Sparkles,
  ScrollText
} from 'lucide-react';

interface ToolDetailProps {
  id: string;
  initialDate?: string;
}

const PIXABAY_KEY = '48924033-0c30626359e86566498506253';

export const ToolDetail: React.FC<ToolDetailProps> = ({ id, initialDate }) => {
  const tool = TOOLS.find(t => t.id === id);
  // Fix: getCycleMetadata expects 0 arguments as per geminiService.ts definition
  const { cycleString } = getCycleMetadata();
  
  const [archiveData, setArchiveData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchive = useCallback(async () => {
    if (!tool) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fix: getArchivedContent expects 1 argument (toolId) as per geminiService.ts definition
      const data = await getArchivedContent(tool.id);
      if (!data) throw new Error("Synchronization protocol returned null data.");
      setArchiveData(data);

      const query = encodeURIComponent(`${tool.name} technology`);
      const pixabayUrl = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;
      const imgResponse = await fetch(pixabayUrl);
      const imgData = await imgResponse.json();
      if (imgData.hits?.length > 0) {
        setImageUrl(imgData.hits[0].largeImageURL);
      }
    } catch (err) {
      console.error(err);
      setError("Archive node calibration failed. Please ensure API Key is active.");
    } finally {
      setIsLoading(false);
    }
  }, [tool]);

  useEffect(() => {
    fetchArchive();
  }, [fetchArchive]);

  if (!tool) return null;

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Navigation Bar */}
        <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
          <a href="#/tools" className="flex items-center gap-3 text-[var(--accent)] font-black text-xs uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
          </a>
          <div className="flex gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-black uppercase tracking-widest">
              <History size={12} /> Cycle: {cycleString}
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <header className="text-center mb-24 space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic font-serif-scholarly">
            {tool.name}
          </h1>
          <p className="text-xl text-gray-400 italic max-w-3xl mx-auto opacity-70">"{tool.description}"</p>
        </header>

        {/* INTERACTIVE INTERFACE (THE TOOL) */}
        <section className="mb-32">
          <div className="glass-3d p-8 md:p-16 rounded-[4rem] border-2 border-[var(--accent)]/30 bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Zap size={300} /></div>
            <div className="relative z-10">
              {renderToolLogic(tool.id)}
            </div>
          </div>
        </section>

        {/* AD PLACEMENT 1 */}
        <div className="ad-placeholder h-28 mb-32 opacity-40"> [Strategic Registry Sponsor - In-Tool Banner] </div>

        {/* AI GENERATED ARTICLE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <main className="lg:col-span-8 space-y-20">
            <div className="flex items-center gap-6">
              <ScrollText className="text-[var(--accent)]" size={32} />
              <h2 className="text-3xl font-black uppercase tracking-widest italic">The Archival <span className="text-[var(--accent)]">Manuscript</span></h2>
              <div className="flex-grow h-px bg-gradient-to-r from-[var(--accent)]/30 to-transparent"></div>
            </div>

            {isLoading ? (
              <div className="py-40 text-center space-y-8 glass-3d rounded-[4rem]">
                <Loader2 className="animate-spin mx-auto text-[var(--accent)]" size={64} />
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] animate-pulse">Consulting Master Scribe...</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">Drafting Professional Utility Logic</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-20 text-center bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-[4rem] space-y-6">
                 <AlertTriangle size={48} className="mx-auto text-rose-500/40" />
                 <p className="text-rose-400 font-black uppercase tracking-widest text-sm">{error}</p>
              </div>
            ) : archiveData ? (
              <article className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                {imageUrl && (
                  <div className="rounded-[3.5rem] overflow-hidden mb-16 border border-white/10 h-96 relative group">
                    <img src={imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[15s]" alt="Scholarly Context" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent"></div>
                    <div className="absolute bottom-10 left-10">
                       <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] bg-black/60 px-6 py-3 rounded-full backdrop-blur-md border border-[var(--accent)]/20">
                         <Sparkles size={14} /> Scholarly Visual Sync
                       </span>
                    </div>
                  </div>
                )}

                <div className="glass-3d p-12 md:p-20 rounded-[4rem] border border-[var(--accent)]/20 bg-white/[0.01]">
                  <h3 className="text-4xl md:text-6xl font-black text-white mb-16 italic font-serif-scholarly leading-tight text-glow">
                    {archiveData.title}
                  </h3>
                  
                  <div 
                    className="prose-archive"
                    dangerouslySetInnerHTML={{ __html: archiveData.content }}
                  />

                  {/* AD PLACEMENT 2 */}
                  <div className="my-20 ad-placeholder h-40 opacity-20"> [Contextual Manuscript Sponsor] </div>

                  <div className="mt-20 p-12 bg-[var(--accent)]/5 border border-[var(--accent)]/30 rounded-[3rem] relative group">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-black shadow-xl group-hover:rotate-12 transition-transform">
                      <History size={24} />
                    </div>
                    <h4 className="text-[var(--accent)] font-black uppercase text-xs tracking-[0.3em] mb-6">Historical Registry Context</h4>
                    <p className="italic text-gray-300 leading-relaxed text-xl">
                      Verification of the archival integrity for {tool.name} is maintained through continuous synchronization with sovereign logical standards.
                    </p>
                  </div>
                </div>
              </article>
            ) : null}
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="glass-3d p-10 rounded-[3rem] border border-white/10 sticky top-32 bg-black/20">
              <h4 className="text-[var(--accent)] font-black uppercase text-[10px] tracking-[0.5em] mb-8 flex items-center gap-3">
                <Activity size={16} /> Registry Pulse
              </h4>
              <div className="space-y-6">
                {[
                  { label: "Authority", val: "Lvl 9 Vault" },
                  { label: "Sync Mode", val: "Dynamic" },
                  { label: "Format", val: "Manuscript" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-4">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">{item.label}</span>
                    <span className="text-white font-black italic">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <div className="ad-placeholder h-96 opacity-30 hover:opacity-100 transition-opacity">
                  [Institutional Sponsor Space]
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};
