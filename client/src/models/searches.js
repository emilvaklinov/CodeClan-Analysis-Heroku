const PubSub = require('../helpers/pub_sub');
const Request = require('../helpers/request');

const Searches = function (url) {
  this.url = url;
  this.request = new Request(this.url);
  this.APIrequest = new Request('http://localhost:3000/api/search-results');
  // this.APIrequest = new Request('');
}

Searches.prototype.bindEvents = function (sentimentQuery, primary) {
  PubSub.subscribe('FormView:search-term-submitted', (event) => {

    // todo move the db stuff to another bit
    if (primary) {
      this.postSearch(event.detail);
      this.renderLoadingSpinner();
    }

    this.getSearchResults(event.detail.searchTerm, sentimentQuery);
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

Searches.prototype.getSearchResults = function (searchTerm, sentimentQuery) {
  let query = null;
  let tweetChannel = null;
  let calculationChannel = null;
  let coordinateChannel = null;
  // if there is no sentiment query
  // search without one and set the channel variable to be generic
  if (!sentimentQuery){
    query = `?query=${searchTerm}`;
    tweetChannel = 'Searches:tweet-data-loaded';
    calculationChannel = 'Searches:totals-calulated';
    coordinateChannel = 'Searches:tweet-coordinates-loaded';
    // if there is a sentiment query
    // add the query to the search
  } else
  query = `?query=${searchTerm}${sentimentQuery}`;
  // if the extra query is for happy sentiment
  // set the channel variable to happy-tweets
  if (sentimentQuery === '%20%3A%29'){
    tweetChannel = 'Searches:happy-tweet-data-loaded';
    calculationChannel = 'Searches:happy-totals-calulated';
    coordinateChannel = 'Searches:happy-tweet-coordinates-loaded';
  }

  // if the extra query is for sad sentiment
  // set the channel variable to sad-tweets
  else if (sentimentQuery === '%20%3A%28'){
    tweetChannel = 'Searches:sad-tweet-data-loaded';
    calculationChannel = 'Searches:sad-totals-calulated';
    coordinateChannel = 'Searches:sad-tweet-coordinates-loaded';
  }

  console.log("searching for " + query);

  this.APIrequest.get(query)
  .then((tweets) => {
    const totals = this.calculator(tweets);
    console.log(calculationChannel + 'totals ', totals);
    PubSub.publish(calculationChannel, totals)
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
    PubSub.publish(tweetChannel, tweets);
    PubSub.publish(coordinateChannel, tweetsCoordinates);
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
    favourites: 0,
    totalTweets: tweetData.length
  };
  tweetData.forEach(tweet => {
    totals.retweets += tweet.retweets;
    totals.favourites += tweet.favourites;
  })
  return totals;
}

Searches.prototype.renderLoadingSpinner = function() {
  const loadingOverlay = document.querySelector('#loading-overlay');
  const loadingModal = document.querySelector('#loading-modal');
  loadingOverlay.classList.remove('hidden');
  loadingModal.classList.remove('hidden');
};

module.exports = Searches;
