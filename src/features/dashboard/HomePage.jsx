import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import { useMeals } from '../../hooks/useMeals';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useHealthPlan } from '../../hooks/useHealthPlan';
import { healthTips } from '../../data/foods';
import { Flame, TrendingUp, ArrowRight, Lightbulb, Zap, Heart, CloudRain, Sun, Wind } from 'lucide-react';
import { useMemo } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const { streak, summary } = useMeals();
  const { recommendations, favorites, toggleFavorite } = useRecommendations();
  const { weatherData, loadingWeather } = useHealthPlan();

  const tip = useMemo(() => healthTips[Math.floor(Math.random() * healthTips.length)], []);

  const timeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-400 animate-gradient p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium mb-1">{timeGreeting()},</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{user?.name} 👋</h1>
          <div className="flex gap-4 mt-6 flex-wrap">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-300" />
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-primary-100 uppercase font-black">Streak</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-300" />
              <div>
                <div className="text-2xl font-bold">{summary?.avgVitality ?? '--'}</div>
                <div className="text-xs text-primary-100 uppercase font-black">Vitality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Insights */}
      <section className="glass rounded-3xl p-6 border-2 border-primary-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-xl">
              {weatherData?.weather === 'Rain' ? <CloudRain className="w-5 h-5 text-primary-600" /> : <Sun className="w-5 h-5 text-primary-600" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Weather Insights</h2>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{weatherData?.city ?? 'detecting...'}</p>
            </div>
          </div>
          {!loadingWeather && (
            <div className="text-right">
              <span className="text-2xl font-black text-primary-600">{Math.round(weatherData?.temp)}°C</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{weatherData?.weather}</p>
            </div>
          )}
        </div>
        {loadingWeather ? (
          <div className="h-20 flex items-center justify-center animate-pulse bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-400 font-medium">Detecting climate patterns...</p>
          </div>
        ) : (
          <div className="bg-primary-50/50 rounded-2xl p-4 border border-primary-100 space-y-2">
            <p className="text-sm font-semibold text-primary-800 flex items-center gap-2"><Wind className="w-4 h-4" /> Climate-Appetite Sync</p>
            {weatherData?.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 text-sm text-primary-700 bg-white/60 p-2 rounded-xl">
                <span className="text-lg">{tip.emoji}</span>
                <p className="font-medium leading-snug">{tip.tip}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Health tip */}
      <section className="glass rounded-2xl p-5 flex items-start gap-4 border border-amber-100 bg-amber-50/60">
        <div className="p-2 bg-amber-100 rounded-xl shrink-0"><Lightbulb className="w-5 h-5 text-amber-600" /></div>
        <div>
          <h3 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-tight">Pro Habit Tip</h3>
          <p className="text-sm text-amber-800 leading-tight font-medium">{tip}</p>
        </div>
      </section>

      {/* Nourish Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500 fill-primary-500" /> Nourish Feed
          </h2>
          <Link to="/discover" className="text-primary-600 text-xs font-black uppercase tracking-wider flex items-center gap-1">
            See More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map(food => (
            <div key={food.id} className="group glass rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-lg bg-black/30 text-white uppercase border border-white/20">
                    V-Score: {food.vitality}
                  </span>
                </div>
                <button onClick={() => toggleFavorite(food.id)} className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 backdrop-blur-md hover:bg-white">
                  <Heart className={`w-4 h-4 ${favorites.includes(food.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 leading-tight mb-1">{food.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 uppercase">{food.tags?.[0]}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{food.calories} cal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
