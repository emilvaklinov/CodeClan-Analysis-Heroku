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

 const button = this.createDeleteButton(search._id);
 this.listElement.appendChild(button);

}

ListView.prototype.createDeleteButton = function (listItemId){
  const deleteButton = document.createElement('button');
  deleteButton.value = listItemId;
  deleteButton.addEventListener('click', (event)=>{
    PubSub.publish('ListView:delete-clicked', event.target.value);
    
  })
  deleteButton.textContent = "delete";
  return deleteButton
}


module.exports = ListView;