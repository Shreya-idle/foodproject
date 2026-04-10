import chemicals from '../data/chemicals.json';

const WEATHER_API_KEY = 'aac9ac15f1a041feb8393129261004';
const WEATHER_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const FOOD_BASE = 'https://world.openfoodfacts.org/api/v0/product';

/**
 * Fetch product data from OpenFoodFacts by UPC/barcode
 */
export async function fetchProductByBarcode(upc) {
  try {
    const res = await fetch(`${FOOD_BASE}/${upc}.json`);
    const data = await res.json();
    if (data.status !== 1) return null;

    const p = data.product;
    return {
      name: p.product_name || 'Unknown Product',
      brand: p.brands || '',
      image: p.image_front_small_url || p.image_url || '',
      ingredients: p.ingredients_text || '',
      nutriscore: p.nutriscore_grade || '',
      nova: p.nova_group || '',
      nutrients: {
        calories: p.nutriments?.['energy-kcal_100g'] || 0,
        sugars: p.nutriments?.sugars_100g || 0,
        fat: p.nutriments?.fat_100g || 0,
        saturatedFat: p.nutriments?.['saturated-fat_100g'] || 0,
        salt: p.nutriments?.salt_100g || 0,
        fiber: p.nutriments?.fiber_100g || 0,
        protein: p.nutriments?.proteins_100g || 0,
        carbs: p.nutriments?.carbohydrates_100g || 0,
      },
      categories: p.categories || '',
      allergens: p.allergens || '',
    };
  } catch (err) {
    console.error('OpenFoodFacts fetch error:', err);
    return null;
  }
}

/**
 * Scan ingredients text for known harmful chemicals
 */
export function analyzeChemicalRisks(ingredientsText) {
  if (!ingredientsText) return [];
  const text = ingredientsText.toLowerCase();

  const found = [];
  Object.entries(chemicals).forEach(([name, info]) => {
    // Match chemical name variants in the ingredients
    const searchTerms = [name.toLowerCase()];
    // Add common alternative forms
    if (name === 'High Fructose Corn Syrup') searchTerms.push('hfcs', 'glucose-fructose');
    if (name === 'MSG') searchTerms.push('monosodium glutamate', 'e621');
    if (name === 'BHA') searchTerms.push('butylated hydroxyanisole', 'e320');
    if (name === 'BHT') searchTerms.push('butylated hydroxytoluene', 'e321');
    if (name === 'Yellow 5') searchTerms.push('tartrazine', 'e102');
    if (name === 'Yellow 6') searchTerms.push('sunset yellow', 'e110');
    if (name === 'Red 40') searchTerms.push('allura red', 'e129');
    if (name === 'Sodium Benzoate') searchTerms.push('e211');
    if (name === 'Acesulfame K') searchTerms.push('acesulfame potassium', 'e950');
    if (name === 'Aspartame') searchTerms.push('e951');
    if (name === 'Carrageenan') searchTerms.push('e407');
    if (name === 'Sulfites') searchTerms.push('sulphites', 'sulfur dioxide', 'e220', 'e221');
    if (name === 'Titanium Dioxide') searchTerms.push('e171');
    if (name === 'Maida') searchTerms.push('refined wheat flour', 'all-purpose flour');

    if (searchTerms.some(term => text.includes(term))) {
      found.push({ name, ...info });
    }
  });

  return found;
}

/**
 * Check product against user health conditions (diabetes, hypertension, etc.)
 */
export function checkHealthLimits(nutrients, conditions = []) {
  const warnings = [];

  if (conditions.includes('diabetes')) {
    if (nutrients.sugars > 15) warnings.push({ type: 'danger', message: `⚠️ High sugar: ${nutrients.sugars}g/100g — exceeds safe limit for diabetes (15g)` });
    else if (nutrients.sugars > 8) warnings.push({ type: 'warning', message: `Sugar: ${nutrients.sugars}g/100g — moderate, monitor intake` });
  }

  if (conditions.includes('hypertension')) {
    if (nutrients.salt > 1.5) warnings.push({ type: 'danger', message: `⚠️ High salt: ${nutrients.salt}g/100g — risky for blood pressure` });
  }

  if (conditions.includes('heart')) {
    if (nutrients.saturatedFat > 5) warnings.push({ type: 'danger', message: `⚠️ High saturated fat: ${nutrients.saturatedFat}g/100g — heart risk` });
    if (nutrients.fat > 17) warnings.push({ type: 'warning', message: `High total fat: ${nutrients.fat}g/100g` });
  }

  if (conditions.includes('obesity')) {
    if (nutrients.calories > 350) warnings.push({ type: 'danger', message: `⚠️ Calorie dense: ${nutrients.calories} kcal/100g` });
    if (nutrients.sugars > 12) warnings.push({ type: 'warning', message: `High sugar content: ${nutrients.sugars}g/100g` });
  }

  // Universal checks
  if (nutrients.sugars > 22.5) warnings.push({ type: 'danger', message: `Extremely high sugar: ${nutrients.sugars}g/100g (UK NHS red)` });
  if (nutrients.fat > 17.5) warnings.push({ type: 'warning', message: `High fat content: ${nutrients.fat}g/100g` });

  return warnings;
}

/**
 * Fetch weather and generate diet suggestions
 */
export async function getWeatherDietTips(lat, lon) {
  try {
    let url;
    if (lat && lon) {
      url = `${WEATHER_BASE}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
    } else {
      // Default to Bhopal, India
      url = `${WEATHER_BASE}?q=Bhopal,IN&units=metric&appid=${WEATHER_API_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    const temp = data.main?.temp || 30;
    const humidity = data.main?.humidity || 50;
    const weather = data.weather?.[0]?.main || 'Clear';
    const city = data.name || 'your area';

    const tips = [];

    if (temp > 35) {
      tips.push({ emoji: '🥤', tip: 'Extreme heat! Prioritize: coconut water, watermelon, cucumber raita, buttermilk' });
      tips.push({ emoji: '🚫', tip: 'Avoid: heavy curries, fried foods, excess caffeine' });
    } else if (temp > 30) {
      tips.push({ emoji: '🥗', tip: 'Hot day — go for salads, yogurt, fresh fruits, light meals' });
      tips.push({ emoji: '💧', tip: 'Stay hydrated: aim for 3L+ water today' });
    } else if (temp > 20) {
      tips.push({ emoji: '⚖️', tip: 'Pleasant weather — perfect for balanced meals with whole grains' });
    } else if (temp > 10) {
      tips.push({ emoji: '🍲', tip: 'Cool weather — warm soups, dal, and herbal tea are great choices' });
    } else {
      tips.push({ emoji: '🔥', tip: 'Cold day! Go for hot oatmeal, ginger tea, turmeric milk, warm dals' });
    }

    if (humidity > 80) {
      tips.push({ emoji: '🫚', tip: 'High humidity — add ginger & turmeric to fight bloating' });
    }

    if (weather === 'Rain') {
      tips.push({ emoji: '☕', tip: 'Rainy day — herbal chai and steamed snacks over fried pakoras!' });
    }

    return { temp, humidity, weather, city, tips };
  } catch (err) {
    console.error('Weather API error:', err);
    return {
      temp: 30, humidity: 50, weather: 'Clear', city: 'Unknown',
      tips: [{ emoji: '🥗', tip: 'Eat seasonal fruits and stay hydrated!' }],
    };
  }
}
