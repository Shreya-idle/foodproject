// Façade hook — wraps NutritionStore, exposes clean interface to UI
import { useNutrition } from '../store/NutritionStore';
import { NutritionAnalytics } from '../domain/analytics/NutritionAnalytics';
import { useMemo } from 'react';

export function useMeals() {
  const { mealHistory, todayMeals, logMeal, loading } = useNutrition();

  const streak = useMemo(() => NutritionAnalytics.calculateStreak(mealHistory), [mealHistory]);
  const summary = useMemo(() => NutritionAnalytics.getSummary(mealHistory, 7), [mealHistory]);
  const moodInsights = useMemo(() => NutritionAnalytics.getMoodInsights(mealHistory), [mealHistory]);

  return { mealHistory, todayMeals, logMeal, streak, summary, moodInsights, loading };
}
