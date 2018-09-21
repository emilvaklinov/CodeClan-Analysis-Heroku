const PubSub = require('../helpers/pub_sub.js');

const FormView = function (formElement) {
  this.formElement = formElement;
}

FormView.prototype.bindEvents = function () {
  this.formElement.addEventListener('submit', (evt) => {
    this.handleSubmit(evt);
  })
}

FormView.prototype.handleSubmit = function (evt) {
  evt.preventDefault();
  const newSearchTerm = this.createSearch(evt.target);
  PubSub.publish('FormView:search-term-submitted', newSearchTerm);
  evt.target.reset();
}

FormView.prototype.createSearch = function (form) {
  const newSearch = {
    searchTerm: form.input.value
  }
  return newSearch;
}

module.exports = FormView;