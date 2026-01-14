
import React from 'react';
import { TOOLS } from '../constants';
import { ToolModal } from '../components/ToolModal';
import { 
  Zap, ChevronRight, Image as ImageIcon, Type, Calculator, 
  Code, ShieldCheck, FileText, Tag, Coins, BookOpen, Code2, AlarmClock as AlarmIcon,
  MonitorPlay, ShieldAlert, FileSpreadsheet, PenLine, Network, Globe2
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Import Logic
import { TimeZoneConverter } from '../components/tools/TimeZoneConverter';
import { SitemapGenerator } from '../components/tools/SitemapGenerator';
import { EmailSignatureGenerator } from '../components/tools/EmailSignatureGenerator';
import { InvoiceGenerator } from '../components/tools/InvoiceGenerator';
import { ScreenRecorder } from '../components/tools/ScreenRecorder';
import { PrivacyGenerator } from '../components/tools/PrivacyGenerator';
import { AlarmClock } from '../components/tools/AlarmClock';
import { MetaTagGenerator } from '../components/tools/MetaTagGenerator';
import { WordCounterPerPage } from '../components/tools/WordCounterPerPage';
import { TipCalculator } from '../components/tools/TipCalculator';
import { DiscountCalculator } from '../components/tools/DiscountCalculator';
import { DaysBetweenDates } from '../components/tools/DaysBetweenDates';
import { ColorPickerFromImage } from '../components/tools/ColorPickerFromImage';
import { CollageMaker } from '../components/tools/CollageMaker';
import { RandomNumberGen } from '../components/tools/RandomNumberGen';
import { WebPToPNG } from '../components/tools/WebPToPNG';
import { PDFToWord } from '../components/tools/PDFToWord';
import { ImageCompressor } from '../components/tools/ImageCompressor';
import { OnlineNotepad } from '../components/tools/OnlineNotepad';
import { PDFImageExtractor } from '../components/tools/PDFImageExtractor';
import { WebsiteImageExtractor } from '../components/tools/WebsiteImageExtractor';
import { AIProductDescription } from '../components/tools/AIProductDescription';
import { AIBackgroundRemover } from '../components/tools/AIBackgroundRemover';
import { AIThumbnailForge } from '../components/tools/AIThumbnailForge';
import { SocialResizer } from '../components/tools/SocialResizer';

import { EmailExtractor } from '../components/tools/EmailExtractor';
import { PDFToTextConverter } from '../components/tools/PDFToTextConverter';
import { CaseConverter } from '../components/tools/CaseConverter';
import { GrammarFixer } from '../components/tools/GrammarFixer';
import { AIHumanizer } from '../components/tools/AIHumanizer';
import { WordCounter } from '../components/tools/WordCounter';

import { UnitConverter } from '../components/tools/UnitConverter';
import { AgeOracle } from '../components/tools/AgeOracle';
import { GPACalculator } from '../components/tools/GPACalculator';
import { IFC_Calculator } from '../components/tools/IFC_Calculator';
import { BasicCalculator } from '../components/tools/BasicCalculator';
import { PercentageCalc } from '../components/tools/PercentageCalc';

import { RobotsGenerator } from '../components/tools/RobotsGenerator';
import { DomainExtractor } from '../components/tools/DomainExtractor';
import { RegexTester } from '../components/tools/RegexTester';
import { SQLFormatter } from '../components/tools/SQLFormatter';
import { JSONConverter } from '../components/tools/JSONConverter';

export const renderToolLogic = (id: string) => {
  switch (id) {
    case 'timezone-converter': return <TimeZoneConverter />;
    case 'sitemap-gen': return <SitemapGenerator />;
    case 'signature-gen': return <EmailSignatureGenerator />;
    case 'invoice-gen': return <InvoiceGenerator />;
    case 'screen-recorder': return <ScreenRecorder />;
    case 'privacy-gen': return <PrivacyGenerator />;
    case 'alarm-clock': return <AlarmClock />;
    case 'meta-gen': return <MetaTagGenerator />;
    case 'word-counter-page': return <WordCounterPerPage />;
    case 'tip-calc': return <TipCalculator />;
    case 'discount-calc': return <DiscountCalculator />;
    case 'days-between': return <DaysBetweenDates />;
    case 'color-picker-img': return <ColorPickerFromImage />;
    case 'collage-maker': return <CollageMaker />;
    case 'random-number': return <RandomNumberGen />;
    case 'webp-to-png': return <WebPToPNG />;
    case 'pdf-to-word': return <PDFToWord />;
    case 'image-compressor': return <ImageCompressor />;
    case 'online-notepad': return <OnlineNotepad />;
    case 'pdf-img-extractor': return <PDFImageExtractor />;
    case 'web-img-extractor': return <WebsiteImageExtractor />;
    case 'product-desc-gen': return <AIProductDescription />;
    case 'bg-remover': return <AIBackgroundRemover />;
    case 'yt-thumbnail-gen': return <AIThumbnailForge />;
    case 'social-resizer': return <SocialResizer />;
    
    case 'email-extractor': return <EmailExtractor />;
    case 'pdf-to-text': return <PDFToTextConverter />;
    case 'case-converter': return <CaseConverter />;
    case 'grammar-fixer': return <GrammarFixer />;
    case 'ai-humanizer': return <AIHumanizer />;
    case 'scribe-counter': return <WordCounter />;
    
    case 'unit-converter': return <UnitConverter />;
    case 'age-oracle': return <AgeOracle />;
    case 'gpa-calc': return <GPACalculator />;
    case 'if-calc': return <IFC_Calculator />;
    case 'basic-calc': return <BasicCalculator />;
    case 'perc-calc': return <PercentageCalc />;
    
    case 'robots-gen': return <RobotsGenerator />;
    case 'domain-extractor': return <DomainExtractor />;
    case 'regex-tester': return <RegexTester />;
    case 'sql-formatter': return <SQLFormatter />;
    case 'json-converter': return <JSONConverter />;
    default: return <div className="text-center py-10 opacity-20"><Zap size={32} className="mx-auto" /></div>;
  }
};

const SectionHeading = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="mb-12 max-w-4xl">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
        <Icon size={20} />
      </div>
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase font-serif-scholarly">{title}</h2>
    </div>
    <p className="text-lg text-gray-500 italic leading-relaxed">{desc}</p>
  </div>
);

