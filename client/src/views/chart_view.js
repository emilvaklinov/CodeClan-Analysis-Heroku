var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function(myChart_x){
  this.myChart_1 = null;
  this.myChart_2 = null;
}

ViewChart.prototype.bindEvents = function () {
  PubSub.subscribe('Searches:totals-calulated', (event) => {
    this.myChart_1 = echarts.init(document.getElementById('chart_1'))
    this.myChart_2 = echarts.init(document.getElementById('chart_2'))
    this.renderChart(event.detail.retweets, event.detail.retweets, 'Positive vs Negative Retweets', this.myChart_1);
    this.renderChart(event.detail.favourites, event.detail.favourites, 'Positive vs Negative Likes', this.myChart_2);
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
