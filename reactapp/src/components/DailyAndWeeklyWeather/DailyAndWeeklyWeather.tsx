import React, { useEffect, useState } from 'react';
import style from './DailyAndWeeklyWeather.module.css';
import ForecastItem from './ForecastItem/ForecastItem';
import { getWeatherIcon } from '../../utils/Helper';

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
    };
  };
}

export const DailyAndWeeklyWeather = () => {
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your WeatherAPI key
  const CITY = 'Worthing'; // You can change this city if needed

  useEffect(() => {
    const fetchWeeklyForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=7&aqi=no&alerts=no`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weekly forecast');
        }

        const data = await response.json();
        setWeeklyForecast(data.forecast.forecastday);
        setError(null); // Clear any previous error
      } catch (err: any) {
        setError(err.message);
        setWeeklyForecast([]); // Clear any previous data
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyForecast();
  }, [API_KEY]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className={style.bottom}>
      <div className={`${style.forecast} ${style.forecastWeek}`}>
        <div className={style.forecastItems}>
          {weeklyForecast.slice(1).map((day) => (
            <ForecastItem
              key={day.date}
              img={getWeatherIcon(day.day.condition.text)} // Use the WeatherAPI icon URL
              day={new Date(day.date).toLocaleDateString('gb-UK', { weekday: 'short' })} // Format day (e.g., "Tue")
              maxTempValue={day.day.maxtemp_c.toFixed(0)} // Max temperature
              minTempValue={day.day.mintemp_c.toFixed(0)} // Min temperature
              percipitationValue={`${day.day.daily_chance_of_rain}`} // Chance of rain
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyAndWeeklyWeather;