import styles from './ForecastItem.module.css';
import ForecastItemValue from './ForecastItemValue/ForecastItemValue';

export interface ForecastItemProps {
    day: string;
    img: string;
    maxTempValue: string;
    minTempValue: string
    percipitationValue: string;
}

export const ForecastItem = ({img, day, maxTempValue, minTempValue, percipitationValue} :ForecastItemProps) => 
    <div className={styles.forecastItem}>
        <ForecastItemValue value={maxTempValue} unit={"°C"} isMaxTemp={true}></ForecastItemValue>
        <ForecastItemValue 
        value={minTempValue} 
        unit={"°C"}
        minorText={true}
        ></ForecastItemValue>
        <div className={styles.forecastItemIconContainer}>
            <img className={styles.forecastItemIcon}
            src={img} alt=''></img>
        </div>
        <div id ="forecast-5days-item-0-time" className="forecastItemTime">{day}</div>
        <ForecastItemValue value={percipitationValue} unit={"%"}></ForecastItemValue>
    </div>

export default ForecastItem;