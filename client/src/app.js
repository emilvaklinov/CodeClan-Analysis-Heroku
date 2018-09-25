const FormView = require('./views/form_view');
const ListView = require('./views/list_view');
const Searches = require('./models/searches');
const MapView = require('./views/map_view');
const ChartView = require('./views/chart_view.js');

document.addEventListener('DOMContentLoaded', () => {
  let url = 'http://localhost:3000/api/inputs';
  const searches = new Searches(url);
  searches.getData();

  const formElement = document.querySelector('#form');
  const formView = new FormView(formElement);

  const listElement = document.querySelector('#list');
  const searchResultsListElement = document.querySelector('#search-results-list');
  const listView = new ListView(listElement, searchResultsListElement);
  const mapView = new MapView();


  const chartView = new ChartView();


  formView.bindEvents();
  listView.bindEvents();
  searches.bindEvents();
  mapView.renderMap();
  chartView.renderChart();
})
