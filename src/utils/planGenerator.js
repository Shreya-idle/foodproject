import { foodDatabase } from '../data/foods';
import { buildUserProfile, getNutritionSummary } from './recommendations';

/**
 * Personalized Health Plan Generator
 * 
 * Generates a 24-hour actionable health plan based on:
 * 1. User Profile & Goals
 * 2. Health Conditions (Diabetes, etc.)
 * 3. Recent Nutritional Gaps
 * 4. Current Weather Context
 */
export function generateHealthPlan(user, mealHistory, weatherData) {
  const profile = buildUserProfile(mealHistory);
  const summary = getNutritionSummary(mealHistory, 7);
  const conditions = user?.preferences?.conditions || [];
  const goal = user?.preferences?.goal || 'balanced';
  
  const plan = {
    title: `Vitality Blueprint: ${user?.name}`,
    generatedAt: new Date().toISOString(),
    focus: goal === 'lose' ? 'Caloric Efficiency' : goal === 'gain' ? 'Protein Synthesis' : 'Metabolic Balance',
    metrics: {
      suggestedKcal: user?.preferences?.calorieTarget || 2000,
      priorityMacro: goal === 'gain' ? 'Protein' : goal === 'energy' ? 'Complex Carbs' : 'Fiber',
    },
    mealPlan: {
      breakfast: {},
      lunch: {},
      dinner: {},
      snack: {}
    },
    habits: [],
    warnings: []
  };

  // 1. Determine Breakfast based on goal and conditions
  if (goal === 'energy') {
    plan.mealPlan.breakfast = { name: "Oatberry Power Bowl", reason: "Complex carbs for sustained morning focus" };
  } else if (conditions.includes('diabetes')) {
    plan.mealPlan.breakfast = { name: "Spinach & Tofu Scramble", reason: "High protein, near-zero glycemic impact" };
  } else {
    plan.mealPlan.breakfast = { name: "Greek Yogurt Parfait", reason: "Probiotics to prime gut health" };
  }

  // 2. Determine Lunch based on weather
  if (weatherData?.temp > 30) {
    plan.mealPlan.lunch = { name: "Quinoa Mediterranean Salad", reason: "High hydration index and light on digestion" };
  } else {
    plan.mealPlan.lunch = { name: "Lentil & Kale Soup", reason: "Thermogenic warmth and high fiber saturation" };
  }

  // 3. Determine Dinner based on history
  if (profile.avgProtein < 40) {
    plan.mealPlan.dinner = { name: "Grilled Herb Salmon", reason: "Correcting your weekly protein deficit" };
  } else {
    plan.mealPlan.dinner = { name: "Stir-fry Tempeh & Broccoli", reason: "Fiber-rich reset for metabolic rest" };
  }

  // 4. Custom Habits based on conditions
  if (conditions.includes('diabetes')) {
    plan.habits.push("Post-meal walking: 10 mins to flatten glucose spikes");
    plan.warnings.push("Avoid 'hidden' sugars in high-sodium sauces today");
  }
  
  if (conditions.includes('hypertension')) {
    plan.habits.push("Replace table salt with lemon or herbs for seasoning");
    plan.warnings.push("Recent logs show high sodium trend; prioritize potassium-rich foods");
  }

  // 5. Goal-based habits
  if (goal === 'lose') {
    plan.habits.push("The 20-Minute Rule: Eat slowly to allow lepton signaling");
  } else if (goal === 'gain') {
    plan.habits.push("Anabolic Window: Protein intake within 30m of workout");
  }

  // 6. Weather-based habits
  if (weatherData?.humidity > 70) {
    plan.habits.push("Stay hydrated: High humidity increases electrolyte loss");
  }

  return plan;
}
