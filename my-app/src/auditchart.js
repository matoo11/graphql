import { fetchPassedAudits, fetchFailedAudits } from "./query.js";

document.addEventListener('DOMContentLoaded', async function () {
  await initChart("#passed-audits-chart", fetchPassedAudits, 'Passed Audits ', '#6B7280', 'passed');
  await initChart("#failed-audits-chart", fetchFailedAudits, 'Failed Audits ', '#9CA3AF', 'fail');
});

async function initChart(containerId, fetchFunction, title, color, auditType) {
  const chartContainer = document.querySelector(containerId);
  if (!chartContainer) {
    console.warn(`Chart container ${containerId} not found`);
    return;
  }

  // Create a title element with black background
  const titleElement = document.createElement('div');
  titleElement.style.backgroundColor = '#000000';
  titleElement.style.color = '#E5E7EB';
  titleElement.style.padding = '8px 16px';
  titleElement.style.borderRadius = '4px';
  titleElement.style.marginBottom = '10px';
  titleElement.style.display = 'inline-block';
  titleElement.style.fontSize = '16px';
  titleElement.style.fontWeight = 'bold';
  titleElement.textContent = title.trim();
  
  // Insert the title before the chart container
  chartContainer.parentNode.insertBefore(titleElement, chartContainer);

  try {
    const auditData = await fetchFunction();

    if (!Array.isArray(auditData) || auditData.length === 0) {
      chartContainer.innerHTML = `<div class="chart-no-data" style="background: ${auditType === 'passed' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)'}; padding: 10px; border-radius: 5px;">There are no audit ${auditType}</div>`;
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
      // Remove the title from chart options since we're adding it manually
      title: {
        text: '',
        align: 'center',
        style: {
          color: 'transparent',
          fontSize: '0px'
        },
        margin: 0
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
          fontSize: '16px',
          background: auditType === 'passed' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)',
          padding: '10px',
          borderRadius: '5px'
        }
      }
    };

    new ApexCharts(chartContainer, options).render();

  } catch (error) {
    console.error(`Error loading ${title.toLowerCase()}:`, error);
    chartContainer.innerHTML = `<div class="chart-error" style="background: ${auditType === 'passed' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)'}; padding: 10px; border-radius: 5px;">Error loading data: ${error.message}</div>`;
  }
}