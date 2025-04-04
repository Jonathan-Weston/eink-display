import sunnyIcon from '../weather-icons/01d.png';
import cloudyIcon from '../weather-icons/02d.png';
import rainyIcon from '../weather-icons/09d.png';
import stormyIcon from '../weather-icons/11d.png';

export const getWeatherIcon = (weatherCondition: string) => {
    switch (weatherCondition) {
      case 'Clear':
        return sunnyIcon;
      case 'Clouds':
        return cloudyIcon;
      case 'Rain':
        return rainyIcon;
      case 'Thunderstorm':
        return stormyIcon;
      default:
        return sunnyIcon; // Default to sunny icon if no match
    }
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
