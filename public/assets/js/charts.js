document.addEventListener('DOMContentLoaded', function() {
  var options = {
    series: [1.2, 1.4], 
    chart: {
      width: '100%',
      type: 'donut',
    },
    labels: ['Done (1.2 MB)', 'Received (1.4 MB)'], // Custom labels
    colors: ['#4CAF50', '#2196F3'], // Green for Done, Blue for Received
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: false,
           
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      formatter: function(seriesName, opts) {
        return seriesName + ' - ' + opts.w.globals.series[opts.seriesIndex] + ' MB';
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        }
      }
    }]
  };

  var chart = new ApexCharts(document.querySelector("#piechart"), options);
  chart.render();
});