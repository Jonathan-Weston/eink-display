import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import styles from './index.module.css';
import MainBody from './components/TopSection/TopSection';
import Header from './components/Header/Header';
import DailyAndWeeklyWeather from './components/DailyAndWeeklyWeather/DailyAndWeeklyWeather';
import HourlyWeather from './components/HourlyWeather/HourlyWeather';
import Test from './components/HourlyWeather/Test';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <body id="main-container" style={{ width: "600px", height: "448px", overflow: "hidden" }}>
      <main className={styles.container}>
        <Header date={new Date()}></Header>
        <MainBody></MainBody>
        <HourlyWeather />
        <DailyAndWeeklyWeather></DailyAndWeeklyWeather>
        
      </main>
    </body>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
