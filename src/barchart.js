import { fetchXpProg } from './query.js';

document.addEventListener('DOMContentLoaded', async function () {
  const chartContainer = document.querySelector("#progress-chart");
  if (!chartContainer) {
    console.warn("Chart container #progress-chart not found");
    return;
  }

  try {
    const data = await fetchXpProg();

    // Sort by date
    const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Build XP gained + cumulative XP progress
    let totalXp = 0;
    const progress = sorted.map(p => {
      totalXp += p.xp;
      return {
        date: new Date(p.createdAt),   // keep as Date object
        xpGained: p.xp,
        totalXp: totalXp
      };
    });

    const options = {
      series: [
        {
          name: "XP Gained",
          data: progress.map(p => [p.date.getTime(), p.xpGained]) // timestamp + value
        },
        {
          name: "Total XP",
          data: progress.map(p => [p.date.getTime(), p.totalXp])
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: { enabled: false },
        foreColor: '#d1d5db',
        background: 'transparent'
      },
      theme: { mode: 'dark' },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#f59e0b', '#3b82f6'],
      markers: {
        size: 4,
        hover: { size: 6 }
      },
      grid: {
        borderColor: '#374151',
        row: { colors: ['#111827', 'transparent'], opacity: 0.1 }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: '#9ca3af' },
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy"
          }
        },
        tickAmount: Math.ceil(progress.length / 120), // approx 1 tick per 4 months if many data points
        axisBorder: { color: '#4b5563' },
        axisTicks: { color: '#4b5563' }
      },
      yaxis: {
        title: { text: "XP", style: { color: '#9ca3af' } },
        labels: { style: { colors: '#9ca3af' } }
      },
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        x: {
          format: "dd MMM yyyy" // show full date on hover
        },
        y: {
          formatter: (val) => val.toLocaleString() + " XP"
        }
      },
      legend: {
        labels: { colors: '#d1d5db' },
        position: 'top'
      }
    };

    const chart = new ApexCharts(chartContainer, options);
    chart.render();

  } catch (error) {
    console.error("Error loading XP progress:", error);
  }
});
