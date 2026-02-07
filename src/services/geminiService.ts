
import { GoogleGenAI } from "@google/genai";
import { SalesRecord } from "../types.ts";

export const getAIStaffingAdvice = async (history: SalesRecord[], location: string, targetDate: string, bookings: number) => {
  // Vite 在打包時會將此處替換為真正的字串
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.length < 5) {
    throw new Error(
      "API_KEY is not configured. Please add it to your GitHub Secrets and re-deploy."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const dateObj = new Date(targetDate);
  const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(dateObj);

  const prompt = `
    Role: Strategic Operations Consultant for Hospitality.
    Location: "${location}"
    Service Date: ${targetDate} (${dayName})
    Current Bookings: ${bookings} guests.

    Task: Use Google Search to analyze real-time local events, weather, and transport disruptions.
    Provide a concise tactical report for the manager.

    CRITICAL: You MUST end with this tag: [FOOTFALL_INDEX: X.X] 
    (1.0 is normal, 1.2 is 20% busier, 0.8 is 20% quieter).

    Report Sections:
    [WEATHER]
    [TRANSPORT]
    [EVENTS]
    [ADVICE] (FOH Staffing recommendation)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const indexMatch = text.match(/\[FOOTFALL_INDEX:\s*(\d+\.?\d*)\]/);
    const footfallIndex = indexMatch ? parseFloat(indexMatch[1]) : 1.0;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s): s is { title: string; uri: string } => s !== null);

    return {
      rawResponse: text.replace(/\[FOOTFALL_INDEX:.*?\]/g, '').trim(),
      sources: sources.slice(0, 5),
      footfallIndex
    };
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message || "AI Synchronization failed.");
  }
};
