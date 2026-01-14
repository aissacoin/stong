
import React, { useState } from 'react';
import { TOOLS } from '../constants';
import { Menu, X, Sun, Moon, ShieldCheck, ChevronDown, Image as ImageIcon, Type, Calculator, Code, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [theme, setTheme] = React.useState<'aureate' | 'abyss'>(() => {
    return (localStorage.getItem('theme') as 'aureate' | 'abyss') || 'aureate';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'aureate' ? 'abyss' : 'aureate');
  };

  const menuCategories = [
    { id: 'image', label: 'IMAGE TOOLS', icon: <ImageIcon size={14}/>, filter: ['pdf-img-extractor', 'web-img-extractor', 'product-desc-gen', 'bg-remover', 'yt-thumbnail-gen', 'social-resizer'] },
    { id: 'text', label: 'TEXT TOOLS', icon: <Type size={14}/>, filter: ['screen-recorder', 'email-extractor', 'pdf-to-text', 'case-converter', 'grammar-fixer', 'ai-humanizer', 'scribe-counter'] },
    { id: 'calc', label: 'CALC TOOLS', icon: <Calculator size={14}/>, filter: ['timezone-converter', 'invoice-gen', 'alarm-clock', 'unit-converter', 'age-oracle', 'gpa-calc', 'if-calc', 'basic-calc', 'perc-calc'] },
    { id: 'dev', label: 'DEV TOOLS', icon: <Code size={14}/>, filter: ['sitemap-gen', 'signature-gen', 'privacy-gen', 'meta-gen', 'robots-gen', 'domain-extractor', 'regex-tester', 'sql-formatter', 'json-converter'] }
  ];

  return (
    <div className="flex flex-col min-h-screen transition-all duration-700 ease-in-out bg-[var(--bg-deep)]">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto bg-[var(--bg-main)]/90 backdrop-blur-2xl border border-[var(--border-glow)] p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 pl-2">
            <a href="#/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--bg-deep)] font-black shadow-lg group-hover:scale-110 transition-transform">S</div>
              <span className="text-xl font-black tracking-tighter text-white">Strong<span className="text-[var(--accent)]">Tools</span></span>
            </a>
          </div>
          
          <nav className="hidden xl:flex items-center gap-1">
            <a href="#/" className="text-[var(--text-dim)] hover:text-white px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em]">HOME</a>
            
            {menuCategories.map((cat) => (
              <div 
                key={cat.id}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(cat.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-2 text-[var(--text-dim)] group-hover:text-white px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all ${activeDropdown === cat.id ? 'text-white bg-white/5' : ''}`}>
                  {cat.label} <ChevronDown size={10} className={`transition-transform ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-0 pt-4 w-72 transition-all duration-300 ${activeDropdown === cat.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                  <div className="bg-[#0a0a0a] border border-[var(--border-glow)] rounded-xl p-4 shadow-2xl backdrop-blur-3xl flex flex-col gap-1">
                    {TOOLS.filter(t => cat.filter.includes(t.id)).map(tool => {
                      const ToolIcon = (LucideIcons as any)[tool.icon] || Zap;
                      return (
                        <a 
                          key={tool.id} 
                          href={`#/tool/${tool.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                        >
                          <ToolIcon size={14} className="text-[var(--accent)]" />
                          <span className="text-[9px] font-black text-white uppercase tracking-wider">{tool.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <a href="#/blog" className="text-[var(--text-dim)] hover:text-white px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em]">CHRONICLES</a>
            <a href="#/about" className="text-[var(--text-dim)] hover:text-white px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em]">ABOUT</a>
            <a href="#/contact" className="text-[var(--text-dim)] hover:text-white px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em]">CONTACT</a>

            <button 
              onClick={toggleTheme}
              className="ml-2 w-10 h-10 rounded-xl flex items-center justify-center text-[var(--accent)] bg-[var(--bg-card)] border border-[var(--border-glow)] hover:scale-110 transition-all"
            >
              {theme === 'aureate' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </nav>

          <div className="xl:hidden flex items-center gap-2 pr-2">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[var(--accent)] p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden mt-4 bg-[var(--bg-main)] border border-[var(--border-glow)] rounded-xl p-4 space-y-1 pointer-events-auto animate-in slide-in-from-top overflow-y-auto max-h-[80vh]">
            <a href="#/" onClick={() => setIsMenuOpen(false)} className="block text-white font-black text-sm p-4 rounded-xl hover:bg-[var(--accent)]/10">HOME</a>
            {menuCategories.map(cat => (
               <div key={cat.id} className="p-4 border-t border-white/5">
                 <p className="text-[8px] font-black text-[var(--accent)] mb-2">{cat.label}</p>
                 <div className="grid grid-cols-1 gap-2">
                   {TOOLS.filter(t => cat.filter.includes(t.id)).map(tool => (
                     <a key={tool.id} href={`#/tool/${tool.id}`} onClick={() => setIsMenuOpen(false)} className="text-[10px] text-gray-400 py-1 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]/30"></div>
                        {tool.name}
                     </a>
                   ))}
                 </div>
               </div>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-[var(--bg-deep)] py-20 border-t border-[var(--border-glow)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-[var(--text-dim)] text-[10px] font-black uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} StrongTools • Standard 1234567890 Active
          </p>
        </div>
      </footer>
    </div>
  );
};
