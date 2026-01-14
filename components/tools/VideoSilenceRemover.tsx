
import React, { useState, useRef } from 'react';
import { Video, Upload, Download, Trash2, ShieldCheck, Zap, Info, Scissors, Loader2, Play, AlertCircle, FileVideo, Check } from 'lucide-react';

export const VideoSilenceRemover: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [threshold, setThreshold] = useState(-35); // dB
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const ffmpegRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    
    try {
      setStatus('Calibrating Archival Engines...');
      const { FFmpeg } = (window as any).FFmpeg;
      const { toBlobURL } = (window as any).FFmpegUtil;
      
      const ffmpeg = new FFmpeg();
      
      ffmpeg.on('progress', ({ progress }: { progress: number }) => {
        setProgress(Math.round(progress * 100));
      });

      // Using a more stable version with multi-threaded support fallback
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpegRef.current = ffmpeg;
      return ffmpeg;
    } catch (err) {
      console.error("FFmpeg Calibration Error:", err);
      setError("Archive node calibration failed: Your browser is restricting the secure memory threads (SharedArrayBuffer). Ensure you are using a modern browser or try clearing your cache.");
      throw err;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("Archive Limit Exceeded: Please select a video under 100MB for stable browser-based synthesis.");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setProcessedVideoUrl(null);
      setError(null);
      // Pre-load to warm up the engine
      loadFFmpeg().catch(() => {});
    }
  };

  const processVideo = async () => {
    if (!videoFile || loading) return;

    setLoading(true);
    setError(null);
    setProgress(0);
    setStatus('Initializing Archival Synthesis...');

    try {
      const ffmpeg = await loadFFmpeg();
      const { fetchFile } = (window as any).FFmpegUtil;
      
      const inputName = 'input_master.mp4';
      const outputName = 'processed_archive.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
      setStatus('Analyzing Audio Frequencies...');
      
      // We use a robust filter string that works in single-threaded mode if necessary
      // This specifically avoids complex thread-dependent filters if SharedArrayBuffer is partially blocked
      await ffmpeg.exec([
        '-i', inputName,
        '-af', `silenceremove=start_periods=1:stop_periods=-1:stop_duration=0.5:stop_threshold=${threshold}dB`,
        '-vcodec', 'copy',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'video/mp4' }));
      setProcessedVideoUrl(url);
      setStatus('Master Synthesis Complete');
    } catch (err: any) {
      console.error("Processing Logic Failure:", err);
      setError("Logical Synthesis Failure: The process was interrupted by the browser security sandbox.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedVideoUrl) return;
    const link = document.createElement('a');
    link.href = processedVideoUrl;
    link.download = `Sovereign_Stripped_Archive_${Date.now()}.mp4`;
    link.click();
  };

  const handleClear = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setProcessedVideoUrl(null);
    setError(null);
    setStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-20">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-500">
              <Scissors size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">AI Video Silence Stripper</h2>
              <p className="text-[9px] font-bold text-[#D4AF37]/40 uppercase tracking-[0.4em]">Zero-Upload Jump-Cut Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <ShieldCheck size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60">Local Memory Isolation Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2">Archival Media Ingestion</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer h-56 bg-black border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${videoFile ? 'border-[var(--accent)]/40' : 'border-white/5 hover:border-[var(--accent)]/40'}`}
              >
                {videoFile ? (
                   <div className="text-center p-6 animate-in fade-in">
                     <FileVideo size={48} className="text-[var(--accent)] mx-auto mb-2" />
                     <p className="text-xs text-white font-black uppercase truncate max-w-[200px]">{videoFile.name}</p>
                     <p className="text-[9px] text-gray-500 uppercase mt-1">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                   </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-700 group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Inject Video Master Asset</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="video/mp4,video/quicktime,video/x-msvideo" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Silence Sensitivity Threshold</label>
                <span className="text-sm font-black text-[var(--accent)] tabular-nums italic">{threshold} dB</span>
              </div>
              <input 
                type="range" min="-60" max="-10" step="1" value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="custom-range"
              />
              <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest px-1 italic">
                 <span>Aggressive (-60dB)</span>
                 <span>Light (-10dB)</span>
              </div>
            </div>

            <button
              onClick={processVideo}
              disabled={loading || !videoFile}
              className="w-full bg-[var(--accent)] text-black py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Synthesis: {progress}%
                </>
              ) : (
                <>
                  <Zap size={24} />
                  Execute Stripping
                </>
              )}
            </button>

            {status && !error && (
               <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 animate-pulse italic">{status}</p>
            )}

            {error && (
              <div className="flex items-start gap-4 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-rose-400/80 font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Institutional Registry Preview</label>
              <button onClick={handleClear} className="text-gray-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
            </div>
            
            <div className="relative flex-grow bg-black/60 border border-white/5 rounded-[3.5rem] p-4 flex items-center justify-center min-h-[450px] overflow-hidden group">
               {processedVideoUrl ? (
                 <video src={processedVideoUrl} controls className="w-full h-full rounded-[2.5rem] shadow-2xl animate-in fade-in duration-1000" />
               ) : videoPreview ? (
                 <div className="relative w-full h-full">
                    <video src={videoPreview} className="w-full h-full object-contain rounded-[2.5rem] opacity-30 grayscale" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                       <Play size={48} className="text-white/20" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Awaiting Logical Refinement</span>
                    </div>
                 </div>
               ) : (
                 <div className="text-center opacity-10 space-y-6">
                   <Video size={100} className="mx-auto" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Master Video Frame</p>
                 </div>
               )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!processedVideoUrl}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter italic flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(5,150,105,0.3)] disabled:opacity-20"
            >
              <Download size={24}/>
              Export Processed Archive (.MP4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
