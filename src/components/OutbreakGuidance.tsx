import { Card, Badge, Button } from './UI';
import { Activity, Thermometer, Droplets, Wind, ShieldCheck, Info } from 'lucide-react';
import { Outbreak, Level } from '../types';

interface OutbreakGuidanceProps {
  outbreak: Outbreak;
}

export default function OutbreakGuidance({ outbreak }: OutbreakGuidanceProps) {
  const getGuidance = (type: string) => {
    switch (type) {
      case 'Respiratory':
        return {
          worker: [
            { icon: <ShieldCheck size={14} />, text: 'Ensure masking in clinics and community centers' },
            { icon: <Wind size={14} />, text: 'Improve indoor ventilation: open windows' },
            { icon: <Droplets size={14} />, text: 'Isolate suspected cases immediately' },
            { icon: <Info size={14} />, text: 'Advise avoiding crowded marketplaces' },
          ],
          patient: [
            'Wear a face covering at all times in public',
            'Cover your mouth with an elbow when coughing',
            'Stay at least 2 meters away from others',
            'Wash hands with soap frequently',
            'Report any sudden breathing difficulty to a worker'
          ]
        };
      case 'Febrile':
        return {
          worker: [
            { icon: <Thermometer size={14} />, text: 'Increase supply of diagnostic kits (RDTs)' },
            { icon: <Activity size={14} />, text: 'Conduct community fever screenings' },
            { icon: <Droplets size={14} />, text: 'Distribute bed nets and promote vector control' },
            { icon: <Info size={14} />, text: 'Monitor water sources for stagnation' },
          ],
          patient: [
            'Sleep under insecticide-treated bed nets',
            'Clear stagnant water around your home',
            'Wear long sleeves and trousers at dawn and dusk',
            'Visit the clinic immediately for any high fever',
            'Do not self-medicate without a proper test'
          ]
        };
      case 'Waterborne':
        return {
          worker: [
            { icon: <Droplets size={14} />, text: 'Issue "Boil Before Drinking" advisories' },
            { icon: <ShieldCheck size={14} />, text: 'Distribute chlorine tablets for storage' },
            { icon: <Activity size={14} />, text: 'Set up oral rehydration stations' },
            { icon: <Info size={14} />, text: 'Inspect common handwashing facilities' },
          ],
          patient: [
            'Boil all drinking and cooking water',
            'Wash hands with soap after using the latrine',
            'Peel or wash fruits and vegetables with safe water',
            'Avoid eating raw or undercooked street food',
            'Use only treated or boiled water for drinking'
          ]
        };
      default:
        return {
          worker: [
            { icon: <Info size={14} />, text: 'Universal health precautions' },
            { icon: <Activity size={14} />, text: 'Report clusters to district officials' },
          ],
          patient: [
            'Maintain general hygiene and handwashing',
            'Report any unusual symptoms to local health workers',
            'Keep your living environment clean and dry',
            'Ensure all vaccinations are up to date'
          ]
        };
    }
  };

  const guidance = getGuidance(outbreak.type);

  return (
    <Card className="bg-rose-50 border-rose-300 p-4 rounded shrink-0 relative overflow-hidden group shadow-lg shadow-rose-200/50">
      <div className="absolute inset-y-0 left-0 w-1 bg-rose-600" />
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-rose-600 text-white flex items-center justify-center rounded shadow-inner text-xl font-black italic animate-pulse">
              !
            </div>
            <div>
              <h2 className="text-[13px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                🚨 POSSIBLE {outbreak.type.toUpperCase()} OUTBREAK DETECTED
              </h2>
              <p className="text-[11px] font-bold text-rose-700 italic flex items-center gap-2">
                 CLUSTERING OBSERVED IN SECTOR 4 • SEVERITY: {outbreak.severity.toUpperCase()} • {outbreak.evidence.totalRecentCases} CASES IMPACTED
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="danger" className="h-8 px-4 text-[9px] font-black shadow-rose-900/20 shadow-lg">INITIATE RESPONSE</Button>
            <Button variant="outline" className="h-8 px-4 text-[9px] bg-white border-rose-300 text-rose-800 font-black">SAFETY PROTOCOL</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 p-4 rounded border border-rose-100">
           <div>
              <h3 className="text-[10px] font-black text-rose-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> Field Worker Directives
              </h3>
              <div className="space-y-2">
                {guidance.worker.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-white/80 rounded border border-rose-100/50">
                    <div className="text-rose-600 mt-0.5">{step.icon}</div>
                    <span className="text-[11px] font-bold text-rose-800 italic">{step.text}</span>
                  </div>
                ))}
              </div>
           </div>

           <div>
              <h3 className="text-[10px] font-black text-rose-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={14} /> Critical Patient Guidance
              </h3>
              <div className="space-y-2">
                {guidance.patient.map((step, i) => (
                  <div key={i} className="text-[11px] font-medium text-slate-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    {step}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
}

function AlertTriangle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
