import clearSkyIcon from '../weather-icons/clear_day.svg';
import mainlyClearIcon from '../weather-icons/mostly_clear_day.svg';
import partlyCloudyIcon from '../weather-icons/partly_cloudy_day.svg';
import overcastIcon from '../weather-icons/cloudy.svg';
import fogIcon from '../weather-icons/haze_fog_dust_smoke.svg';
import drizzleIcon from '../weather-icons/drizzle.svg';
import freezingDrizzleIcon from '../weather-icons/mixed_rain_snow.svg';
import rainSlightIcon from '../weather-icons/drizzle.svg';
import rainModerateIcon from '../weather-icons/showers_rain.svg';
import rainHeavyIcon from '../weather-icons/heavy_rain.svg';
import snowIcon from '../weather-icons/heavy_snow.svg';
import thunderstormIcon from '../weather-icons/strong_thunderstorms.svg';
import thunderstormWithRainIcon from '../weather-icons/isolated_thunderstorms.svg';
import unknownIcon from '../weather-icons/tropical_storm_hurricane.svg';


const weatherIconMapping: { codes: number[]; icon: string }[] = [
  { codes: [0], icon: clearSkyIcon }, // Clear sky
  { codes: [1], icon: mainlyClearIcon }, // Mainly clear
  { codes: [2], icon: partlyCloudyIcon }, // Partly cloudy
  { codes: [3], icon: overcastIcon }, // Overcast
  { codes: [45, 48], icon: fogIcon }, // Fog or depositing rime fog
  { codes: [51, 53, 55], icon: drizzleIcon }, // Drizzle
  { codes: [56, 57, 66, 67], icon: freezingDrizzleIcon }, // Freezing drizzle
  { codes: [61, 63, 65, 80], icon: rainSlightIcon },
  { codes: [63, 81], icon: rainModerateIcon },  
  { codes: [65, 82], icon: rainHeavyIcon },
  { codes: [71, 73, 75, 77, 85, 86], icon: snowIcon }, // Snowfall
  { codes: [95], icon: thunderstormIcon }, // Thunderstorm
  { codes: [96, 99], icon: thunderstormWithRainIcon }, // Thunderstorm with hail
];


export const getWeatherIcon = (weatherCode: number): string => {
  const mapping = weatherIconMapping.find(entry => entry.codes.includes(weatherCode));
  return mapping ? mapping.icon : unknownIcon; // Default to unknownIcon if no match
};

export const formatTime = (epoch: number): string => {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; // Format as HH:mm
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', // Full weekday name (e.g., "Tuesday")
      day: '2-digit',  // Two-digit day (e.g., "02")
      month: 'long',   // Full month name (e.g., "April")
  }).format(date);
};
