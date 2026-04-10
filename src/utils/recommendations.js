// Backward-compatibility shim — re-exports from domain layer
import { NutritionAnalytics } from '../domain/analytics/NutritionAnalytics';
import { RecommendationEngine } from '../domain/engines/RecommendationEngine';

export { NutritionAnalytics };
export { RecommendationEngine };

// Legacy named function exports kept for backward compat
export const calculateStreak = (h) => NutritionAnalytics.calculateStreak(h);
export const getNutritionSummary = (h, d) => NutritionAnalytics.getSummary(h, d);
export const getMoodFoodInsights = (h) => NutritionAnalytics.getMoodInsights(h);

export function buildUserProfile(mealHistory) {
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

export function getRecommendations(mealHistory, todayMeals) {
  const profile = buildUserProfile(mealHistory);
  return RecommendationEngine.getRecommendations(mealHistory, todayMeals, profile);
}
