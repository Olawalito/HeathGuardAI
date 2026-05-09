import { Card, Badge } from './UI';
import { Users, Activity, AlertCircle, HeartPulse } from 'lucide-react';
import { PatientRecord } from '../types';

interface SummaryCardsProps {
  records: PatientRecord[];
}

export default function SummaryCards({ records }: SummaryCardsProps) {
  const total = records.length;
  const highRisk = records.filter(r => r.riskLevel === 'high').length;
  const moderateRisk = records.filter(r => r.riskLevel === 'moderate').length;
  const resources = 'OPTIMAL';

  const stats = [
    { label: 'Screened (24h)', value: total, icon: <Users size={14} />, color: 'text-slate-900' },
    { label: 'High Risk Alert', value: highRisk, icon: <AlertCircle size={14} />, color: 'text-rose-600', badge: 'URGENT' },
    { label: 'Moderate Cases', value: moderateRisk, icon: <Activity size={14} />, color: 'text-amber-600' },
    { label: 'System Check', value: resources, icon: <HeartPulse size={14} />, color: 'text-emerald-600', sub: '92% Active' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {stats.map((stat, i) => (
        <Card key={i} className="p-3 bg-white border border-slate-200 rounded flex flex-col justify-between h-20 shadow-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stat.label}</span>
            {stat.badge && <span className="text-[8px] font-black bg-rose-600 text-white px-1 py-0.5 rounded italic">{stat.badge}</span>}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
            {stat.sub && <span className="text-[9px] font-bold text-slate-400 uppercase">{stat.sub}</span>}
          </div>
        </Card>
      ))}
    </div>
  );
}
