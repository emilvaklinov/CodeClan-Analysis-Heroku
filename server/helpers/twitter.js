var Twit = require('twit');
const GeocoderHelper = require('./geocoder_helper.js');
const MongoClient = require('mongodb').MongoClient;
const geocoder = new GeocoderHelper();


// instantiate a new Twit object and pass it the consumer key variables
// set app_only_auth to true so that access tokens are generated before expiring
var T = new Twit({
  consumer_key: process.env.GROUP_PROJECT_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.GROUP_PROJECT_TWITTER_CONSUMER_SECRET_KEY,
  app_only_auth: true,
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL: true,     // optional - requires SSL certificates to be valid.
})

const Twitter = function () {

}

// This is the method to call from the outside
Twitter.prototype.getAllSearchResultsFromLast7DaysForSearchTerm = function (searchTerm) {
  // retrieve the first data set
  return new Promise((resolve, reject) => {
    let nextResultsQuery = null;
    let currentPageNumber = 1;
    const maxPages = 1;
    let allResults = [];

    this.getSinglePageOfResultsFromLast7Days(searchTerm, nextResultsQuery, currentPageNumber, maxPages, allResults, resolve, reject);
  });
};

Twitter.prototype.getSinglePageOfResultsFromLast7Days = function (searchTerm, nextResultsQuery, currentPageNumber, maxPages, allResults, resolve, reject) {
  // nextResultQuery is null the first time round
  this.makeSearchTweetsRequestToTwitterWithSearchTerm(searchTerm, nextResultsQuery)
    .then((data) => {
      // if the data has next_results (i.e. it is not the last page)
      // and the we're definately not on the last page
      // add the data so far to allResults
      const tweets = data.statuses.map(tweet => {
        return { text: tweet.full_text, location: tweet.user.location }
      });

      tweets.forEach((tweet) => {
        allResults.push(tweet);
      });

      // allResults.push(tweets);
      console.log("next results = ", data.search_metadata.next_results);
      if (data.search_metadata.next_results && (currentPageNumber < maxPages)) {
        // set nextResults to the value from the metadata
        nextResultsQuery = data.search_metadata.next_results;
        let nextPageNumber = currentPageNumber + 1;
        // call this method recursively with the new values from the first call
        this.getSinglePageOfResultsFromLast7Days(searchTerm, nextResultsQuery, nextPageNumber, maxPages, allResults, resolve, reject);
        // otherwise, exit now and resolve with the data
      } else {
        //const flattenedResults = allResults.flat(0);

        this.getCoordsForTweets(allResults).then(() => {
          console.log("resolving results")
          resolve(allResults);
        })

      }
    });
};

Twitter.prototype.makeSearchTweetsRequestToTwitterWithSearchTerm = function (searchTerm, nextResultsQuery) {
  return new Promise((resolve, reject) => {
    let queryPath = null;
    let queryOptions = null;

    if (nextResultsQuery) {
      queryPath = `https://api.twitter.com/1.1/search/tweets.json${nextResultsQuery}&tweet_mode=extended`;
      queryOptions = {};
      console.log(queryPath);
    } else {
      queryPath = 'search/tweets';
      queryOptions = { q: searchTerm + " -filter:retweets", has: "geo", count: 100, exclude: "replies", tweet_mode: "extended" };
    };
    T.get(queryPath, queryOptions, (err, data, response) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  });
};

let locationCollection = null;

MongoClient.connect('mongodb://localhost:27017')
  .then((client) => {
    const db = client.db('project_tweetdb');
    locationCollection = db.collection('locations_coords');
  })
  .catch(console.error);


// finally works - needs refactored :<
Twitter.prototype.getCoordsForTweets = function (tweets) {

  const numTweets = tweets.length;
  let numProcessed = 0;

  return new Promise((resolve, reject) => {

    tweets.forEach((tweet, index) => {
      let tweetToUpdate = tweets[index];
      let tweetLocation = tweet.location;
      locationCollection.findOne({ location: tweetLocation }).then((dbLocation) => {
        console.log('search result', dbLocation);
        if (dbLocation && dbLocation.location === tweetLocation) {

          console.log('found in database', tweetLocation);

          tweetToUpdate.latitude = dbLocation.latitude;
          tweetToUpdate.longitude = dbLocation.longitude;
          numProcessed += 1;

          if (numProcessed === numTweets) {
            resolve();
          }

        } else if (tweetLocation) {

          geocoder.getLocationData(tweetLocation)
            .then((data) => {
              console.log('found geocode data for tweet location', data, tweetLocation, index);
              tweetToUpdate.latitude = data[0];
              tweetToUpdate.longitude = data[1];
              numProcessed += 1;

              locationCollection.insertOne({
                location: tweetLocation,
                latitude: data[0],
                longitude: data[1]
              });

              if (numProcessed === numTweets) {
                resolve();
              }


            })
            .catch((err) => {
              console.log('geocode error', err);
              numProcessed += 1;

              if (numProcessed === numTweets) {
                resolve();
              }
            });

        } else {
          // blank location
          numProcessed += 1;

          if (numProcessed === numTweets) {
            resolve();
          }

        }


      })
    })
  })
};

module.exports = Twitter;