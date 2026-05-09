import { GoogleGenAI, Type } from "@google/genai";
import { PatientRecord, Outbreak } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function getStrategicInsights(records: PatientRecord[], outbreak: Outbreak | null) {
  const prompt = `
    Analyze the following rural health clinic data and provide a high-level strategic problem-solving plan.
    Current Records: ${JSON.stringify(records.slice(-10))}
    Active Outbreak: ${outbreak ? JSON.stringify(outbreak) : 'None detected'}

    Format your response in JSON with the following structure:
    {
      "summary": "Brief executive summary of the current health landscape",
      "criticalAlerts": ["Alert 1", "Alert 2"],
      "strategicPlan": [
        { "title": "Priority 1", "action": "Specific problem solving action" },
        { "title": "Priority 2", "action": "Specific problem solving action" }
      ],
      "resourceOptimization": "How to best use limited resources (meds, staff, etc)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  action: { type: Type.STRING }
                }
              }
            },
            resourceOptimization: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini strategic insight error:", error);
    return null;
  }
}

export async function generateHealthInsight(record: PatientRecord) {
  const prompt = `
    Conduct a clinical reasoning analysis for the following triage record:
    Age: ${record.age}
    Symptoms: ${JSON.stringify(record.symptoms)}
    Likely Conditions: ${record.likelyConditions.join(', ')}
    Risk Level: ${record.riskLevel}

    Format your response in JSON:
    {
      "summary": "High-level diagnostic summary",
      "riskExplanation": "Why this risk level was assigned",
      "nextSteps": ["Step 1", "Step 2", "Step 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            riskExplanation: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini insight error:", error);
    return null;
  }
}
