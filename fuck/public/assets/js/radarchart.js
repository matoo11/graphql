import { fetchSkills } from "./query.js";

document.addEventListener('DOMContentLoaded', async () => {
  const chartContainer = document.querySelector("#radarchart");
  if (!chartContainer) {
    console.warn("Radar chart container #radarchart not found");
    return;
  }

  const skills = await fetchSkills();

  if (!skills || skills.length === 0) {
    console.warn("No skill data found");
    return;
  }

  const categories = skills.map(skill =>
    skill.type.replace("skill_", "").replaceAll("_", " ").toUpperCase()
  );
  const data = skills.map(skill => skill.amount);

  const options = {
    series: [{
      name: 'Skill Level',
      data: data,
    }],
    chart: {
      height: 400,
      type: 'radar',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    title: {
      text: 'Skill Radar',
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#f1f5f9' 
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '13px',
        colors: ['#000000'] 
      }
    },
    plotOptions: {
      radar: {
        size: 120,
        polygons: {
          strokeColor: '#475569',
          fill: {
            colors: ['#1e293b', '#ffffff'] 
          }
        }
      }
    },
    colors: ['#06b6d4'], 
    markers: {
      size: 5,
      colors: ['#0f172a'], 
      strokeColor: '#06b6d4',
      strokeWidth: 2
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: val => `${val} pts`
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#cbd5e1' 
        }
      }
    },
    yaxis: {
  show: true,
  tickAmount: 5,
  labels: {
    formatter: val => `${val}`,
    style: {
      fontSize: '11px',
      color: '#ffffff' 
    }
  }
}

  };

  const chart = new ApexCharts(chartContainer, options);
  chart.render();
});
