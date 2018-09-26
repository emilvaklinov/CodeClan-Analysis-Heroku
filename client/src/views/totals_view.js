const PubSub = require('../helpers/pub_sub.js');

const TotalsView = function (formElement) {
  this.formElement = formElement;
}

TotalsView.prototype.bindEvents = function () {
    PubSub.subscribe('Searches:totals-calulated', (event) => {
        this.renderTotals(event.detail);
    })
}

TotalsView.prototype.renderTotals = function (totalData) {
    const firstContentElement = document.querySelector('#grid-item-5');
    firstContentElement.textContent = totalData.totalTweets;

    const secondContentElement = document.querySelector('#grid-item-6');
    firstContentElement.textContent = totalData.favourites;

    const thirdContentElement = document.querySelector('#grid-item-7');
    firstContentElement.textContent = totalData.retweets;

    const fourthContentElement = document.querySelector('#grid-item-8');
    // firstContentElement.textContent = totalData.XXXX;

}




module.exports = TotalsView;