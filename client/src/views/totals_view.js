const PubSub = require('../helpers/pub_sub.js');

const TotalsView = function (formElement) {
  this.formElement = formElement;
  this.sadTweets = 0;
  this.sadRetweets = 0;
  this.happyRetweets = 0;
  this.happyFavourites = 0;
  this.sadFavourites = 0;  
}

TotalsView.prototype.bindEvents = function () {
    PubSub.subscribe('Searches:happy-totals-calulated', (event) => {
        this.happyRetweets = event.detail.retweets;
        this.happyFavourites = event.detail.favourites;
    })
    PubSub.subscribe('Searches:sad-totals-calulated', (event) => {
        this.sadTweets = event.detail.totalTweets;
        this.sadRetweets = event.detail.retweets;
        this.sadFavourites = event.detail.favourites;

        this.renderTotals()
    })  
}

TotalsView.prototype.renderTotals = function () {
    const firstContentElement = document.querySelector('#grid-item-5');
    firstContentElement.textContent = this.sadTweets;

    const secondContentElement = document.querySelector('#grid-item-6');
    secondContentElement.textContent = this.sadRetweets+this.happyRetweets;

    const thirdContentElement = document.querySelector('#grid-item-7');
    thirdContentElement.textContent = this.sadFavourites+this.happyFavourites;

    const fourthContentElement = document.querySelector('#grid-item-8');
    const sentiment = this.determineSentiment();
    fourthContentElement.textContent = sentiment;
}

TotalsView.prototype.determineSentiment = function() {
    if (this.sadRetweets + this.sadFavourites <= this.happyRetweets + this.happyFavourites){
        return ':)'
    }
    return ':('
}






module.exports = TotalsView;