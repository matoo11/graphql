document.addEventListener('DOMContentLoaded', function() {
  // Wait for profile data to be loaded
  initProfile().then(() => {
    // Get the values from the UI (which were set by updateProfileUI)
    const doneText = document.getElementById('Done').textContent;
    const receivedText = document.getElementById('recived').textContent;
    
    // Extract numeric values from the formatted text (e.g., "3.5 MB" -> 3.5)
    const doneSize = parseFloat(doneText) || 0;
    const receivedSize = parseFloat(receivedText) || 0;
    
    const options = {
      series: [doneSize, receivedSize],
      chart: {
        width: '100%',
        type: 'donut',
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