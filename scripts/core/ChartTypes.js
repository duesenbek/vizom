// VIZOM Chart Types - Comprehensive Chart.js Integration
// Supports all major chart types with advanced configurations

const ChartGlobal = typeof window !== 'undefined' ? window.Chart : (typeof globalThis !== 'undefined' ? globalThis.Chart : undefined);

if (!ChartGlobal) {
    throw new Error('Chart.js is required. Please ensure chart.umd.min.js is loaded before ChartTypes.');
}

const Chart = ChartGlobal;

export class ChartTypes {
    constructor() {
        this.chartInstances = new Map();
        this.defaultOptions = this.getDefaultOptions();
        this.colorSchemes = this.getColorSchemes();
    }

    // Default chart options
    getDefaultOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            family: 'Inter, system-ui, sans-serif'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        };
    }

    // Color schemes for charts
    getColorSchemes() {
        return {
            default: [
                '#0066FF', '#00C853', '#FF9500', '#FF3B30', '#AF52DE',
                '#5AC8FA', '#FFCC00', '#FF2D92', '#30D158', '#64D2FF'
            ],
            pastel: [
                '#E3F2FD', '#E8F5E8', '#FFF3E0', '#FFEBEE', '#F3E5F5',
                '#E0F7FA', '#FFF8E1', '#FCE4EC', '#E8F5E9', '#E1F5FE'
            ],
            vibrant: [
                '#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF',
                '#06FFB4', '#FF4365', '#00D9FF', '#FE5F55', '#7209B7'
            ],
            business: [
                '#1E3A8A', '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA',
                '#93C5FD', '#DBEAFE', '#EFF6FF', '#1F2937', '#374151'
            ]
        };
    }

    // Area Chart
    createAreaChart(ctx, data, options = {}) {
        const config = {
            type: 'line',
            data: {
                ...data,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    fill: true,
                    backgroundColor: this.createGradient(ctx, dataset.backgroundColor || '#0066FF'),
                    borderColor: dataset.borderColor || '#0066FF',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: dataset.borderColor || '#0066FF',
                    pointBorderWidth: 2
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Bar Chart
    createBarChart(ctx, data, options = {}) {
        const config = {
            type: 'bar',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    borderColor: dataset.borderColor || 'transparent',
                    borderWidth: 0,
                    borderRadius: 8,
                    borderSkipped: false
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Bubble Chart
    createBubbleChart(ctx, data, options = {}) {
        const config = {
            type: 'bubble',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: this.addAlpha(dataset.backgroundColor || this.colorSchemes.default[index % this.colorSchemes.default.length], 0.6),
                    borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    borderWidth: 2
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Doughnut Chart
    createDoughnutChart(ctx, data, options = {}) {
        const config = {
            type: 'doughnut',
            data: {
                ...data,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || this.colorSchemes.default,
                    borderColor: '#fff',
                    borderWidth: 2,
                    hoverOffset: 4
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                cutout: '60%',
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Pie Chart
    createPieChart(ctx, data, options = {}) {
        const config = {
            type: 'pie',
            data: {
                ...data,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || this.colorSchemes.default,
                    borderColor: '#fff',
                    borderWidth: 2,
                    hoverOffset: 4
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Line Chart
    createLineChart(ctx, data, options = {}) {
        const config = {
            type: 'line',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Mixed Chart Types
    createMixedChart(ctx, data, options = {}) {
        const config = {
            type: 'bar',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => {
                    if (dataset.type === 'line') {
                        return {
                            ...dataset,
                            type: 'line',
                            borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                            pointBorderWidth: 2
                        };
                    } else {
                        return {
                            ...dataset,
                            type: 'bar',
                            backgroundColor: dataset.backgroundColor || this.addAlpha(this.colorSchemes.default[index % this.colorSchemes.default.length], 0.6),
                            borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                            borderWidth: 0,
                            borderRadius: 8
                        };
                    }
                })
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Polar Area Chart
    createPolarAreaChart(ctx, data, options = {}) {
        const config = {
            type: 'polarArea',
            data: {
                ...data,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || this.colorSchemes.default.map(color => this.addAlpha(color, 0.6)),
                    borderColor: dataset.borderColor || this.colorSchemes.default,
                    borderWidth: 2
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Radar Chart
    createRadarChart(ctx, data, options = {}) {
        const config = {
            type: 'radar',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: this.addAlpha(dataset.backgroundColor || this.colorSchemes.default[index % this.colorSchemes.default.length], 0.2),
                    borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    r: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Scatter Chart
    createScatterChart(ctx, data, options = {}) {
        const config = {
            type: 'scatter',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    borderColor: dataset.borderColor || this.colorSchemes.default[index % this.colorSchemes.default.length],
                    borderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Helper method to create gradient
    createGradient(ctx, color) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, this.addAlpha(color, 0.8));
        gradient.addColorStop(1, this.addAlpha(color, 0.1));
        return gradient;
    }

    // Helper method to add alpha to color
    addAlpha(color, alpha) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        return color;
    }

    // Generate sample data for testing
    generateSampleData(type, labels = null) {
        const defaultLabels = labels || ['January', 'February', 'March', 'April', 'May', 'June'];
        
        switch (type) {
            case 'bar':
            case 'line':
            case 'area':
                return {
                    labels: defaultLabels,
                    datasets: [{
                        label: 'Dataset 1',
                        data: defaultLabels.map(() => Math.floor(Math.random() * 100) + 20),
                        backgroundColor: '#0066FF'
                    }, {
                        label: 'Dataset 2',
                        data: defaultLabels.map(() => Math.floor(Math.random() * 100) + 20),
                        backgroundColor: '#00C853'
                    }]
                };
                
            case 'pie':
            case 'doughnut':
            case 'polar':
                return {
                    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: this.colorSchemes.default
                    }]
                };
                
            case 'bubble':
                return {
                    datasets: [{
                        label: 'Dataset 1',
                        data: Array.from({length: 10}, () => ({
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                            r: Math.random() * 20 + 5
                        })),
                        backgroundColor: '#0066FF'
                    }]
                };
                
            case 'radar':
                return {
                    labels: ['Metric A', 'Metric B', 'Metric C', 'Metric D', 'Metric E', 'Metric F'],
                    datasets: [{
                        label: 'Dataset 1',
                        data: [80, 65, 90, 75, 85, 70],
                        backgroundColor: '#0066FF'
                    }, {
                        label: 'Dataset 2',
                        data: [70, 85, 75, 90, 65, 80],
                        backgroundColor: '#00C853'
                    }]
                };
                
            case 'scatter':
                return {
                    datasets: [{
                        label: 'Dataset 1',
                        data: Array.from({length: 20}, () => ({
                            x: Math.random() * 100,
                            y: Math.random() * 100
                        })),
                        backgroundColor: '#0066FF'
                    }]
                };
                
            default:
                return this.generateSampleData('bar');
        }
    }

    // Update chart data
    updateChart(chartId, newData) {
        const chart = this.chartInstances.get(chartId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    // Destroy chart
    destroyChart(chartId) {
        const chart = this.chartInstances.get(chartId);
        if (chart) {
            chart.destroy();
            this.chartInstances.delete(chartId);
        }
    }

    // Get all chart instances
    getAllCharts() {
        return this.chartInstances;
    }

    // Export chart as image
    exportChart(chartId, format = 'png') {
        const chart = this.chartInstances.get(chartId);
        if (chart) {
            return chart.toBase64Image(`image/${format}`);
        }
        return null;
    }
}

// Export singleton instance
export const chartTypes = new ChartTypes();
export default chartTypes;
