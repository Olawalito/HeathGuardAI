import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './UI';
import { PatientRecord } from '../types';

interface TrendChartProps {
  records: PatientRecord[];
}

export default function TrendChart({ records }: TrendChartProps) {
  // Group cases by day for the last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toLocaleDateString(undefined, { weekday: 'short' });
    
    const count = records.filter(r => {
      const rDate = new Date(r.timestamp);
      return rDate.toDateString() === day.toDateString();
    }).length;

    const highRiskCount = records.filter(r => {
      const rDate = new Date(r.timestamp);
      return rDate.toDateString() === day.toDateString() && r.riskLevel === 'high';
    }).length;

    return { name: dayStr, total: count, highRisk: highRiskCount };
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Community Health Trends</h3>
          <p className="text-sm text-slate-500">7-day case volume comparison</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">High Risk</span>
          </div>
        </div>
      </div>

      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            <Area type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHigh)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
