// var echarts = require('echarts');
const PubSub = require('../helpers/pub_sub.js');

const ViewChart = function(myChart_x){
  this.myChart_x = myChart_x;
}

ViewChart.prototype.bindEvents = function(){
  PubSub.subscribe('Searches:totals-calulated', (event) =>{
    console.log('halo warszawa:', event.detail);
  })
}

ViewChart.prototype.renderChart = function(testChartData, chartTitle){
  this.myChart_x.setOption({
    title: {
      text: chartTitle
    },
    tooltip: {},
    series: [{
      radius: '50%',
      type: 'pie',
      data:[
        {value:testChartData[0], name:testChartData[0]},
        {value:testChartData[1], name:testChartData[1]},
      ]
    }]
  });
}

module.exports = ViewChart;
