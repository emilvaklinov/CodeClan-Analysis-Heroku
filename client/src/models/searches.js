const PubSub = require('../helpers/pub_sub');
const Request = require('../helpers/request');

const Searches = function (url) {
  this.url = url;
  this.request = new Request(this.url);
  this.APIrequest = new Request('http://localhost:3000/api/search-results');
}

Searches.prototype.bindEvents = function () {
  PubSub.subscribe('FormView:search-term-submitted', (event) => {
    this.postSearch(event.detail);
    this.getSearchResults(event.detail.searchTerm);
    // console.log(event.detail.searchTerm);
  })
  PubSub.subscribe('ListView:delete-clicked', (event) => {
    this.deleteSearch(event.detail);
  })
}

Searches.prototype.getData = function () {
  this.request.get()
    .then((searches) => {
      PubSub.publish('Searches:searches-data-loaded', searches);
    })
    .catch(console.error);
}

Searches.prototype.getSearchResults = function (searchTerm) {
  this.APIrequest.get(`?query=${searchTerm}`)
    .then((tweets) => {
      const totals = this.calculator(tweets);
      console.log(totals);
      PubSub.publish('Searches:totals-calulated', totals)
      let tweetsWithLocations = [];
      let tweetsCoordinates = [];
      tweets.forEach((tweet) => {
        if (tweet.latitude && tweet.longitude) {
          tweetsWithLocations.push(tweet);
          tweetsCoordinates.push({
            geometry: {
              type: "Point",
              coordinates: [tweet.longitude, tweet.latitude]
            }
          });
        }
      })
      PubSub.publish('Searches:tweet-data-loaded', tweets);

      const stringifiedCoordinates = JSON.stringify(tweetsCoordinates);
      // console.log('stringifiedtweetscoordinates: ', stringifiedCoordinates);
      PubSub.publish('Searches:tweet-coordinates-loaded', tweetsCoordinates);
    })
    .catch(console.error);
};

Searches.prototype.postSearch = function (search) {
  this.request.post(search)
    .then((searches) => {
      PubSub.publish('Searches:searches-data-loaded', searches);
    })
    .catch(console.error);
}

Searches.prototype.deleteSearch = function (listItemId) {
  this.request.delete(listItemId)
    .then((searches) => {
      PubSub.publish('Searches:searches-data-loaded', searches);
    })
    .catch(console.error);
}

Searches.prototype.calculator = function (tweetData) {
  const totals = {
    retweets: 0,
    favourites: 0
  }
  tweetData.forEach(tweet => {
    totals.retweets += tweet.retweets;
    totals.favourites += tweet.favourites;
  })
  return totals;
}
module.exports = Searches;
