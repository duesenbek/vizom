/**
 * Chart Templates Database
 * 30 Stunning Templates: 5 Free + 25 Pro
 * Uses Chart.js, ECharts, and ApexCharts for beautiful visualizations
 */

export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'business',
  FINANCE: 'finance',
  MARKETING: 'marketing',
  SCIENCE: 'science',
  EDUCATION: 'education',
  HEALTH: 'health'
};

// Beautiful color palettes
const PALETTES = {
  blue: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  green: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#dcfce7'],
  purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe'],
  orange: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#ffedd5'],
  gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
  corporate: ['#1e3a5f', '#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d'],
  modern: ['#0f172a', '#1e293b', '#334155', '#64748b', '#94a3b8'],
  vibrant: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']
};

/**
 * All templates
 * isPro: false = Free tier (first 5)
 * isPro: true = Pro tier only
 */
export const TEMPLATES = [
  // ============================================
  // FREE TEMPLATES (5)
  // ============================================
  {
    id: 'monthly-sales',
    title: 'Monthly Sales Report',
    description: 'Track monthly sales performance with a clean bar chart',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'bar',
    isPro: false,
    thumbnail: '/assets/images/templates/monthly-sales.png',
    prompt: 'Create a bar chart showing monthly sales data for January through December with values ranging from $10,000 to $50,000',
    config: {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales ($)',
          data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 40000, 38000, 45000, 50000],
          backgroundColor: 'rgba(37, 99, 235, 0.8)'
        }]
      }
    }
  },
  {
    id: 'website-traffic',
    title: 'Website Traffic Trends',
    description: 'Visualize website visitor trends over time',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'line',
    isPro: false,
    thumbnail: '/assets/images/templates/website-traffic.png',
    prompt: 'Create a line chart showing website traffic over the past 7 days with daily visitors',
    config: {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Visitors',
          data: [1200, 1900, 1500, 2500, 2200, 1800, 1400],
          borderColor: 'rgb(37, 99, 235)',
          tension: 0.4
        }]
      }
    }
  },
  {
    id: 'market-share',
    title: 'Market Share Distribution',
    description: 'Show market share breakdown by competitor',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'pie',
    isPro: false,
    thumbnail: '/assets/images/templates/market-share.png',
    prompt: 'Create a pie chart showing market share distribution among 5 competitors',
    config: {
      type: 'pie',
      data: {
        labels: ['Our Company', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']
        }]
      }
    }
  },
  {
    id: 'quarterly-revenue',
    title: 'Quarterly Revenue',
    description: 'Compare revenue across quarters',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'bar',
    isPro: false,
    thumbnail: '/assets/images/templates/quarterly-revenue.png',
    prompt: 'Create a bar chart comparing quarterly revenue for the current year',
    config: {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue ($M)',
          data: [2.5, 3.2, 4.1, 5.0],
          backgroundColor: ['#22c55e', '#16a34a', '#15803d', '#166534']
        }]
      }
    }
  },
  {
    id: 'task-completion',
    title: 'Task Completion Rate',
    description: 'Track project task completion status',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'pie',
    isPro: false,
    thumbnail: '/assets/images/templates/task-completion.png',
    prompt: 'Create a pie chart showing task completion status: completed, in progress, and pending',
    config: {
      type: 'pie',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
        }]
      }
    }
  },

  // ============================================
  // PRO TEMPLATES (25)
  // ============================================
  
  // Business (5)
  {
    id: 'sales-comparison',
    title: 'Sales Comparison by Region',
    description: 'Compare sales performance across different regions',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/sales-comparison.png',
    prompt: 'Create a grouped bar chart comparing sales across North, South, East, and West regions for Q1-Q4',
    config: {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'North', data: [120, 150, 180, 200], backgroundColor: '#2563eb' },
          { label: 'South', data: [100, 130, 160, 190], backgroundColor: '#3b82f6' },
          { label: 'East', data: [80, 110, 140, 170], backgroundColor: '#60a5fa' },
          { label: 'West', data: [90, 120, 150, 180], backgroundColor: '#93c5fd' }
        ]
      }
    }
  },
  {
    id: 'employee-performance',
    title: 'Employee Performance Radar',
    description: 'Multi-dimensional employee performance assessment',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'radar',
    isPro: true,
    thumbnail: '/assets/images/templates/employee-performance.png',
    prompt: 'Create a radar chart showing employee performance across 6 dimensions: Communication, Technical Skills, Leadership, Teamwork, Problem Solving, Creativity',
    config: {
      type: 'radar',
      data: {
        labels: ['Communication', 'Technical', 'Leadership', 'Teamwork', 'Problem Solving', 'Creativity'],
        datasets: [{
          label: 'Score',
          data: [85, 90, 75, 88, 82, 78],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgb(37, 99, 235)'
        }]
      }
    }
  },
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction Survey',
    description: 'Visualize customer satisfaction scores',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'doughnut',
    isPro: true,
    thumbnail: '/assets/images/templates/customer-satisfaction.png',
    prompt: 'Create a doughnut chart showing customer satisfaction levels: Very Satisfied, Satisfied, Neutral, Dissatisfied',
    config: {
      type: 'doughnut',
      data: {
        labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444']
        }]
      }
    }
  },
  {
    id: 'project-timeline',
    title: 'Project Timeline Gantt',
    description: 'Horizontal bar chart for project milestones',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/project-timeline.png',
    prompt: 'Create a horizontal bar chart showing project phases: Planning, Design, Development, Testing, Launch with duration in weeks',
    config: {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['Planning', 'Design', 'Development', 'Testing', 'Launch'],
        datasets: [{
          label: 'Duration (weeks)',
          data: [2, 3, 8, 4, 1],
          backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']
        }]
      }
    }
  },
  {
    id: 'kpi-dashboard',
    title: 'KPI Dashboard Overview',
    description: 'Key performance indicators at a glance',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'mixed',
    isPro: true,
    thumbnail: '/assets/images/templates/kpi-dashboard.png',
    prompt: 'Create a mixed chart with bar and line showing monthly KPIs: Revenue (bars) and Growth Rate (line)',
    config: {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { type: 'bar', label: 'Revenue ($K)', data: [50, 60, 75, 80, 95, 110], backgroundColor: '#2563eb' },
          { type: 'line', label: 'Growth %', data: [5, 8, 12, 15, 18, 22], borderColor: '#22c55e', yAxisID: 'y1' }
        ]
      }
    }
  },

  // Finance (5)
  {
    id: 'stock-performance',
    title: 'Stock Performance',
    description: 'Track stock price movements over time',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/stock-performance.png',
    prompt: 'Create a line chart showing stock price movement over 30 days with high/low indicators',
    config: {
      type: 'line',
      data: {
        labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
        datasets: [{
          label: 'Stock Price ($)',
          data: [100, 102, 98, 105, 110, 108, 112, 115, 113, 118, 120, 117, 122, 125, 123, 128, 130, 127, 132, 135, 133, 138, 140, 137, 142, 145, 143, 148, 150, 152],
          borderColor: '#2563eb',
          fill: true,
          backgroundColor: 'rgba(37, 99, 235, 0.1)'
        }]
      }
    }
  },
  {
    id: 'expense-breakdown',
    title: 'Expense Breakdown',
    description: 'Detailed breakdown of company expenses',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'doughnut',
    isPro: true,
    thumbnail: '/assets/images/templates/expense-breakdown.png',
    prompt: 'Create a doughnut chart showing expense categories: Salaries, Marketing, Operations, R&D, Admin',
    config: {
      type: 'doughnut',
      data: {
        labels: ['Salaries', 'Marketing', 'Operations', 'R&D', 'Admin'],
        datasets: [{
          data: [40, 20, 15, 15, 10],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
        }]
      }
    }
  },
  {
    id: 'investment-portfolio',
    title: 'Investment Portfolio',
    description: 'Asset allocation visualization',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'polarArea',
    isPro: true,
    thumbnail: '/assets/images/templates/investment-portfolio.png',
    prompt: 'Create a polar area chart showing investment allocation: Stocks, Bonds, Real Estate, Crypto, Cash',
    config: {
      type: 'polarArea',
      data: {
        labels: ['Stocks', 'Bonds', 'Real Estate', 'Crypto', 'Cash'],
        datasets: [{
          data: [40, 25, 20, 10, 5],
          backgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(107, 114, 128, 0.8)']
        }]
      }
    }
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss Statement',
    description: 'Visualize P&L with waterfall effect',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/profit-loss.png',
    prompt: 'Create a bar chart showing P&L breakdown: Revenue, COGS, Gross Profit, Operating Expenses, Net Profit',
    config: {
      type: 'bar',
      data: {
        labels: ['Revenue', 'COGS', 'Gross Profit', 'OpEx', 'Net Profit'],
        datasets: [{
          label: 'Amount ($K)',
          data: [500, -200, 300, -150, 150],
          backgroundColor: ['#22c55e', '#ef4444', '#3b82f6', '#ef4444', '#22c55e']
        }]
      }
    }
  },
  {
    id: 'budget-vs-actual',
    title: 'Budget vs Actual',
    description: 'Compare budgeted vs actual spending',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/budget-vs-actual.png',
    prompt: 'Create a grouped bar chart comparing budget vs actual for each department',
    config: {
      type: 'bar',
      data: {
        labels: ['Marketing', 'Sales', 'Engineering', 'HR', 'Operations'],
        datasets: [
          { label: 'Budget', data: [100, 150, 200, 50, 80], backgroundColor: '#93c5fd' },
          { label: 'Actual', data: [95, 160, 190, 55, 75], backgroundColor: '#2563eb' }
        ]
      }
    }
  },

  // Marketing (5)
  {
    id: 'conversion-funnel',
    title: 'Conversion Funnel',
    description: 'Visualize marketing funnel stages',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'funnel',
    isPro: true,
    thumbnail: '/assets/images/templates/conversion-funnel.png',
    prompt: 'Create a funnel chart showing: Visitors, Leads, Qualified, Proposals, Customers',
    config: {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['Visitors', 'Leads', 'Qualified', 'Proposals', 'Customers'],
        datasets: [{
          data: [10000, 5000, 2000, 500, 200],
          backgroundColor: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb']
        }]
      }
    }
  },
  {
    id: 'social-media-reach',
    title: 'Social Media Reach',
    description: 'Compare reach across social platforms',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/social-media-reach.png',
    prompt: 'Create a horizontal bar chart showing followers/reach on different social platforms',
    config: {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube'],
        datasets: [{
          label: 'Followers (K)',
          data: [150, 80, 45, 120, 200, 75],
          backgroundColor: ['#e1306c', '#1da1f2', '#0077b5', '#4267b2', '#000000', '#ff0000']
        }]
      }
    }
  },
  {
    id: 'campaign-performance',
    title: 'Campaign Performance',
    description: 'Track marketing campaign metrics',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'radar',
    isPro: true,
    thumbnail: '/assets/images/templates/campaign-performance.png',
    prompt: 'Create a radar chart comparing campaign performance: Reach, Engagement, Clicks, Conversions, ROI',
    config: {
      type: 'radar',
      data: {
        labels: ['Reach', 'Engagement', 'Clicks', 'Conversions', 'ROI'],
        datasets: [
          { label: 'Campaign A', data: [90, 75, 80, 70, 85], borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.2)' },
          { label: 'Campaign B', data: [70, 85, 75, 80, 70], borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.2)' }
        ]
      }
    }
  },
  {
    id: 'email-metrics',
    title: 'Email Marketing Metrics',
    description: 'Track email campaign performance',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/email-metrics.png',
    prompt: 'Create a multi-line chart showing email open rate, click rate, and unsubscribe rate over 6 months',
    config: {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Open Rate %', data: [22, 24, 23, 26, 28, 30], borderColor: '#2563eb' },
          { label: 'Click Rate %', data: [3.5, 4.0, 3.8, 4.5, 5.0, 5.5], borderColor: '#22c55e' },
          { label: 'Unsubscribe %', data: [0.5, 0.4, 0.3, 0.3, 0.2, 0.2], borderColor: '#ef4444' }
        ]
      }
    }
  },
  {
    id: 'ad-spend-roi',
    title: 'Ad Spend vs ROI',
    description: 'Visualize advertising spend and return',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'scatter',
    isPro: true,
    thumbnail: '/assets/images/templates/ad-spend-roi.png',
    prompt: 'Create a scatter plot showing ad spend vs ROI for different campaigns',
    config: {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Campaigns',
          data: [
            {x: 1000, y: 150}, {x: 2000, y: 280}, {x: 3000, y: 450},
            {x: 4000, y: 520}, {x: 5000, y: 680}, {x: 6000, y: 750}
          ],
          backgroundColor: '#2563eb'
        }]
      }
    }
  },

  // Science (5)
  {
    id: 'experiment-results',
    title: 'Experiment Results',
    description: 'Compare control vs treatment groups',
    category: TEMPLATE_CATEGORIES.SCIENCE,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/experiment-results.png',
    prompt: 'Create a grouped bar chart comparing control and treatment group results across multiple trials',
    config: {
      type: 'bar',
      data: {
        labels: ['Trial 1', 'Trial 2', 'Trial 3', 'Trial 4', 'Trial 5'],
        datasets: [
          { label: 'Control', data: [45, 48, 42, 50, 47], backgroundColor: '#94a3b8' },
          { label: 'Treatment', data: [62, 68, 65, 72, 70], backgroundColor: '#2563eb' }
        ]
      }
    }
  },
  {
    id: 'temperature-trends',
    title: 'Temperature Trends',
    description: 'Climate data visualization',
    category: TEMPLATE_CATEGORIES.SCIENCE,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/temperature-trends.png',
    prompt: 'Create a line chart showing average monthly temperatures with min/max range',
    config: {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          { label: 'Avg Temp (°C)', data: [5, 7, 12, 16, 20, 25, 28, 27, 23, 17, 11, 6], borderColor: '#f59e0b', fill: false },
          { label: 'Max', data: [10, 12, 18, 22, 26, 31, 34, 33, 29, 23, 16, 11], borderColor: '#ef4444', borderDash: [5,5] },
          { label: 'Min', data: [0, 2, 6, 10, 14, 19, 22, 21, 17, 11, 6, 1], borderColor: '#3b82f6', borderDash: [5,5] }
        ]
      }
    }
  },
  {
    id: 'population-distribution',
    title: 'Population Distribution',
    description: 'Age demographic breakdown',
    category: TEMPLATE_CATEGORIES.SCIENCE,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/population-distribution.png',
    prompt: 'Create a population pyramid showing age distribution by gender',
    config: {
      type: 'bar',
      indexAxis: 'y',
      data: {
        labels: ['0-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        datasets: [
          { label: 'Male', data: [-15, -12, -14, -13, -11, -9, -7], backgroundColor: '#3b82f6' },
          { label: 'Female', data: [14, 11, 13, 12, 12, 10, 9], backgroundColor: '#ec4899' }
        ]
      }
    }
  },
  {
    id: 'correlation-matrix',
    title: 'Correlation Heatmap',
    description: 'Variable correlation visualization',
    category: TEMPLATE_CATEGORIES.SCIENCE,
    chartType: 'heatmap',
    isPro: true,
    thumbnail: '/assets/images/templates/correlation-matrix.png',
    prompt: 'Create a heatmap showing correlation between variables A, B, C, D, E',
    config: {
      type: 'bar',
      data: {
        labels: ['Var A', 'Var B', 'Var C', 'Var D', 'Var E'],
        datasets: [{
          label: 'Correlation',
          data: [1.0, 0.8, 0.6, 0.4, 0.2],
          backgroundColor: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
        }]
      }
    }
  },
  {
    id: 'growth-curve',
    title: 'Growth Curve Analysis',
    description: 'Biological growth pattern visualization',
    category: TEMPLATE_CATEGORIES.SCIENCE,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/growth-curve.png',
    prompt: 'Create a sigmoid growth curve showing population growth over time',
    config: {
      type: 'line',
      data: {
        labels: Array.from({length: 20}, (_, i) => `T${i}`),
        datasets: [{
          label: 'Population',
          data: [10, 12, 15, 20, 28, 40, 58, 82, 115, 155, 200, 245, 285, 315, 340, 358, 372, 382, 390, 395],
          borderColor: '#22c55e',
          tension: 0.4
        }]
      }
    }
  },

  // Education (3)
  {
    id: 'grade-distribution',
    title: 'Grade Distribution',
    description: 'Student grade breakdown',
    category: TEMPLATE_CATEGORIES.EDUCATION,
    chartType: 'bar',
    isPro: true,
    thumbnail: '/assets/images/templates/grade-distribution.png',
    prompt: 'Create a bar chart showing grade distribution: A, B, C, D, F',
    config: {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'F'],
        datasets: [{
          label: 'Students',
          data: [25, 35, 28, 10, 2],
          backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
        }]
      }
    }
  },
  {
    id: 'course-enrollment',
    title: 'Course Enrollment Trends',
    description: 'Track enrollment over semesters',
    category: TEMPLATE_CATEGORIES.EDUCATION,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/course-enrollment.png',
    prompt: 'Create a line chart showing course enrollment trends over 4 years',
    config: {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          { label: 'Computer Science', data: [500, 650, 800, 950, 1100], borderColor: '#2563eb' },
          { label: 'Business', data: [800, 750, 720, 700, 680], borderColor: '#f59e0b' },
          { label: 'Engineering', data: [600, 620, 680, 750, 820], borderColor: '#22c55e' }
        ]
      }
    }
  },
  {
    id: 'skill-assessment',
    title: 'Student Skill Assessment',
    description: 'Multi-skill radar evaluation',
    category: TEMPLATE_CATEGORIES.EDUCATION,
    chartType: 'radar',
    isPro: true,
    thumbnail: '/assets/images/templates/skill-assessment.png',
    prompt: 'Create a radar chart showing student skills: Math, Science, Language, Arts, Physical Ed',
    config: {
      type: 'radar',
      data: {
        labels: ['Math', 'Science', 'Language', 'Arts', 'Physical Ed'],
        datasets: [{
          label: 'Score',
          data: [85, 78, 92, 70, 88],
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb'
        }]
      }
    }
  },

  // Health (2)
  {
    id: 'health-metrics',
    title: 'Health Metrics Dashboard',
    description: 'Personal health tracking',
    category: TEMPLATE_CATEGORIES.HEALTH,
    chartType: 'line',
    isPro: true,
    thumbnail: '/assets/images/templates/health-metrics.png',
    prompt: 'Create a line chart tracking weight, blood pressure, and heart rate over 30 days',
    config: {
      type: 'line',
      data: {
        labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
        datasets: [{
          label: 'Weight (kg)',
          data: [80, 79.8, 79.5, 79.3, 79, 78.8, 78.5, 78.3, 78, 77.8, 77.5, 77.3, 77, 76.8, 76.5, 76.3, 76, 75.8, 75.5, 75.3, 75, 74.8, 74.5, 74.3, 74, 73.8, 73.5, 73.3, 73, 72.8],
          borderColor: '#2563eb'
        }]
      }
    }
  },
  {
    id: 'nutrition-breakdown',
    title: 'Nutrition Breakdown',
    description: 'Daily macronutrient distribution',
    category: TEMPLATE_CATEGORIES.HEALTH,
    chartType: 'doughnut',
    isPro: true,
    thumbnail: '/assets/images/templates/nutrition-breakdown.png',
    prompt: 'Create a doughnut chart showing macronutrient distribution: Protein, Carbs, Fat, Fiber',
    config: {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'],
        datasets: [{
          data: [30, 45, 20, 5],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#8b5cf6']
        }]
      }
    }
  },

  // ============================================
  // PREMIUM ECHARTS TEMPLATES (5 more stunning visualizations)
  // ============================================
  
  {
    id: 'revenue-sankey',
    title: 'Revenue Flow Sankey',
    description: 'Stunning flow diagram showing revenue sources to departments',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'sankey',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/revenue-sankey.png',
    prompt: 'Create a Sankey diagram showing revenue flow from sources (Products, Services, Subscriptions) to departments (Sales, Marketing, R&D, Operations)',
    echartsConfig: {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 },
        data: [
          { name: 'Products' }, { name: 'Services' }, { name: 'Subscriptions' },
          { name: 'Sales' }, { name: 'Marketing' }, { name: 'R&D' }, { name: 'Operations' }
        ],
        links: [
          { source: 'Products', target: 'Sales', value: 40 },
          { source: 'Products', target: 'Marketing', value: 20 },
          { source: 'Services', target: 'Sales', value: 30 },
          { source: 'Services', target: 'R&D', value: 25 },
          { source: 'Subscriptions', target: 'Marketing', value: 35 },
          { source: 'Subscriptions', target: 'Operations', value: 15 }
        ]
      }]
    }
  },
  {
    id: 'market-treemap',
    title: 'Market Cap Treemap',
    description: 'Hierarchical market capitalization visualization',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'treemap',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/market-treemap.png',
    prompt: 'Create a treemap showing market cap by sector: Technology, Healthcare, Finance, Energy, Consumer',
    echartsConfig: {
      tooltip: { formatter: '{b}: ${c}B' },
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}' },
        itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 },
        levels: [
          { itemStyle: { borderColor: '#555', borderWidth: 4, gapWidth: 4 } },
          { colorSaturation: [0.3, 0.6], itemStyle: { borderColorSaturation: 0.7, gapWidth: 2, borderWidth: 2 } }
        ],
        data: [
          { name: 'Technology', value: 850, itemStyle: { color: '#3b82f6' },
            children: [
              { name: 'Apple', value: 280 }, { name: 'Microsoft', value: 250 },
              { name: 'Google', value: 180 }, { name: 'Amazon', value: 140 }
            ]
          },
          { name: 'Healthcare', value: 420, itemStyle: { color: '#22c55e' },
            children: [
              { name: 'J&J', value: 150 }, { name: 'Pfizer', value: 120 },
              { name: 'UnitedHealth', value: 150 }
            ]
          },
          { name: 'Finance', value: 380, itemStyle: { color: '#f59e0b' },
            children: [
              { name: 'JPMorgan', value: 140 }, { name: 'Visa', value: 130 },
              { name: 'Mastercard', value: 110 }
            ]
          },
          { name: 'Energy', value: 280, itemStyle: { color: '#ef4444' },
            children: [
              { name: 'Exxon', value: 150 }, { name: 'Chevron', value: 130 }
            ]
          }
        ]
      }]
    }
  },
  {
    id: 'performance-gauge',
    title: 'Performance Gauge Dashboard',
    description: 'Beautiful gauge meters for KPI tracking',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'gauge',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/performance-gauge.png',
    prompt: 'Create a gauge chart showing performance score from 0-100 with color zones (red, yellow, green)',
    echartsConfig: {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '100%',
        center: ['50%', '70%'],
        axisLine: {
          lineStyle: {
            width: 30,
            color: [[0.3, '#ef4444'], [0.7, '#f59e0b'], [1, '#22c55e']]
          }
        },
        pointer: { itemStyle: { color: '#1e293b' }, width: 8 },
        axisTick: { distance: -30, length: 8, lineStyle: { color: '#fff', width: 2 } },
        splitLine: { distance: -30, length: 30, lineStyle: { color: '#fff', width: 4 } },
        axisLabel: { color: '#64748b', distance: 40, fontSize: 14 },
        detail: { valueAnimation: true, formatter: '{value}%', color: '#1e293b', fontSize: 32, offsetCenter: [0, '20%'] },
        data: [{ value: 78, name: 'Performance Score' }]
      }]
    }
  },
  {
    id: 'activity-heatmap',
    title: 'Activity Heatmap Calendar',
    description: 'GitHub-style contribution heatmap',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'heatmap',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/activity-heatmap.png',
    prompt: 'Create a heatmap calendar showing daily activity levels over the past year',
    echartsConfig: {
      tooltip: { position: 'top', formatter: (p) => `${p.data[0]}: ${p.data[1]} activities` },
      visualMap: {
        min: 0, max: 20, calculable: true, orient: 'horizontal', left: 'center', bottom: 10,
        inRange: { color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] }
      },
      calendar: {
        top: 60, left: 30, right: 30, cellSize: ['auto', 15],
        range: '2024', itemStyle: { borderWidth: 3, borderColor: '#fff' },
        yearLabel: { show: true }, monthLabel: { show: true }, dayLabel: { show: true }
      },
      series: [{
        type: 'heatmap', coordinateSystem: 'calendar',
        data: Array.from({ length: 365 }, (_, i) => {
          const date = new Date(2024, 0, 1);
          date.setDate(date.getDate() + i);
          return [date.toISOString().split('T')[0], Math.floor(Math.random() * 20)];
        })
      }]
    }
  },
  {
    id: 'sales-funnel-3d',
    title: '3D Sales Funnel',
    description: 'Stunning 3D funnel visualization',
    category: TEMPLATE_CATEGORIES.MARKETING,
    chartType: 'funnel',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/sales-funnel-3d.png',
    prompt: 'Create a 3D-style funnel chart showing sales pipeline: Awareness, Interest, Consideration, Intent, Purchase',
    echartsConfig: {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { top: 'bottom', data: ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase'] },
      series: [{
        type: 'funnel',
        left: '10%', top: 60, bottom: 60, width: '80%',
        min: 0, max: 100, minSize: '0%', maxSize: '100%',
        sort: 'descending', gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}\n{c}', fontSize: 14 },
        labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 16 } },
        data: [
          { value: 100, name: 'Awareness', itemStyle: { color: '#667eea' } },
          { value: 80, name: 'Interest', itemStyle: { color: '#764ba2' } },
          { value: 60, name: 'Consideration', itemStyle: { color: '#f093fb' } },
          { value: 40, name: 'Intent', itemStyle: { color: '#f5576c' } },
          { value: 20, name: 'Purchase', itemStyle: { color: '#4facfe' } }
        ]
      }]
    }
  },
  {
    id: 'realtime-dashboard',
    title: 'Real-time Analytics Dashboard',
    description: 'Live updating metrics visualization',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'mixed',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/realtime-dashboard.png',
    prompt: 'Create a real-time dashboard with live updating line chart showing server metrics',
    echartsConfig: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['CPU', 'Memory', 'Network'], top: 10 },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
      series: [
        { name: 'CPU', type: 'line', smooth: true, areaStyle: { opacity: 0.3 }, lineStyle: { width: 2 }, itemStyle: { color: '#3b82f6' }, data: [30, 45, 62, 78, 65, 52, 40] },
        { name: 'Memory', type: 'line', smooth: true, areaStyle: { opacity: 0.3 }, lineStyle: { width: 2 }, itemStyle: { color: '#22c55e' }, data: [55, 58, 65, 72, 68, 62, 58] },
        { name: 'Network', type: 'line', smooth: true, areaStyle: { opacity: 0.3 }, lineStyle: { width: 2 }, itemStyle: { color: '#f59e0b' }, data: [20, 35, 55, 85, 70, 45, 25] }
      ]
    }
  },
  {
    id: 'world-map-sales',
    title: 'Global Sales Map',
    description: 'World map showing sales by region',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    chartType: 'map',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/world-map-sales.png',
    prompt: 'Create a world map visualization showing sales distribution by country',
    echartsConfig: {
      tooltip: { trigger: 'item', formatter: '{b}: ${c}M' },
      visualMap: { min: 0, max: 500, text: ['High', 'Low'], realtime: false, calculable: true, inRange: { color: ['#dbeafe', '#3b82f6', '#1e40af'] } },
      series: [{
        type: 'map', map: 'world', roam: true, emphasis: { label: { show: true } },
        data: [
          { name: 'United States', value: 450 }, { name: 'China', value: 380 },
          { name: 'Germany', value: 220 }, { name: 'United Kingdom', value: 180 },
          { name: 'Japan', value: 160 }, { name: 'France', value: 140 },
          { name: 'India', value: 120 }, { name: 'Brazil', value: 100 },
          { name: 'Canada', value: 90 }, { name: 'Australia', value: 85 }
        ]
      }]
    }
  },
  {
    id: 'candlestick-stock',
    title: 'Stock Candlestick Chart',
    description: 'Professional trading candlestick visualization',
    category: TEMPLATE_CATEGORIES.FINANCE,
    chartType: 'candlestick',
    isPro: true,
    library: 'echarts',
    thumbnail: '/assets/images/templates/candlestick-stock.png',
    prompt: 'Create a candlestick chart showing stock OHLC data with volume bars',
    echartsConfig: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['Price', 'Volume'], top: 10 },
      grid: [{ left: '10%', right: '10%', top: 60, height: '50%' }, { left: '10%', right: '10%', top: '70%', height: '15%' }],
      xAxis: [
        { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], gridIndex: 0 },
        { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], gridIndex: 1 }
      ],
      yAxis: [{ type: 'value', gridIndex: 0 }, { type: 'value', gridIndex: 1 }],
      series: [
        { name: 'Price', type: 'candlestick', xAxisIndex: 0, yAxisIndex: 0,
          itemStyle: { color: '#22c55e', color0: '#ef4444', borderColor: '#22c55e', borderColor0: '#ef4444' },
          data: [[150, 156, 148, 155], [155, 162, 154, 160], [160, 158, 152, 154], [154, 168, 153, 166], [166, 172, 164, 170]]
        },
        { name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1,
          itemStyle: { color: '#93c5fd' },
          data: [12000, 15000, 8000, 18000, 22000]
        }
      ]
    }
  }
];

/**
 * Get templates by tier
 */
export function getTemplatesByTier(isPro = false) {
  if (isPro) {
    return TEMPLATES;
  }
  return TEMPLATES.filter(t => !t.isPro);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category) {
  return TEMPLATES.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id);
}

/**
 * Get template count
 */
export function getTemplateCount() {
  return {
    total: TEMPLATES.length,
    free: TEMPLATES.filter(t => !t.isPro).length,
    pro: TEMPLATES.filter(t => t.isPro).length
  };
}

export default TEMPLATES;
