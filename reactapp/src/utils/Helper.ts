// import sunnyIcon from '../weather-icons/01d.png';
// import partlyCloudyIcon from '../weather-icons/02d.png';
// import cloudyIcon from '../weather-icons/03d.png';
// import overcastIcon from '../weather-icons/04d.png';
// import rainyIcon from '../weather-icons/09d.png';
// import rainyAndSunnyIcon from '../weather-icons/10d.png'
// import stormyIcon from '../weather-icons/11d.png';
// import snowIcon from '../weather-icons/13d.png';
// import mistIcon from '../weather-icons/50d.png';

// const weatherIconMapping: { codes: number[]; icon: string }[] = [
//   { codes: [1000], icon: sunnyIcon }, // Sunny / Clear
//   { codes: [1003], icon: partlyCloudyIcon }, // Partly cloudy
//   { codes: [1006], icon: cloudyIcon }, 
//   { codes: [1009], icon: overcastIcon}, // Cloudy / Overcast
//   { codes: [1030, 1135, 1147], icon: mistIcon }, // Mist
//   { codes: [1072, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201], icon: rainyIcon },
//   { codes: [1063, 1150, 1153, 1168], icon: rainyAndSunnyIcon}, // Patchy rain possible
//   { codes: [1087], icon: stormyIcon }, // Thundery outbreaks possible
//   { codes: [1066, 1069, 1114, 1117], icon: snowIcon }, // Patchy snow / sleet possible
// ];

// export const getWeatherIcon = (weatherCode: number): string => {
//   return weatherIconMap[weatherCode] || sunnyIcon; // Default to sunnyIcon if no match
// };

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
