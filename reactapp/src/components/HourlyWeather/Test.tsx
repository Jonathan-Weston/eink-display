import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Chart
  } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './HourlyWeather.module.css';
import { getChartData, getChartOptions, createGradient } from './ChartHelper';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
)

const Test = () => {
    interface HourlyForecast {
        time: string;
        temperature: number;
    }
    const API_KEY = process.env.REACT_APP_API_KEY;
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Worthing&hours=12`);
                const data = await response.json();
                const forecast = data.forecast.forecastday[0].hour.map((hour: { time: string; temp_c: any }) => ({
                    time: hour.time.split(" ")[1],
                    temperature: hour.temp_c
                }));
                setHourlyForecast(forecast);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        fetchWeatherData();

        if(!hourlyForecast || hourlyForecast.length === 0) return;
    }, []);

    const labels = hourlyForecast.map((hour) => hour.time);
    const temperatures = hourlyForecast.map((hour) => hour.temperature);

    const options = getChartOptions();
    const data = getChartData(labels, temperatures);
    const tempGradient = createGradient(
        chartRef, 
        Math.max(...temperatures), 
        Math.min(...temperatures),
        'rgba(252,204,5, 0.9)',
        'rgba(252,204,5, 0.01)'
    );
    // chartRef.current.chartInstance.data.datasets[0].backgroundColor = tempGradient;

    return (
        <div className={styles.hourlyWeatherContainer}> 
            {data && <Line options={options} data={data} />}
        </div>
    )
};

export default Test;
