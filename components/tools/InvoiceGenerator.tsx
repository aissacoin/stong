
import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, Trash2, Printer, Download, Landmark, User, Receipt, ShieldCheck, Zap, Info, Calendar } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceGenerator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    from: 'StrongTools Institutional Archive\nLondon, UK',
    to: 'Recipient Entity Name\nFull Address Registry',
    taxRate: 15,
    notes: 'Payment terms: Net 30. Please include invoice number in the transfer record.'
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Digital Asset Licensing', quantity: 1, price: 500.00 }
  ]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + taxAmount;

  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; color: black !important; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-[#0a0a0a] border border-emerald-500/30 rounded-[3rem] p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden selection:bg-emerald-500 selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <FileSpreadsheet size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Fiscal Invoice Architect</h2>
              <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-[0.4em]">High-Fidelity Billing Engine</p>
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
          >
            <Printer size={16} /> Export Print-Ready Manuscript
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 print-area">
          {/* Header Data */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/5 pb-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic px-2 no-print">Originating Entity (From)</label>
                <textarea 
                  value={invoiceData.from}
                  onChange={(e) => setInvoiceData({...invoiceData, from: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:border-emerald-500/40 transition-all min-h-[120px] resize-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic px-2 no-print">Invoice Registry ID</label>
                    <input 
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-emerald-400 font-black text-xs uppercase"
                    />
                 </div>
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic px-2 no-print">Temporal Coordinate</label>
                    <input 
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white text-xs tabular-nums"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic px-2 no-print">Recipient Entity (To)</label>
                <textarea 
                  value={invoiceData.to}
                  onChange={(e) => setInvoiceData({...invoiceData, to: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:border-emerald-500/40 transition-all min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="lg:col-span-12 space-y-4">
            <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 italic">
               <div className="col-span-6">Description Registry</div>
               <div className="col-span-2 text-center">Qty</div>
               <div className="col-span-3 text-right">Unit Value</div>
               <div className="col-span-1"></div>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl group animate-in slide-in-from-left-2 transition-all hover:border-emerald-500/20">
                  <div className="col-span-6">
                    <input 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Service / Product descriptor..."
                      className="w-full bg-transparent border-0 text-white text-sm outline-none font-medium italic"
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(toStd(e.target.value)) || 0)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-center text-white text-xs tabular-nums"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/40 text-[10px] font-black">$</span>
                      <input 
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(toStd(e.target.value)) || 0)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 pl-6 text-right text-white text-xs tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center no-print">
                    <button onClick={() => removeItem(item.id)} className="text-gray-700 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addItem}
              className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-3 text-gray-600 hover:text-emerald-400 hover:border-emerald-400/20 transition-all no-print"
            >
              <Plus size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Append Line Item</span>
            </button>
          </div>

          {/* Footer & Totals */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-t border-white/5 pt-12">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic px-2 no-print">Instructional Notes</label>
                <textarea 
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-[2rem] p-8 text-gray-400 text-xs italic leading-relaxed outline-none min-h-[150px] resize-none"
                />
             </div>
             <div className="space-y-6">
                <div className="space-y-3 bg-black/60 border border-white/5 p-8 rounded-[3rem] shadow-inner">
                   <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>Subtotal Ledger</span>
                      <span className="text-white tabular-nums">${toStd(subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 }))}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <div className="flex items-center gap-4">
                        <span>Tax Rate Registry</span>
                        <input 
                          type="number"
                          value={invoiceData.taxRate}
                          onChange={(e) => setInvoiceData({...invoiceData, taxRate: parseFloat(toStd(e.target.value)) || 0})}
                          className="w-12 bg-white/5 border border-white/10 rounded-md p-1 text-center text-emerald-400 font-black no-print"
                        />
                        <span className="no-print">%</span>
                      </div>
                      <span className="text-white tabular-nums">${toStd(taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }))}</span>
                   </div>
                   <div className="h-px bg-white/5 my-4"></div>
                   <div className="flex justify-between items-center">
                      <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Total Assessment</span>
                      <span className="text-4xl font-black text-white italic tabular-nums tracking-tighter text-glow">${toStd(total.toLocaleString('en-US', { minimumFractionDigits: 2 }))}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40 py-4 border-t border-white/5 no-print">
          <div className="flex items-center gap-2">
            <Landmark size={14} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Institutional Billing Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Client-Side Calculation</span>
          </div>
          <div className="flex items-center gap-2">
            <Receipt size={14} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Print-Ready Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};
