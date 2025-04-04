import CurrentWeather from "./CurrentWeather/CurrentWeather";
import styles from './TopSection.module.css';

export const MainBody = () => 
    //class Middle
    <div className={styles.middle}>
            <div className={styles.currentWeather}>
        <CurrentWeather></CurrentWeather>
    </div>
    </div>

 export default MainBody;   