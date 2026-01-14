
import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, Search, Loader2, Sparkles, History } from 'lucide-react';
import { getDailyChronicles } from '../services/geminiService';

const PIXABAY_KEY = '53998460-a3c2d1b031017273e7b6e80cb';

// Fixed missing export for BLOG_POSTS used in dynamic routing fallback or specific IDs
export const BLOG_POSTS = [
  {
    id: 'master-guide',
    title: 'The Sovereign Guide to Digital Precision',
    excerpt: 'An archival overview of how absolute rigor defines modern utility instruments.',
    author: 'Lead Scribe',
    date: 'Current Cycle',
    category: 'Productivity',
    query: 'digital precision technology'
  }
];

const BlogPostCard: React.FC<{ post: any }> = ({ post }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const query = encodeURIComponent(post.title);
        const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.hits?.length > 0) setImageUrl(data.hits[0].webformatURL);
      } catch (e) { console.warn(e); }
    };
    fetchImage();
  }, [post]);

  return (
    <article className="glass-3d rounded-[3rem] overflow-hidden group flex flex-col h-full border border-[var(--border-glow)] hover:border-[var(--accent)] transition-all">
      <div className="h-64 overflow-hidden relative bg-zinc-900">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" 
        />
        <div className="absolute top-6 left-6">
          <span className="bg-[var(--accent)] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{post.category}</span>
        </div>
      </div>
      <div className="p-10 flex flex-col flex-grow space-y-6">
        <div className="flex items-center gap-4 text-[var(--accent)]/40 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1"><Clock size={12}/> Today</div>
          <span>By {post.author}</span>
        </div>
        <h2 className="text-2xl font-black leading-tight group-hover:text-[var(--accent)] transition-colors italic font-serif-scholarly">{post.title}</h2>
        <p className="text-[var(--text-dim)] text-sm italic flex-grow leading-relaxed">"{post.excerpt}"</p>
        <a href={`#/blog/${post.id}`} className="inline-flex items-center gap-2 text-[var(--accent)] font-black text-xs uppercase tracking-widest hover:text-white transition-all group/link">
          Read Manuscript <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
        </a>
      </div>
    </article>
  );
};

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyChronicles().then(data => {
      // Merge with static posts if needed or just use fetched
      setPosts([...BLOG_POSTS, ...data]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white py-32 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.5em] mb-4">
            <History size={16} /> The Sovereignty Archive
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic font-serif-scholarly">The <span className="text-[var(--accent)]">Chronicles</span></h1>
          <p className="text-xl text-gray-500 italic max-w-2xl mx-auto">"Deep technical insights and logical foundations from the master scribes."</p>
        </div>

        {loading ? (
          <div className="py-40 text-center space-y-6">
            <Loader2 className="animate-spin mx-auto text-[var(--accent)]" size={64} />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Synchronizing with Knowledge Nodes...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, idx) => (
              <BlogPostCard key={idx} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass-3d rounded-[4rem] border-2 border-dashed border-white/5">
            <Search className="mx-auto text-[var(--accent)]/20 mb-6" size={64} />
            <p className="text-2xl font-black text-[var(--text-dim)] italic">No manuscripts found for this temporal cycle.</p>
          </div>
        )}

        <div className="ad-placeholder h-40 opacity-30 mt-20"> [Premium Chronicle Registry Ad Space] </div>
      </div>
    </div>
  );
};
