/**
 * Chart Types and Configuration
 * Centralized chart type definitions and configurations
 */
// Chart type definitions
export const CHART_TYPES = {
    bar: {
        id: 'bar',
        name: 'Bar Chart',
        icon: 'fa-chart-column',
        category: 'comparison',
        description: 'Compare values across categories',
        supportedDataTypes: ['categorical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: 'Bar Chart' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    },
    line: {
        id: 'line',
        name: 'Line Chart',
        icon: 'fa-chart-line',
        category: 'trend',
        description: 'Show trends over time or continuous data',
        supportedDataTypes: ['time-series', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Line Chart' }
            },
            scales: {
                y: { beginAtZero: true }
            },
            elements: {
                line: { tension: 0.4 },
                point: { radius: 5, hoverRadius: 7 }
            }
        }
    },
    pie: {
        id: 'pie',
        name: 'Pie Chart',
        icon: 'fa-chart-pie',
        category: 'composition',
        description: 'Show parts of a whole',
        supportedDataTypes: ['categorical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Pie Chart' }
            }
        }
    },
    area: {
        id: 'area',
        name: 'Area Chart',
        icon: 'fa-chart-area',
        category: 'trend',
        description: 'Show trends with filled areas',
        supportedDataTypes: ['time-series', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Area Chart' }
            },
            scales: {
                y: { beginAtZero: true, stacked: true }
            },
            elements: {
                line: { tension: 0.4, fill: true }
            }
        }
    },
    scatter: {
        id: 'scatter',
        name: 'Scatter Plot',
        icon: 'fa-braille',
        category: 'correlation',
        description: 'Show relationship between two variables',
        supportedDataTypes: ['numerical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Scatter Plot' }
            },
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { beginAtZero: true }
            }
        }
    },
    bubble: {
        id: 'bubble',
        name: 'Bubble Chart',
        icon: 'fa-circle',
        category: 'correlation',
        description: 'Show relationship with three variables',
        supportedDataTypes: ['numerical', 'numerical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Bubble Chart' }
            },
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { beginAtZero: true }
            }
        }
    },
    radar: {
        id: 'radar',
        name: 'Radar Chart',
        icon: 'fa-spider',
        category: 'comparison',
        description: 'Compare multiple variables',
        supportedDataTypes: ['multidimensional'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Radar Chart' }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { circular: true }
                }
            }
        }
    },
    heatmap: {
        id: 'heatmap',
        name: 'Heatmap',
        icon: 'fa-th',
        category: 'matrix',
        description: 'Show data intensity in a matrix',
        supportedDataTypes: ['matrix', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Heatmap' }
            }
        }
    },
    histogram: {
        id: 'histogram',
        name: 'Histogram',
        icon: 'fa-chart-column',
        category: 'distribution',
        description: 'Show frequency distribution',
        supportedDataTypes: ['numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Histogram' }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                x: { title: { display: true, text: 'Value' } }
            }
        }
    },
    box: {
        id: 'box',
        name: 'Box Plot',
        icon: 'fa-box',
        category: 'distribution',
        description: 'Show statistical distribution',
        supportedDataTypes: ['numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Box Plot' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    },
    funnel: {
        id: 'funnel',
        name: 'Funnel Chart',
        icon: 'fa-filter',
        category: 'composition',
        description: 'Show progressive reduction',
        supportedDataTypes: ['categorical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Funnel Chart' }
            }
        }
    },
    gauge: {
        id: 'gauge',
        name: 'Gauge Chart',
        icon: 'fa-gauge',
        category: 'kpi',
        description: 'Show progress towards a goal',
        supportedDataTypes: ['numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Gauge' }
            }
        }
    },
    progress: {
        id: 'progress',
        name: 'Progress Bar',
        icon: 'fa-progress',
        category: 'kpi',
        description: 'Show completion percentage',
        supportedDataTypes: ['numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Progress' }
            },
            scales: {
                x: { beginAtZero: true, max: 100 }
            }
        }
    },
    timeline: {
        id: 'timeline',
        name: 'Timeline',
        icon: 'fa-clock',
        category: 'temporal',
        description: 'Show events over time',
        supportedDataTypes: ['time-series', 'events'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Timeline' }
            }
        }
    },
    gantt: {
        id: 'gantt',
        name: 'Gantt Chart',
        icon: 'fa-tasks',
        category: 'temporal',
        description: 'Show project schedule',
        supportedDataTypes: ['time-series', 'tasks'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Gantt Chart' }
            },
            scales: {
                x: { type: 'time' },
                y: { beginAtZero: true }
            }
        }
    },
    sankey: {
        id: 'sankey',
        name: 'Sankey Diagram',
        icon: 'fa-stream',
        category: 'flow',
        description: 'Show flow between entities',
        supportedDataTypes: ['flow', 'network'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Sankey Diagram' }
            }
        }
    },
    tree: {
        id: 'tree',
        name: 'Tree Map',
        icon: 'fa-tree',
        category: 'hierarchy',
        description: 'Show hierarchical data',
        supportedDataTypes: ['hierarchical', 'numerical'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Tree Map' }
            }
        }
    },
    network: {
        id: 'network',
        name: 'Network Graph',
        icon: 'fa-project-diagram',
        category: 'network',
        description: 'Show relationships between nodes',
        supportedDataTypes: ['network', 'graph'],
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Network Graph' }
            }
        }
    }
};
// Chart theme definitions
export const CHART_THEMES = {
    default: {
        name: 'Default',
        colors: ['#3B82F6', '#8B5CF6', '#06D6A0', '#60A5FA', '#A78BFA'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    dark: {
        name: 'Dark',
        colors: ['#60A5FA', '#A78BFA', '#34D399', '#93C5FD', '#C4B5FD'],
        background: '#1f2937',
        grid: '#374151',
        text: '#f9fafb',
        border: '#4b5563'
    },
    vibrant: {
        name: 'Vibrant',
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    pastel: {
        name: 'Pastel',
        colors: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#DDD6FE'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    monochrome: {
        name: 'Monochrome',
        colors: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    nature: {
        name: 'Nature',
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    sunset: {
        name: 'Sunset',
        colors: ['#dc2626', '#ea580c', '#f59e0b', '#fbbf24', '#fcd34d'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    },
    ocean: {
        name: 'Ocean',
        colors: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'],
        background: '#ffffff',
        grid: '#e5e7eb',
        text: '#1f2937',
        border: '#d1d5db'
    }
};
// Default animation settings
export const DEFAULT_ANIMATION = {
    enabled: true,
    duration: 750,
    easing: 'easeInOutQuart',
    delay: 0
};

// Lightweight chart type definitions used by UI and workflow helpers
export const ChartType = {
    BAR: 'bar',
    LINE: 'line',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    AREA: 'area',
    SCATTER: 'scatter',
    BUBBLE: 'bubble',
    RADAR: 'radar',
    POLAR: 'polarArea',
    MIXED: 'mixed'
};

export const ChartStatus = {
    IDLE: 'idle',
    LOADING: 'loading',
    RENDERING: 'rendering',
    COMPLETE: 'complete',
    ERROR: 'error'
};

export class ChartConfig {
    constructor(type, data, options = {}) {
        this.type = type;
        this.data = data;
        this.options = options;
    }
}

export class ChartError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ChartError';
        this.code = code;
    }
}
