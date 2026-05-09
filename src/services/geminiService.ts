import { GoogleGenAI } from "@google/genai";
import { PatientRecord, HealthInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateHealthInsight(record: PatientRecord): Promise<HealthInsight> {
  const prompt = `
    As a medical decision support assistant for community health workers in rural settings, analyze this patient record:
    Age: ${record.age}
    Symptoms: Fever ${record.symptoms.fever}, Cough ${record.symptoms.cough}, Breathing Difficulty: ${record.symptoms.breathingDifficulty ? 'Yes' : 'No'}, Fatigue: ${record.symptoms.fatigue}, Appetite: ${record.symptoms.appetite}
    Additional Notes: ${record.notes || 'None'}
    Risk Level: ${record.riskLevel} (${record.riskScore}/100)
    Likely Risk Categories: ${record.likelyConditions.join(', ')}

    Provide a summary in simple, human-friendly language. 
    Explain the possible risk clearly.
    Suggest next steps for the health worker.
    
    IMPORTANT: Do NOT provide a diagnosis. Ensure the tone is supportive and clear. Keep it short.
    Return the response in JSON format matching this schema:
    {
      "summary": "string",
      "riskExplanation": "string",
      "nextSteps": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text) as HealthInsight;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return {
      summary: "Unable to generate AI insight at this moment.",
      riskExplanation: "The system encountered an error analyzing the record.",
      nextSteps: ["Proceed with standard triage protocols.", "Consult with a supervisor if unsure."]
    };
  }
}
