import { useState } from 'react';
import { Card, Badge, Button } from './UI';
import { PatientRecord, Outbreak } from '../types';
import { AlertCircle, Shield, TrendingUp, Filter, ArrowUpRight, Activity, X, Info, ShieldCheck, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface OutbreakSurveillanceProps {
  records: PatientRecord[];
}

export default function OutbreakSurveillance({ records }: OutbreakSurveillanceProps) {
  const [showPolicy, setShowPolicy] = useState(false);

  // Analytical processing for surveillance
  const getRiskMetric = (type: string, count: number, threshold: number) => {
    const ratio = count / threshold;
    if (ratio >= 1) return { level: 'CRITICAL', color: 'text-rose-600', bg: 'bg-rose-50' };
    if (ratio >= 0.5) return { level: 'MONITORING', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { level: 'STABLE', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  const windowMs = 14 * 24 * 60 * 60 * 1000;
  const recent = records.filter(r => Date.now() - r.timestamp < windowMs);
  
  const feverCount = recent.filter(r => r.symptoms.fever === 'severe').length;
  const respCount = recent.filter(r => r.symptoms.breathingDifficulty).length;
  const gastroCount = recent.filter(r => r.symptoms.additionalSymptoms.toLowerCase().includes('diarrhea')).length;

  const metrics = [
    { name: 'Febrile', value: feverCount, threshold: 3, icon: <Activity size={12} /> },
    { name: 'Respiratory', value: respCount, threshold: 3, icon: <Shield size={12} /> },
    { name: 'Waterborne', value: gastroCount, threshold: 2, icon: <AlertCircle size={12} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(m => {
          const risk = getRiskMetric(m.name, m.value, m.threshold);
          return (
            <Card key={m.name} className={`p-4 border-l-4 ${risk.color.replace('text', 'border')} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  {m.icon} {m.name} Vector
                </span>
                <Badge className={risk.bg + ' ' + risk.color}>{risk.level}</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{m.value}</span>
                <span className="text-[10px] font-bold text-slate-400">/ {m.threshold} PROXIMITY</span>
              </div>
              <div className="mt-3 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${risk.color.replace('text', 'bg')}`} 
                  style={{ width: `${Math.min(100, (m.value / m.threshold) * 100)}%` }} 
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Cluster Analysis (14D)</h3>
             <TrendingUp size={14} className="text-slate-300" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {metrics.map((entry, index) => (
                    <Cell key={index} fill={entry.value >= entry.threshold ? '#e11d48' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Regional Intelligence</h3>
             <Badge variant="blue">External Feed</Badge>
          </div>
          <div className="space-y-3">
             {[
               { source: 'WHO regional', date: '2h ago', text: 'Neighboring sector reports 15% increase in unexplained fever.', priority: 'HIGH' },
               { source: 'District Health', date: '5h ago', text: 'Medication supply chain delay expected for Sector 4.', priority: 'MEDIUM' },
               { source: 'Met Office', date: '1d ago', text: 'Unseasonal heavy rainfall likely to increase mosquito breeding.', priority: 'ALERT' }
             ].map((report, i) => (
               <div key={i} className="p-2 border border-slate-100 rounded bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{report.source}</span>
                    <span className="text-[8px] font-bold text-slate-400">{report.date}</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-600 leading-tight">{report.text}</p>
               </div>
             ))}
          </div>
          <Button variant="outline" className="w-full mt-auto h-8 text-[9px]">View Complete Archive</Button>
        </Card>

        <Card className="bg-slate-900 border-none p-6 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
           
           <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Shield size={14} /> Surveillance Readiness
              </h3>
              <p className="text-sm font-bold border-l-2 border-emerald-500 pl-4 py-1 italic mb-6">
                Active sensors monitoring Sector 4. Data integrity verified. Last sweep performed 2m ago.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-emerald-500 border border-slate-700">
                      <ArrowUpRight size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-400">Response Plan</div>
                      <div className="text-xs font-bold">Standard Isolation Protocol</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10"
                    onClick={() => setShowPolicy(true)}
                  >
                    View Policy
                  </Button>
                </div>
              </div>
           </div>
        </Card>
      </div>

      <AnimatePresence>
        {showPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowPolicy(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Health Surveillance Policy v4.0</h3>
                </div>
                <button onClick={() => setShowPolicy(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6 space-y-6">
                <section>
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap size={14} /> Immediate Action Protocol
                  </h4>
                  <div className="space-y-3 bg-rose-50/50 p-4 rounded border border-rose-100">
                    <p className="text-[11px] font-bold text-rose-900 leading-relaxed italic">
                      "Upon detection of a 3nd concurrent case within a 14-day window, the sector lead must trigger isolation protocols."
                    </p>
                    <ul className="text-xs space-y-2 text-rose-800">
                      <li className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>Establish primary triage ring within 2km of cluster origin.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>Deploy rapid diagnostic kits to field units 04 and 07.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Case Definition</h4>
                    <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                      <p><strong>Febrile:</strong> Temp &gt; 38°C for 48h with systemic joint pain.</p>
                      <p><strong>Respiratory:</strong> Rate &gt; 30/min with persistent non-productive cough.</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Ethics & Privacy</h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      All surveillance data is PII-stripped at the edge. Identifiers are hashed using regional keys. Data retention strictly capped at 90 days.
                    </p>
                  </div>
                </section>

                <section className="bg-slate-900 text-white p-4 rounded-lg shadow-inner">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center">
                      <Info size={16} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Regional Guidance</div>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Based on recent reports from the Ministry of Health, all waterborne clusters should be treated with priority chlorine distribution. Avoid communal tap usage if turbidity exceeds 5 NTU.
                  </p>
                </section>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button onClick={() => setShowPolicy(false)} variant="secondary" className="px-6">CLOSE POLICY</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
