import React, { useState, useMemo } from 'react';
import { SalesRecord, AIRecommendation } from '../types.ts';
import { getAIStaffingAdvice } from '../services/geminiService.ts';

interface AIAdvisorProps {
  history: SalesRecord[];
  location: string;
  targetDate: string;
  currentBookings: number;
  onAIResult?: (result: AIRecommendation) => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ history, location, targetDate, currentBookings, onAIResult }) => {
  const [advice, setAdvice] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsultAI = async () => {
    if (!location) {
      alert("Please specify venue location for grounding.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getAIStaffingAdvice(history, location, targetDate, currentBookings);
      setAdvice(result);
      if (onAIResult) onAIResult(result);
    } catch (err: any) {
      // 處理配額用盡 (429) 或頻率限制錯誤
      if (err.message.includes('429') || err.message.toLowerCase().includes('quota') || err.message.includes('exhausted')) {
        setError("AI Engine Cooling Down: You've reached the free tier limit. Please wait 60 seconds.");
      } else {
        setError(err.message || "Consultation failed. Check console for details.");
      }
      console.error("Diagnostic Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '•').trim();
  };

  const parsedSections = useMemo(() => {
    if (!advice) return null;
    const raw = advice.rawResponse;
    const weatherRaw = raw.split('[WEATHER]')[1]?.split('[TRANSPORT]')[0] || "";
    const transportRaw = raw.split('[TRANSPORT]')[1]?.split('[EVENTS]')[0] || "";
    const eventsRaw = raw.split('[EVENTS]')[1]?.split('[ADVICE]')[0] || "";
    const adviceRaw = raw.split('[ADVICE]')[1] || "";

    return {
      weather: cleanText(weatherRaw),
      transport: cleanText(transportRaw),
      events: cleanText(eventsRaw),
      advice: cleanText(adviceRaw)
    };
  }, [advice]);

  const Card = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col h-full shadow-sm hover:border-indigo-200 transition-all">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-indigo-500">
        {icon}
      </div>
      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">{title}</h4>
      <div className="text-[12px] font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">
        {content || "Consult engine for insights..."}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden mt-12">
      <div className="bg-slate-900 px-12 py-16 text-white relative">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black tracking-tighter mb-6">Strategic <span className="text-indigo-400">Tactical</span> Report</h2>
            <p className="text-slate-400 text-xl font-medium">Contextual Grounding for <span className="text-white font-bold">{location}</span></p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleConsultAI} 
              disabled={loading} 
              className="px-12 py-6 bg-white text-slate-900 font-black rounded-3xl transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-50 shadow-xl active:scale-95 group"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-indigo-600 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing Aura Intelligence...
                </span>
              ) : "Consult Aura Intelligence"}
            </button>
            {error && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {parsedSections && (
        <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-white">
          <Card title="Weather" content={parsedSections.weather} icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} />
          <Card title="Transport" content={parsedSections.transport} icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
          <Card title="Local Events" content={parsedSections.events} icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <Card title="Staff Strategy" content={parsedSections.advice} icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        </div>
      )}
    </div>
  );
};