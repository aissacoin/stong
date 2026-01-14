
import React, { useState } from 'react';
import { MapPin, RefreshCw, Copy, Check, ShieldCheck, Zap, Info, Target, Globe, User, Phone, Mail } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface FakeAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  country: string;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }
];

export const FakeAddressGenerator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [address, setAddress] = useState<FakeAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateAddress = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a highly realistic synthetic (fake) identity and address for ${selectedCountry.name}.`,
        config: {
          systemInstruction: "You are a Synthetic Data Architect. Generate realistic but fake user data. Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              street: { type: Type.STRING },
              city: { type: Type.STRING },
              state: { type: Type.STRING },
              zip: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              country: { type: Type.STRING }
            },
            required: ["fullName", "street", "city", "state", "zip", "phone", "email", "country"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAddress(data);
    } catch (err) {
      console.error("Archive Synthesis Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <MapPin size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Synthetic Identity Forge</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">High-Fidelity Fake Address Node</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Neural Randomizer Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Settings Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Regional Jurisdiction</label>
              <div className="grid grid-cols-1 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedCountry.code === c.code 
                      ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-black' 
                      : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-widest">{c.name}</span>
                    <Globe size={14} className={selectedCountry.code === c.code ? 'opacity-100' : 'opacity-20'} />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateAddress}
              disabled={loading}
              className="w-full bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} />}
              Synthesize Data
            </button>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden min-h-[450px]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%)', backgroundSize: '40px 40px' }}></div>
            
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 animate-pulse">
                 <RefreshCw size={64} className="text-[var(--accent)] animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center italic">Consulting Archival Registries...</p>
              </div>
            ) : address ? (
              <div className="relative z-10 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Result Item Components */}
                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl group relative">
                    <button onClick={() => handleCopy(address.fullName, 'name')} className="absolute top-4 right-4 text-gray-600 hover:text-[var(--accent)] transition-colors">
                      {copiedField === 'name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <div className="flex items-center gap-3 text-[var(--accent)] mb-2 opacity-60">
                      <User size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">Full Name</span>
                    </div>
                    <div className="text-xl font-black text-white italic truncate">{address.fullName}</div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl group relative">
                    <button onClick={() => handleCopy(address.street, 'street')} className="absolute top-4 right-4 text-gray-600 hover:text-[var(--accent)] transition-colors">
                      {copiedField === 'street' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <div className="flex items-center gap-3 text-[var(--accent)] mb-2 opacity-60">
                      <MapPin size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">Street Archive</span>
                    </div>
                    <div className="text-xl font-black text-white italic truncate">{address.street}</div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl group relative">
                    <button onClick={() => handleCopy(`${address.city}, ${address.state} ${address.zip}`, 'csz')} className="absolute top-4 right-4 text-gray-600 hover:text-[var(--accent)] transition-colors">
                      {copiedField === 'csz' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <div className="flex items-center gap-3 text-[var(--accent)] mb-2 opacity-60">
                      <Globe size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">Region & Postal</span>
                    </div>
                    <div className="text-xl font-black text-white italic">{address.city}, {address.state} {address.zip}</div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl group relative">
                    <button onClick={() => handleCopy(address.phone, 'phone')} className="absolute top-4 right-4 text-gray-600 hover:text-[var(--accent)] transition-colors">
                      {copiedField === 'phone' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <div className="flex items-center gap-3 text-[var(--accent)] mb-2 opacity-60">
                      <Phone size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">Telephony Node</span>
                    </div>
                    <div className="text-xl font-black text-white italic tabular-nums">{address.phone}</div>
                  </div>

                </div>

                <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/30 p-8 rounded-[2.5rem] relative group mt-8">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-[var(--accent)]">
                        <Mail size={16} /> <span className="text-[10px] font-black uppercase tracking-[0.4em]">Synthetic Mailbox</span>
                      </div>
                      <button onClick={() => handleCopy(address.email, 'email')} className="text-gray-400 hover:text-[var(--accent)] transition-all">
                        {copiedField === 'email' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      </button>
                   </div>
                   <div className="text-2xl font-black text-white italic break-all underline decoration-[var(--accent)]/20">{address.email}</div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                <MapPin size={100} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Data Synthesis Initiation</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Privacy Protection Protocol Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Target size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Local Sandbox Execution Verified</p>
           </div>
        </div>
      </div>

      {/* EDUCATIONAL MANUSCRIPT SECTION */}
      <div className="max-w-4xl mx-auto space-y-24 py-20 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <div className="ad-placeholder h-24 mb-16 opacity-40"> [Expert Registry Display Ad] </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">The Utility of Synthetic Identity</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            In the modern meridian of digital development and cybersecurity, the ability to generate high-fidelity synthetic identities is paramount. A "Fake Address" is not merely a string of random characters, but a scholarly deconstruction of real-world postal registries. These generated archives allow developers to test localization logic, form validation, and database integrity without risking actual user PII (Personally Identifiable Information).
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Primary Use Cases</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Quality Assurance Testing</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Ensure your e-commerce platform handles international shipping formats, from ZIP codes to prefecture names, using verified synthetic models.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Privacy Preservation</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Protect your digital footprint when registering for informational newsletters or ephemeral accounts by utilizing non-tracked postal coordinates.</p>
            </div>
          </div>
        </section>

        <div className="ad-placeholder h-40 opacity-30 mt-20"> [Strategic Registry Display Ad Placeholder] </div>
      </div>
    </div>
  );
};
