
import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PatientRecord, SymptomForm, MalnutritionForm, Outbreak } from './types';
import { calculateTriageScore, getRiskLevel, identifyLikelyConditions, getRecommendedActions, calculateMalnutritionRisk, getMalnutritionLevel } from './utils/healthLogic';
import TriageForm from './components/TriageForm';
import PatientDetails from './components/PatientDetails';
import SummaryCards from './components/SummaryCards';
import TrendChart from './components/TrendChart';
import PatientTable from './components/PatientTable';
import OutbreakGuidance from './components/OutbreakGuidance';
import { Card, Button } from './components/UI';
import OutbreakSurveillance from './components/OutbreakSurveillance';
import { Activity, Plus, LayoutDashboard, Search, Settings, Shield, Menu, X, Heart, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [records, setRecords] = useLocalStorage<PatientRecord[]>('health_records', []);
  const [view, setView] = useState<'dashboard' | 'form' | 'reports' | 'surveillance'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Logic to detect current outbreak status
  const currentOutbreak = useMemo(() => {
    const windowMs = 30 * 24 * 60 * 60 * 1000; // 30 days for easier simulation
    const now = Date.now();
    const recent = records.filter(r => now - r.timestamp < windowMs);
    
    // Simulations triggers:
    const fever = recent.filter(r => r.symptoms.fever === 'severe').length;
    const resp = recent.filter(r => r.symptoms.breathingDifficulty).length;
    const diarrhea = recent.filter(r => r.symptoms.additionalSymptoms.toLowerCase().includes('diarrhea')).length;

    if (fever >= 3) return { id: 'o1', type: 'Febrile', severity: 'high', detectedAt: now, evidence: { feverCount: fever, respiratoryCount: resp, diarrheaCount: diarrhea, totalRecentCases: recent.length } } as Outbreak;
    if (resp >= 3) return { id: 'o2', type: 'Respiratory', severity: 'medium', detectedAt: now, evidence: { feverCount: fever, respiratoryCount: resp, diarrheaCount: diarrhea, totalRecentCases: recent.length } } as Outbreak;
    if (diarrhea >= 2) return { id: 'o3', type: 'Waterborne', severity: 'high', detectedAt: now, evidence: { feverCount: fever, respiratoryCount: resp, diarrheaCount: diarrhea, totalRecentCases: recent.length } } as Outbreak;

    return null;
  }, [records]);

  const handleTriageSubmit = (symptomForm: SymptomForm, malnutritionForm?: MalnutritionForm) => {
    const riskScore = calculateTriageScore(symptomForm);
    const riskLevel = getRiskLevel(riskScore);
    
    let mScore, mRisk;
    if (malnutritionForm) {
      mScore = calculateMalnutritionRisk(malnutritionForm);
      mRisk = getMalnutritionLevel(mScore);
    }

    const newRecord: PatientRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      age: symptomForm.age,
      symptoms: symptomForm,
      malnutrition: malnutritionForm,
      riskScore,
      riskLevel,
      likelyConditions: identifyLikelyConditions(symptomForm),
      recommendedActions: getRecommendedActions(riskLevel),
      malnutritionScore: mScore,
      malnutritionRisk: mRisk,
    };

    setRecords([newRecord, ...records]);
    setSelectedRecord(newRecord);
    setView('dashboard');
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof view, icon: any, label: string }) => (
    <button
      onClick={() => { setView(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 p-2 transition-colors rounded text-[11px] font-bold uppercase tracking-tight ${
        view === id 
        ? 'bg-slate-800 text-white' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={14} className={view === id ? 'text-emerald-500' : ''} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* High Density Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold">H</div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            HealthGuard <span className="text-emerald-600">AI</span>
          </h1>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200 uppercase tracking-tighter">
            Rural Support Mode
          </span>
        </div>

        <div className="flex items-center space-x-6 text-[11px] font-bold uppercase tracking-tight">
          <div className="flex items-center text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></div>
            System Online
          </div>
          <div className="hidden md:flex items-center space-x-4 border-l border-slate-200 pl-4 text-right">
            <div className="flex flex-col items-end">
              <span className="text-slate-500 font-normal uppercase text-[9px]">Active Worker</span>
              <span className="text-slate-900">S. Musoke</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-48 bg-slate-900 flex flex-col shrink-0 text-slate-300 border-r border-slate-800 shadow-xl transition-transform duration-300 md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 flex justify-between items-center md:hidden border-b border-slate-800">
             <span className="font-bold text-[10px] uppercase text-slate-500">Navigation</span>
             <button onClick={() => setIsSidebarOpen(false)}><X size={18} /></button>
          </div>
          <nav className="p-2 flex-1 space-y-1">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Command Hub" />
            <NavItem id="reports" icon={Search} label="Registry" />
            <NavItem id="surveillance" icon={Shield} label="Surveillance" />
            
            <div className="pt-4 pb-2 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assessment</div>
            <button
               onClick={() => { setView('form'); setIsSidebarOpen(false); }}
               className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
            >
              <Plus size={14} />
              <span>New Entry</span>
            </button>
          </nav>
          
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Storage</span>
              <span className="text-emerald-500">Synced</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-emerald-600"></div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden gap-4">
          <div className="flex-1 flex flex-col overflow-auto gap-4 scroll-smooth">
            {view === 'dashboard' && (
              <>
                {currentOutbreak && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <OutbreakGuidance outbreak={currentOutbreak} />
                  </motion.div>
                )}
                
                <SummaryCards records={records} />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <TrendChart records={records} />
                  </div>
                  <div className="bg-slate-900 text-white rounded p-4 flex flex-col justify-center space-y-4 shadow-xl border border-slate-800 relative overflow-hidden group">
                     {/* Decorative pattern */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-600/20 transition-all" />
                     
                     <div className="relative z-10">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Assessment Engine</h3>
                       <p className="text-sm font-bold leading-tight">Ready for rapid triage in rural field units.</p>
                       <button 
                         onClick={() => setView('form')}
                         className="mt-4 w-full py-2.5 bg-emerald-600 text-white rounded font-black uppercase text-[9px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-[0.98]"
                       >
                         Start New Triage
                       </button>
                     </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0">
                  <PatientTable records={records} onView={setSelectedRecord} />
                </div>
              </>
            )}

            {view === 'form' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                   <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Input</h2>
                   <button onClick={() => setView('dashboard')} className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Back to Dashboard</button>
                </div>
                <div className="flex-1 overflow-auto">
                   <TriageForm onSubmit={handleTriageSubmit} />
                </div>
              </motion.div>
            )}

            {view === 'reports' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <PatientTable records={records} onView={setSelectedRecord} />
              </motion.div>
            )}

            {view === 'surveillance' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col gap-6">
                {currentOutbreak && <OutbreakGuidance outbreak={currentOutbreak} />}
                <OutbreakSurveillance records={records} />
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* High Density Footer */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 shrink-0 flex items-center px-6 justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tight">
        <div className="flex space-x-4">
          <span>Version 2.4.1-Stable</span>
          <span className="text-slate-700">|</span>
          <span>Health Protocol v4.0</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-500">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Secure Cloud Relay Active</span>
        </div>
      </footer>

      {/* Modal for patient details */}
      <AnimatePresence>
        {selectedRecord && (
          <PatientDetails 
            record={selectedRecord} 
            onClose={() => setSelectedRecord(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

