import { useState, useEffect } from 'react';
import { useNutrition } from '../../store/NutritionStore';
import { useAuth } from '../../store/AuthStore';
import { foodDatabase, moodOptions } from '../../data/foods';
import { fetchProductByBarcode, analyzeChemicalRisks, checkHealthLimits } from '../../utils/api';
import { Search, Plus, Clock, Check, Utensils, Scan, X, AlertTriangle, ShieldCheck, Thermometer, Info } from 'lucide-react';
import BarcodeScanner from '../../components/BarcodeScanner';

export default function MealLogPage() {
  const { logMeal, todayMeals } = useNutrition();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [customMeal, setCustomMeal] = useState(false);
  const [custom, setCustom] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
  const [logged, setLogged] = useState(false);
  
  // Barcode specific state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [analysis, setAnalysis] = useState({ risks: [], warnings: [] });

  const results = search.length > 1
    ? foodDatabase.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const handleBarcodeDetected = async (code) => {
    setIsScanning(false);
    setLoadingProduct(true);
    const product = await fetchProductByBarcode(code);
    
    if (product) {
      const risks = analyzeChemicalRisks(product.ingredients);
      const warnings = checkHealthLimits(product.nutrients, user?.preferences?.conditions || []);
      setAnalysis({ risks, warnings });
      setScannedProduct(product);
    } else {
      alert("Product not found in database. Try a custom entry.");
    }
    setLoadingProduct(false);
  };

  const handleLog = () => {
    let meal;
    if (scannedProduct) {
      meal = {
        id: Date.now(),
        name: scannedProduct.name,
        calories: scannedProduct.nutrients.calories,
        protein: scannedProduct.nutrients.protein,
        carbs: scannedProduct.nutrients.carbs,
        fat: scannedProduct.nutrients.fat,
        fiber: scannedProduct.nutrients.fiber,
        vitality: scannedProduct.nutriscore === 'a' ? 90 : scannedProduct.nutriscore === 'b' ? 70 : scannedProduct.nutriscore === 'c' ? 50 : 30,
        hasRisks: analysis.risks.length > 0 || analysis.warnings.some(w => w.type === 'danger'),
        category: 'Scanned',
        tags: [scannedProduct.brand, 'Barcode Scan'],
        image: scannedProduct.image
      };
    } else if (customMeal) {
      meal = { id: Date.now(), name: custom.name, calories: +custom.calories || 0, protein: +custom.protein || 0, carbs: +custom.carbs || 0, fat: +custom.fat || 0, fiber: +custom.fiber || 0, vitality: 50, category: 'Custom', tags: ['Custom Entry'], image: '' };
    } else {
      meal = selectedFood;
    }

    if (meal) {
      logMeal(meal, selectedMood);
      setLogged(true);
      setTimeout(() => {
        setLogged(false);
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setSelectedFood(null);
    setSelectedMood(null);
    setScannedProduct(null);
    setSearch('');
    setCustom({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
  };

  if (logged) {
    return (
      <div className="flex flex-col items-center justify-center py-24 page-enter">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal Logged! 🎉</h2>
        <p className="text-gray-500">Your habit streak is growing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {isScanning && (
        <BarcodeScanner 
          onDetected={handleBarcodeDetected} 
          onClose={() => setIsScanning(false)} 
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add to Journal</h1>
          <p className="text-sm text-gray-500">Log your meal via search or barcode</p>
        </div>
        <button 
          onClick={() => setIsScanning(true)}
          className="p-3 bg-primary-100 text-primary-700 rounded-2xl hover:bg-primary-200 transition-all flex items-center gap-2 font-semibold text-sm"
        >
          <Scan className="w-5 h-5" />
          Scan Box
        </button>
      </div>

      {/* Loading State */}
      {loadingProduct && (
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-600">Analyzing product composition...</p>
        </div>
      )}

      {/* Scanned Product Health Report */}
      {scannedProduct && !loadingProduct && (
        <div className="glass rounded-3xl overflow-hidden page-enter border-2 border-primary-100">
          <div className="bg-gradient-to-r from-primary-600 to-emerald-500 p-4 text-white flex justify-between items-start">
            <div className="flex gap-3">
              <img src={scannedProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-white p-1" />
              <div>
                <h3 className="font-bold leading-tight">{scannedProduct.name}</h3>
                <p className="text-xs text-primary-100 opacity-80">{scannedProduct.brand}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">Nutriscore: {scannedProduct.nutriscore.toUpperCase() || 'N/A'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">NOVA: {scannedProduct.nova || 'N/A'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setScannedProduct(null)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Health Warnings */}
            {analysis.warnings.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Health Compatibility</p>
                {analysis.warnings.map((w, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl text-sm ${w.type === 'danger' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-medium">{w.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Chemical Risks */}
            {analysis.risks.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Additives Detected</p>
                <div className="grid gap-2">
                  {analysis.risks.map((r, i) => (
                    <div key={i} className="flex flex-col p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-800">{r.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.risk === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          {r.risk.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">{r.effects}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-800 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-semibold">No harmful additives found. Clean label!</p>
              </div>
            )}

            {/* Nutrition Grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Sugars', val: scannedProduct.nutrients.sugars, unit: 'g' },
                { label: 'Protein', val: scannedProduct.nutrients.protein, unit: 'g' },
                { label: 'Fat', val: scannedProduct.nutrients.fat, unit: 'g' },
                { label: 'Fiber', val: scannedProduct.nutrients.fiber, unit: 'g' },
              ].map(n => (
                <div key={n.label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{n.label}</p>
                  <p className="text-sm font-bold text-gray-800">{n.val}{n.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!scannedProduct && !loadingProduct && (
        <>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setCustomMeal(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!customMeal ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >Search Database</button>
            <button
              onClick={() => setCustomMeal(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${customMeal ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >Custom Entry</button>
          </div>

          {!customMeal && (
            <div className="space-y-4 page-enter">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a meal name..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedFood(null); }}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
              </div>

              {results.length > 0 && !selectedFood && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {results.map(food => (
                    <button
                      key={food.id}
                      onClick={() => { setSelectedFood(food); setSearch(food.name); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left"
                    >
                      <img src={food.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{food.name}</p>
                        <p className="text-[11px] text-gray-400">{food.calories} cal · {food.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedFood && (
                <div className="glass rounded-2xl p-4 page-enter">
                  <div className="flex items-center gap-3">
                    <img src={selectedFood.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedFood.name}</h3>
                      <p className="text-xs text-gray-500">{selectedFood.calories} cal · V-Score: {selectedFood.vitality}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {customMeal && (
            <div className="space-y-3 page-enter">
              <input placeholder="Meal name" value={custom.name} onChange={e => setCustom(p => ({...p, name: e.target.value}))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
              <div className="grid grid-cols-2 gap-3">
                {['calories', 'protein', 'carbs', 'fat', 'fiber'].map(field => (
                  <input key={field} placeholder={field} type="number" 
                    value={custom[field]} onChange={e => setCustom(p => ({...p, [field]: e.target.value}))}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mood after eating */}
      {(selectedFood || scannedProduct || (customMeal && custom.name)) && (
        <div className="page-enter bg-white/50 p-5 rounded-3xl border border-gray-100">
          <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-500" />
            How do you feel after eating this?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {moodOptions.map(m => (
              <button key={m.value} onClick={() => setSelectedMood(m.value)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedMood === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <span className="text-2xl block">{m.emoji}</span>
                <span className="text-[10px] font-bold text-gray-600 uppercase mt-1">{m.label}</span>
              </button>
            ))}
          </div>
          
          <button onClick={handleLog}
            className="w-full mt-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2 transition-all">
            <Plus className="w-5 h-5 flex-shrink-0" /> Finish Logging
          </button>
        </div>
      )}

      {/* Today's Log */}
      {todayMeals.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Daily Journal
            </h2>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full uppercase">Today</span>
          </div>
          <div className="space-y-3">
            {todayMeals.map((meal, i) => (
              <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4 border border-gray-100/50 hover:border-primary-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {meal.image ? <img src={meal.image} alt="" className="w-full h-full object-cover" /> : <Utensils className="w-5 h-5 text-primary-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <p className="text-sm font-bold text-gray-900">{meal.name}</p>
                     {meal.moodAfter && <span className="text-sm">{moodOptions.find(m => m.value === meal.moodAfter)?.emoji}</span>}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{meal.calories} kcal</span>
                    {meal.wasSwap && <span className="text-[10px] text-emerald-600 font-extrabold uppercase bg-emerald-50 px-1.5 rounded">Smart Swap ✓</span>}
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-300">{new Date(meal.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
