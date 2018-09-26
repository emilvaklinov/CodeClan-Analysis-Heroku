const PubSub = require('../helpers/pub_sub.js');

const TotalsView = function (positiveGrid, negativeGrid) {
  this.positiveGrid = positiveGrid;
  this.negativeGrid = negativeGrid;
  this.happyTweets = 0;
  this.sadTweets = 0;
  this.sadRetweets = 0;
  this.happyRetweets = 0;
  this.happyFavourites = 0;
  this.sadFavourites = 0;  
}

TotalsView.prototype.bindEvents = function () {
    PubSub.subscribe('Searches:happy-totals-calulated', (event) => {
        //this.happyTweets = event.detail.totalTweets;
        this.happyRetweets = event.detail.retweets;
        this.happyFavourites = event.detail.favourites;

        this.renderTotals()
        this.positiveGrid.classList.remove('hidden');

    })
    PubSub.subscribe('Searches:sad-totals-calulated', (event) => {
        //this.sadTweets = event.detail.totalTweets;
        this.sadRetweets = event.detail.retweets;
        this.sadFavourites = event.detail.favourites;

        this.renderTotals()
        this.negativeGrid.classList.remove('hidden');
    })  
}

TotalsView.prototype.renderTotals = function () {
    const firstContentElement = document.querySelector('#grid-item-5');
    firstContentElement.textContent = this.happyRetweets;

    const secondContentElement = document.querySelector('#grid-item-6');
    secondContentElement.textContent = this.sadRetweets;

    const thirdContentElement = document.querySelector('#grid-item-7');
    thirdContentElement.textContent = this.happyFavourites;

    const fourthContentElement = document.querySelector('#grid-item-8');
    fourthContentElement.textContent = this.sadFavourites;
    //const sentiment = this.determineSentiment();
    //fourthContentElement.textContent = sentiment;
}

TotalsView.prototype.determineSentiment = function() {
    if (this.sadRetweets + this.sadFavourites <= this.happyRetweets + this.happyFavourites){
        return ':)'
    }
    return ':('
}






module.exports = TotalsView;