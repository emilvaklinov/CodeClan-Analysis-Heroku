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

// query the Twitter search/tweets endpoint with a keyword string as the search parameter
Twitter.prototype.searchTweetsByKeyword = function (keyword) {
  return new Promise((resolve, reject) => {
    T.get('search/tweets', { q: keyword + " -filter:retweets", has: "geo", count: 100, exclude: "replies" }, function (err, data, response) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  });
}

// query the Twitter search/tweets endpoint with a metadata value from a data set as the search parameter
Twitter.prototype.searchTweetsByMetaData = function (metadata) {
  return new Promise((resolve, reject) => {
    console.log(`search/tweets.json${metadata}`);
    T.get(`search/tweets.json${metadata}`, {}, function (err, data, response) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    })
  });
}

Twitter.prototype.getAllPagesFromLast7DaysForSearchTerm = function (searchTerm) {
  let nextResultsQueryParam = null;
  let allData = [];
  console.log('empty data ' + allData);
  // retrieve the first data set
  return new Promise((resolve, reject) => {
    this.searchTweetsByKeyword(searchTerm)
      .then((data) => {
        const tweets = data.statuses.map(tweet => {
          //return tweet;
          return { text: tweet.text, location: tweet.user.location, place: tweet.place, coords: tweet.coordinates }
        });

        console.log(tweets, "xx");

        allData.push(tweets);




        console.log('first data entry' + allData);
        // save out the search_metadata.next_results value
        nextResultsQueryParam = data.search_metadata.next_results;
        if (!nextResultsQueryParam) {
          resolve(allData);
        }
        let loopCounter = 0;
        // keep requesting pages of results until you are on the last page
        // or until 10 requests have been made
        // check what happens when there are no more pages
        while (nextResultsQueryParam && loopCounter < 3) {
          loopCounter += 1;
          console.log('loop data entry number ' + loopCounter + ' ' + allData);
          this.searchTweetsByMetaData(nextResultsQueryParam)
            .then((data) => {
              const tweets = data.statuses.map(tweet => {
                return { text: tweet.text, location: tweet.user.location, place: tweet.place }
              });
              allData.push(tweets);
              console.log('add to array' + allData);
              nextResultsQueryParam = data.search_metadata.next_results;
              console.log(allData.length)
              if ((allData.length === 4) || (!nextResultsQueryParam)) {
                console.log('resolving data ' + allData);
                resolve(allData);
              }
            })
        }









      });


 
  })
};


module.exports = Twitter;