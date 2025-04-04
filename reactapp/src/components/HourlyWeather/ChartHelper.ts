export const getChartOptions = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        font: { family: "Jost" },
        grid: {display: false }
      },
      y: {
        font: { family: "Jost" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };
  return options;
};

export const getChartData = (labels: any, temperatures: any) => {
  const data = {
    labels,
    datasets: [{
        type: "line" as const,
        label: 'Hourly Temperature',
        data: temperatures,
        pointRadius: 0,
        tension: 0.5,
        fill: true,
        borderColor: 'rgba(241, 122, 36, 0.9)',
        borderWidth: 2
      },
    ],
  };
  return data;
}

const handleAccessScales = (chartRef: any) => {
  if (chartRef.current) {
    const chartInstance = chartRef.current.chartInstance; // Access the Chart.js instance
    console.log("X Scale:", chartInstance.scales.x);
    console.log("Y Scale:", chartInstance.scales.y);
  }
};

export const createGradient = (
  chartRef: any, 
  max: number, 
  min: number,
  color1: string,
  color2: string) => {
  const chartInstance = chartRef.current.chartInstance;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradientStart = chartInstance.scales['y'].getPixelForValue(max); // Max temperature
  const gradientEnd = chartInstance.scales['y'].getPixelForValue(min);   // Min temperature

  // Create gradient based on y-axis values
  const gradient = ctx.createLinearGradient(0, gradientStart, 0, gradientEnd+10);
  gradient.addColorStop(0, color1); // Top of the gradient (max temperature)
  gradient.addColorStop(1, color2); // Bottom of the gradient (min temperature)
  return gradient
}
