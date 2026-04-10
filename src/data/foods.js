// Food database with nutritional data
export const foodDatabase = [
  { id: 1, name: 'Quinoa Buddha Bowl', category: 'Bowls', vitality: 92, calories: 420, protein: 18, carbs: 52, fat: 14, fiber: 9, mood: 'energized', tags: ['High Protein', 'Gluten Free', 'Vegan'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format', swapFor: null, description: 'Nutrient-dense bowl with quinoa, roasted veggies, and tahini dressing.' },
  { id: 2, name: 'Pepperoni Pizza (2 slices)', category: 'Fast Food', vitality: 31, calories: 570, protein: 22, carbs: 62, fat: 28, fiber: 3, mood: 'comfort', tags: ['High Calorie', 'Processed'], image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format', swapFor: 3, description: 'Classic comfort food, high in sodium and saturated fat.' },
  { id: 3, name: 'Cauliflower Crust Veggie Pizza', category: 'Smart Swap', vitality: 76, calories: 320, protein: 14, carbs: 28, fat: 16, fiber: 6, mood: 'satisfied', tags: ['Low Carb', 'Smart Swap'], image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&auto=format', swapFor: null, description: 'All the pizza satisfaction with a fraction of the empty carbs.' },
  { id: 4, name: 'Grilled Salmon & Greens', category: 'Protein', vitality: 94, calories: 480, protein: 38, carbs: 12, fat: 22, fiber: 5, mood: 'focused', tags: ['Omega-3', 'Brain Food'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format', swapFor: null, description: 'Rich in omega-3 fatty acids for brain health and mental clarity.' },
  { id: 5, name: 'Chicken Biryani', category: 'Rice', vitality: 52, calories: 650, protein: 30, carbs: 78, fat: 22, fiber: 4, mood: 'comfort', tags: ['High Carb', 'Spiced'], image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format', swapFor: 6, description: 'Aromatic spiced rice with tender chicken — rich but heavy.' },
  { id: 6, name: 'Chicken & Cauliflower Rice Bowl', category: 'Smart Swap', vitality: 82, calories: 380, protein: 32, carbs: 22, fat: 14, fiber: 7, mood: 'energized', tags: ['Low Carb', 'Smart Swap'], image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format', swapFor: null, description: 'Same spiced chicken, swapped for cauliflower rice — 40% fewer carbs.' },
  { id: 7, name: 'Avocado Toast with Eggs', category: 'Breakfast', vitality: 85, calories: 380, protein: 16, carbs: 32, fat: 22, fiber: 8, mood: 'energized', tags: ['Good Fats', 'Morning Boost'], image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format', swapFor: null, description: 'Heart-healthy fats plus protein to kickstart your morning.' },
  { id: 8, name: 'Double Cheeseburger', category: 'Fast Food', vitality: 22, calories: 820, protein: 42, carbs: 54, fat: 48, fiber: 2, mood: 'sluggish', tags: ['Ultra Processed', 'High Sodium'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format', swapFor: 9, description: 'Calorie bomb with high saturated fat and sodium levels.' },
  { id: 9, name: 'Turkey Lettuce Wrap Burger', category: 'Smart Swap', vitality: 79, calories: 340, protein: 28, carbs: 12, fat: 18, fiber: 4, mood: 'satisfied', tags: ['Lean Protein', 'Smart Swap'], image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&auto=format', swapFor: null, description: 'All the burger satisfaction with lean turkey and fresh lettuce wrap.' },
  { id: 10, name: 'Greek Yogurt Parfait', category: 'Snack', vitality: 88, calories: 280, protein: 18, carbs: 34, fat: 8, fiber: 4, mood: 'refreshed', tags: ['Probiotic', 'Calcium Rich'], image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format', swapFor: null, description: 'Creamy yogurt layered with fresh berries and granola.' },
  { id: 11, name: 'Masala Dosa', category: 'Breakfast', vitality: 60, calories: 370, protein: 8, carbs: 52, fat: 14, fiber: 5, mood: 'comfort', tags: ['Fermented', 'Traditional'], image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format', swapFor: null, description: 'Crispy fermented crepe with spiced potato filling — probiotic benefits from fermentation.' },
  { id: 12, name: 'Green Smoothie Bowl', category: 'Bowls', vitality: 90, calories: 310, protein: 12, carbs: 48, fat: 8, fiber: 10, mood: 'refreshed', tags: ['Detox', 'Vitamin C'], image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format', swapFor: null, description: 'Spinach, banana, mango blend topped with chia and coconut.' },
];

export const moodOptions = [
  { value: 'energized', emoji: '⚡', label: 'Energized', color: 'text-yellow-500' },
  { value: 'focused', emoji: '🎯', label: 'Focused', color: 'text-blue-500' },
  { value: 'satisfied', emoji: '😊', label: 'Satisfied', color: 'text-green-500' },
  { value: 'comfort', emoji: '🛋️', label: 'Comfort', color: 'text-orange-500' },
  { value: 'refreshed', emoji: '🌊', label: 'Refreshed', color: 'text-cyan-500' },
  { value: 'sluggish', emoji: '😴', label: 'Sluggish', color: 'text-gray-500' },
];

export const healthTips = [
  "Eating slowly helps your brain register fullness — try putting your fork down between bites.",
  "Hydration matters: 500ml of water 30 minutes before a meal reduces calorie intake by 13%.",
  "Foods rich in fiber keep you full longer and stabilize blood sugar levels.",
  "Omega-3 fatty acids in fish improve brain function and reduce inflammation.",
  "Fermented foods like yogurt and kimchi support gut microbiome diversity.",
  "Eating protein at breakfast reduces snacking urges throughout the day by 25%.",
  "Colorful plates = nutritious plates. Aim for 3 different colors per meal.",
  "Post-meal walks of just 10 minutes can reduce blood sugar spikes by 22%.",
];
