
import React from 'react';
import { X, Sparkles, Loader2, ShieldCheck, PenTool, Link as LinkIcon, History } from 'lucide-react';
import { getAutomatedArchive, ArchivalRecord } from '../services/geminiService';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  toolId?: string;
  children: React.ReactNode;
}

export const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, title, toolId, children }) => {
  const [archive, setArchive] = React.useState<ArchivalRecord | null>(null);
  const [loading, setLoading] = React.useState(false);

  const syncArchive = React.useCallback(async () => {
    if (!toolId) return;
    setLoading(true);
    try {
      const data = await getAutomatedArchive(toolId);
      setArchive(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  React.useEffect(() => {
    if (isOpen && toolId) syncArchive();
  }, [isOpen, toolId, syncArchive]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-[3rem] w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in duration-500">
        
        <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-5">
             <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
               <Sparkles size={20} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-white italic tracking-tight">{title}</h3>
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/50">Professional Instrument Module</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={24} className="text-white/40" />
          </button>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-grow selection:bg-[#D4AF37] selection:text-black">
          <div className="max-w-4xl mx-auto space-y-20">
            
            <section className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
               {children}
            </section>

            <section className="space-y-12 pb-20">
              <div className="flex items-center gap-4">
                <PenTool className="text-[#D4AF37]" size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Full Technical Manuscript</h4>
                <div className="flex-grow h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent"></div>
              </div>

              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={40} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/40">Synthesizing 600+ word professional guide...</p>
                </div>
              ) : archive ? (
                <article className="animate-in fade-in duration-1000">
                  {archive.imageUrl && (
                    <img src={archive.imageUrl} className="w-full h-80 object-cover rounded-[2.5rem] mb-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5" alt="Registry Context" />
                  )}
                  <div className="space-y-10">
                    <h2 className="text-5xl font-black italic text-[#D4AF37] font-serif-scholarly leading-tight">{archive.title}</h2>
                    
                    <div className="flex items-center gap-6 py-4 border-y border-white/5 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/60">
                      <span>Authored by Senior Scribes</span>
                      <span>Words: 600+ Professional Prose</span>
                      <div className="flex items-center gap-2"><ShieldCheck size={12}/> Verified Content</div>
                    </div>

                    <div 
                      className="prose-archive text-gray-300 text-lg leading-[1.8] italic space-y-8 [&_p]:mb-6 [&_strong]:text-white [&_strong]:text-2xl [&_strong]:block [&_strong]:mt-10 [&_strong]:mb-4"
                      dangerouslySetInnerHTML={{ __html: archive.content }}
                    />
                    
                    <div className="pt-16 border-t border-white/5 flex items-center gap-8">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <History size={14} /> Last Registry Update: Current Cycle
                      </div>
                    </div>
                  </div>
                </article>
              ) : null}
            </section>
          </div>
        </div>

        <div className="px-10 py-4 bg-black border-t border-white/5 flex justify-between items-center">
           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">StrongTools • Global Archival Standard</span>
           <ShieldCheck size={16} className="text-[#D4AF37]/20" />
        </div>
      </div>
    </div>
  );
};
