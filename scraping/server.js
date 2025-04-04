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
  const colorRegex = /(\w+)(?=(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{2} \w{3} \d{4})/;  // Matches the color before the date
  const dateRegex = /\d{2} \w{3} \d{4}/g; // Matches dates in the format "02 Apr 2025"

  tables.forEach((item) => {
    const colorMatch = item.match(colorRegex);
    const dateMatches = item.match(dateRegex);
    
    //if color and date present but not green bins push to result
    if (colorMatch && dateMatches && colorMatch[0] !== 'Green') {
      dateMatches.forEach((date) => {
        result.push({ color: colorMatch[1], date });
      });
    }
  });

  return result;
};

// Scrape the bin collection date from the website
app.get('/scrape-bin-date', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.adur-worthing.gov.uk/bin-day/?brlu-selected-address=100062209115&return-url=%2Fbin-day%2F');
    const $ = cheerio.load(data);

    const tables = [];
    $('tr').each((_idx, el) => {
	    const table = $(el).text();
	    tables.push(table);
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
