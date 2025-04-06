import React, { useEffect, useState } from 'react';
import binBlueImage from './img/blue_bin.png';
import binBlackImage from './img/black_bin.png';
import defaultBinImage from './img/default_bin.png';
import style from './BinDisplay.module.css';
import { formatDate } from '../../../utils/Helper';

const findEarliestDateItem = (data: { dates: { color: string; date: string }[] }) => {
    if (!data || !data.dates || data.dates.length === 0) {
        return null;
    }

    // Convert dates to Date objects and find the earliest one
    const earliestDateItem = data.dates.reduce((earliest, current) => {
        const currentDate = new Date(current.date);
        const earliestDate = new Date(earliest.date);

        return currentDate < earliestDate ? current : earliest;
    });

    return earliestDateItem;
};

const BinDisplay: React.FC = () => {
    const [nextBinDate, setNextBinDate] = useState<string | null>(null);
    const [binColor, setBinColor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const url = process.env.SCRAPE_BIN_DATE_URL || 'http://localhost:5000/scrape-bin-date';

    useEffect(() => {
        const fetchBinDate = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                const data = await response.json();
    
                if (data.dates) {
                    const earliestDateItem = findEarliestDateItem(data);
                    if (earliestDateItem) {
                        setNextBinDate(`${earliestDateItem.date}`);
                        setBinColor(earliestDateItem.color); // Set the bin color
                    } else {
                        setError('No valid dates found');
                    }
                } else {
                    setError('Could not fetch the bin date');
                }
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchBinDate();
    }, []);

    const getBinImage = () => {
        if (binColor === 'Blue') {
            return binBlueImage;
        } else if (binColor === 'Grey') {
            return binBlackImage;
        }
        return defaultBinImage; // Default to blue if no color is set
    };

    return (
        <div id="binSummary" className={style.binSummary}>
            <div id="binImage" className={style.binImage}>
                <img src={getBinImage()} alt={`${binColor} Bin`} />
            </div>
            <div className={style.binDate}>
                {loading ? (
                    <span>Loading...</span>
                ) : error ? (
                    <span>{error}</span>
                ) : nextBinDate ? (
                    <span className={style.binDateText}>{formatDate(nextBinDate)}</span>
                ) : (
                    <span>No upcoming bin collection</span>
                )}
            </div>
        </div>
    );
};

export default BinDisplay;