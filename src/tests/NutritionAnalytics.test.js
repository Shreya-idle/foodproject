import { describe, it, expect } from 'vitest';
import { NutritionAnalytics } from '../domain/analytics/NutritionAnalytics';

describe('NutritionAnalytics', () => {
  it('should calculate streak correctly', () => {
    const history = [
      { loggedAt: new Date().toISOString(), vitality: 70 },
      { loggedAt: new Date(Date.now() - 86400000).toISOString(), vitality: 80 }
    ];
    expect(NutritionAnalytics.calculateStreak(history)).toBe(2);
  });

  it('should return 0 streak if no healthy meals today', () => {
    const history = [
      { loggedAt: new Date().toISOString(), vitality: 30 }
    ];
    // Since current date meal didn't meet threshold (60)
    expect(NutritionAnalytics.calculateStreak(history)).toBe(0);
  });

  it('should generate correct summary', () => {
    const history = [
      { loggedAt: new Date().toISOString(), calories: 500, vitality: 80, protein: 20, carbs: 50, fat: 10, fiber: 5 },
      { loggedAt: new Date().toISOString(), calories: 300, vitality: 60, protein: 10, carbs: 30, fat: 5, fiber: 2 }
    ];
    const summary = NutritionAnalytics.getSummary(history);
    expect(summary.totalMeals).toBe(2);
    expect(summary.avgVitality).toBe(70);
    expect(summary.healthyMeals).toBe(1); // Only the first one is >= 70
  });

  it('should correlate moods correctly', () => {
    const history = [
      { moodAfter: 'Focused', vitality: 90, category: 'Healthy' },
      { moodAfter: 'Focused', vitality: 80, category: 'Healthy' },
      { moodAfter: 'Sleepy', vitality: 40, category: 'Junk' }
    ];
    const insights = NutritionAnalytics.getMoodInsights(history);
    expect(insights.moodCorrelations['Focused'].avgVitality).toBe(85);
    expect(insights.moodCorrelations['Focused'].commonCategory).toBe('Healthy');
  });
});
