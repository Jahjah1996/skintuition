import { Card, CardContent } from "../core/Card";

export interface RegimenData {
  morning: Array<{ step: string; product: string; purpose: string }>;
  evening: Array<{ step: string; product: string; purpose: string }>;
}

interface RegimenWidgetProps {
  regimen: RegimenData;
}

export function RegimenWidget({ regimen }: RegimenWidgetProps) {
  if (!regimen || (!regimen.morning?.length && !regimen.evening?.length)) {
    return null;
  }

  return (
    <Card className="bg-white border-surface-dim shadow-sm mt-6 fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-serif italic font-bold text-primary mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          Tailored Regimen
        </h3>
        <p className="text-sm text-secondary mb-6">
          A personalized morning and evening routine based on your latest skin analysis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morning Routine */}
          <div className="bg-surface-lowest rounded-xl p-5 border border-surface-dim">
            <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">light_mode</span>
              Morning Ritual
            </h4>
            <div className="space-y-4">
              {regimen.morning?.map((item, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-primary/20">
                  <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1.5" />
                  <p className="text-sm font-bold text-primary">{item.step}</p>
                  <p className="text-sm font-medium text-emerald-700 my-0.5">{item.product}</p>
                  <p className="text-xs text-secondary leading-relaxed">{item.purpose}</p>
                </div>
              ))}
              {(!regimen.morning || regimen.morning.length === 0) && (
                <p className="text-sm text-secondary italic">No morning steps recommended.</p>
              )}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">dark_mode</span>
              Evening Ritual
            </h4>
            <div className="space-y-4">
              {regimen.evening?.map((item, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-indigo-200">
                  <div className="absolute w-2 h-2 rounded-full bg-indigo-500 -left-[5px] top-1.5" />
                  <p className="text-sm font-bold text-slate-800">{item.step}</p>
                  <p className="text-sm font-medium text-indigo-700 my-0.5">{item.product}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.purpose}</p>
                </div>
              ))}
              {(!regimen.evening || regimen.evening.length === 0) && (
                <p className="text-sm text-slate-500 italic">No evening steps recommended.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
