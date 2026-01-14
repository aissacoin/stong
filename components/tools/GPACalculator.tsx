
import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Info, BookOpen, Target, ShieldCheck, Award, Calculator, Settings2, Check } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  hours: number;
}

const GRADE_VALUES: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export const GPACalculator: React.FC = () => {
  const [scale, setScale] = useState<4 | 5>(4);
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', hours: 3 },
    { id: '2', name: '', grade: 'B', hours: 3 }
  ]);
  const [result, setResult] = useState<number>(0);

  // Force Standard Numerals Protocol (1234567890)
  const toStd = (n: number | string) => {
    return String(n).replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalHours = 0;

    courses.forEach(c => {
      const gradeValue = GRADE_VALUES[c.grade] || 0;
      const normalizedValue = scale === 5 ? (gradeValue === 0 ? 0 : gradeValue + 1) : gradeValue;
      totalPoints += normalizedValue * c.hours;
      totalHours += c.hours;
    });

    setResult(totalHours > 0 ? totalPoints / totalHours : 0);
  };

  useEffect(() => {
    calculateGPA();
  }, [courses, scale]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: 'A', hours: 3 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    let finalValue = value;
    if (field === 'hours') {
      // Apply numeral sanitation to hours input
      finalValue = parseFloat(toStd(value)) || 0;
    }
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: finalValue } : c));
  };

  return (
    <div className="space-y-20">
      {/* TOOL INTERFACE */}
      <div className="bg-[#0a0a0a] border border-[var(--accent)]/30 rounded-[3rem] p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden selection:bg-[var(--accent)] selection:text-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
              <GraduationCap size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Academic GPA Architect</h2>
              <p className="text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.4em]">Scholarly Performance Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
             <Check size={14} className="text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 tabular-nums">1234567890 Numerals Enforced</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Courses List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center px-2">
               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Course Registry</label>
               <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setScale(4)}
                  className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${scale === 4 ? 'bg-[var(--accent)] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  4.0 Scale
                </button>
                <button 
                  onClick={() => setScale(5)}
                  className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${scale === 5 ? 'bg-[var(--accent)] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  5.0 Scale
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-3 group items-center animate-in slide-in-from-left-2 duration-300">
                  <div className="col-span-6">
                    <input 
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="Course Name (Optional)"
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-[var(--accent)]/40 transition-all shadow-inner italic"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-xl px-3 py-3 text-xs font-black uppercase text-[var(--accent)] outline-none cursor-pointer"
                    >
                      {Object.keys(GRADE_VALUES).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="text"
                      value={course.hours}
                      onChange={(e) => updateCourse(course.id, 'hours', e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none text-center tabular-nums"
                      placeholder="Hrs"
                    />
                  </div>
                  <div className="col-span-1">
                    <button 
                      onClick={() => removeCourse(course.id)}
                      className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-40 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={addCourse}
              className="w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Course Entry
            </button>
          </div>

          {/* Result Display */}
          <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-[20deg]">
              <Calculator size={200} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] mb-2 italic">Calculated GPA</div>
              <div className="text-7xl font-black text-white italic tracking-tighter text-glow tabular-nums">
                {toStd(result.toFixed(2))}
              </div>
              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                System: {scale}.0 Scale Registry
              </div>
              <div className="pt-6">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] transition-all duration-1000" 
                    style={{ width: `${(result/scale)*100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <ShieldCheck size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">1234567890 Precision Formatting Active</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
             <Award size={20} className="text-[var(--accent)]" />
             <p className="text-[9px] font-black uppercase tracking-widest leading-loose italic">Scholarly Merit Protocol Calibration</p>
           </div>
        </div>
      </div>

      {/* ACADEMIC CHART SECTION */}
      <div className="max-w-5xl mx-auto space-y-24 py-16 px-8 bg-white/[0.01] rounded-[4rem] border border-white/5">
        
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <BookOpen size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic text-glow">GPA Conversion Charts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 4.0 Chart */}
            <div className="space-y-6">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs border-b border-[var(--accent)]/20 pb-4">Standard 4.0 Scale</h4>
              <div className="grid grid-cols-3 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 border-b border-white/5 pb-2">
                <span>Grade</span>
                <span>Points</span>
                <span>Percent</span>
              </div>
              {[
                { g: 'A+', p: '4.0', r: '97-100' },
                { g: 'A', p: '4.0', r: '93-96' },
                { g: 'A-', p: '3.7', r: '90-92' },
                { g: 'B+', p: '3.3', r: '87-89' },
                { g: 'B', p: '3.0', r: '83-86' },
                { g: 'C+', p: '2.3', r: '77-79' },
                { g: 'D', p: '1.0', r: '65-66' },
                { g: 'F', p: '0.0', r: '< 65' },
              ].map(row => (
                <div key={row.g} className="grid grid-cols-3 text-sm py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all italic tabular-nums">
                  <span className="text-white font-black">{row.g}</span>
                  <span className="text-[var(--accent)]">{toStd(row.p)}</span>
                  <span className="text-gray-500">{toStd(row.r)}%</span>
                </div>
              ))}
            </div>

            {/* 5.0 Chart */}
            <div className="space-y-6">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs border-b border-[var(--accent)]/20 pb-4">Standard 5.0 Scale</h4>
              <div className="grid grid-cols-3 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 border-b border-white/5 pb-2">
                <span>Grade</span>
                <span>Points</span>
                <span>Definition</span>
              </div>
              {[
                { g: 'A+', p: '5.0', d: 'Exceptional' },
                { g: 'A', p: '4.75', d: 'Excellent' },
                { g: 'B+', p: '4.5', d: 'Very Good' },
                { g: 'B', p: '4.0', d: 'Good' },
                { g: 'C+', p: '3.5', d: 'Fair' },
                { g: 'C', p: '3.0', d: 'Satisfactory' },
                { g: 'D+', p: '2.5', d: 'Pass' },
                { g: 'F', p: '0.0', d: 'Fail' },
              ].map(row => (
                <div key={row.g} className="grid grid-cols-3 text-sm py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all italic tabular-nums">
                  <span className="text-white font-black">{row.g}</span>
                  <span className="text-[var(--accent)]">{toStd(row.p)}</span>
                  <span className="text-gray-500">{row.d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Info size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Calculating Academic Success</h3>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed italic">
            A Grade Point Average (GPA) is a number that indicates how high you scored in your courses on average. It's meant to grade you (usually on a GPA scale between 1.0 and 4.0 or 5.0) during your studies and shows whether your overall grades have been high or low. This number is used to assess whether you meet the standards and expectations set by the degree program or university.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Target size={24} />
            </div>
            <h3 className="text-3xl font-black text-white font-serif-scholarly italic">Strategic Significance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">University Admissions</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Your GPA is a critical factor for entry into competitive graduate programs and international universities.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Scholarship Eligibility</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Maintaining a high GPA often serves as the primary gateway for merit-based financial aid and academic grants.</p>
            </div>
            <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4 hover:border-[var(--accent)]/30 transition-colors">
              <h4 className="text-[var(--accent)] font-black uppercase tracking-widest text-xs">Career Foundations</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Top-tier global employers frequently utilize GPA thresholds for entry-level recruitment in prestigious sectors.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
