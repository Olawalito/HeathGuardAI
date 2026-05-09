
export type FeverLevel = 'none' | 'mild' | 'severe';
export type CoughLevel = 'none' | 'mild' | 'severe';
export type Level = 'low' | 'medium' | 'high';
export type AppetiteLevel = 'good' | 'reduced' | 'poor';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface SymptomForm {
  age: number;
  fever: FeverLevel;
  cough: CoughLevel;
  breathingDifficulty: boolean;
  fatigue: Level;
  appetite: AppetiteLevel;
  additionalSymptoms: string;
}

export interface MalnutritionForm {
  age: number; // in months
  weight: number; // kg
  height: number; // cm
  appetite: AppetiteLevel;
  visibleWeakness: boolean;
}

export interface PatientRecord {
  id: string;
  timestamp: number;
  age: number;
  symptoms: SymptomForm;
  malnutrition?: MalnutritionForm;
  riskScore: number;
  riskLevel: RiskLevel;
  likelyConditions: string[];
  recommendedActions: string[];
  notes?: string;
  malnutritionScore?: number;
  malnutritionRisk?: RiskLevel;
}

export interface Outbreak {
  id: string;
  type: 'Respiratory' | 'Febrile' | 'Waterborne' | 'Rodent-associated' | 'Unknown';
  severity: Level;
  detectedAt: number;
  evidence: {
    feverCount: number;
    respiratoryCount: number;
    diarrheaCount: number;
    totalRecentCases: number;
  };
}

export interface HealthInsight {
  summary: string;
  riskExplanation: string;
  nextSteps: string[];
}
