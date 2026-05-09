import { SymptomForm, RiskLevel, PatientRecord, MalnutritionForm, AppetiteLevel } from '../types';

export const calculateTriageScore = (form: SymptomForm) => {
  let score = 0;

  // Fever
  if (form.fever === 'mild') score += 15;
  if (form.fever === 'severe') score += 40;

  // Cough
  if (form.cough === 'mild') score += 10;
  if (form.cough === 'severe') score += 20;

  // Breathing Difficulty (High Risk)
  if (form.breathingDifficulty) score += 50;

  // Fatigue
  if (form.fatigue === 'medium') score += 10;
  if (form.fatigue === 'high') score += 20;

  // Appetite
  if (form.appetite === 'reduced') score += 10;
  if (form.appetite === 'poor') score += 25;

  // Age factor
  if (form.age < 5 || form.age > 65) score += 10;

  return Math.min(100, score);
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
};

export const identifyLikelyConditions = (form: SymptomForm) => {
  const conditions: string[] = [];

  if (form.fever !== 'none') {
    conditions.push('Malaria risk');
  }

  if (form.cough !== 'none' || form.breathingDifficulty) {
    conditions.push('Pneumonia/Respiratory infection risk');
  }

  if (form.appetite === 'poor' || form.fatigue === 'high') {
    conditions.push('General infection risk');
  }
  
  if (form.appetite === 'poor' && form.fever === 'severe') {
    conditions.push('Dehydration risk');
  }

  return conditions;
};

export const getRecommendedActions = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case 'high':
      return ['Urgent hospital referral', 'Immediate medical stabilization', 'Continuous monitoring'];
    case 'moderate':
      return ['Visit clinic within 24 hours', 'Rest and hydration', 'Follow-up call in 48 hours'];
    case 'low':
      return ['Home care', 'Monitor for 3 days', 'Return if symptoms worsen'];
    default:
      return ['Home care'];
  }
};

export const calculateMalnutritionRisk = (form: MalnutritionForm) => {
  let score = 0;
  
  // BMI-like check (Simplified for rural prototype)
  // Normal weight for age varies, but let's use weighted factors
  if (form.weight < (form.height - 100) * 0.7) score += 40;
  if (form.appetite === 'poor') score += 30;
  if (form.appetite === 'reduced') score += 15;
  if (form.visibleWeakness) score += 30;
  
  return Math.min(100, score);
};

export const getMalnutritionLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
};

export const detectOutbreak = (recentRecords: PatientRecord[]) => {
  const windowMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  const recent = recentRecords.filter(r => now - r.timestamp < windowMs);

  const feverCases = recent.filter(r => r.symptoms.fever !== 'none').length;
  const respiratoryCases = recent.filter(r => r.symptoms.cough !== 'none' || r.symptoms.breathingDifficulty).length;
  const diarrheaCases = recent.filter(r => r.symptoms.additionalSymptoms.toLowerCase().includes('diarrhea') || r.symptoms.appetite === 'poor').length;
  
  const total = recent.length;
  if (total < 5) return null; // Not enough data

  if (feverCases / total > 0.6) return { type: 'Febrile', severity: 'high', count: feverCases };
  if (respiratoryCases / total > 0.5) return { type: 'Respiratory', severity: 'medium', count: respiratoryCases };
  if (diarrheaCases / total > 0.4) return { type: 'Waterborne', severity: 'medium', count: diarrheaCases };

  return null;
};
