/**
 * Domain Logic: Nutrition Analytics
 * Pure functions for calculating stats, streaks, and insights.
 */

export const NutritionAnalytics = {
  calculateStreak(mealHistory) {
    if (!mealHistory || mealHistory.length === 0) return 0;
    const sorted = [...mealHistory].sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));
    let streak = 0;
    let currentDate = new Date().toDateString();
    for (const meal of sorted) {
      const mealDate = new Date(meal.loggedAt).toDateString();
      if (mealDate === currentDate || streak === 0) {
        if (meal.vitality >= 60) streak++;
        currentDate = new Date(new Date(mealDate).getTime() - 86400000).toDateString();
      } else break;
    }
    return streak;
  },

  getSummary(mealHistory, days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const recent = mealHistory.filter(m => new Date(m.loggedAt) >= cutoff);
    if (recent.length === 0) return null;
    const totals = recent.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
      fiber: acc.fiber + m.fiber,
      vitality: acc.vitality + m.vitality,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vitality: 0 });
    return {
      totalMeals: recent.length,
      avgVitality: Math.round(totals.vitality / recent.length),
      avgCalories: Math.round(totals.calories / recent.length),
      avgProtein: Math.round(totals.protein / recent.length),
      healthyMeals: recent.filter(m => m.vitality >= 70).length,
    };
  },

  getMoodInsights(mealHistory) {
    if (!mealHistory || mealHistory.length < 3) return { moodCorrelations: {} };
    const moodFoodMap = {};
    mealHistory.forEach(meal => {
      if (meal.moodAfter) {
        if (!moodFoodMap[meal.moodAfter]) moodFoodMap[meal.moodAfter] = [];
        moodFoodMap[meal.moodAfter].push({ vitality: meal.vitality, category: meal.category });
      }
    });

    const insights = {};
    Object.entries(moodFoodMap).forEach(([mood, data]) => {
      const avgVitality = data.reduce((s, f) => s + f.vitality, 0) / data.length;
      const cats = {};
      data.forEach(f => { cats[f.category] = (cats[f.category] || 0) + 1; });
      insights[mood] = {
        avgVitality: Math.round(avgVitality),
        commonCategory: Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various'
      };
    });
    return { moodCorrelations: insights };
  }
};
