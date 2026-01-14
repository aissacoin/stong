
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Copy, RefreshCw, Check, Lock, ShieldCheck, Zap } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: 'Weak', color: 'bg-rose-500' });

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!charset) {
      setPassword('Select Protocol');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }
    setPassword(generated);
    calculateStrength(generated);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 12) score++;
    if (pwd.length > 20) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) setStrength({ label: 'Vulnerable', color: 'bg-rose-500' });
    else if (score <= 4) setStrength({ label: 'Secure', color: 'bg-amber-500' });
    else setStrength({ label: 'Sovereign', color: 'bg-emerald-500' });
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (password === 'Select Protocol') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 text-[#D4AF37]">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Cryptographic Forge</h2>
            <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Entropy-Based Key Generation</p>
          </div>
        </div>
        <button 
          onClick={generatePassword}
          className="p-3 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all active:rotate-180 duration-500"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Output Area */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-[#D4AF37]/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="relative bg-black border border-[#D4AF37]/20 rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-inner">
            <div className="w-full text-center">
               <div className="text-2xl md:text-3xl font-mono text-white break-all tabular-nums leading-relaxed mb-4">
                 {password}
               </div>
               <div className="flex items-center justify-center gap-4">
                 <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-black ${strength.color} transition-all duration-500`}>
                   {strength.label}
                 </div>
               </div>
            </div>
            <button 
              onClick={handleCopy}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all ${
                copied 
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                : 'bg-[#D4AF37] text-black hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20'
              }`}
            >
              {copied ? <ShieldCheck size={18} /> : <Copy size={18} />}
              {copied ? 'Vaulted' : 'Capture Key'}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Complexity: {password.length}</label>
            </div>
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1">
               <span>8 Bit</span>
               <span>64 Bit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'upper', label: 'Caps', active: includeUpper, set: setIncludeUpper },
              { id: 'lower', label: 'Alpha', active: includeLower, set: setIncludeLower },
              { id: 'num', label: 'Numeric', active: includeNumbers, set: setIncludeNumbers },
              { id: 'sym', label: 'Glyphs', active: includeSymbols, set: setIncludeSymbols },
            ].map(toggle => (
              <button
                key={toggle.id}
                onClick={() => toggle.set(!toggle.active)}
                className={`p-4 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest flex flex-col items-center gap-2 ${
                  toggle.active 
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]' 
                  : 'bg-white/5 border-white/5 text-white/20'
                }`}
              >
                {toggle.label}
                <div className={`w-1.5 h-1.5 rounded-full ${toggle.active ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/10'}`}></div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#D4AF37]/5 p-6 rounded-[2.5rem] border border-[#D4AF37]/10 flex items-start gap-4">
          <ShieldAlert className="text-[#D4AF37]/40 shrink-0" size={20} />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">
            StrongTools Protocol: Keys are generated client-side via Web Crypto API. No data is ever transmitted to the registry or external nodes.
          </p>
        </div>
      </div>
    </div>
  );
};
