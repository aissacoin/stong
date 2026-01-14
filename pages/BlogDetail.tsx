
import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Printer, 
  Loader2, 
  Sparkles, 
  Landmark,
  History,
  FileText,
  ExternalLink
} from 'lucide-react';
import { getDetailedArticle, getPixabayImage } from '../services/geminiService';
import { TOOLS } from '../constants';

interface BlogDetailProps {
  id: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ id }) => {
  const [article, setArticle] = useState<any>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true);
      // Attempt to generate/fetch detailed manuscript
      const data = await getDetailedArticle(id);
      
      if (data) {
        setArticle(data);
        const img = await getPixabayImage(data.title);
        setHeroImage(img);
      }
      setLoading(false);
    };

    fetchFullData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] space-y-8">
        <Loader2 className="animate-spin text-[#D4AF37]" size={64} />
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] animate-gold-pulse">Synchronizing with Archival Registry</p>
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] mt-2">Retrieving 1200+ Words of Historical Context...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-12">
        <Landmark size={64} className="text-[#D4AF37] opacity-20 mb-8" />
        <h2 className="text-4xl font-black text-white uppercase italic mb-4">Manuscript Unindexed</h2>
        <p className="text-gray-500 max-w-md italic mb-10">The specific chronicle you seek is currently being verified by the master scribes.</p>
        <a href="#/blog" className="px-10 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
          Return to Chronicles
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white pb-32">
      {/* Cinematic Hero Node */}
      <div className="relative h-[85vh] flex items-end justify-center overflow-hidden">
        <div 
          className="absolute inset-0 transition-all duration-1000 scale-105"
          style={{ 
            backgroundImage: `linear-gradient(rgba(5,5,5,0.1), rgba(5,5,5,1)), url('${heroImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="relative z-10 max-w-5xl w-full px-8 pb-32 text-center">
           <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] mb-12 backdrop-blur-xl">
             <Sparkles size={16} /> Scholarly Manuscript • {article.category}
           </div>
           <h1 className="text-6xl md:text-[9rem] font-black leading-[0.8] text-white uppercase tracking-tighter italic font-serif-scholarly text-glow drop-shadow-2xl">
             {article.title}
           </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-20 px-8">
        {/* Actions Registry Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-10 mb-16 gap-8">
          <a href="#/blog" className="inline-flex items-center gap-4 text-[#D4AF37] hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em] group italic">
            <ArrowLeft size={20} className="group-hover:-translate-x-3 transition-transform" /> Back to Chronicles
          </a>
          <div className="flex gap-4">
            <button className="p-4 bg-white/5 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all border border-white/5 shadow-xl"><Share2 size={20}/></button>
            <button className="p-4 bg-white/5 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all border border-white/5 shadow-xl" onClick={() => window.print()}><Printer size={20}/></button>
            <button className="p-4 bg-white/5 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all border border-white/5 shadow-xl"><Bookmark size={20}/></button>
          </div>
        </div>

        {/* Temporal Metadata */}
        <div className="flex flex-wrap items-center gap-10 text-[#D4AF37]/50 text-[10px] font-black uppercase tracking-[0.4em] mb-20 pb-4 border-b border-[#D4AF37]/10">
          <div className="flex items-center gap-3"><Clock size={16}/> Cycle: {article.timestamp || 'ST-ALPHA'}</div>
          <div className="flex items-center gap-3"><BookOpen size={16}/> ~1200 Words</div>
          <div className="flex items-center gap-3"><ShieldCheck size={16}/> Authenticated By: {article.author}</div>
        </div>

        {/* The Monolith Content */}
        <article className="prose-archive selection:bg-[#D4AF37] selection:text-black">
          {/* Ad Slot Alpha */}
          <div className="ad-placeholder h-24 mb-16 opacity-40"> [Expert Ad Inventory - Sovereignty Placement Alpha] </div>

          <div 
            className="prose-archive-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Ad Slot Beta */}
          <div className="my-24 ad-placeholder h-40 opacity-30"> [Premium Chronicle Registry Display Ad] </div>

          {/* Institutional Closing Section */}
          <div className="mt-32 p-16 bg-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37]/20 rounded-[4rem] relative overflow-hidden group">
             <History size={200} className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity" />
             <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 bg-[#D4AF37] rounded-[2rem] flex items-center justify-center text-black shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                   <FileText size={36} />
                </div>
                <h4 className="text-4xl font-black uppercase tracking-tighter text-white">Institutional Postscript</h4>
                <p className="text-gray-400 italic text-xl max-w-2xl leading-relaxed">
                  "This record is synchronized with the latest mathematical standards. Our scribes continuously verify the integrity of these archives."
                </p>
                <div className="pt-8">
                  <a href="#/tools" className="inline-flex items-center gap-6 bg-[#D4AF37] text-black px-16 py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(212,175,55,0.4)] group">
                    Enter Tool Vault <ExternalLink size={20} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
             </div>
          </div>
        </article>
      </div>
    </div>
  );
};
