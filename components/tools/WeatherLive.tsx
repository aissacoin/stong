
import React, { useState } from 'react';
import { 
  Sun, Cloud, CloudRain, CloudLightning, Snowflake, 
  Wind, Droplets, Search, Sparkles, MapPin, 
  Loader2, AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export const WeatherLive: React.FC = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);

  const fetchWeather = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    // Initializing Google GenAI with process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Atmospheric status for: ${city}`,
        config: {
          systemInstruction: "You are the Celestial Oracle. Return CURRENT weather data in JSON. Include: temp (Celsius), condition, humidity, wind, tip (prestigious health tip).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              humidity: { type: Type.STRING },
              wind: { type: Type.STRING },
              tip: { type: Type.STRING }
            },
            required: ["temp", "condition", "humidity", "wind", "tip"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      const result = JSON.parse(text);

      setWeather({
        temp: result.temp,
        condition: result.condition,
        humidity: result.humidity,
        wind: result.wind,
        tip: result.tip,
        city: city
      });
    } catch (err) {
      setError("Celestial synchronization failed. Check coordinates.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain')) return <CloudRain className="text-[#D4AF37]" size={64} />;
    if (c.includes('storm')) return <CloudLightning className="text-[#D4AF37]" size={64} />;
    if (c.includes('snow')) return <Snowflake className="text-[#D4AF37]" size={64} />;
    if (c.includes('cloud')) return <Cloud className="text-[#D4AF37]" size={64} />;
    return <Sun className="text-[#D4AF37] animate-pulse" size={64} />;
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-10 max-w-2xl mx-auto shadow-[0_0_80px_rgba(212,175,55,0.1)] relative overflow-hidden group">
      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-4">
          <Sparkles className="text-[#D4AF37]" size={24} />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Weather Oracle</h2>
        </div>

        <form onSubmit={fetchWeather} className="flex gap-3">
          <div className="relative flex-grow">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={20} />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter Coordinate/City..."
              className="w-full bg-black border border-[#D4AF37]/20 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="px-8 bg-[#D4AF37] text-black rounded-2xl font-black">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </form>

        {error && <div className="text-rose-400 font-bold p-4 bg-rose-500/5 rounded-xl border border-rose-500/20">{error}</div>}

        {weather && !loading && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex justify-between items-center p-8 bg-white/5 rounded-[2.5rem]">
               <div>
                 <p className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-2">{weather.city}</p>
                 <div className="text-7xl font-black text-white">{weather.temp}°C</div>
                 <p className="text-xl font-bold uppercase italic text-white/60">{weather.condition}</p>
               </div>
               {getWeatherIcon(weather.condition)}
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-black border border-white/5 rounded-3xl">
                  <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">Humidity</p>
                  <p className="text-xl font-black text-white">{weather.humidity}</p>
               </div>
               <div className="p-6 bg-black border border-white/5 rounded-3xl">
                  <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">Wind Speed</p>
                  <p className="text-xl font-black text-white">{weather.wind}</p>
               </div>
            </div>
            <div className="p-8 bg-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-[2rem] text-lg italic text-white/90">
               "{weather.tip}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
