const PubSub = require('../helpers/pub_sub');
const Request = require('../helpers/request');

const Searches = function(url){
  this.url = url;
  this.request = new Request(this.url);
}

Searches.prototype.bindEvents = function(){
  PubSub.subscribe('FormView:search-term-submitted', (event)=>{
    this.postSearch(event.detail);
  })
}

Searches.prototype.getData = function(){
  this.request.get()
  .then((searches)=>{
    PubSub.publish('Searches:searches-data-loaded', searches);
  })
  .catch(console.error);
}


Searches.prototype.postSearch = function(search){
  this.request.post(search)
    .then((searches)=>{
      PubSub.publish('Searches:searches-data-loaded', searches);
    })
    .catch(console.error);
}


module.exports = Searches;