import { useState, useMemo } from 'react';
import { useAuth } from '../../store/AuthStore';
import { useMeals } from '../../hooks/useMeals';
import { useHealthPlan } from '../../hooks/useHealthPlan';
import { moodOptions } from '../../data/foods';
import { Brain, Flame, Target, Sparkles, Utensils, Lightbulb, ShieldCheck, X, ClipboardList, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { mealHistory, streak, moodInsights } = useMeals();
  const { plan, generatePlan } = useHealthPlan();
  const [showPlan, setShowPlan] = useState(false);

  const safetyScore = useMemo(() => {
    if (!mealHistory.length) return 100;
    return Math.round(mealHistory.filter(m => !m.hasRisks).length / mealHistory.length * 100);
  }, [mealHistory]);

  const topMoods = useMemo(() =>
    Object.entries(moodInsights?.moodCorrelations ?? {})
      .sort(([, a], [, b]) => b.avgVitality - a.avgVitality)
      .slice(0, 3),
    [moodInsights]
  );

  const handleGenerate = () => { generatePlan(); setShowPlan(true); };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Health Intelligence</h1>
          <p className="text-sm text-gray-500 font-medium">Data-driven biological insights</p>
        </div>
        <button onClick={handleGenerate} className="p-3 bg-primary-600 text-white rounded-2xl hover:shadow-lg hover:shadow-primary-500/20 transition-all flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">Plan</span>
        </button>
      </div>

      {/* Health Plan Modal */}
      {showPlan && plan && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl page-enter">
            <div className="bg-gradient-to-br from-primary-600 to-emerald-500 p-8 text-white relative">
              <button onClick={() => setShowPlan(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl"><ClipboardList className="w-5 h-5" /></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Daily Protocol</p>
              </div>
              <h2 className="text-2xl font-black leading-tight">Your 24h Vitality Blueprint</h2>
              <p className="text-sm text-primary-100 font-medium mt-2">Focus: <span className="underline">{plan.focus}</span></p>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Kcal Ceiling</p>
                  <p className="text-xl font-black text-gray-900">{plan.metrics.suggestedKcal}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Priority Macro</p>
                  <p className="text-xl font-black text-primary-600">{plan.metrics.priorityMacro}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Utensils className="w-4 h-4" /> Meal Protocol</h3>
                {Object.entries(plan.mealPlan).map(([type, details]) => (
                  <div key={type} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-[24px] hover:border-primary-100 transition-colors shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 uppercase text-[10px] font-black text-primary-600">{type[0]}</div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{details.name}</p>
                      <p className="text-xs text-gray-400 font-medium leading-tight mt-0.5">{details.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              {plan.habits.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Behavioral Meta</h3>
                  {plan.habits.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl text-xs font-bold text-emerald-800 border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <p>{h}</p>
                    </div>
                  ))}
                </div>
              )}

              {plan.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Risk Mitigation</h3>
                  {plan.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl text-xs font-bold text-amber-800 border border-amber-100">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                      <p>{w}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 flex gap-4">
              <button onClick={() => setShowPlan(false)} className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all">
                Close
              </button>
              <button className="flex items-center justify-center p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Utensils, label: 'Total Meals', value: mealHistory.length, color: 'bg-blue-50 text-blue-600' },
          { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'bg-amber-50 text-amber-600' },
          { icon: Target, label: 'Avg Vitality', value: moodInsights?.moodCorrelations ? Object.values(moodInsights.moodCorrelations)[0]?.avgVitality ?? '--' : '--', color: 'bg-emerald-50 text-emerald-600' },
          { icon: ShieldCheck, label: 'Safety Score', value: `${safetyScore}%`, color: 'bg-purple-50 text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mood-Food Correlation */}
      <section className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-black text-gray-900">Neuro-Nutrition Logic</h2>
        </div>
        <p className="text-xs text-gray-500 font-medium mb-6">How food modulates your neurochemistry</p>
        {topMoods.length > 0 ? (
          <div className="space-y-3">
            {topMoods.map(([mood, stats]) => (
              <div key={mood} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:border-primary-200 transition-all group">
                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                  {moodOptions.find(m => m.value === mood)?.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-gray-800 uppercase text-[10px] tracking-tight">{mood} State</p>
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">V-Score: {stats.avgVitality}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    You feel most <span className="font-bold text-gray-700 capitalize">{mood}</span> after <span className="text-primary-600 font-bold">{stats.commonCategory}</span> meals.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-primary-50/50 p-6 rounded-2xl text-center border border-dashed border-primary-200">
            <Lightbulb className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-primary-700">Log 5+ meals with mood to unlock insights</p>
          </div>
        )}
      </section>

      {/* Bio-Shield Audit */}
      <section className="glass rounded-3xl p-6 border-2 border-red-50">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <h2 className="font-black text-gray-900 uppercase text-xs tracking-[0.1em]">Bio-Shield Audit</h2>
        </div>
        {user?.preferences?.conditions?.length > 0 ? user.preferences.conditions.map(c => (
          <div key={c} className="flex justify-between items-center p-3 bg-red-50/50 rounded-2xl border border-red-100 mb-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-800 uppercase tracking-tight">{c} Monitoring</span>
            </div>
            <span className="text-[10px] font-black text-red-600">ACTIVE</span>
          </div>
        )) : (
          <p className="text-sm text-gray-400 text-center py-4 italic">No health conditions set in Profile.</p>
        )}
      </section>
    </div>
  );
}
