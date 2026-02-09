import React, { useMemo, useState } from "react";
import type { SalesRecord, AIRecommendation } from "../services/types";
import { getAIStaffingAdvice } from "../services/geminiService";

/* -------------------- DEMO FALLBACK -------------------- */

const makeDemoSections = () => {
  const variants = [
    {
      environment:
        "Footfall is strong around commute + early evening. Peak demand compresses into short windows—queue risk rises fast if handoffs lag.",
      logistics:
        "Friction appears at pass → runner and table turns. Small pre-peak resets reduce drag during peak.",
      opportunities:
        "Start 1 FOH 30–45 mins earlier Tue–Thu, add a 2-hour runner micro-shift, pilot 2 add-on scripts.",
      tactical:
        "Run a 7-day test: tighter pre-peak checklist, dedicated runner for busiest 90 mins, track ticket time."
    },
    {
      environment:
        "Weekdays show lunch intent spikes; weekends skew to groups. Clear bundles speed decisions.",
      logistics:
        "Bottlenecks come in bursts. Micro-shifts outperform adding full headcount.",
      opportunities:
        "Peak-only support role, pre-batch top sellers, 10-second upsell line.",
      tactical:
        "Keep labour flat: reallocate into top 2 windows, monitor SPLH + wait time."
    }
  ];
  return variants[Math.floor(Math.random() * variants.length)];
};

/* -------------------- UTILITIES -------------------- */

const cleanText = (text: string) =>
  (text || "")
    .replace(/\r/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "•")
    .trim();

/**
 * Very tolerant parser:
 * - If tags exist → split
 * - If tags missing → dump everything into tactical
 */
const parseSections = (raw: string) => {
  const txt = cleanText(raw);

  const normalize = txt
    .replace(/\bENVIRONMENT\b\s*:/gi, "[ENVIRONMENT]")
    .replace(/\bLOGISTICS\b\s*:/gi, "[LOGISTICS]")
    .replace(/\bOPPORTUNITIES\b\s*:/gi, "[OPPORTUNITIES]")
    .replace(/\bTACTICAL_ADVICE\b\s*:/gi, "[TACTICAL_ADVICE]");

  const slice = (start: string, end?: string) => {
    const s = normalize.indexOf(start);
    if (s === -1) return "";
    const from = s + start.length;
    if (!end) return normalize.slice(from).trim();
    const e = normalize.indexOf(end, from);
    return e === -1 ? normalize.slice(from).trim() : normalize.slice(from, e).trim();
  };

  const environment = slice("[ENVIRONMENT]", "[LOGISTICS]");
  const logistics = slice("[LOGISTICS]", "[OPPORTUNITIES]");
  const opportunities = slice("[OPPORTUNITIES]", "[TACTICAL_ADVICE]");
  const tactical = slice("[TACTICAL_ADVICE]");

  if (!environment && !logistics && !opportunities && !tactical) {
    return {
      environment: "",
      logistics: "",
      opportunities: "",
      tactical: normalize
    };
  }

  return {
    environment,
    logistics,
    opportunities,
    tactical: tactical || normalize
  };
};

/* -------------------- COMPONENT -------------------- */

interface AIAdvisorProps {
  history: SalesRecord[];
  location: string;
  targetDate: string;
  currentBookings: number;
  onAIResult?: (result: AIRecommendation) => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  history,
  location,
  targetDate,
  currentBookings,
  onAIResult
}) => {
  const [advice, setAdvice] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConsultAI = async () => {
    if (!location) {
      alert("Please specify location.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getAIStaffingAdvice(
        history,
        location,
        targetDate,
        currentBookings
      );

      console.log("AI RESULT:", result);
      console.log("AI RAW:", result?.rawResponse);

      const raw = result?.rawResponse || "";

      if (!raw || raw.length < 20) {
        const demo = makeDemoSections();
        const demoResult: AIRecommendation = {
          rawResponse:
            `[ENVIRONMENT]\n${demo.environment}\n\n` +
            `[LOGISTICS]\n${demo.logistics}\n\n` +
            `[OPPORTUNITIES]\n${demo.opportunities}\n\n` +
            `[TACTICAL_ADVICE]\n${demo.tactical}\n`,
          sources: [],
          footfallIndex: 1
        };
        setAdvice(demoResult);
        onAIResult?.(demoResult);
        return;
      }

      setAdvice(result);
      onAIResult?.(result);

    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "AI service unavailable.");

      const demo = makeDemoSections();
      const demoResult: AIRecommendation = {
        rawResponse:
          `[ENVIRONMENT]\n${demo.environment}\n\n` +
          `[LOGISTICS]\n${demo.logistics}\n\n` +
          `[OPPORTUNITIES]\n${demo.opportunities}\n\n` +
          `[TACTICAL_ADVICE]\n${demo.tactical}\n`,
        sources: [],
        footfallIndex: 1
      };
      setAdvice(demoResult);
      onAIResult?.(demoResult);
    } finally {
      setLoading(false);
    }
  };

  const sections = useMemo(() => {
    if (!advice) return null;
    return parseSections(advice.rawResponse || "");
  }, [advice]);

  const InfoCard = ({
    title,
    content,
    color,
    icon
  }: {
    title: string;
    content: string;
    color: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
      <div className={`w-10 h-10 mb-4 rounded-xl flex items-center justify-center ${color} text-white`}>
        {icon}
      </div>
      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
        {title}
      </h5>
      <p className="text-xs text-slate-600 whitespace-pre-wrap">
        {content || "Analyzing signals…"}
      </p>
    </div>
  );

  return (
    <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-12 border border-slate-200">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black">
            Grounding <span className="text-indigo-600">Intelligence</span>
          </h2>
          <p className="text-slate-500">
            Live context analysis for <b>{location}</b>
          </p>
        </div>

        <button
          onClick={handleConsultAI}
          disabled={loading}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? "Syncing…" : "Fetch Tactical Audit"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {sections && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard title="Environment" content={sections.environment} color="bg-blue-500" icon={"☁️"} />
          <InfoCard title="Logistics" content={sections.logistics} color="bg-indigo-500" icon={"🧭"} />
          <InfoCard title="Opportunities" content={sections.opportunities} color="bg-amber-500" icon={"📈"} />
          <InfoCard title="GM Advice" content={sections.tactical} color="bg-emerald-500" icon={"🛡️"} />
        </div>
      )}
    </div>
  );
};
