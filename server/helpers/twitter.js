var Twit = require('twit');

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
    const maxPages = 5;
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
        return { text: tweet.full_text, location: tweet.user.location, place: tweet.place, coords: tweet.coordinates }
      });

      tweets.forEach((tweet) => {
        allResults.push(tweet);
      });

      // allResults.push(tweets);
      if (data.search_metadata.next_results && (currentPageNumber < maxPages)) {
        // set nextResults to the value from the metadata
        nextResultsQuery = data.search_metadata.next_results;
        let nextPageNumber = currentPageNumber + 1;
        // call this method recursively with the new values from the first call
        this.getSinglePageOfResultsFromLast7Days(searchTerm, nextResultsQuery, nextPageNumber, maxPages, allResults, resolve, reject);      
      // otherwise, exit now and resolve with the data
      } else {
        //const flattenedResults = allResults.flat(0);
        resolve(allResults);
      }
    });
};

Twitter.prototype.makeSearchTweetsRequestToTwitterWithSearchTerm = function (searchTerm, nextResultsQuery) {
  return new Promise((resolve, reject) => {
    let queryPath = null;
    let queryOptions = null;
    
    if (nextResultsQuery) {
      queryPath = `https://api.twitter.com/1.1/search/tweets.json${nextResultsQuery}&tweet_mode=extended`;
      queryOptions = { };
      console.log(queryPath);
    } else {
      queryPath = 'search/tweets';
      queryOptions = { q: searchTerm + " -filter:retweets", has: "geo", count: 100, exclude: "replies", tweet_mode: "extended"};
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

module.exports = Twitter;