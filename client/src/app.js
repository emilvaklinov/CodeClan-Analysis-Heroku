const FormView = require('./views/form_view');
const ListView = require('./views/list_view');
const Searches = require('./models/searches');
const MapView = require('./views/map_view');
const ChartView = require('./views/chart_view.js');
const echarts = require('echarts');
const TotalsView = require('./views/totals_view')

document.addEventListener('DOMContentLoaded', () => {
  let url = 'https://emil-twitter-analysis.herokuapp.com/api/inputs';
  const sadSearches = new Searches(url);
  const happySearches = new Searches(url);
  sadSearches.getData();
  happySearches.getData();

  const formElement = document.querySelector('#form');
  const formView = new FormView(formElement);

  const listElement = document.querySelector('#list');
  const searchResultsListElement = document.querySelector('#search-results-list');
  const listView = new ListView(listElement, searchResultsListElement);
  const mapView = new MapView();

  const charts = document.querySelector('#charts')
  const chartView = new ChartView(charts);

  const positiveTotals = document.querySelector('#summary1');
  const negativeTotals = document.querySelector('#summary2');
  const totalsView = new TotalsView(positiveTotals, negativeTotals);

  formView.bindEvents();
  listView.bindEvents();

  happySearches.bindEvents('%20%3A%29', true); //'%20%3A%29' - happy
  sadSearches.bindEvents('%20%3A%28'); // '%20%3A%28' - sad
  mapView.bindEvents();
  chartView.bindEvents();
  totalsView.bindEvents();
})
