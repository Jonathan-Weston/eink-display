import React, { useEffect, useState } from 'react';
import binBlueImage from './img/blue_bin.png';
import binBlackImage from './img/black_bin.png';
import defaultBinImage from './img/default_bin.png';
import binBlueWarningImage from './img/blue_bin_warning.png';
import binBlackWarningImage from './img/black_bin_warning.png';
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
    const url = process.env.REACT_APP_BIN_DATE_URL;

    useEffect(() => {
        const fetchBinDate = async () => {
            try {
                setLoading(true);
                if (!url) {
                    throw new Error('SCRAPE_BIN_DATE_URL is not defined');
                }
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
    }, [url]);

    const getBinImage = () => {
        if (!nextBinDate || !binColor) {
            return defaultBinImage; // Default image if no date or color is set
        }
    
        const today = new Date();
        const binDate = new Date(nextBinDate);
    
        // Check if today is the day before the bin date
        const isDayBefore = (binDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 1;
    
        if (isDayBefore) {
            if (binColor === 'Blue') {
                return binBlueWarningImage; // Warning image for blue bin
            } else if (binColor === 'Grey') {
                return binBlackWarningImage; // Warning image for black bin
            }
        }
    
        // Default bin images
        if (binColor === 'Blue') {
            return binBlueImage;
        } else if (binColor === 'Grey') {
            return binBlackImage;
        }
    
        return defaultBinImage; // Default image if no color matches
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