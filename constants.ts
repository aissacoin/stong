
import { Tool, ToolCategory } from './types';

export const CATEGORY_COLORS: Record<string, { bg: string, text: string, glow: string }> = {
  'Knowledge': { bg: 'bg-yellow-400', text: 'text-black', glow: 'shadow-yellow-400/50' },
  'Time': { bg: 'bg-cyan-400', text: 'text-black', glow: 'shadow-cyan-400/50' },
  'Finance': { bg: 'bg-emerald-400', text: 'text-black', glow: 'shadow-emerald-400/50' },
  'Conversion': { bg: 'bg-pink-500', text: 'text-white', glow: 'shadow-pink-500/50' },
  'Generators': { bg: 'bg-indigo-500', text: 'text-white', glow: 'shadow-indigo-500/50' },
  'Productivity': { bg: 'bg-orange-500', text: 'text-white', glow: 'shadow-orange-500/50' }
};

export const NAV_LINKS = [
  { name: 'Home', href: '#/' },
  { name: 'Tools', href: '#/tools' },
  { name: 'Chronicles', href: '#/blog' },
  { name: 'About', href: '#/about' },
  { name: 'Contact', href: '#/contact' }
];

export const TOOLS: Tool[] = [
  // TIME TOOLS
  { 
    id: 'timezone-converter', 
    name: 'Global Time Zone Architect', 
    description: 'Synchronize specific temporal coordinates across international jurisdictions with high-fidelity conversion logic.', 
    category: ToolCategory.TIME, 
    icon: 'Globe2'
  },
  { 
    id: 'alarm-clock', 
    name: 'Chronos Awakening Node', 
    description: 'High-precision digital alarm system with temporal countdown logic and acoustic alerts.', 
    category: ToolCategory.TIME, 
    icon: 'AlarmClock'
  },
  { 
    id: 'timer-stopwatch', 
    name: 'Interval Precision Master', 
    description: 'High-fidelity stopwatch and timer system for tracking minute temporal increments.', 
    category: ToolCategory.TIME, 
    icon: 'Timer'
  },
  { 
    id: 'world-clock', 
    name: 'Chronos Global Node', 
    description: 'Real-time synchronization with major international meridians and capital registries.', 
    category: ToolCategory.TIME, 
    icon: 'Clock'
  },
  // GENERATORS
  { 
    id: 'sitemap-gen', 
    name: 'Sovereign Sitemap Architect', 
    description: 'Construct compliant XML sitemap manuscripts for institutional search engine indexing.', 
    category: ToolCategory.GENERATORS, 
    icon: 'Network'
  },
  { 
    id: 'signature-gen', 
    name: 'Email Signature Architect', 
    description: 'Construct professional high-fidelity HTML email signatures for institutional communication.', 
    category: ToolCategory.GENERATORS, 
    icon: 'PenLine'
  },
  { 
    id: 'privacy-gen', 
    name: 'Institutional Privacy Architect', 
    description: 'Construct compliant Privacy Policy manuscripts for global digital jurisdictions.', 
    category: ToolCategory.GENERATORS, 
    icon: 'ShieldSafe'
  },
  { 
    id: 'meta-gen', 
    name: 'Sovereign Meta Architect', 
    description: 'Construct high-fidelity SEO and Social Meta tags with real-time semantic validation.', 
    category: ToolCategory.GENERATORS, 
    icon: 'Code2'
  },
  // FINANCE TOOLS
  { 
    id: 'invoice-gen', 
    name: 'Fiscal Invoice Architect', 
    description: 'Construct professional high-fidelity billing manuscripts with automated tax logic and PDF export.', 
    category: ToolCategory.FINANCE, 
    icon: 'FileSpreadsheet'
  },
  { 
    id: 'tip-calc', 
    name: 'Gratuity Precision Master', 
    description: 'Deconstruct service transactions with individual split logic and algorithmic percentage scaling.', 
    category: ToolCategory.FINANCE, 
    icon: 'Coins'
  },
  // PRODUCTIVITY TOOLS
  { 
    id: 'screen-recorder', 
    name: 'Sovereign Screen Recorder', 
    description: 'High-fidelity browser-based screen capturing with optional audio archival synchronization.', 
    category: ToolCategory.PRODUCTIVITY, 
    icon: 'MonitorPlay'
  },
  { 
    id: 'word-counter-page', 
    name: 'Lexical Volume Architect', 
    description: 'Advanced word counter that simulates professional page counts based on typography standards.', 
    category: ToolCategory.PRODUCTIVITY, 
    icon: 'BookOpen'
  }
];
