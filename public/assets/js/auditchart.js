import { fetchPassedAudits, fetchFailedAudits } from "./query.js";

document.addEventListener('DOMContentLoaded', async function () {
  await initChart("#passed-audits-chart", fetchPassedAudits, 'Passed Audits by Project', '#6B7280', 'passed');
  await initChart("#failed-audits-chart", fetchFailedAudits, 'Failed Audits by Project', '#9CA3AF', 'fail');
});

async function initChart(containerId, fetchFunction, title, color, auditType) {
  const chartContainer = document.querySelector(containerId);
  if (!chartContainer) {
    console.warn(`Chart container ${containerId} not found`);
    return;
  }

  try {
    const auditData = await fetchFunction();

    if (!Array.isArray(auditData) || auditData.length === 0) {
      chartContainer.innerHTML = `<div class="chart-no-data">There are no audit ${auditType}</div>`;
      return;
    }

    const treemapData = auditData.map(item => ({
      x: item.x,
      y: item.y
    }));

    const options = {
      series: [{
        data: treemapData
      }],
      chart: {
        height: 350,
        type: 'treemap',
        toolbar: { 
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            pan: false
          }
        },
        foreColor: '#F3F4F6',
        background: 'transparent'
      },
      theme: {
        mode: 'dark'
      },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: true,
          shadeIntensity: 0.2,
          colorScale: {
            ranges: [{
              from: 0,
              to: Math.max(...treemapData.map(d => d.y)),
              color: color
            }]
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#000000']
        },
        formatter: function(text, opts) {
          return [text, `${opts.value} audit${opts.value !== 1 ? 's' : ''}`];
        },
        offsetY: 0
      },
      title: {
        text: title,
        align: 'center',
        style: {
          color: '#E5E7EB',
          fontSize: '16px',
          fontWeight: 'bold'
        },
        margin: 20
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function(value) {
            return `${value} audit${value !== 1 ? 's' : ''}`;
          }
        }
      },
      noData: {
        text: `There are no audit ${auditType}`,
        align: 'center',
        style: {
          color: '#9CA3AF',
          fontSize: '16px'
        }
      }
    };

    new ApexCharts(chartContainer, options).render();

  } catch (error) {
    console.error(`Error loading ${title.toLowerCase()}:`, error);
    chartContainer.innerHTML = `<div class="chart-error">Error loading data: ${error.message}</div>`;
  }
}