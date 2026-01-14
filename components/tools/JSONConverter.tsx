
import React, { useState, useCallback } from 'react';
import { FileSpreadsheet, Download, Trash2, AlertCircle, Check, Copy, Table, FileJson, Info } from 'lucide-react';

export const JSONConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Flatten nested objects for table representation
  const flattenObject = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '_' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const processJSON = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      let arrayToProcess: any[] = [];

      if (Array.isArray(parsed)) {
        arrayToProcess = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        arrayToProcess = [parsed];
      } else {
        throw new Error("Input must be a valid JSON Object or Array.");
      }

      const flattened = arrayToProcess.map(item => flattenObject(item));
      const allHeaders = Array.from(new Set(flattened.flatMap(obj => Object.keys(obj))));
      
      setHeaders(allHeaders);
      setData(flattened);
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax detected.");
      setData([]);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] === undefined || row[header] === null ? '' : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `StrongTools_Export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-pink-500 selection:text-white">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 text-pink-400">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">JSON to Excel/CSV</h2>
            <p className="text-[9px] font-bold text-pink-500/40 uppercase tracking-[0.4em]">Structured Data Transformation</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => {setJsonInput(''); setData([]);}}
            className="p-3 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-rose-400 transition-all"
            title="Clear Input"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-black uppercase text-[10px] tracking-widest ${copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic px-2 flex items-center gap-2">
              <FileJson size={14} /> Input JSON Data
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-[400px] bg-black border border-white/5 rounded-[2rem] p-6 text-pink-500 font-mono text-sm outline-none focus:border-pink-500/40 transition-all placeholder-white/5 resize-none shadow-inner custom-scrollbar"
              placeholder='[{"id": 1, "name": "StrongTools", "stats": {"speed": "high"}}, ...]'
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs italic font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            onClick={processJSON}
            disabled={!jsonInput.trim()}
            className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-20"
          >
            <Table size={18} /> Visualize Data Table
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 italic">Table Preview</h3>
              {data.length > 0 && (
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{data.length} Records Found</span>
              )}
            </div>
            
            <div className="flex-grow overflow-auto custom-scrollbar bg-black/40 rounded-2xl border border-white/5">
              {data.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {headers.map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-pink-400/60 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        {headers.map(h => (
                          <td key={h} className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{String(row[h] ?? '-')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 opacity-10 space-y-4">
                  <Table size={64} />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Process JSON to see preview</p>
                </div>
              )}
            </div>

            {data.length > 10 && (
              <p className="mt-4 text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center italic">Showing first 10 records only. Full data available in export.</p>
            )}

            <button 
              onClick={downloadCSV}
              disabled={data.length === 0}
              className="mt-6 w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-20"
            >
              <Download size={18} /> Export as CSV (Excel)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-40">
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Info size={14} className="text-pink-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Handles Nested JSON</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <Check size={14} className="text-pink-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Client-side Processing</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <FileSpreadsheet size={14} className="text-pink-500" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Excel Compatible Output</span>
        </div>
      </div>
    </div>
  );
};
