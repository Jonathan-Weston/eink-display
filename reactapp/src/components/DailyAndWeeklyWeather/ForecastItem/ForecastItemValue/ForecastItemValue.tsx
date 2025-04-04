import styles from './ForecastItemValue.module.css'

export interface ForecastItemValueProps {
    value: string;
    unit: string;
    minorText?: boolean
    isMaxTemp?: boolean
}

export const ForecastItemValue = ({value, unit, minorText, isMaxTemp}: ForecastItemValueProps) => 
    <div className={isMaxTemp ? styles. forecastItemTempratureMax : styles.forecastItemTemprature}>
        <span className={minorText ? styles.forecastItemValueMinor : styles.forecastItemValue}>{value}</span>
        <span className={minorText ? styles.forecastItemUnitMinor : styles.forecastItemUnit}>{unit}</span>
    </div>

export default ForecastItemValue;