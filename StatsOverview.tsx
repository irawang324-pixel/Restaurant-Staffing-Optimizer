import React from 'react';
import { SalesRecord } from './types';

interface StatsOverviewProps {
  data: SalesRecord[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ data }) => {
  const calcStats = (items: SalesRecord[]) => {
    if (items.length === 0) return { revPerStaff: 0, coversPerStaff: 0, asph: 0 };
    const totalSales = items.reduce((acc, curr) => acc + curr.sales, 0);
    const totalStaff = items.reduce((acc, curr) => acc + curr.fohStaff, 0);
    const totalCovers = items.reduce((acc, curr) => acc + curr.covers, 0);
    return {
      revPerStaff: totalSales / (totalStaff || 1),
      coversPerStaff: totalCovers / (totalStaff || 1),
      asph: totalSales / (totalCovers || 1)
    };
  };

  const lunch = calcStats(data.filter(d => d.shift === 'Lunch'));
  const dinner = calcStats(data.filter(d => d.shift === 'Dinner'));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[ { t: 'Lunch Efficiency', s: lunch, c: 'text-indigo-600' }, { t: 'Dinner Efficiency', s: dinner, c: 'text-purple-600' } ].map((card, i) => (
        <div key={i} className="p-6 rounded-2xl border bg-white shadow-sm">
          <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${card.c}`}>{card.t}</h3>
          <div className="grid grid-cols-3 gap-4">
            {[['Rev/Staff', `£${card.s.revPerStaff.toFixed(0)}`], ['Cov/Staff', card.s.coversPerStaff.toFixed(1)], ['ASPH', `£${card.s.asph.toFixed(1)}`]].map(([l, v]) => (
              <div key={l}><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{l}</p><p className="text-xl font-black text-slate-800">{v}</p></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};