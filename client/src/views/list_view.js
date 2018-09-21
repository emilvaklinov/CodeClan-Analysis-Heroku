const PubSub = require('../helpers/pub_sub');

const ListView = function (listElement) {
  this.listElement = listElement;
}

ListView.prototype.bindEvents = function () {
  PubSub.subscribe('Searches:searches-data-loaded', (event) => {
    console.log(event.detail);
    this.render(event.detail);
  })
}

ListView.prototype.render = function (searches) {
  this.listElement.innerHTML = "";
  searches.forEach((search) => {
    this.renderOne(search);
  });
}

ListView.prototype.renderOne = function (search) {
  const searchItem = document.createElement('li');
  searchItem.textContent = search.searchTerm;
  this.listElement.appendChild(searchItem);
}

module.exports = ListView;