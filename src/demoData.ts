// src/demoData.ts
export type TacticalAudit = {
  area: string
  generatedAt: string
  executiveSummary: string
  signals: Array<{ title: string; insight: string; impact: "High" | "Medium" | "Low" }>
  opportunities: Array<{ title: string; whyNow: string; nextStep: string; confidence: number }>
  risks: Array<{ title: string; mitigation: string }>
  recommendedActions: Array<{ owner: string; action: string; timeframe: string }>
  metrics: Array<{ label: string; value: number }>
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const jitter = (n: number, maxDelta: number) => Math.max(0, Math.round(n + (Math.random() * 2 - 1) * maxDelta))

export function makeDemoAudit(area = "Central London"): TacticalAudit {
  const now = new Date().toISOString()

  const summaries = [
    "Footfall is strong and highly time-boxed, with demand peaking around commute and early evening windows. The biggest upside comes from aligning staffing to short, high-intensity surges and tightening pre-peak readiness.",
    "Demand patterns show clear weekday vs weekend behaviour. There is a measurable gap between service capacity and peak throughput that can be solved with role clarity, pre-batch, and small schedule shifts rather than adding headcount.",
    "Customer intent appears value-sensitive but responsive to clear bundles and fast fulfilment. Optimising runner/bar support during peak can lift conversion without increasing total labour hours."
  ]

  const signals = [
    { title: "Peak compression", insight: "Demand concentrates into shorter windows, increasing queue risk and ticket times.", impact: "High" as const },
    { title: "Bundle responsiveness", insight: "Clear add-ons and set menus increase attach rate during busy periods.", impact: "Medium" as const },
    { title: "Search intent seasonality", insight: "Queries cluster around lunch plans and post-work food; weekends shift to groups.", impact: "Medium" as const },
    { title: "Operational friction", insight: "Small handoffs (host→server, pass→runner) are the primary delay multipliers.", impact: "High" as const }
  ]

  const opportunities = [
    { title: "Rebalance pre-peak staffing", whyNow: "Peak starts earlier than scheduled coverage on 2–3 weekdays.", nextStep: "Move 1 FOH start time 30–45 mins earlier on Tue–Thu.", confidence: 84 },
    { title: "Runner support micro-shift", whyNow: "Runner bottleneck appears when orders spike, not all shift long.", nextStep: "Add a 2-hour runner micro-shift for peak windows only.", confidence: 78 },
    { title: "Menu attach script", whyNow: "High intent for quick decisions; scripts reduce hesitation.", nextStep: "Train a 10-second upsell line for top 2 add-ons.", confidence: 72 }
  ]

  const risks = [
    { title: "Overstaffing off-peak", mitigation: "Use micro-shifts and split roles to avoid idle time." },
    { title: "Queue abandonment", mitigation: "Add host cueing + order pre-reads during highest 30 mins." }
  ]

  const recommendedActions = [
    { owner: "GM", action: "Run 7-day test: shift 1 FOH start earlier on Tue–Thu", timeframe: "This week" },
    { owner: "Shift lead", action: "Introduce 2-hour runner micro-shift during peak window", timeframe: "Next 7 days" },
    { owner: "Team", action: "Pilot 2 add-on scripts + track attach rate", timeframe: "Next 14 days" }
  ]

  const metrics = [
    { label: "Forecasted peak orders/hr", value: jitter(74, 8) },
    { label: "Recommended peak FOH headcount", value: jitter(8, 1) },
    { label: "Queue risk index (0–100)", value: jitter(62, 10) },
    { label: "Expected labour efficiency gain %", value: jitter(9, 3) }
  ]

  return {
    area,
    generatedAt: now,
    executiveSummary: pick(summaries),
    signals: signals.sort(() => 0.5 - Math.random()).slice(0, 3),
    opportunities: opportunities.sort(() => 0.5 - Math.random()).slice(0, 3),
    risks,
    recommendedActions,
    metrics
  }
}
