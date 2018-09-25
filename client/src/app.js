const FormView = require('./views/form_view');
const ListView = require('./views/list_view');
const Searches = require('./models/searches');
const MapView = require('./views/map_view');
const ChartView = require('./views/chart_view.js');
const echarts = require('echarts');

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


  const myChart_1 = echarts.init(document.getElementById('chart_1'));
  const chartView_1 = new ChartView(myChart_1);
  let testChartData_1 = [20, 100];
  let chartTitle_1 = "retweets"
  //chartView_1.renderChart(testChartData_1, chartTitle_1);



  const myChart_2 = echarts.init(document.getElementById('chart_2'));
  const chartView_2 = new ChartView(myChart_2);
  let testChartData_2 = [80, 150];
  let chartTitle_2 = "likes"
  //chartView_2.renderChart(testChartData_2, chartTitle_2);

  // const myChart_3 = echarts.init(document.getElementById('chart_3'));
  // const chartView_3 = new ChartView(myChart_3);
  // let testChartData_3 = [80, 150];
  // let chartTitle_3 = "followers"
  // chartView_3.renderChart(testChartData_3, chartTitle_3);


  const chartView = new ChartView();

  formView.bindEvents();
  listView.bindEvents();
  searches.bindEvents();
  mapView.bindEvents();
  chartView.bindEvents();
})
