// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

// extract dates from the tables rows and map to colour of bin
const extractDates = (tables) => {
  result =[];
  const colorRegex = /(Blue|Grey|Green)/;
  const dateRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2}(st|nd|rd|th)? \b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)/; 

  tables.forEach((item) => {
    const colorMatch = item.match(colorRegex);
    const dateMatch = item.match(dateRegex);
    
    //if color and date present but not green bins push to result
    if (colorMatch && dateMatch && colorMatch[0] !== 'Green') {
      dateMatch.forEach((date) => {
        result.push({ color: colorMatch[0], date: dateMatch[0] });
      });
    }
  });

  return result;
};

// Scrape the bin collection date from the website
app.get('/scrape-bin-date', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.adur-worthing.gov.uk/bin-day/?brlu-selected-address=100061897141&return-url=%2Fbin-day%2F');
    const $ = cheerio.load(data);

    const tables = [];
    $('.bin-collection-listing-row').each((_idx, el) => {
	    const text = $(el).text().trim();
	    tables.push(text);
    });
    
    const dates = extractDates(tables);

    if (dates) {
      console.log("returning:" && {dates});
      res.status(200).json({dates});
    } else {
      res.status(404).json({ message: 'No dates found' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error scraping data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
