const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // Replace with your desired port number

// Enable CORS on the server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Define a cache object to store fetched feeds
const feedCache = {};

// Define a cache timeout (in milliseconds) for the feeds
const cacheTimeout = 3600000 // 1 heure

// Define a route to handle the proxy request
app.get('/proxy', async (req, res) => {
  const rssFeedUrl = req.query.url;

  try {
    // Check if the feed is already in the cache and not too old
    if (feedCache[rssFeedUrl] && !isFeedExpired(feedCache[rssFeedUrl])) {
      console.log('Using cached feed:', rssFeedUrl);
      res.set('Content-Type', 'text/xml');
      res.send(feedCache[rssFeedUrl].data);
    } else {
      const response = await axios.get(rssFeedUrl, { responseType: 'text' });
      const xmlData = response.data;

      // Store the fetched feed in the cache
      feedCache[rssFeedUrl] = {
        data: xmlData,
        timestamp: Date.now()
      };

      res.set('Content-Type', 'text/xml');
      res.send(xmlData);
    }
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).send('Error fetching RSS feed');
  }
});

// Function to check if a feed is expired
function isFeedExpired(feed) {
  return feed.timestamp + cacheTimeout < Date.now();
}

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
