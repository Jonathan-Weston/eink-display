import React, { useEffect, useRef, useState } from "react";
import { Chart, LineController, BarController, LinearScale, CategoryScale, PointElement, LineElement, BarElement, Filler } from "chart.js";
import styles from './HourlyWeather.module.css';

Chart.register(LineController, BarController, LinearScale, CategoryScale, PointElement, LineElement, BarElement, Filler);

const HourlyTemperatureChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  interface HourlyForecast {
    time: string;
    temperature: number;
    precip_mm: number;
  }

  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Worthing&hours=12`);
        const data = await response.json();
        const forecast = data.forecast.forecastday[0].hour.map((hour: { time: string; temp_c: any; precip_mm: any; }) => ({
          time: hour.time.split(" ")[1],
          temperature: hour.temp_c,
          precip_mm: hour.precip_mm,
        }));
        setHourlyForecast(forecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [API_KEY]);

  useEffect(() => {
    if (!hourlyForecast || hourlyForecast.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = hourlyForecast.map((hour) => hour.time);
    const temperatures = hourlyForecast.map((hour) => hour.temperature);
    const precipitation = hourlyForecast.map((hour) => hour.precip_mm * 100);

    const minTemp = Math.min(...temperatures);
    let maxTemp = Math.max(...temperatures);

    if (maxTemp - minTemp < 4) {
      maxTemp += 2;
    }

    chartInstance.current = new Chart(ctx, {
      data: {
        labels,
        datasets: [{
          type: 'line',
          label: 'Hourly Temperature',
          data: temperatures,
          borderColor: 'rgba(241, 122, 36, 0.9)', // Line color
          borderWidth: 2,
          pointRadius: 0, // Hide points
          fill: true, // Enable filling the area under the line
          tension: 0.5
        },
        {
          type: 'bar',
          label: 'Precipitation Probability',
          data: precipitation,
          borderColor: 'rgba(26, 111, 176, 1)',
          borderWidth: {
            top: 2,
            right: 0,
            bottom: 0,
            left: 0
          },
          yAxisID: 'y1',
          barPercentage: 1.0, // Ensures full width
          categoryPercentage: 1.0,  // Ensures full width// Enable filling the area under the line
        }
      ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              font: { family: "Jost" },
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              font: { family: "Jost" },
              callback: (value, index, values) =>
                index === values.length - 1 ? `${maxTemp}°` : index === 0 ? `${minTemp}°` : "",
            },
            grid: { display: false },
            suggestedMin: minTemp,
            suggestedMax: maxTemp,
          },
          y1: {
            position: "right",
            grid: { display: false },
            ticks: {
              font: { family: "Jost" },
              callback: (value, index, values) =>
                index === values.length - 1 ? "100%" : index === 0 ? "0%" : "",
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: { legend: { display: false } },
        elements: {
          line: { borderJoinStyle: "round" },
        },
      },
    });


    let tempGradient;
    let precipitationGradient;
    if (ctx) {
      const gradientStart = chartInstance.current.scales['y'].getPixelForValue(maxTemp);
      const gradientEnd = chartInstance.current.scales['y'].getPixelForValue(minTemp);
      
      if (gradientStart !== undefined && gradientEnd !== undefined) {
        tempGradient = ctx.createLinearGradient(0, gradientStart, 0, gradientEnd + 10);
        tempGradient.addColorStop(0, 'rgba(252,204,5, 0.9)');
        tempGradient.addColorStop(1, 'rgba(252,204,5, 0.01)');
        precipitationGradient = ctx.createLinearGradient(0, gradientStart, 0, gradientEnd);
        precipitationGradient.addColorStop(0, 'rgba(26, 111, 176, 0.9)'); // Top of the gradient (max temperature)
        precipitationGradient.addColorStop(1, 'rgba(194, 223, 246, 0)');
      }

      chartInstance.current.data.datasets[0].backgroundColor = tempGradient;
      chartInstance.current.data.datasets[1].backgroundColor = precipitationGradient;
      chartInstance.current.update();
    }

  }, [hourlyForecast]);

  return (
    <div className={styles.hourlyWeatherContainer}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default HourlyTemperatureChart;
