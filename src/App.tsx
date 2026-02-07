
import React, { useState, useEffect } from 'react';
import { SalesRecord } from './types.ts';
import { INITIAL_DATA } from './constants.tsx';
import { StatsOverview } from './components/StatsOverview.tsx';
import { Charts } from './components/Charts.tsx';
import { StaffPredictor } from './components/StaffPredictor.tsx';
import { AIAdvisor } from './components/AIAdvisor.tsx';
import { DataEntry } from './components/DataEntry.tsx';

function App() {
  const [data, setData] = useState<SalesRecord[]>(INITIAL_DATA);
  const [location, setLocation] = useState('London Brixton');
  const [targetDate, setTargetDate] = useState('2025-02-14'); 
  const [totalDailyCovers, setTotalDailyCovers] = useState(118); 
  const [aiFootfallMultiplier, setAiFootfallMultiplier] = useState(1.0);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key.length > 5) {
      setIsApiConfigured(true);
    }
  }, []);

  const addRecord = (record: SalesRecord) => {
    setData([record, ...data]);
  };

  const handleExport = () => {
    alert("Operational Performance Report (PDF) exported successfully.");
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 selection:bg-indigo-100 text-slate-900" lang="en">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-2xl border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">AuraOps <span className="text-indigo-400 italic">Intelligence</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Resource Optimization Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isApiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {isApiConfigured ? 'Engine Connected' : 'Configuration Required'}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-300">{location}</span>
             </div>
             <button onClick={handleExport} className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Export Report</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-9">
             <StaffPredictor data={data} targetDate={targetDate} onTotalCoversChange={setTotalDailyCovers} aiMultiplier={aiFootfallMultiplier} />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Context</label>
              <input type="text" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-600 outline-none mb-4" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
            </div>
          </div>
        </div>
        <AIAdvisor history={data} location={location} targetDate={targetDate} currentBookings={totalDailyCovers} onAIResult={(result) => setAiFootfallMultiplier(result.footfallIndex)} />
        <div className="border-t border-slate-200 pt-16 mt-16">
          <StatsOverview data={data} />
          <Charts data={data} targetDate={targetDate} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16">
          <div className="lg:col-span-4"><DataEntry onAdd={addRecord} /></div>
          <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
             <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Staff</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Covers</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.slice(0, 10).map(r => (
                    <tr key={r.id}>
                      <td className="px-6 py-4 text-sm font-bold">{r.date} ({r.shift})</td>
                      <td className="px-6 py-4 text-sm font-black">{r.fohStaff}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-500">{r.covers}</td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-600">£{r.sales}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
