import { fetchSkills2 } from "./query.js";

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const chartContainer = document.querySelector("#skills-card");
        if (!chartContainer) {
            console.warn("Radial chart container #skills-card not found");
            return;
        }

        const skillsData = await fetchSkills2();
        
        if (!skillsData || skillsData.length === 0) {
            chartContainer.innerHTML = '<div class="no-data">No skill data available</div>';
            return;
        }

        const series = skillsData.map(skill => skill.amount);
        const labels = skillsData.map(skill => 
            skill.type.replace("skill_", "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        );

        const options = {
            series: series,
            chart: {
                height: 380,
                type: 'radialBar',
                toolbar: {
                    show: false
                },
                background: 'transparent' 
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent'
                    },
                    track: {
                        show: true,
                        background: '#1f2937', 
                        strokeWidth: '97%',
                        opacity: 0.5,
                        margin: 5
                    },
                    dataLabels: {
                        name: {
                            fontSize: '16px',
                            color: '#e5e7eb', 
                            fontWeight: 600
                        },
                        value: {
                            fontSize: '14px',
                            color: '#d1d5db',
                            fontWeight: 400,
                            formatter: function (val) {
                                return val;
                            }
                        },
                        total: {
                            show: true,
                            label: 'Overall Skills',
                            color: '#f9fafb',
                            fontWeight: 600,
                            fontSize: '16px',
                            formatter: function (w) {
                                const sum = w.globals.series.reduce((a, b) => a + b, 0);
                                return Math.round(sum / w.globals.series.length);
                            }
                        }
                    }
                }
            },
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'], 
            labels: labels,
            legend: {
                show: true,
                floating: true,
                fontSize: '14px',
                position: 'left',
                offsetX: -10,
                offsetY: 0,
                labels: {
                    colors: '#e5e7eb', 
                    useSeriesColors: true,
                },
                markers: {
                    size: 0
                },
                formatter: function(seriesName, opts) {
                    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
                },
                itemMargin: {
                    vertical: 3
                }
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        height: 320
                    },
                    legend: {
                        show: false
                    }
                }
            }]
        };

        const chart = new ApexCharts(chartContainer, options);
        chart.render();

        window.addEventListener('resize', function() {
            chart.updateOptions({
                chart: {
                    height: window.innerWidth < 768 ? 300 : 380
                }
            });
        });

    } catch (error) {
        console.error("Error rendering radial chart:", error);
        const chartContainer = document.querySelector("#skills-card");
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div class="chart-error" style="color:#f87171; text-align:center; padding:10px;">
                    Failed to load skill data. Please try again later.
                </div>
            `;
        }
    }
});
