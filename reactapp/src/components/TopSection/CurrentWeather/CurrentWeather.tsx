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
import { getWeatherIcon } from '../../../utils/Helper';

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      icon: string;
    };
    wind_mph: number;
    humidity: number;
    pressure_mb: number;
    uv: number;
    vis_km: number;
    air_quality: {
      "gb-defra-index": number;
    };
  };
  forecast: {
    forecastday: {
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
  }

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
          {weather?.current && (
            <img
              src={getWeatherIcon(weather.current.condition.icon)} // Use WeatherAPI icon URL
              alt="Weather Icon"
            />
          )}
        </div>
        <div className={styles['CurrentWeather-temperature']}>
          <span id="current-weather-temperature" className={styles['CurrentWeather-temperature-value']}>
            {weather?.current.temp_c.toFixed(0)}
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
            altText='Sunrise Icon'
          />  
          <WeatherDetailItem
            label="Sunset"
            value={weather?.forecast.forecastday[0].astro.sunset || ''}
            icon={sunRiseIcon}
            altText='Sunset Icon'
          />  
          <WeatherDetailItem
            label="Wind"
            value={weather?.current.wind_mph.toFixed(0) || ''}
            unit="mph"
            icon={windIcon} // Use local wind icon
            altText="Wind Icon"
          />
          <WeatherDetailItem
            label="Humidity"
            value={weather?.current.humidity || ''}
            unit="%"
            icon={humidityIcon} // Use local humidity icon
            altText="Humidity Icon"
          />
          <WeatherDetailItem
            label="Pressure"
            value={weather?.current.pressure_mb || ''}
            unit="mb"
            icon={pressureIcon} // Use local pressure icon
            altText="Pressure Icon"
          />
          <WeatherDetailItem
            label="UV Index"
            value={weather?.current.uv || ''}
            icon={uvIcon} // Use local UV index icon
            altText="UV Index Icon"
          />
          <WeatherDetailItem
            label="Visibility"
            value={weather?.current.vis_km || ''}
            unit="km"
            icon={visibilityIcon} // Use local visibility icon
            altText="Visibility Icon"
          />
          <WeatherDetailItem
            label="Air Quality (PM2.5)"
            value={weather?.current.air_quality['gb-defra-index'] || ''}
            unit={getAirQualityValue(weather?.current.air_quality['gb-defra-index'] || 0)}
            icon={airQualityIcon} // Use local air quality icon
            altText="Air Quality Icon"
          />
        </ul>
      </div>
    </div>
  );
};

export default CurrentWeather;