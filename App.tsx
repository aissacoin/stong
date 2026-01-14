
import React from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { ToolDetail } from './pages/ToolDetail';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { AlertTriangle } from 'lucide-react';

/**
 * Registry Error Page (404)
 */
const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-6 text-center">
    <AlertTriangle size={80} className="text-[var(--accent)] mb-10 opacity-40 animate-pulse" />
    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-[var(--accent)] mb-6">Record Not Found</h2>
    <p className="text-gray-400 max-w-xl mx-auto text-xl mb-12 italic leading-relaxed">
      The archival node you are attempting to reach does not exist in the current sovereign registry.
    </p>
    <a href="#/" className="px-12 py-5 bg-[var(--accent)] text-black font-black uppercase tracking-[0.6em] text-[10px] rounded-2xl hover:scale-105 transition-all shadow-[0_20px_60px_rgba(212,175,55,0.3)]">
      Return to Home Meridian
    </a>
  </div>
);

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = React.useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    const hash = currentHash.replace(/^#/, '') || '/';

    // Static Routes
    if (hash === '/' || hash === '') return <Home />;
    if (hash === '/about') return <About />;
    if (hash === '/contact') return <Contact />;
    if (hash === '/privacy') return <Privacy />;
    if (hash === '/terms') return <Terms />;
    if (hash === '/tools') return <Tools />;
    if (hash === '/blog') return <Blog />;

    // Dynamic Blog Routing: #/blog/:id
    if (hash.startsWith('/blog/')) {
      const parts = hash.split('/');
      const id = parts[2];
      if (!id) return <Blog />;
      return <BlogDetail id={id} key={`blog-${id}`} />;
    }

    // Dynamic Tool Routing: #/tool/:id or #/tool/:id/:date
    if (hash.startsWith('/tool/')) {
      const parts = hash.split('/').filter(Boolean); // ['tool', 'id', 'date']
      const id = parts[1];
      const date = parts[2];
      if (!id) return <NotFound />;
      return <ToolDetail id={id} initialDate={date} key={`tool-${id}-${date || 'latest'}`} />;
    }

    return <NotFound />;
  };

  return <Layout>{renderContent()}</Layout>;
};

export default App;
