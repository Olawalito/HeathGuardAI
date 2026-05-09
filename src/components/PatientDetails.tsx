import { Card, Badge, Button } from './UI';
import { PatientRecord, HealthInsight } from '../types';
import { AlertTriangle, Clock, ArrowRight, User, ClipboardList, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateHealthInsight } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface PatientDetailsProps {
  record: PatientRecord;
  onClose: () => void;
}

export default function PatientDetails({ record, onClose }: PatientDetailsProps) {
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    try {
      const res = await generateHealthInsight(record);
      setInsight(res);
    } finally {
      setLoading(false);
    }
  };

  const riskColors = {
    high: 'text-red-600 bg-red-50',
    moderate: 'text-amber-600 bg-amber-50',
    low: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
        >
          <User size={24} className="rotate-45" />
        </button>

        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge variant={record.riskLevel === 'high' ? 'error' : record.riskLevel === 'moderate' ? 'warning' : 'success'}>
                  {record.riskLevel} RISK
                </Badge>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={14} /> {new Date(record.timestamp).toLocaleString()}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Triage Assessment Result</h2>
              <p className="text-slate-500">Patient ID: {record.id.slice(0, 8)} • Age: {record.age}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase">Score</div>
                <div className={`text-3xl font-black ${record.riskScore >= 70 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {record.riskScore}<span className="text-sm opacity-50">/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                  <AlertTriangle size={16} /> Possible Condition Risks
                </h3>
                <div className="space-y-2">
                  {record.likelyConditions.map((condition, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-slate-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                  <ShieldAlert size={16} /> Recommended Actions
                </h3>
                <div className="space-y-2">
                  {record.recommendedActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-emerald-950 text-emerald-50 p-6 rounded-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <Sparkles size={20} className="text-emerald-400" /> AI-Powered Health Insight
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    {!insight ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-emerald-200/80 leading-relaxed">
                          Our AI can analyze symptoms to provide deeper understanding and tailored guidance for health workers.
                        </p>
                        <Button 
                          onClick={handleGetInsight} 
                          disabled={loading}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950"
                        >
                          {loading ? (
                            <>Generating Insight... <Loader2 size={18} className="animate-spin" /></>
                          ) : (
                            <>Unlock AI Insight <ArrowRight size={18} /></>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Summary</p>
                          <p className="text-sm leading-relaxed">{insight.summary}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Risk Context</p>
                          <p className="text-sm leading-relaxed opacity-90">{insight.riskExplanation}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Suggested Next Steps</p>
                          <ul className="space-y-2">
                            {insight.nextSteps.map((step, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-emerald-400 mt-1">•</span> {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-800/30 rounded-full blur-3xl" />
              </div>

              {record.malnutritionRisk && (
                <div className={`p-6 rounded-2xl border ${record.malnutritionRisk === 'high' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                   <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                     <ClipboardList size={16} /> Malnutrition Assessment
                   </h3>
                   <div className="flex items-center justify-between">
                     <span className="font-bold text-slate-700">Risk Level:</span>
                     <Badge variant={record.malnutritionRisk === 'high' ? 'error' : record.malnutritionRisk === 'moderate' ? 'warning' : 'success'}>
                       {record.malnutritionRisk}
                     </Badge>
                   </div>
                   <p className="text-[11px] text-slate-500 mt-2 font-medium italic">
                     {record.malnutritionRisk === 'high' ? 'Urgent nutritional intervention required. Prioritize protein-rich supplements.' : 'Stable. Monitor weight-for-height trends monthly.'}
                   </p>
                </div>
              )}

              <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-12 -mt-12 group-hover:bg-rose-500/20 transition-all" />
                 <h3 className="text-[10px] font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
                   <ShieldAlert size={14} className="text-rose-500" /> Prevention & Home Care
                 </h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-rose-500 uppercase italic">Primary Directive</p>
                      <p className="text-xs font-medium leading-relaxed opacity-90 border-l border-rose-500/50 pl-3">
                        Ensure patient maintains hydration. If waterborne risk is suspected, use only boiled or treated water. Avoid communal feeding during recovery.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-emerald-500 uppercase italic">Prevention Goal</p>
                      <ul className="text-[11px] font-medium space-y-1.5 opacity-80">
                         <li className="flex items-start gap-2">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                           Regular handwashing with soap (min 20s)
                         </li>
                         <li className="flex items-start gap-2">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                           Isolation of laundry and bedding if fever persists
                         </li>
                      </ul>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
