import { describe, it, expect } from 'vitest';
import { RecommendationEngine } from '../domain/engines/RecommendationEngine';

describe('RecommendationEngine', () => {
  it('should return recommendations sorted by score', () => {
    const history = [];
    const today = [];
    const profile = { categoryAffinity: {}, avgVitality: 50, totalMeals: 0 };
    
    const recs = RecommendationEngine.getRecommendations(history, today, profile);
    
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].recommendationScore).toBeGreaterThanOrEqual(recs[1].recommendationScore);
  });

  it('should boost scores for category affinity', () => {
    const profile = { 
      categoryAffinity: { 'Breakfast': 5 }, // Strong preference for Breakfast
      avgVitality: 50, 
      totalMeals: 10 
    };
    
    const recs = RecommendationEngine.getRecommendations([], [], profile);
    const breakfastItem = recs.find(f => f.category === 'Breakfast');
    
    // Base vitality for Greek Yogurt (Breakfast) is 92.
    // Category boost: min(5 * 3, 15) = 15.
    // Total should be around 100 (capped).
    expect(breakfastItem.recommendationScore).toBe(100);
  });

  it('should penalize foods already eaten today', () => {
    const today = [{ name: 'Greek Yogurt Parfait' }];
    const profile = { categoryAffinity: {}, avgVitality: 50, totalMeals: 0 };
    
    const recs = RecommendationEngine.getRecommendations([], today, profile);
    const eatenItem = recs.find(f => f.name === 'Greek Yogurt Parfait');
    
    // Should be significantly lower due to -50 penalty
    expect(eatenItem.recommendationScore).toBeLessThan(50);
  });
});
