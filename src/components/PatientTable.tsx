import { Card, Badge, Button } from './UI';
import { PatientRecord } from '../types';
import { Search, Filter, Eye, User, Calendar, Activity } from 'lucide-react';
import { useState } from 'react';

interface PatientTableProps {
  records: PatientRecord[];
  onView: (record: PatientRecord) => void;
}

export default function PatientTable({ records, onView }: PatientTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');

  const filtered = records
    .filter(r => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
                          (r.id && r.id.toLowerCase().includes(searchLower)) || 
                          (r.likelyConditions && r.likelyConditions.some(c => c.toLowerCase().includes(searchLower)));
      const matchesFilter = filter === 'all' || r.riskLevel === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="flex flex-col h-full bg-white shadow-sm border-slate-200">
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
           <Activity size={14} className="text-emerald-600" />
           <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Active Registry</h3>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase">Live Stream</span>
           </div>
           <Badge variant="default" className="text-[9px] font-black border-slate-200">{filtered.length} RECORDS</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <th className="p-3 font-black text-slate-500 uppercase tracking-tight">Patient Identity</th>
              <th className="p-3 font-black text-slate-500 uppercase tracking-tight text-center">Triage Score</th>
              <th className="p-3 font-black text-slate-500 uppercase tracking-tight">Risk Vector</th>
              <th className="p-3 font-black text-slate-500 uppercase tracking-tight">Assessment Date</th>
              <th className="p-3 font-black text-slate-500 uppercase tracking-tight text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic font-medium">
            {filtered.map((record) => (
              <tr key={record.id} className={`hover:bg-slate-50 transition-colors group ${record.riskLevel === 'high' ? 'bg-rose-50/20' : ''}`}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-900 font-black">ID: {record.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-[10px] text-slate-400 bg-slate-100 flex px-1.5 py-0.5 rounded">AGE {record.age}Y</div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`font-mono text-xs font-black ${record.riskLevel === 'high' ? 'text-rose-600' : 'text-slate-700'}`}>
                    {record.riskScore}
                  </span>
                </td>
                <td className="p-3">
                   <Badge variant={record.riskLevel === 'high' ? 'error' : record.riskLevel === 'moderate' ? 'warning' : 'success'}>
                     {record.riskLevel}
                   </Badge>
                </td>
                <td className="p-3">
                  <div className="text-slate-500 font-bold tabular-nums">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => onView(record)}
                    className="font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest text-[9px] border border-emerald-100 px-2 py-1 rounded bg-white"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest opacity-50">
                   Database Query Returned Null Results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
