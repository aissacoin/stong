
import React, { useState } from 'react';
import { History, Sparkles, Loader2, Music, Film, Trophy } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export const BirthWatchTool: React.FC = () => {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!year || parseInt(year) < 1900) {
      setError("Please provide a valid historical year (1900+).");
      return;
    }

    setLoading(true);
    setError(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `What were the cultural highlights of the year ${year}?`,
        config: {
          systemInstruction: "You are a professional historian. Return cultural highlights for the year in JSON: music, cinema, majorEvent (max 15 words each).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              music: { type: Type.STRING },
              cinema: { type: Type.STRING },
              majorEvent: { type: Type.STRING }
            },
            required: ["music", "cinema", "majorEvent"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      setData(result);
    } catch (err) {
      setError("Archive node failed to retrieve data for this temporal coordinate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-[2.5rem] p-6 sm:p-8 max-w-xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <History className="text-[#D4AF37]" size={28} />
        <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Temporal Registry</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="flex-grow bg-black border border-[#D4AF37]/20 rounded-2xl p-4 text-[#D4AF37] text-xl font-black outline-none focus:border-[#D4AF37]"
            placeholder="Year..."
          />
          <button 
            onClick={fetchHistory}
            disabled={loading}
            className="px-6 bg-[#D4AF37] text-black rounded-2xl font-black hover:scale-105 transition-transform"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          </button>
        </div>

        {error && <p className="text-rose-400 text-xs italic px-2">{error}</p>}

        {data && !loading && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
              <Music className="text-[#D4AF37] shrink-0" size={20} />
              <div>
                <p className="text-[8px] font-black uppercase text-[#D4AF37]/40 tracking-widest">Audio Archive</p>
                <p className="text-sm text-white/90 italic">{data.music}</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
              <Film className="text-[#D4AF37] shrink-0" size={20} />
              <div>
                <p className="text-[8px] font-black uppercase text-[#D4AF37]/40 tracking-widest">Visual Archive</p>
                <p className="text-sm text-white/90 italic">{data.cinema}</p>
              </div>
            </div>
            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
              <Trophy className="text-[#D4AF37] shrink-0" size={20} />
              <div>
                <p className="text-[8px] font-black uppercase text-[#D4AF37]/40 tracking-widest">Global Record</p>
                <p className="text-sm text-white/90 italic">{data.majorEvent}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
