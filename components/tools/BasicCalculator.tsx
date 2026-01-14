
import React, { useState } from 'react';
import { Calculator, Delete, RotateCcw, Equal, Plus, Minus, X, Divide } from 'lucide-react';

export const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isDone, setIsDone] = useState(false);

  // Ensuring Standard Numerals 1234567890
  const toStd = (s: string) => {
    return s.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const handleNumber = (num: string) => {
    if (isDone || display === 'Error') {
      setDisplay(num);
      setIsDone(false);
    } else {
      // If display is '0', replace it. Otherwise, append.
      setDisplay(prev => (prev === '0' ? num : prev + num));
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    
    // Check if the last character is already an operator to prevent duplicates
    const lastChar = display.trim().slice(-1);
    const operators = ['+', '-', '×', '÷'];
    
    if (operators.includes(lastChar)) {
      // Replace the last operator if user clicks a different one
      setDisplay(prev => prev.slice(0, -1) + op);
    } else {
      // Append the operator with spaces for better visibility
      setDisplay(prev => prev + op);
    }
    setIsDone(false);
  };

  const calculate = () => {
    try {
      if (!display || display === '0') return;

      // Convert visual symbols to math operators for evaluation
      const expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]); // Ensure std numerals
      
      const result = eval(expression);
      
      if (!isFinite(result)) {
        setDisplay('Error');
      } else {
        // Formatting result to avoid float issues
        const formattedResult = Number(parseFloat(result.toFixed(8)).toString());
        setDisplay(toStd(String(formattedResult)));
      }
      setIsDone(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setIsDone(false);
  };

  const deleteLast = () => {
    if (isDone || display === 'Error') {
      clear();
      return;
    }
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  /**
   * Internal Button Component
   * Fix: Added React.Attributes to handle 'key' prop when rendering in lists.
   */
  const Btn = ({ label, onClick, className = "" }: { label: any, onClick: () => void, className?: string } & React.Attributes) => (
    <button 
      onClick={onClick}
      className={`h-16 rounded-2xl font-black text-xl flex items-center justify-center transition-all active:scale-90 select-none ${className || "bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-sm"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[3rem] p-8 max-sm mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37]">
          <Calculator size={20} />
        </div>
        <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Simple Calculator</h2>
      </div>

      <div className="mb-6 p-6 bg-black border border-white/5 rounded-3xl text-right overflow-hidden shadow-inner min-h-[100px] flex flex-col justify-end">
        <div className="text-[10px] font-black text-[#D4AF37]/40 uppercase tracking-widest h-5 mb-1 truncate">
          {isDone ? 'Result' : 'Active Expression'}
        </div>
        <div className="text-4xl font-black text-white tabular-nums tracking-tighter break-all leading-tight">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Btn label={<RotateCcw size={18} />} onClick={clear} className="bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20" />
        <Btn label={<Delete size={18} />} onClick={deleteLast} className="hover:text-amber-500" />
        <Btn label={<Divide size={18} />} onClick={() => handleOperator('÷')} className="bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20" />
        <Btn label={<X size={18} />} onClick={() => handleOperator('×')} className="bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20" />

        {[7, 8, 9].map(n => <Btn key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <Btn label={<Minus size={18} />} onClick={() => handleOperator('-')} className="bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20" />

        {[4, 5, 6].map(n => <Btn key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <Btn label={<Plus size={18} />} onClick={() => handleOperator('+')} className="bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20" />

        {[1, 2, 3].map(n => <Btn key={n} label={String(n)} onClick={() => handleNumber(String(n))} />)}
        <Btn label={<Equal size={22} />} onClick={calculate} className="row-span-2 bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-95" />

        <Btn label="0" onClick={() => handleNumber('0')} className="col-span-2" />
        <Btn label="." onClick={() => handleNumber('.')} />
      </div>

      <p className="mt-8 text-[8px] font-bold text-center text-white/20 uppercase tracking-[0.3em] italic">
        Mathematical Precision Node • Standard Numerals Active
      </p>
    </div>
  );
};
