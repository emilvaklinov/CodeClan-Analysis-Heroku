var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function(myChart_x){
  this.myChart_x = myChart_x;
  console.log('mychartx in constructor',this.myChart_x);
}

ViewChart.prototype.bindEvents = function(){
  PubSub.subscribe('Searches:totals-calulated', (event) =>{
    this.renderChart(event.detail, "retweets");
  })
}

ViewChart.prototype.renderChart = function(chartData, chartTitle){
  console.log(chartData)
  console.log('mychartx in render function',this.myChart_x);
  const my_chart_hardcoded = echarts.init(document.getElementById('chart_1'))
  my_chart_hardcoded.setOption({
    title: {
      text: chartTitle
    },
    tooltip: {},
    series: [{
      radius: '50%',
      type: 'pie',
      data:[
        {value:chartData.retweets, name: chartData.retweets},
        {value:chartData.favourites, name: chartData.favourites},
      ]
    }]
  });
}

module.exports = ViewChart;
