import { useState, useEffect } from 'react';
import { Card, Badge, Button } from './UI';
import { PatientRecord, Outbreak } from '../types';
import { getStrategicInsights } from '../services/geminiService';
import { Sparkles, ShieldAlert, Cpu, Target, Box, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIStrategicAdvisorProps {
  records: PatientRecord[];
  outbreak: Outbreak | null;
}

export default function AIStrategicAdvisor({ records, outbreak }: AIStrategicAdvisorProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await getStrategicInsights(records, outbreak);
    if (data) setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    if (records.length > 0 && !insights) {
      fetchInsights();
    }
  }, [records, outbreak]);

  return (
    <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group min-h-[400px]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -ml-24 -mb-24" />
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Cpu size={20} />
             </div>
             <div>
                <h2 className="text-[14px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  AI Strategic Advisor
                </h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Neural Engine Active</span>
                </div>
             </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={fetchInsights} 
            disabled={loading}
            className="text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12"
            >
              <div className="p-4 bg-emerald-500/10 rounded-full">
                <Sparkles size={32} className="text-emerald-500 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-widest">Synthesizing Clinic Context</p>
                <p className="text-xs text-slate-500 italic mt-1">Cross-referencing symptoms with regional outbreak signatures...</p>
              </div>
            </motion.div>
          ) : insights ? (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 space-y-6"
            >
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                 <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                   "{insights.summary}"
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={14} /> Critical Vulnerabilities
                  </h3>
                  <div className="space-y-2">
                    {insights.criticalAlerts.map((alert: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start p-2 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                        <div className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span className="text-[11px] font-bold text-rose-200">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> Problem Solving Matrix
                  </h3>
                  <div className="space-y-3">
                    {insights.strategicPlan.map((plan: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{plan.title}</div>
                        <div className="text-xs font-semibold text-slate-200 border-l border-emerald-500/50 pl-2 leading-snug">
                          {plan.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Box size={16} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resource Optimization AI</div>
                      <p className="text-[11px] font-medium text-slate-300 italic">{insights.resourceOptimization}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs italic">
              Record patient data to trigger strategic AI analysis.
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
