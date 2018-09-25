var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function(){
  this.myChart_1 = null;
  this.myChart_2 = null;
}

ViewChart.prototype.bindEvents = function(){
  PubSub.subscribe('Searches:totals-calulated', (event) =>{
    this.renderChartRetweets(event.detail.retweets, event.detail.retweets);
    this.renderChartFavourites(event.detail.favourites, event.detail.favourites);
  })
}

ViewChart.prototype.renderChartRetweets = function (chartData_positive, chartData_negative){
  this.myChart_1 = echarts.init(document.getElementById('chart_1'))
  this.myChart_1.setOption({
    title: {
      text: 'retweets'
    },
    tooltip: {},
    series: [{
      radius: '50%',
      type: 'pie',
      data:[
        { value: chartData_positive, name: `positive: ${chartData_positive}`},
        { value: chartData_negative, name: `negative: ${chartData_negative}`},
      ]
    }]
  });
}

ViewChart.prototype.renderChartFavourites = function (chartData_positive, chartData_negative) {
  this.myChart_1 = echarts.init(document.getElementById('chart_2'))
  this.myChart_1.setOption({
    title: {
      text: 'favourites'
    },
    tooltip: {},
    series: [{
      radius: '50%',
      type: 'pie',
      data: [
        { value: chartData_positive, name: `positive: ${chartData_positive}` },
        { value: chartData_negative, name: `negative: ${chartData_negative}` },
      ]
    }]
  });
}






module.exports = ViewChart;
