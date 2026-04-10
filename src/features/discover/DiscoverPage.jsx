import { useState, useMemo } from 'react';
import { useNutrition } from '../../store/NutritionStore';
import { foodDatabase, moodOptions } from '../../data/foods';
import { Search, Filter, Heart, ArrowRightLeft, X, ChevronDown, Star } from 'lucide-react';

export default function DiscoverPage() {
  const { favorites, toggleFavorite, logMeal } = useNutrition();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [swapModal, setSwapModal] = useState(null);
  const [moodModal, setMoodModal] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...new Set(foodDatabase.map(f => f.category))];

  const filtered = useMemo(() => {
    return foodDatabase.filter(food => {
      const matchSearch = food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter === 'All' || food.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const handleLogWithMood = (food) => {
    setMoodModal(food);
  };

  const confirmLog = (mood) => {
    logMeal(moodModal, mood);
    setMoodModal(null);
  };

  const showSwap = (food) => {
    const swap = foodDatabase.find(f => f.id === food.swapFor);
    if (swap) setSwapModal({ original: food, swap });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Discover Foods</h1>
        <p className="text-sm text-gray-500">Browse, search, and find healthier options</p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search meals, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-xl flex items-center gap-2 ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-200 text-gray-600'}`}
        >
          <Filter className="w-4 h-4" />
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Category pills */}
      {showFilters && (
        <div className="flex gap-2 flex-wrap page-enter">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-gray-400">{filtered.length} items found</p>

      {/* Food grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((food, i) => (
          <div
            key={food.id}
            className="glass rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="relative h-36 overflow-hidden">
              <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                  food.vitality >= 75 ? 'bg-emerald-500/90 text-white' : food.vitality >= 50 ? 'bg-amber-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}>V:{food.vitality}</span>
              </div>
              <button
                onClick={() => toggleFavorite(food.id)}
                className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md hover:bg-white"
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.includes(food.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </button>
              <div className="absolute bottom-2.5 left-2.5">
                <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                  {food.calories} cal
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{food.name}</h3>
              <p className="text-[11px] text-gray-500 mb-3 line-clamp-2">{food.description}</p>
              <div className="flex gap-1 mb-3 flex-wrap">
                {food.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                ))}
              </div>

              {/* Macro bar */}
              <div className="flex gap-3 mb-3 text-[10px] text-gray-500">
                <span>P: {food.protein}g</span>
                <span>C: {food.carbs}g</span>
                <span>F: {food.fat}g</span>
                <span>Fiber: {food.fiber}g</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleLogWithMood(food)}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  + Log This Meal
                </button>
                {food.swapFor && (
                  <button
                    onClick={() => showSwap(food)}
                    className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-100"
                    title="Smart Swap available"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Swap Modal */}
      {swapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSwapModal(null)}>
          <div className="glass rounded-3xl max-w-lg w-full p-6 bg-white page-enter" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500" /> Smart Swap
              </h2>
              <button onClick={() => setSwapModal(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
              <div className="text-center opacity-60">
                <img src={swapModal.original.image} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-red-200" />
                <p className="text-sm font-medium mt-2">{swapModal.original.name}</p>
                <p className="text-red-500 font-bold text-sm">V: {swapModal.original.vitality}</p>
                <p className="text-xs text-gray-400">{swapModal.original.calories} cal</p>
              </div>
              <div className="text-3xl">→</div>
              <div className="text-center">
                <div className="relative inline-block">
                  <img src={swapModal.swap.image} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-primary-400 shadow-lg shadow-primary-500/20" />
                  <Star className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-sm font-semibold mt-2">{swapModal.swap.name}</p>
                <p className="text-primary-600 font-bold text-sm">V: {swapModal.swap.vitality}</p>
                <p className="text-xs text-gray-400">{swapModal.swap.calories} cal</p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
              <p className="font-semibold text-primary-800 text-sm mb-2">Why swap?</p>
              <ul className="text-sm text-primary-700 space-y-1.5">
                <li>• Save <strong>{swapModal.original.calories - swapModal.swap.calories}</strong> calories</li>
                <li>• {swapModal.swap.fiber > swapModal.original.fiber ? `+${swapModal.swap.fiber - swapModal.original.fiber}g more fiber` : 'Better macro balance'}</li>
                <li>• Vitality score jumps from {swapModal.original.vitality} → {swapModal.swap.vitality}</li>
              </ul>
            </div>

            <button
              onClick={() => { handleLogWithMood(swapModal.swap); setSwapModal(null); }}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25"
            >
              Log the Healthier Option 🌿
            </button>
          </div>
        </div>
      )}

      {/* Mood after eating modal */}
      {moodModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setMoodModal(null)}>
          <div className="glass rounded-3xl max-w-sm w-full p-6 bg-white page-enter" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">How do you feel?</h2>
            <p className="text-sm text-gray-500 mb-5">After eating <strong>{moodModal.name}</strong>, pick your mood:</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {moodOptions.map(m => (
                <button
                  key={m.value}
                  onClick={() => confirmLog(m.value)}
                  className="p-3 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all text-center"
                >
                  <span className="text-2xl block mb-1">{m.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{m.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { logMeal(moodModal, null); setMoodModal(null); }} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
              Skip mood tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
