import { foodDatabase } from '../../data/foods';

/**
 * Domain Logic: Recommendation Engine
 * Strategy Pattern: Scoring logic adapts to user context.
 */
export const RecommendationEngine = {
  getRecommendations(mealHistory, todayMeals, profile) {
    const todayNutrition = todayMeals.reduce((acc, m) => ({
      protein: acc.protein + (m.protein || 0),
      fiber: acc.fiber + (m.fiber || 0),
    }), { protein: 0, fiber: 0 });

    return foodDatabase.map(food => {
      let score = food.vitality;
      
      // Category affinity boost
      const affinity = profile.categoryAffinity?.[food.category] || 0;
      score += Math.min(affinity * 3, 15);

      // Vitality nudge
      if (profile.totalMeals > 3 && food.vitality > profile.avgVitality) score += 10;

      // Deficiency correction
      if (todayNutrition.protein < 40 && food.protein > 20) score += 12;
      if (todayNutrition.fiber < 15 && food.fiber > 6) score += 8;

      // Diversification penalization
      if (todayMeals.some(m => m.name === food.name)) score -= 50;

      return { ...food, recommendationScore: Math.min(score, 100) };
    })
    .filter(f => f.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }
};
