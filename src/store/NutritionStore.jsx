import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthStore';
import { MealRepository, FavoritesRepository } from '../services/Repositories';

const NutritionContext = createContext(null);

export function NutritionProvider({ children }) {
  const { user } = useAuth();
  const [mealHistory, setMealHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
    else { setMealHistory([]); setFavorites([]); setLoading(false); }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meals, favs] = await Promise.all([
        MealRepository.getAllByUserId(user.id),
        FavoritesRepository.getAllByUserId(user.id)
      ]);
      setMealHistory(meals.map(m => ({ ...m, loggedAt: m.logged_at, wasSwap: m.was_swap, hasRisks: m.has_risks, moodAfter: m.mood_after })));
      setFavorites(favs.map(f => f.food_id));
    } catch (e) {
      console.error('Data sync error:', e);
      const local = localStorage.getItem(`nourish_data_${user?.id}`);
      if (local) {
        const { meals, favorites: f } = JSON.parse(local);
        setMealHistory(meals || []); setFavorites(f || []);
      }
    } finally { setLoading(false); }
  };

  const logMeal = async (meal, mood) => {
    if (!user) return;
    const newMeal = {
      user_id: user.id, name: meal.name, calories: meal.calories, protein: meal.protein,
      carbs: meal.carbs, fat: meal.fat, fiber: meal.fiber, vitality: meal.vitality,
      was_swap: meal.wasSwap || false, has_risks: meal.hasRisks || false,
      mood_after: mood, logged_at: new Date().toISOString(), image: meal.image, tags: meal.tags
    };
    try {
      const data = await MealRepository.insert(newMeal);
      setMealHistory(prev => [{ ...data, loggedAt: data.logged_at, wasSwap: data.was_swap, hasRisks: data.has_risks, moodAfter: data.mood_after }, ...prev]);
    } catch (e) {
      console.error('Offline log:', e);
      setMealHistory(prev => [{ ...newMeal, id: Date.now(), loggedAt: newMeal.logged_at, wasSwap: newMeal.was_swap, hasRisks: newMeal.has_risks, moodAfter: newMeal.mood_after }, ...prev]);
    }
  };

  const toggleFavorite = async (foodId) => {
    if (!user) return;
    const isFav = favorites.includes(foodId);
    try {
      if (isFav) await FavoritesRepository.remove(user.id, foodId);
      else await FavoritesRepository.add(user.id, foodId);
      setFavorites(prev => isFav ? prev.filter(id => id !== foodId) : [...prev, foodId]);
    } catch (e) {
      console.error('Fav error:', e);
      setFavorites(prev => isFav ? prev.filter(id => id !== foodId) : [...prev, foodId]);
    }
  };

  useEffect(() => {
    if (user && mealHistory.length > 0) {
      localStorage.setItem(`nourish_data_${user.id}`, JSON.stringify({ meals: mealHistory, favorites }));
    }
  }, [mealHistory, favorites, user]);

  const todayMeals = mealHistory.filter(m => new Date(m.loggedAt).toDateString() === new Date().toDateString());

  return (
    <NutritionContext.Provider value={{ mealHistory, todayMeals, favorites, logMeal, toggleFavorite, loading }}>
      {children}
    </NutritionContext.Provider>
  );
}

export const useNutrition = () => useContext(NutritionContext);
