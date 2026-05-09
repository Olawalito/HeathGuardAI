import React, { useState } from 'react';
import { Card, Button } from './UI';
import { SymptomForm, FeverLevel, CoughLevel, Level, AppetiteLevel, MalnutritionForm } from '../types';
import { Activity, Thermometer, Wind, AlertCircle, Scale, Utensils, User } from 'lucide-react';

interface TriageFormProps {
  onSubmit: (form: SymptomForm, malnutrition?: MalnutritionForm) => void;
}

export default function TriageForm({ onSubmit }: TriageFormProps) {
  const [activeTab, setActiveTab] = useState<'triage' | 'malnutrition'>('triage');
  const [symptomForm, setSymptomForm] = useState<SymptomForm>({
    age: 0,
    fever: 'none',
    cough: 'none',
    breathingDifficulty: false,
    fatigue: 'low',
    appetite: 'good',
    additionalSymptoms: '',
  });

  const [malnutritionForm, setMalnutritionForm] = useState<MalnutritionForm>({
    age: 0,
    weight: 0,
    height: 0,
    appetite: 'good',
    visibleWeakness: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symptomForm, activeTab === 'malnutrition' ? malnutritionForm : undefined);
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === id ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
    >
      {label}
    </button>
  );

  const Label = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight flex items-center gap-1.5 mb-1">
      {Icon && <Icon size={12} className="text-slate-400" />} {children}
    </label>
  );

  const InputStyle = "w-full px-3 py-1.5 border border-slate-200 rounded text-xs font-bold outline-none focus:border-emerald-500 transition-colors";

  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <div className="flex border-b border-slate-200">
        <TabButton id="triage" label="Rapid Triage" />
        <TabButton id="malnutrition" label="Nutrition Check" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white/50">
        {activeTab === 'triage' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label icon={User}>Patient Age (Years)</Label>
                <input
                  type="number"
                  required
                  min="0"
                  className={InputStyle}
                  value={symptomForm.age || ''}
                  onChange={e => setSymptomForm({ ...symptomForm, age: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label icon={Thermometer}>Fever State</Label>
                <select
                  className={InputStyle}
                  value={symptomForm.fever}
                  onChange={e => setSymptomForm({ ...symptomForm, fever: e.target.value as FeverLevel })}
                >
                  <option value="none">CLINICALLY NORMAL</option>
                  <option value="mild">MILD FEBRILE</option>
                  <option value="severe">SEVERE FEVER</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label icon={Wind}>Cough Severity</Label>
                <select
                  className={InputStyle}
                  value={symptomForm.cough}
                  onChange={e => setSymptomForm({ ...symptomForm, cough: e.target.value as CoughLevel })}
                >
                  <option value="none">NONE</option>
                  <option value="mild">OCCASIONAL</option>
                  <option value="severe">PERSISTENT/SEVERE</option>
                </select>
              </div>
              <div>
                <Label>Fatigue Indicator</Label>
                <select
                  className={InputStyle}
                  value={symptomForm.fatigue}
                  onChange={e => setSymptomForm({ ...symptomForm, fatigue: e.target.value as Level })}
                >
                  <option value="low">LOW</option>
                  <option value="medium">MODERATE</option>
                  <option value="high">SYSTEMIC/HIGH</option>
                </select>
              </div>
            </div>

            <div className="p-2 bg-slate-100 border border-slate-200 rounded flex items-center gap-3 cursor-pointer select-none" onClick={() => setSymptomForm({ ...symptomForm, breathingDifficulty: !symptomForm.breathingDifficulty })}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-emerald-600"
                checked={symptomForm.breathingDifficulty}
                readOnly
              />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Respiratory Distress / Short Breath</span>
            </div>

            <div>
              <Label icon={Utensils}>Anorexia / Appetite Status</Label>
              <div className="grid grid-cols-3 gap-1">
                {(['good', 'reduced', 'poor'] as AppetiteLevel[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSymptomForm({ ...symptomForm, appetite: level })}
                    className={`py-1.5 px-2 text-[9px] font-black rounded border transition-all uppercase tracking-widest ${symptomForm.appetite === level ? 'bg-emerald-600 border-emerald-700 text-white shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Field Notes / Observation</Label>
              <textarea
                className={`${InputStyle} min-h-[60px] resize-none uppercase font-bold placeholder:font-normal placeholder:normal-case`}
                placeholder="e.g. visible dehydration, skin lesions, ocular pallor..."
                value={symptomForm.additionalSymptoms}
                onChange={e => setSymptomForm({ ...symptomForm, additionalSymptoms: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age (Months)</Label>
                <input
                  type="number"
                  required
                  className={InputStyle}
                  value={malnutritionForm.age || ''}
                  onChange={e => setMalnutritionForm({ ...malnutritionForm, age: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className={InputStyle}
                  value={malnutritionForm.weight || ''}
                  onChange={e => setMalnutritionForm({ ...malnutritionForm, weight: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height (cm)</Label>
                <input
                  type="number"
                  required
                  className={InputStyle}
                  value={malnutritionForm.height || ''}
                  onChange={e => setMalnutritionForm({ ...malnutritionForm, height: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label icon={Utensils}>Appetite</Label>
                <div className="grid grid-cols-3 gap-1">
                  {(['good', 'reduced', 'poor'] as AppetiteLevel[]).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setMalnutritionForm({ ...malnutritionForm, appetite: level })}
                      className={`py-1.5 px-2 text-[9px] font-black rounded border transition-all uppercase tracking-widest ${malnutritionForm.appetite === level ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-100 border border-slate-200 rounded flex items-center gap-3 cursor-pointer" onClick={() => setMalnutritionForm({ ...malnutritionForm, visibleWeakness: !malnutritionForm.visibleWeakness })}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-emerald-600"
                checked={malnutritionForm.visibleWeakness}
                readOnly
              />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Systemic Weakness / Wasting</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <Button type="submit" className="w-full h-10 text-xs shadow-lg shadow-emerald-500/10">
            Submit Assessment Record <Activity size={12} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
