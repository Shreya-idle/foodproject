// Façade hook — wraps WeatherEngine + HealthPlanEngine
import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthStore';
import { useMeals } from './useMeals';
import { getWeatherDietTips } from '../utils/api';
import { generateHealthPlan } from '../utils/planGenerator';

export function useHealthPlan() {
  const { user } = useAuth();
  const { mealHistory } = useMeals();
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await getWeatherDietTips(pos.coords.latitude, pos.coords.longitude);
            setWeatherData(data);
            setLoadingWeather(false);
          },
          async () => {
            const data = await getWeatherDietTips();
            setWeatherData(data);
            setLoadingWeather(false);
          }
        );
      } else {
        const data = await getWeatherDietTips();
        setWeatherData(data);
        setLoadingWeather(false);
      }
    }
    fetchWeather();
  }, []);

  const generatePlan = () => {
    if (!user || !weatherData) return;
    const p = generateHealthPlan(user, mealHistory, weatherData);
    setPlan(p);
    return p;
  };

  return { weatherData, loadingWeather, plan, generatePlan };
}
