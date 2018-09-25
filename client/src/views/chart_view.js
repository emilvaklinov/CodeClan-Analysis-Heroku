var echarts = require('echarts');

const ViewChart = function(){}

const testChartData = [20, 100];


ViewChart.prototype.renderChart = function(){
// initialize echarts instance with prepared DOM
var myChart = echarts.init(document.getElementById('chart_1'));
// draw chart
myChart.setOption({
    title: {
        text: 'by Retweets'
    },
    tooltip: {},
    series: [{
        // name: 'no of retweets',
        radius: '55%',
        type: 'pie',
        data:[
                {value:testChartData[0], name:testChartData[0]},
                {value:testChartData[1], name:testChartData[1]},
              ]
  }]
});
}

module.exports = ViewChart;
