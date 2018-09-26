const FormView = require('./views/form_view');
const ListView = require('./views/list_view');
const Searches = require('./models/searches');
const MapView = require('./views/map_view');
const ChartView = require('./views/chart_view.js');
const echarts = require('echarts');
const TotalsView = require('./views/totals_view')

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

  const charts = document.querySelector('#charts')
  const chartView = new ChartView(charts);

  const totals = document.querySelector('#summary');
  const totalsView = new TotalsView(totals);


  formView.bindEvents();
  listView.bindEvents();
  searches.bindEvents();
  mapView.bindEvents();
  chartView.bindEvents();
  totalsView.bindEvents();
})
