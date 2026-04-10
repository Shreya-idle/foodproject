import { useState } from 'react';
import { useAuth } from '../../store/AuthStore';
import { useNutrition } from '../../store/NutritionStore';
import { NutritionAnalytics } from '../../domain/analytics/NutritionAnalytics';
import { User, Mail, Target, Calendar, Trash2, Check, Flame, Award, Heart, Settings, Leaf, AlertCircle, Activity } from 'lucide-react';

export default function ProfilePage() {
  const { user, updatePreferences, logout } = useAuth();
  const { mealHistory, favorites } = useNutrition();
  const streak = NutritionAnalytics.calculateStreak(mealHistory);
  const [editGoal, setEditGoal] = useState(false);
  const [calTarget, setCalTarget] = useState(user?.preferences?.calorieTarget || 2000);

  const goals = [
    { value: 'lose', label: 'Lose Weight', emoji: '🔥' },
    { value: 'balanced', label: 'Eat Balanced', emoji: '⚖️' },
    { value: 'gain', label: 'Build Muscle', emoji: '💪' },
    { value: 'energy', label: 'More Energy', emoji: '⚡' },
  ];

  const conditions = [
    { value: 'diabetes', label: 'Diabetes', icon: '🩸' },
    { value: 'hypertension', label: 'Hypertension', icon: '🩺' },
    { value: 'heart', label: 'Heart Health', icon: '❤️' },
    { value: 'obesity', label: 'Weight Mgmt', icon: '⚖️' },
  ];

  const toggleCondition = (cond) => {
    let current = user?.preferences?.conditions || [];
    if (current.includes(cond)) {
      current = current.filter(c => c !== cond);
    } else {
      current = [...current, cond];
    }
    updatePreferences({ conditions: current });
  };

  const healthyPct = mealHistory.length > 0
    ? Math.round(mealHistory.filter(m => m.vitality >= 70).length / mealHistory.length * 100)
    : 0;

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter pb-10">
      {/* Profile header */}
      <div className="glass rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-emerald-500/5" />
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-emerald-500 mx-auto flex items-center justify-center mb-4 shadow-xl shadow-primary-500/30 border-4 border-white">
            <span className="text-4xl font-black text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{user?.email}</p>

          <div className="flex justify-center gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{streak}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Streak</div>
            </div>
            <div className="w-px h-8 bg-gray-100 self-center" />
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{healthyPct}%</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Vitality</div>
            </div>
            <div className="w-px h-8 bg-gray-100 self-center" />
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{favorites.length}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Conditions / Limits */}
      <div className="glass rounded-3xl p-6 border-2 border-red-50 bg-white">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Activity className="w-4 h-4 text-red-500" /> Health Conditions
        </h3>
        <p className="text-xs text-gray-500 mb-4 font-medium">Select any conditions for personalized barcode warnings.</p>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map(c => (
            <button
              key={c.value}
              onClick={() => toggleCondition(c.value)}
              className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                user?.preferences?.conditions?.includes(c.value)
                  ? 'border-red-500 bg-red-50 shadow-sm'
                  : 'border-gray-50 bg-gray-50/50 hover:border-gray-100'
              }`}
            >
              <span className="text-xl">{c.icon}</span>
              <span className={`text-xs font-bold uppercase ${user?.preferences?.conditions?.includes(c.value) ? 'text-red-700' : 'text-gray-500'}`}>
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Goal setting */}
      <div className="glass rounded-3xl p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Target className="w-4 h-4 text-primary-500" /> Nutrition Focus
          </h3>
          <button onClick={() => setEditGoal(!editGoal)} className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">
            {editGoal ? 'Save' : 'Edit'}
          </button>
        </div>

        {editGoal ? (
          <div className="space-y-4 page-enter">
            <div className="grid grid-cols-2 gap-2">
              {goals.map(g => (
                <button
                  key={g.value}
                  onClick={() => updatePreferences({ goal: g.value })}
                  className={`p-4 rounded-3xl border-2 text-left transition-all ${
                    user?.preferences?.goal === g.value
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-50 bg-gray-50 hover:border-gray-100'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="text-xs font-black uppercase mt-2 tracking-tight">{g.label}</div>
                </button>
              ))}
            </div>
            <div className="pt-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Daily kcal Budget</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={calTarget}
                  onChange={e => setCalTarget(+e.target.value)}
                  onBlur={() => updatePreferences({ calorieTarget: calTarget })}
                  className="flex-1 px-5 py-3 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
              {goals.find(g => g.value === user?.preferences?.goal)?.emoji || '⚖️'}
            </div>
            <div>
              <p className="font-black text-gray-800 uppercase text-sm tracking-tight">{goals.find(g => g.value === user?.preferences?.goal)?.label || 'Eat Balanced'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Budget: {user?.preferences?.calorieTarget || 2000} kcal/day</p>
            </div>
          </div>
        )}
      </div>

      {/* Safety Info */}
      <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Health Shield</h4>
          <p className="text-xs text-amber-700 leading-tight font-medium">NourishAI analyzed over 3M+ products. Your conditions help us flag high sodium, sugar, and fat levels instantly when scanning.</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full py-4 border-2 border-red-50 text-red-500 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all active:scale-95"
      >
        Sign Out Securely
      </button>
    </div>
  );
}