export const Home: React.FC = () => {
  const [selectedToolId, setSelectedToolId] = React.useState<string | null>(null);
  const selectedTool = TOOLS.find(t => t.id === selectedToolId);

  const homeSections = [
    {
      id: 'image',
      icon: ImageIcon,
      title: "VISUAL FORGE & IMAGE STUDIO",
      desc: "Harness neural networks to isolate subjects, refine pixels, and synthesize professional visual assets for the digital era.",
      toolIds: ['color-picker-img', 'collage-maker', 'webp-to-png', 'pdf-to-word', 'image-compressor', 'pdf-img-extractor', 'web-img-extractor', 'product-desc-gen', 'bg-remover', 'yt-thumbnail-gen', 'social-resizer']
    },
    {
      id: 'text',
      icon: Type,
      title: "LINGUISTIC SCRIBES & CONTENT NODES",
      desc: "Advanced instruments for topological text conversion, academic counting, AI-driven humanization, and communication harvesting.",
      toolIds: ['screen-recorder', 'word-counter-page', 'online-notepad', 'email-extractor', 'pdf-to-text', 'case-converter', 'grammar-fixer', 'ai-humanizer', 'scribe-counter']
    },
    {
      id: 'calc',
      icon: Calculator,
      title: "METRIC ORACLES & MATH ENGINES",
      desc: "Absolute mathematical rigor for tracking temporal age, academic GPA, metabolic fasting, and precise unit translations.",
      toolIds: ['timezone-converter', 'alarm-clock', 'tip-calc', 'discount-calc', 'days-between', 'unit-converter', 'age-oracle', 'gpa-calc', 'if-calc', 'basic-calc', 'perc-calc']
    },
    {
      id: 'dev',
      icon: Code,
      title: "ENGINEERING VAULT & LOGIC PROBES",
      desc: "High-fidelity instruments for SEO harvesting, SQL refinement, and structured data deconstruction for technical architects.",
      toolIds: ['sitemap-gen', 'signature-gen', 'privacy-gen', 'meta-gen', 'random-number', 'robots-gen', 'domain-extractor', 'regex-tester', 'sql-formatter', 'json-converter']
    }
  ];

  return (
    <div className="min-h-screen pb-20 px-4 selection:bg-[var(--accent)] selection:text-black">
      {/* HERO */}
      <section className="relative pt-32 pb-40 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--border-glow)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.5em] animate-gold-pulse">
            <ShieldCheck size={14} /> SOVEREIGN ARCHIVE MMXXV
          </div>
          <h1 className="text-7xl md:text-[12rem] font-black text-white uppercase tracking-tighter italic font-serif-scholarly leading-[0.8]">
            PRECISION <br /> <span className="text-[var(--accent)] text-glow">INSTRUMENTS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 font-medium italic">
            "Absolute logical rigor wrapped in artisanal aesthetic excellence. The definitive sanctuary for digital architects."
          </p>
        </div>
      </section>

      {/* SECTIONS */}
      <div className="max-w-7xl mx-auto space-y-32">
        {homeSections.map((section) => (
          <section key={section.id} id={section.id}>
            <SectionHeading icon={section.icon} title={section.title} desc={section.desc} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {TOOLS.filter(t => section.toolIds.includes(t.id)).map((tool) => {
                const Icon = (LucideIcons as any)[tool.icon] || Zap;
                return (
                  <div key={tool.id} className="tool-card-3d group h-full">
                    <div className="glass-3d p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-full hover:border-[var(--accent)] transition-all">
                      <button onClick={() => setSelectedToolId(tool.id)} className="w-full text-left flex flex-col h-full">
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight mb-2 group-hover:text-[var(--accent)] transition-colors uppercase">{tool.name}</h3>
                        <p className="text-gray-500 text-xs italic leading-relaxed flex-grow">{tool.description}</p>
                        <div className="mt-6 flex items-center gap-2 text-[var(--accent)] opacity-40 group-hover:opacity-100 transition-all">
                          <span className="text-[8px] font-black uppercase tracking-widest">OPEN NODE</span>
                          <ChevronRight size={12} />
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* MODAL */}
      {selectedTool && (
        <ToolModal isOpen={!!selectedToolId} onClose={() => setSelectedToolId(null)} title={selectedTool.name} toolId={selectedTool.id}>
          {renderToolLogic(selectedTool.id)}
        </ToolModal>
      )}
    </div>
  );
};
