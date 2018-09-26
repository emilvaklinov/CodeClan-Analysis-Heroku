var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function (chartHtmlElement) {
  this.myChart_1 = null;
  this.myChart_2 = null;
  this.chartHtmlElement = chartHtmlElement;
}



ViewChart.prototype.bindEvents = function () {
  this.retweetsValues = {};
  this.favouritesValues = {};


  PubSub.subscribe('Searches:happy-totals-calulated', (event) => {
    const chart1 = document.querySelector('#chart_1');
    this.chartHtmlElement.classList.remove('hidden');
    chart1.classList.add('chart');
    this.myChart_1 = echarts.init(document.getElementById('chart_1'))
    this.myChart_2 = echarts.init(document.getElementById('chart_2'))
    this.retweetsValues.happyRetweets = event.detail.retweets;
    this.favouritesValues.happyFavourites = event.detail.favourites;
    // this.retweetsValues.push(event.detail.retweets);
    console.log('happy retweets from event: ', event.detail.retweets);
    console.log('happy retweets from object: ', this.retweetsValues);
    if (this.retweetsValues.happyRetweets && this.retweetsValues.sadRetweets) {
      console.log('both values are ready from happy listener: ', this.retweetsValues);
      this.renderChart(this.retweetsValues.happyRetweets, this.retweetsValues.sadRetweets, 'Positive vs Negative Retweets', this.myChart_1);
      //this.retweetsValues = [];
    }
    if (this.favouritesValues.happyFavourites && this.favouritesValues.sadFavourites) {
      console.log('both values are ready from happy listener: ', this.favouritesValues);
      this.renderChart(this.favouritesValues.happyFavourites, this.favouritesValues.sadFavourites, 'Positive vs Negative Retweets', this.myChart_2);
      //this.retweetsValues = [];
    }
    //this.renderChart(event.detail.favourites, event.detail.favourites, 'Positive vs Negative Likes', this.myChart_2);
  })

  PubSub.subscribe('Searches:sad-totals-calulated', (event) => {
    const chart2 = document.querySelector('#chart_2');
    this.chartHtmlElement.classList.remove('hidden');
    chart2.classList.add('chart');
    this.retweetsValues.sadRetweets = event.detail.retweets;
    this.favouritesValues.sadFavourites = event.detail.favourites;
    console.log('sad retweets from event: ', event.detail.retweets);
    if (this.retweetsValues.length === 2) {
      console.log('both values are ready from sad listener: ', this.retweetsValues);
      this.renderChart(this.retweetsValues.happyRetweets, this.retweetsValues.sadRetweets, 'Positive vs Negative Retweets', this.myChart_1);
      //this.retweetsValues = [];
    }
    if (this.favouritesValues.happyFavourites && this.favouritesValues.sadFavourites) {
      console.log('both values are ready from happy listener: ', this.favouritesValues);
      this.renderChart(this.favouritesValues.happyFavourites, this.favouritesValues.sadFavourites, 'Positive vs Negative Retweets', this.myChart_2);
      //this.retweetsValues = [];
    }
    //this.renderChart(event.detail.favourites, event.detail.favourites, 'Positive vs Negative Likes', this.myChart_2);
  })
}

ViewChart.prototype.renderChart = function (chartData_positive, chartData_negative, title, chart_x) {
  chart_x.setOption({
    // title: {
    //   text: title
    // },
    color: ['#c4114b','#15A5CC'],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    tooltip: {},
    series: [{
      radius: '70%',
      type: 'pie',
      data: [
        { value: chartData_positive, name: `positive: ${chartData_positive}` },
        { value: chartData_negative, name: `negative: ${chartData_negative}` },
      ],
      itemStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      }
    }]
  });
}
module.exports = ViewChart;
