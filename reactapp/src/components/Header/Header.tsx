
import styles from './Header.module.css';
import {formatDate} from '../../utils/Helper';
import BinDisplay from './BinDisplay/BinDisplay';

export interface HeaderProps {
    date: Date;
}

export const Header = ({ date }: HeaderProps) => {
    return (
        <div className={styles.top}>
            <BinDisplay/>
            <div className={styles.locationDate}>
                <p id="location" className={styles.location}>Worthing</p>
                <p id="date" className={styles.date}>{formatDate(date.toString())}</p>
            </div>

        </div>
    );
};
export default Header;