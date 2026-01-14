
import React from 'react';
import { TOOLS, CATEGORY_COLORS } from '../constants';
import * as LucideIcons from 'lucide-react';
import { Search, Sparkles } from 'lucide-react';

export const Tools: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight text-white">Utility <span className="text-[var(--accent)]">Vault</span></h1>
            <p className="text-[var(--accent)]/60 font-black text-xl flex items-center gap-2 uppercase tracking-widest">
              <Sparkles size={24}/> {TOOLS.length} Curated Instruments
            </p>
          </div>
          <div className="relative w-full md:w-96 tool-card-3d">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent)]/40" size={24} />
            <input 
              type="text" 
              placeholder="Filter the archives..." 
              className="w-full pl-16 pr-8 py-5 glass-3d rounded-3xl text-lg outline-none focus:border-[var(--accent)] transition-all text-white placeholder-[var(--text-dim)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredTools.map(tool => {
            const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Zap;
            const colors = CATEGORY_COLORS[tool.category] || { bg: 'bg-zinc-800', text: 'text-white', glow: '' };

            return (
              <div key={tool.id} className="tool-card-3d">
                <a 
                  href={`#/tool/${tool.id}`}
                  className="w-full text-left h-full glass-3d p-10 rounded-[3rem] flex flex-col items-center text-center space-y-8 block"
                >
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center ${colors.bg} ${colors.text} shadow-2xl ${colors.glow} border border-white/10 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={42} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]/40">{tool.category}</span>
                    <h4 className="text-2xl font-black text-white leading-tight">{tool.name}</h4>
                    <p className="text-[var(--text-dim)] text-xs font-medium leading-relaxed line-clamp-2">{tool.description}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-2xl font-black text-[var(--text-dim)] italic">No instruments match your query in our records.</p>
          </div>
        )}
      </div>
    </div>
  );
};
