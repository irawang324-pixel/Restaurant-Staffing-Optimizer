import React from 'react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose, appUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">User <span className="text-indigo-600">Manual</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <section className="space-y-8">
            <div>
              <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-4">Core Operational Logic</h3>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>This system utilizes **"Historical Correlation Analysis"** to optimize staffing. It tracks your <span className="font-bold text-slate-900">ASPH (Average Spend Per Head)</span> and <span className="font-bold text-slate-900">Rev/Staff (Revenue per Staff member)</span> to find the sweet spot between service quality and labor cost.</p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-xs text-slate-900 mb-2 uppercase">Staffing Benchmarks:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><b>Lunch:</b> Standardized at 1 FOH staff per 25 covers.</li>
                    <li><b>Dinner:</b> Premium service mode, 1 FOH staff per 30-35 covers depending on complexity.</li>
                    <li><b>AI Adjustments:</b> The Footfall Index factors in local weather and events to fine-tune these estimates.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-4">Operational Best Practices</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { t: 'Daily Reconciliation', d: 'Ensure the duty manager logs "Actuals" at the end of every shift. High-quality historical data is the foundation of accurate future predictions.' },
                  { t: 'Roster Planning', d: 'When creating next week\'s schedule, check the target dates in AuraOps. Adjust staff levels based on the AI-predicted footfall and bookings.' },
                  { t: 'Anomaly Alerts', d: 'If a prediction shows "Understaffed," consider calling in a part-timer or lowering the reservation cap for that specific window.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.t}</h4>
                      <p className="text-xs text-slate-500">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">System Integration (Embed Code)</h3>
              <p className="text-[10px] text-slate-500 mb-4">To integrate this tool into your central management portal or Notion workspace, use the following code:</p>
              <div className="bg-slate-900 p-4 rounded-xl relative group">
                <code className="text-[10px] text-indigo-300 break-all leading-tight">
                  {`<iframe src="${appUrl}" width="100%" height="800px" frameborder="0"></iframe>`}
                </code>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};