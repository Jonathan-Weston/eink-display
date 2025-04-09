import React, { useEffect, useState } from 'react';
import styles from './CurrentWeather.module.css';
import WeatherDetailItem from './WeatherDetailItem/WeatherDetailItem';
import windIcon from '../../../weather-icons/wind.png';
import humidityIcon from '../../../weather-icons/humidity.png';
import pressureIcon from '../../../weather-icons/pressure.png';
import uvIcon from '../../../weather-icons/uvi.png';
import visibilityIcon from '../../../weather-icons/visibility.png';
import airQualityIcon from '../../../weather-icons/aqi.png';
import sunRiseIcon from '../../../weather-icons/sunrise.png';
import sunSetIcon from '../../../weather-icons/sunset.png';

interface WeatherData {
  current: {
    pressure_mb: number;
    air_quality: {
      "gb-defra-index": number;
    };
  };
  forecast: {
    forecastday: {
      day: {
        avgtemp_c: number;
        maxwind_mph: number;
        avghumidity: number;
        avgvis_miles: number;
        uv: number;
        condition: {
          text: string;
          icon: string;
        }
      }
      astro: {
        sunrise: string;
        sunset: string;
      };
    }[];
  };
}

export const CurrentWeather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your WeatherAPI key
  const CITY = 'Worthing'; // You can change this city if needed

  const getAirQualityValue = (value: number) => {
    if (value <= 3) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 9) return 'High';
    if (value <= 10) return 'Moderate';
    return 'Hazardous';
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=1&aqi=yes&alerts=no`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
        setError(null); // Clear any previous error
      } catch (err: any) {
        setError(err.message);
        setWeather(null); // Clear any previous data
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [API_KEY]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="container" className={styles['Container']}>
      <div className={styles['CurrentWeather-summary']}>
        <div id="currentWeatherImage" className={styles['CurrentWeather-icon']}>
          {weather?.forecast.forecastday[0]?.day?.condition?.icon && (
            <img
              src={`https:${weather.forecast.forecastday[0].day.condition.icon}`} // Use WeatherAPI icon URL
              alt={weather.forecast.forecastday[0].day.condition.text || 'Weather Icon'}
            />
          )}
        </div>
        <div className={styles['CurrentWeather-temperature']}>
          <span id="current-weather-temperature" className={styles['CurrentWeather-temperature-value']}>
            {weather?.forecast.forecastday[0].day.avgtemp_c.toFixed(0) || ''}
          </span>
          <span className={styles['CurrentWeather-temperature-unit']}>°C</span>
        </div>
      </div>
      <div className={styles['CurrentWeather-details']}>
        <ul className={styles['WeatherDetails']}>
          <WeatherDetailItem
            label="Sunrise"
            value={weather?.forecast.forecastday[0].astro.sunrise || ''}
            icon={sunRiseIcon}
            altText="Sunrise Icon"
          />
          <WeatherDetailItem
            label="Sunset"
            value={weather?.forecast.forecastday[0].astro.sunset || ''}
            icon={sunSetIcon}
            altText="Sunset Icon"
          />
          <WeatherDetailItem
            label="Wind"
            value={weather?.forecast.forecastday[0].day.maxwind_mph.toFixed(0) || ''}
            unit="mph"
            icon={windIcon} // Use local wind icon
            altText="Wind Icon"
          />
          <WeatherDetailItem
            label="Humidity"
            value={weather?.forecast.forecastday[0].day.avghumidity || ''}
            unit="%"
            icon={humidityIcon} // Use local humidity icon
            altText="Humidity Icon"
          />
          <WeatherDetailItem
            label="UV Index"
            value={weather?.forecast.forecastday[0].day.uv || ''}
            icon={uvIcon} // Use local UV index icon
            altText="UV Index Icon"
          />
          <WeatherDetailItem
            label="Visibility"
            value={weather?.forecast.forecastday[0].day.avgvis_miles || ''}
            unit="km"
            icon={visibilityIcon} // Use local visibility icon
            altText="Visibility Icon"
          />
        </ul>
      </div>
    </div>
  );
};

export default CurrentWeather;