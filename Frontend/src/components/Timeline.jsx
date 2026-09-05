import React from 'react';
import { 
  CalendarCheck, 
  Truck, 
  Sparkles, 
  Scale, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const STAGES = [
  { id: 'Slot Booked', label: 'Slot Booked', icon: CalendarCheck, desc: 'Slot confirmed with gate token' },
  { id: 'In Queue', label: 'In Queue', icon: Truck, desc: 'Vehicle checked in at Hub gate' },
  { id: 'Quality Check', label: 'Quality Check', icon: Sparkles, desc: 'FAQ Moisture & Grading analysis' },
  { id: 'Weighing', label: 'Weighing', icon: Scale, desc: 'Gross & Tare Weighbridge records' },
  { id: 'Payment Processing', label: 'Payment Processing', icon: Banknote, desc: 'DBT PFMS authorization' },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2, desc: 'Funds settled & Block committed' }
];

export const Timeline = ({ currentStatus, timelineData = [] }) => {
  // Normalize current stage index
  let activeIndex = STAGES.findIndex(s => s.id === currentStatus);
  if (activeIndex === -1) {
    if (currentStatus === 'Cancelled') activeIndex = -1;
    else activeIndex = 0;
  }

  // Calculate progress percentage
  const progressPercent = activeIndex >= 0 ? (activeIndex / (STAGES.length - 1)) * 100 : 0;

  return (
    <div className="w-full py-6">
      {/* Desktop Horizontal Milestone Bar */}
      <div className="relative mb-10 hidden md:block">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-stone-200 rounded-full z-0"></div>
        {/* Active Progress Fill */}
        <div 
          className="absolute top-1/2 left-6 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#1B4D3E] via-emerald-600 to-emerald-400 rounded-full transition-all duration-700 z-0"
          style={{ width: `calc(${progressPercent}% * 0.9 + 20px)` }}
        ></div>

        <div className="relative z-10 flex justify-between items-center">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < activeIndex || (idx === STAGES.length - 1 && currentStatus === 'Completed');
            const isCurrent = idx === activeIndex && currentStatus !== 'Completed';
            const isUpcoming = idx > activeIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center group w-24">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-[#1B4D3E] text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-amber-200 animate-pulse scale-110'
                      : 'bg-white text-stone-400 border-2 border-stone-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <span
                  className={`mt-2.5 text-xs font-bold text-center tracking-tight leading-snug ${
                    isCompleted
                      ? 'text-[#1B4D3E]'
                      : isCurrent
                      ? 'text-emerald-700 font-extrabold scale-105'
                      : 'text-stone-400'
                  }`}
                >
                  {stage.label}
                </span>

                <span className="text-[10px] text-stone-400 text-center hidden lg:block mt-0.5 max-w-[110px] truncate">
                  {stage.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="md:hidden space-y-4">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < activeIndex || (idx === STAGES.length - 1 && currentStatus === 'Completed');
          const isCurrent = idx === activeIndex && currentStatus !== 'Completed';

          return (
            <div key={stage.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isCompleted
                    ? 'bg-[#1B4D3E] text-white'
                    : isCurrent
                    ? 'bg-emerald-600 text-white ring-2 ring-amber-300 animate-pulse'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-700' : 'text-stone-800'}`}>
                  {stage.label}
                </p>
                <p className="text-[11px] text-stone-500">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Event Log History */}
      {timelineData.length > 0 && (
        <div className="mt-8 bg-stone-50 rounded-xl p-4 border border-stone-200">
          <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            Verified Event Audit Trail
          </h5>
          <div className="space-y-3">
            {timelineData.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-stone-800">{ev.status}</span>
                    <span className="text-[11px] text-stone-400">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString('en-IN') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] mt-0.5">{ev.description}</p>
                  {ev.updatedBy && (
                    <span className="inline-block mt-1 text-[10px] font-medium bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded">
                      Handled by: {ev.updatedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
