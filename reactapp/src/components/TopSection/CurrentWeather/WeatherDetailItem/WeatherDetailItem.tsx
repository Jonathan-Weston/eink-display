import React from 'react';
import styles from './WeatherDetailItem.module.css';

interface WeatherDetailItemProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  altText: string;
}

const WeatherDetailItem: React.FC<WeatherDetailItemProps> = ({ label, value, unit, icon, altText }) => {
  return (
    <li className={styles['WeatherDetails-item']}>
      <div className={styles['WeatherDetails-item-content']}>
        <div className={styles['WeatherDetails-item-icon-container']}>
          <img src={icon} alt={altText} />
        </div>
        <div className={styles['WeatherDetails-item-text']}>
          <p>{label}</p>
          <div className={styles['WeatherDetails-item-measurement']}>
            <span className={styles['WeatherDetails-item-value']}>{value}</span>
            <span className={styles['WeatherDetails-item-unit']}>{unit}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default WeatherDetailItem;