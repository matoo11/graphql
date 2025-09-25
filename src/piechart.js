document.addEventListener('DOMContentLoaded', function() {
  initProfile().then(() => {
    const doneText = document.getElementById('Done').textContent;
    const receivedText = document.getElementById('recived').textContent;
    
    const doneSize = parseFloat(doneText) || 0;
    const receivedSize = parseFloat(receivedText) || 0;
    
    const options = {
      series: [doneSize, receivedSize],
      chart: {
        width: '100%',
        type: 'donut',
        background: 'transparent', 
        foreColor: '#E5E7EB'      
      },
      labels: [`Done (${doneText})`, `Received (${receivedText})`],
      colors: ['#4CAF50', '#2196F3'],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          donut: {
            labels: {
              show: false
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        labels: {
          colors: '#E5E7EB' 
        },
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

    const chartContainer = document.querySelector("#piechart");
    if (chartContainer) {
      const chart = new ApexCharts(chartContainer, options);
      chart.render();
    } else {
      console.warn("Element with ID #piechart not found in the DOM.");
    }
  });
});
