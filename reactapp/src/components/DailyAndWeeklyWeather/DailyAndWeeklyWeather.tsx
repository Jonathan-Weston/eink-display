import React, { useEffect, useState } from 'react';
import style from './DailyAndWeeklyWeather.module.css';
import ForecastItem from './ForecastItem/ForecastItem';
import { getWeatherIcon } from '../../utils/Helper'; // Import getWeatherIcon

interface ForecastDay {
  date: string;
  maxtemp_c: number;
  mintemp_c: number;
  precipitation_sum: number;
  weather_code: number; // Add weather_code to the interface
}

export const DailyAndWeeklyWeather = () => {
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const LAT = 50.817; // Latitude for Worthing
  const LON = -0.375; // Longitude for Worthing

  useEffect(() => {
    const fetchWeeklyForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weekly forecast');
        }

        const data = await response.json();

        // Map the Open-Meteo response to match the ForecastDay interface
        const forecast = data.daily.time.map((date: string, index: number) => ({
          date,
          maxtemp_c: data.daily.temperature_2m_max[index],
          mintemp_c: data.daily.temperature_2m_min[index],
          precipitation_sum: data.daily.precipitation_sum[index],
          weather_code: data.daily.weathercode[index], // Include weather_code
        }));

        setWeeklyForecast(forecast);
        setError(null); // Clear any previous error
      } catch (err: any) {
        setError(err.message);
        setWeeklyForecast([]); // Clear any previous data
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyForecast();
  }, [LAT, LON]);

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
          {weeklyForecast.map((day) => (
            <ForecastItem
              key={day.date}
              img={getWeatherIcon(day.weather_code)} // Use getWeatherIcon to get the icon
              day={new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })} // Format day (e.g., "Tue")
              maxTempValue={day.maxtemp_c.toFixed(0)} // Max temperature
              minTempValue={day.mintemp_c.toFixed(0)} // Min temperature
              percipitationValue={day.precipitation_sum.toFixed(1)} // Precipitation sum
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyAndWeeklyWeather;