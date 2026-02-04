
export interface SalesRecord {
  id: string;
  date: string;
  sales: number;
  fohStaff: number;
  covers: number;
  reservations: number;
  walkins: number;
  shift: 'Lunch' | 'Dinner';
  avgWage?: number; // Optional hourly wage for cost calc
}

export interface ShiftPrediction {
  predictedSales: number;
  predictedCovers: number;
  predictedWalkins: number;
  suggestedStaff: number;
  status: 'Understaffed' | 'Optimal' | 'Surplus';
  peakTime: string;
  estSPLH: number; // Sales Per Labor Hour
}

export interface DailyPrediction {
  lunch: ShiftPrediction;
  dinner: ShiftPrediction;
  totalCovers: number;
  totalSales: number;
}

export interface AIRecommendation {
  rawResponse: string;
  sources: { title: string; uri: string }[];
  footfallIndex: number;
}
