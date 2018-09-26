var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function(myChart_x){
  this.myChart_1 = null;
  this.myChart_2 = null;
}



ViewChart.prototype.bindEvents = function () {
  
  this.myChart_1 = echarts.init(document.getElementById('chart_1'))
  this.myChart_2 = echarts.init(document.getElementById('chart_2'))
  this.retweetsValues = [];
  this.favouritesValues = [];
  PubSub.subscribe('Searches:happy-totals-calulated', (event) => {
    this.retweetsValues.push(event.detail.retweets);
    console.log('happy retweets from event: ', event.detail.retweets);
    if (this.retweetsValues.length === 2){
    console.log('both values are ready from happy listener: ', this.retweetsValues);
    this.renderChart(this.retweetsValues[0], this.retweetsValues[1], 'Positive vs Negative Retweets', this.myChart_1);
    this.retweetsValues = [];
    }
    //this.renderChart(event.detail.favourites, event.detail.favourites, 'Positive vs Negative Likes', this.myChart_2);
  })

  PubSub.subscribe('Searches:sad-totals-calulated', (event) => {
    this.retweetsValues.push(event.detail.retweets);
    console.log('sad retweets from event: ', event.detail.retweets);
    if (this.retweetsValues.length === 2){
      console.log('both values are ready from sad listener: ', this.retweetsValues);
    this.renderChart(this.retweetsValues[0], this.retweetsValues[1], 'Positive vs Negative Retweets', this.myChart_1);
    this.retweetsValues = [];
    }
    //this.renderChart(event.detail.favourites, event.detail.favourites, 'Positive vs Negative Likes', this.myChart_2);
  })
}

ViewChart.prototype.renderChart = function (chartData_positive, chartData_negative, title, chart_x) {
  chart_x.setOption({
    title: {
      text: title
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
