// Façade hook — wraps NutritionStore + RecommendationEngine
import { useMemo } from 'react';
import { useNutrition } from '../store/NutritionStore';
import { NutritionAnalytics } from '../domain/analytics/NutritionAnalytics';
import { RecommendationEngine } from '../domain/engines/RecommendationEngine';

function buildProfile(mealHistory) {
  if (!mealHistory || mealHistory.length === 0) {
    return { categoryAffinity: {}, avgVitality: 50, totalMeals: 0 };
  }
  const categoryCount = {};
  let totalVitality = 0;
  mealHistory.forEach(meal => {
    categoryCount[meal.category] = (categoryCount[meal.category] || 0) + 1;
    totalVitality += meal.vitality || 0;
  });
  return {
    categoryAffinity: categoryCount,
    avgVitality: Math.round(totalVitality / mealHistory.length),
    totalMeals: mealHistory.length,
  };
}

export function useRecommendations() {
  const { mealHistory, todayMeals, favorites, toggleFavorite } = useNutrition();

  const profile = useMemo(() => buildProfile(mealHistory), [mealHistory]);

  const recommendations = useMemo(
    () => RecommendationEngine.getRecommendations(mealHistory, todayMeals, profile).slice(0, 8),
    [mealHistory, todayMeals, profile]
  );

  return { recommendations, profile, favorites, toggleFavorite };
}
