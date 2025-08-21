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
                }
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    track: {
                        show: true,
                        startAngle: undefined,
                        endAngle: undefined,
                        background: '#f2f2f2',
                        strokeWidth: '97%',
                        opacity: 1,
                        margin: 5,
                        dropShadow: {
                            enabled: false,
                            top: 0,
                            left: 0,
                            blur: 3,
                            opacity: 0.5
                        }
                    },
                    dataLabels: {
                        name: {
                            fontSize: '16px',
                            color: undefined,
                            fontWeight: 600
                        },
                        value: {
                            fontSize: '14px',
                            color: undefined,
                            fontWeight: 400,
                            formatter: function (val) {
                                return val ;
                            }
                        },
                        total: {
                            show: true,
                            label: 'Overall Skills',
                            color: '#373d3f',
                            fontWeight: 600,
                            fontSize: '16px',
                            formatter: function (w) {
                                const sum = w.globals.series.reduce((a, b) => a + b, 0);
                                return Math.round(sum / w.globals.series.length) ;
                            }
                        }
                    }
                }
            },
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'], // Extended color palette
            labels: labels,
            legend: {
                show: true,
                floating: true,
                fontSize: '14px',
                position: 'left',
                offsetX: -10,
                offsetY: 0,
                labels: {
                    useSeriesColors: true,
                },
                markers: {
                    size: 0
                },
                formatter: function(seriesName, opts) {
                    return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex] ;
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
                <div class="chart-error">
                    Failed to load skill data. Please try again later.
                </div>
            `;
        }
    }
});