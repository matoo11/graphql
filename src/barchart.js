import { fetchprojectsDone } from './query.js';

document.addEventListener('DOMContentLoaded', async function () {
  const chartContainer = document.querySelector("#progress-chart");
  if (!chartContainer) {
    console.warn("Chart container #progress-chart not found");
    return;
  }

  try {
    const data = await fetchprojectsDone();

    const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const projectNames = sorted.map(p => p.name || "Unnamed");
    const dates = sorted.map(p => new Date(p.createdAt).toLocaleDateString());

    const options = {
      series: [{
        name: "Projects Done",
        data: projectNames.map((_, i) => i + 1)
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        foreColor: '#e5e7eb', 
        background: 'transparent'
      },
      theme: {
        mode: 'dark'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Completed Projects Over Time',
        align: 'left',
        style: {
          color: '#f9fafb',
          fontSize: '16px'
        }
      },
      grid: {
        borderColor: '#374151', 
        row: {
          colors: ['#1f2937', 'transparent'], 
          opacity: 0.5
        }
      },
      xaxis: {
        categories: dates,
        labels: {
          style: {
            colors: '#000000' 
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#000000' 
          }
        }
      }
    };

    const chart = new ApexCharts(chartContainer, options);
    chart.render();

  } catch (error) {
    console.error("Error loading project data:", error);
  }
});