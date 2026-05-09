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
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (records.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStrategicInsights(records, outbreak);
      if (data) {
        setInsights(data);
      } else {
        setError("Strategic analysis engine reported a connectivity issue. Please ensure your API keys are configured.");
      }
    } catch (err) {
      setError("An unexpected error occurred during synthesis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (records.length > 0 && !insights && !loading && !error) {
      fetchInsights();
    }
  }, [records, outbreak]);

  return (
    <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="relative z-10 p-8 flex flex-col h-full flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 ring-1 ring-white/20">
                <Cpu size={24} />
             </div>
             <div>
                <h2 className="text-[16px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  HealthGuard <span className="text-emerald-400">Strategos</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Intelligence Active</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={fetchInsights} 
              disabled={loading}
              className="text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 px-4 h-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Refresh Analysis
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative p-6 bg-slate-800 rounded-2xl border border-white/5">
                  <Sparkles size={40} className="text-emerald-400 animate-bounce" />
                </div>
              </div>
              <div className="max-w-xs space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-[0.15em]">Synthesizing Rural Health Data</p>
                <p className="text-[10px] text-slate-500 font-medium italic">Performing cross-vector analysis of clinical records and regional reports...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-20"
            >
              <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 mb-2">
                <ShieldAlert size={32} className="text-rose-500" />
              </div>
              <p className="text-sm font-bold text-rose-200 max-w-sm">{error}</p>
              <Button onClick={fetchInsights} variant="outline" className="text-slate-400 border-slate-700 hover:text-white">Retry Analysis</Button>
            </motion.div>
          ) : insights ? (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 space-y-8"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-75 transition duration-1000 group-hover:opacity-100" />
                <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl">
                  <p className="text-sm font-medium text-slate-200 leading-relaxed italic border-l-2 border-emerald-500 pl-4 py-1">
                    "{insights.summary}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <ShieldAlert size={16} className="text-rose-500" />
                    <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Critical Intelligence Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {insights.criticalAlerts.map((alert: string, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex gap-4 items-start p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl group hover:bg-rose-500/10 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        <span className="text-xs font-bold text-rose-50/90 leading-snug">{alert}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <Target size={16} className="text-emerald-500" />
                    <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Strategic Problem Solving Matrix</h3>
                  </div>
                  <div className="space-y-4">
                    {insights.strategicPlan.map((plan: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                          <span>{plan.title}</span>
                          <div className="w-0 group-hover:w-16 h-px bg-emerald-500/50 transition-all duration-500" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-200 leading-normal">
                          {plan.action}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 group cursor-help">
                   <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
                      <Box size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Clinic Resource Optimization AI</div>
                        <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-black px-1.5 py-0">DEPLOYED</Badge>
                      </div>
                      <p className="text-[12px] font-medium text-slate-400 italic leading-relaxed">{insights.resourceOptimization}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20"
            >
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                 <Target size={32} className="text-slate-700" />
              </div>
              <div className="max-w-xs">
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Waiting for Data Feed</p>
                <p className="text-[10px] text-slate-700 italic mt-1">Submit patient triage records to generate strategic intelligence.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
