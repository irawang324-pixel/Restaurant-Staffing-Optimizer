// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import type { SalesRecord } from "./types";

export type AISource = { title: string; uri: string };

export type AIStaffingAdviceResult = {
  rawResponse: string;
  sources: AISource[];
  footfallIndex: number;
};

/**
 * Gemini Service (Vite frontend)
 * - Reads key ONLY from: import.meta.env.VITE_API_KEY
 * - Never uses process.env
 * - Uses Google Search grounding when supported by the selected model/SDK
 */
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("API_KEY is not configured. Please check Vercel Environment Variables.");
}

const ai = new GoogleGenAI({ apiKey });

const extractText = (response: any): string => {
  // Defensive extraction across SDK response shapes
  return (
    response?.response?.text?.() ??
    response?.text ??
    response?.response?.text ??
    ""
  );
};

const extractSources = (response: any): AISource[] => {
  const chunks =
    response?.candidates?.[0]?.groundingMetadata?.groundingChunks ??
    response?.response?.candidates?.[0]?.groundingMetadata?.groundingChunks ??
    [];

  return (chunks as any[])
    .map((c) => (c?.web ? { title: c.web.title, uri: c.web.uri } : null))
    .filter((s): s is AISource => !!s)
    .slice(0, 5);
};

const extractFootfallIndex = (text: string): number => {
  const m = text.match(/\[FOOTFALL_INDEX:\s*(\d+\.?\d*)\]/);
  const n = m ? Number.parseFloat(m[1]) : 1.0;
  return Number.isFinite(n) ? n : 1.0;
};

const stripFootfallToken = (text: string): string =>
  text.replace(/\[FOOTFALL_INDEX:.*?\]/g, "").trim();

export const getAIStaffingAdvice = async (
  history: SalesRecord[],
  location: string,
  targetDate: string,
  bookings: number
): Promise<AIStaffingAdviceResult> => {
  const dateObj = new Date(targetDate);
  const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(dateObj);

  const prompt = `
Role: Senior Hospitality Operations Analyst
Goal: Provide staffing advice for a venue in "${location}" on ${targetDate} (${dayName}).
Current Bookings: ${bookings} guests.

Historical Context (JSON, truncated):
${JSON.stringify(history).slice(0, 12000)}

Analysis Tasks:
1. Use Google Search to check live weather forecasts for ${location} on that date.
2. Check for major local events (concerts, festivals, sports) near the venue.
3. Analyze transportation logistics (road closures, rail strikes, or high traffic expected).
4. Estimate the percentage change in "Walk-in" traffic based on these environmental factors.

MANDATORY FORMAT:
You must include a footfall index multiplier at the end: [FOOTFALL_INDEX: X.X]
- 1.0 = Baseline (Neutral)
- < 1.0 = Expected reduction (e.g., extreme storms, transport failure)
- > 1.0 = Expected surge (e.g., neighboring event, ideal weather)

Report Structure:
[ENVIRONMENT] Weather & Atmosphere analysis.
[LOGISTICS] Access & Transport considerations.
[OPPORTUNITIES] Revenue opportunities or risks.
[TACTICAL_ADVICE] Staffing adjustments for the GM.

Tone: Professional, data-driven, and sharp.
`.trim();

  try {
    const response: any = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.6,
      },
    });

    const text = extractText(response);
    const footfallIndex = extractFootfallIndex(text);
    const sources = extractSources(response);

    return {
      rawResponse: stripFootfallToken(text),
      sources,
      footfallIndex,
    };
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error?.message || "AI Service currently unavailable.");
  }
};
