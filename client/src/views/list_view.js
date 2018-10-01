const PubSub = require('../helpers/pub_sub');

let tweets = null;

const ListView = function (listElement, searchResultsListElement) {
  this.listElement = listElement;
  this.searchResultsListElement = searchResultsListElement;
}

ListView.prototype.bindEvents = function () {
  let allTweets = [];
  let eventCounter = 0;

  PubSub.subscribe('FormView:search-term-submitted', (event) => {
    eventCounter = 0;
    allTweets = [];
  });

  PubSub.subscribe('Searches:searches-data-loaded', (event) => {
    this.render(event.detail);
  })
  // PubSub.subscribe('Searches:tweet-data-loaded', (event) => {
  //   console.log('got all tweets')
  //   this.renderSearchResultsList(event.detail);
  // });
  PubSub.subscribe('Searches:happy-tweet-data-loaded', (event) => {
    eventCounter += 1;
    allTweets = allTweets.concat(event.detail, allTweets);
    if (eventCounter === 2) {
      this.renderTop10Tweets(allTweets);
    }
    console.log('got happy tweets')
    //this.renderSearchResultsList(event.detail);
  });
  PubSub.subscribe('Searches:sad-tweet-data-loaded', (event) => {
    eventCounter += 1;
    allTweets = allTweets.concat(event.detail, allTweets);
    if (eventCounter === 2) {
      this.renderTop10Tweets(allTweets);
    }
    console.log('got sad tweets')
    //this.renderSearchResultsList(event.detail);
  });
};

ListView.prototype.renderSearchResultsList = function (searchResults) {
  this.searchResultsListElement.innerHTML = "";
  searchResults.forEach((searchResult) => {
    this.renderOneSearchResult(searchResult);
  });
};

ListView.prototype.renderOneSearchResult = function (searchResult) {
  const searchResultItem = document.createElement('li');
  searchResultItem.textContent = searchResult.text;
  searchResultItem.id = 'tweet' + searchResult.id;
  //console.log(searchResult.retweets);
  this.searchResultsListElement.appendChild(searchResultItem);
  twttr.widgets.createTweet(
    ' ' + searchResult.id,
    document.getElementById('tweet' + searchResult.id),
    console.log(searchResult.id),
    {
      theme: 'light'
    }
  );
}

ListView.prototype.render = function (searches) {
  this.listElement.innerHTML = "";
  searches.forEach((search) => {
    this.renderOne(search);
  });
}

ListView.prototype.renderOne = function (search) {
  const button = this.createDeleteButton(search._id);
  const searchItem = document.createElement('li');
  searchItem.textContent = search.searchTerm;
  searchItem.appendChild(button);
  this.listElement.appendChild(searchItem);
}

ListView.prototype.createDeleteButton = function (listItemId) {
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-times"></i>';
  deleteButton.value = listItemId;
  deleteButton.addEventListener('click', () => {
    PubSub.publish('ListView:delete-clicked', listItemId);
  })

  // const historyButtons = document.querySelectorAll('#list button');
  // const list = document.querySelector('#list');
  // const buttonCount = historyButtons.length;
  // if (buttonCount >= 6) {
  //   list.lastChild.remove();
  // };
  return deleteButton
}

ListView.prototype.renderTop10Tweets = function (tweets) {
  tweets.sort((a, b) => {
    return b.retweets - a.retweets;
  });
  const top5Tweets = tweets.slice(0, 10);
  const container = document.querySelector('#result-container');
  container.classList.remove('hidden');
  this.searchResultsListElement.innerHTML = "";
  top5Tweets.forEach((tweet) => {
    this.renderOneSearchResult(tweet);
  });
};


module.exports = ListView;
