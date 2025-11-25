// Backend API Configuration
// SECURITY: API calls are proxied through backend to keep API keys secure
const BACKEND_API_URL = '/api/generate'; // Backend endpoint that handles DeepSeek API calls
const BACKEND_PARSE_URL = '/api/parse'; // Backend endpoint for data parsing

// Optimized prompt templates for different visual types
const chartPrompts = {
  bar: `Generate a Chart.js configuration for a bar chart. Data: {data}. 
Requirements:
- Use gradient colors (e.g., rgba(99, 102, 241, 0.8) to rgba(139, 92, 246, 0.8))
- Include responsive: true and maintainAspectRatio: false in options
- Add grid lines with color: 'rgba(0, 0, 0, 0.1)'
- Enable tooltips with backgroundColor: 'rgba(0, 0, 0, 0.8)'
- Set borderRadius: 8 for rounded bars
- Add title with font: { size: 18, weight: 'bold' }
Respond with ONLY the JSON object: { type: 'bar', data: { labels: [...], datasets: [{ label: '...', data: [...], backgroundColor: [...], borderRadius: 8 }] }, options: { responsive: true, plugins: { legend: { display: true }, title: { display: true, text: '...' } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } } } } }`,

  line: `Generate a Chart.js configuration for a line chart with area fill. Data: {data}.
Requirements:
- Use multiple datasets if data has multiple series
- Set tension: 0.4 for smooth curves
- Use fill: true with gradient: backgroundColor: 'rgba(99, 102, 241, 0.2)'
- borderColor: 'rgb(99, 102, 241)', borderWidth: 3
- pointRadius: 5, pointHoverRadius: 7
- Add legend at top position
- Include grid lines and tooltips
Respond with ONLY the JSON: { type: 'line', data: { labels: [...], datasets: [{ label: '...', data: [...], borderColor: '...', backgroundColor: '...', fill: true, tension: 0.4, pointRadius: 5 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: '...' } }, scales: { y: { beginAtZero: true } } } }`,

  pie: `Generate a Chart.js configuration for a pie or doughnut chart. Data: {data}.
Requirements:
- Use vibrant colors: ['#6366f1', '#8b5cf6', '#06d6a0', '#60a5fa', '#a78bfa', '#f59e0b']
- Set cutout: '50%' for doughnut style
- Add percentage labels in tooltips
- Enable legend with position: 'right'
- Include hover effects with hoverOffset: 4
Respond with ONLY the JSON: { type: 'doughnut', data: { labels: [...], datasets: [{ data: [...], backgroundColor: [...], hoverOffset: 4 }] }, options: { responsive: true, plugins: { legend: { position: 'right' }, title: { display: true, text: '...' } } } }`,

  scatter: `Generate a Chart.js configuration for a scatter plot. Data: {data}.
Requirements:
- Use different colors for different data groups
- Set pointRadius based on data value (5-15 range)
- Include x and y axes with proper labels
- Add tooltips showing all data dimensions
- Use rgba colors with 0.6 opacity
Respond with ONLY the JSON: { type: 'scatter', data: { datasets: [{ label: '...', data: [{x: ..., y: ...}], backgroundColor: 'rgba(99, 102, 241, 0.6)', pointRadius: 8 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: '...' } }, scales: { x: { title: { display: true, text: '...' } }, y: { title: { display: true, text: '...' } } } } }`,

  mixed: `Generate a Chart.js configuration for a mixed chart (bar + line). Data: {data}.
Requirements:
- First dataset: type 'bar' with bars
- Second dataset: type 'line' with line overlay
- Use different y-axes if needed (yAxisID: 'y' and 'y1')
- Bar colors: rgba(99, 102, 241, 0.8)
- Line color: rgb(16, 185, 129), tension: 0.4
- Include dual legends
Respond with ONLY the JSON: { type: 'bar', data: { labels: [...], datasets: [{ type: 'bar', label: '...', data: [...], backgroundColor: '...', yAxisID: 'y' }, { type: 'line', label: '...', data: [...], borderColor: '...', tension: 0.4, yAxisID: 'y1' }] }, options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { type: 'linear', position: 'left' }, y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } } } } }`,

  table: `Generate a professional HTML table with color-coded cells. Data: {data}.
Requirements:
- Use Tailwind CSS classes
- Add header with dark background (bg-slate-700 text-white)
- Alternate row colors (even:bg-slate-50)
- Color-code numeric cells: green for good values (bg-green-100 text-green-800), red for bad (bg-red-100 text-red-800)
- Add hover effects (hover:bg-slate-100)
- Include rounded corners (rounded-xl) and shadow (shadow-lg)
- Make it responsive with overflow-x-auto wrapper
Return ONLY HTML: <div class="overflow-x-auto rounded-xl shadow-lg"><table class="min-w-full bg-white"><thead class="bg-slate-700 text-white"><tr><th class="px-6 py-3 text-left">...</th></tr></thead><tbody>...</tbody></table></div>`,

  dashboard: `Generate a complete dashboard with multiple Chart.js charts and KPI cards. Data: {data}.
Requirements:
- Layout: Tailwind grid (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6)
- 2-3 KPI cards with icons, values, and trend indicators
- 2-3 canvas elements for charts (bar, line, doughnut)
- Each canvas must have unique id (chart1, chart2, chart3)
- Cards: rounded-xl shadow-lg p-6 bg-white
- Title: text-2xl font-bold mb-6
Return JSON: { "layout": "<div class='p-6 bg-gray-50 min-h-screen'><h1 class='text-2xl font-bold mb-6'>Dashboard Title</h1><div class='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'><div class='bg-white rounded-xl shadow-lg p-6'>KPI Card</div></div><div class='grid grid-cols-1 lg:grid-cols-2 gap-6'><div class='bg-white rounded-xl shadow-lg p-6'><canvas id='chart1'></canvas></div></div></div>", "charts": [{ "canvasId": "chart1", "config": { type: 'bar', data: {...}, options: {...} } }] }`,

  custom: `Analyze the data and generate the most appropriate visualization. Data: {data}.
Choose between: bar chart, line chart, scatter plot, mixed chart, pie chart, or table.
Follow the same requirements as the specific chart type prompts above.
Respond with ONLY the Chart.js JSON configuration or HTML table.`
};

/**
 * SECURITY: HTML Sanitization utilities to prevent XSS attacks
 * Sanitizes user-generated and AI-generated HTML content
 */
const HTMLSanitizer = {
  /**
   * Escape HTML special characters
   */
  escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, char => map[char]);
  },

  /**
   * Sanitize SVG content - allow safe SVG elements only
   */
  sanitizeSVG(svg) {
    if (!svg || typeof svg !== 'string') return '';
    
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = svg;
    
    // List of allowed SVG elements
    const allowedElements = ['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop', 'use', 'symbol', 'image', 'foreignObject'];
    
    // Remove all disallowed elements
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      if (!allowedElements.includes(el.tagName.toLowerCase())) {
        el.remove();
      }
    });
    
    // Remove event handlers and dangerous attributes
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || ['href', 'src'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return temp.innerHTML;
  },

  /**
   * Sanitize HTML content - allow safe HTML elements only
   */
  sanitizeHTML(html) {
    if (!html || typeof html !== 'string') return '';
    
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // List of allowed HTML elements
    const allowedElements = ['div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'p', 'span', 'a', 'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop', 'use', 'symbol', 'image', 'foreignObject', 'blockquote', 'pre', 'code', 'form', 'input', 'button', 'label', 'select', 'textarea', 'option', 'img', 'figure', 'figcaption'];
    
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      if (!allowedElements.includes(el.tagName.toLowerCase())) {
        el.remove();
      }
    });
    
    // Remove event handlers and dangerous attributes
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return temp.innerHTML;
  }
};

// Example data templates
const exampleTemplates = {
  sales: `Create a bar chart showing monthly sales data:
January: $12,000
February: $15,000
March: $18,000
April: $14,000
May: $19,000
June: $22,000`,
  
  traffic: `Generate a line chart of website traffic over 6 months:
January: 1,200 visitors
February: 1,500 visitors
March: 1,800 visitors
April: 2,100 visitors
May: 2,400 visitors
June: 2,800 visitors`,
  
  market: `Create a pie chart showing market share:
Company A: 35%
Company B: 28%
Company C: 22%
Company D: 15%`,
  
  products: `Generate a table of product performance:
Product A | 150 units | $4,500 | +12%
Product B | 120 units | $3,600 | -5%
Product C | 200 units | $6,000 | +25%
Product D | 180 units | $5,400 | +8%`,

  scatter: `Create a scatter plot showing algorithm scalability:
Small graphs: (8, 48), (10, 45), (8, 43)
Medium graphs: (15, 90), (18, 114), (20, 59)
Large graphs: (30, 184), (40, 209), (50, 243)`,

  mixed: `Create a mixed chart (bar + line) showing execution time analysis:
Processing Time (bars): small_1: 3ms, small_2: 2ms, small_3: 2ms, medium_1: 3ms, medium_2: 3ms, large_1: 5ms, large_2: 4ms, large_3: 5ms
Operations (line): small_1: 1.5, small_2: 1.2, small_3: 1.0, medium_1: 3.0, medium_2: 3.5, large_1: 5.0, large_2: 7.0, large_3: 8.0`
};

// DOM Elements
let generateBtn, downloadBtn, formatButtons, textarea, previewContainer, loadingIndicator;
let selectedFormat = 'PNG';
let currentChartType = 'custom';
let generatedHTML = '';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  attachEventListeners();
  loadTemplateIfAvailable();
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
  generateBtn = document.getElementById('generate-btn');
  downloadBtn = document.getElementById('download-btn');
  textarea = document.getElementById('prompt-input');
  previewContainer = document.getElementById('preview');
  loadingIndicator = document.getElementById('loading');
  formatButtons = document.querySelectorAll('.format-btn');
}

/**
 * Load template prompt from sessionStorage if available
 */
function loadTemplateIfAvailable() {
  const templatePrompt = sessionStorage.getItem('templatePrompt');
  const templateHTML = sessionStorage.getItem('templateHTML');
  if (templatePrompt && textarea) {
    textarea.value = templatePrompt;
    sessionStorage.removeItem('templatePrompt');
    showValidationMessage('Template loaded! Customize and generate your visualization.', 'success');
  }

  // If a local preview HTML is available, render it immediately
  if (templateHTML && previewContainer) {
    try {
      generatedHTML = templateHTML;
      displayGeneratedHTML(generatedHTML);
      showValidationMessage('Preview loaded from template. You can generate a new version or export.', 'success');
    } finally {
      sessionStorage.removeItem('templateHTML');
    }
  }
}

/**
 * Attach event listeners to interactive elements
 */
function attachEventListeners() {
  // Smart Parse button click
  const smartParseBtn = document.getElementById('smart-parse-btn');
  if (smartParseBtn) {
    smartParseBtn.addEventListener('click', async () => {
      const inputText = textarea?.value.trim();
      if (!inputText) {
        showValidationMessage('Please enter some data to parse.', 'warning');
        return;
      }
      
      try {
        await smartGenerate(inputText);
      } catch (error) {
        showError(`Smart parse failed: ${error.message}`);
      }
    });
  }

  // Generate button click
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }

  // Download button click
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Chart type card selection
  const chartTypeCards = document.querySelectorAll('.chart-type-card');
  chartTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      chartTypeCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      // Update current chart type
      currentChartType = card.dataset.type;
    });
  });

  // Data input tabs
  const dataTabs = document.querySelectorAll('.data-tab');
  dataTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Update tab styles
      dataTabs.forEach(t => {
        t.classList.remove('border-b-2', 'border-slate-900', 'text-slate-900');
        t.classList.add('text-slate-500');
      });
      tab.classList.add('border-b-2', 'border-slate-900', 'text-slate-900');
      tab.classList.remove('text-slate-500');
      
      // Show corresponding tab content
      document.querySelectorAll('.data-tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    });
  });

  // Format selection buttons
  formatButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      formatButtons.forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white', 'border-slate-900');
        b.classList.add('border-slate-200');
      });
      e.target.classList.add('bg-slate-900', 'text-white', 'border-slate-900');
      e.target.classList.remove('border-slate-200');
      selectedFormat = e.target.textContent.trim();
    });
  });

  // File upload - drop zone click
  const dropZone = document.getElementById('drop-zone');
  const csvUpload = document.getElementById('csv-upload');
  
  if (dropZone && csvUpload) {
    dropZone.addEventListener('click', () => {
      csvUpload.click();
    });

    // File input change
    csvUpload.addEventListener('change', handleFileSelect);

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-blue-500', 'bg-blue-50');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-500', 'bg-blue-50');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });
  }

  // Example templates
  const exampleButtons = document.querySelectorAll('.example-template');
  exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const exampleType = btn.dataset.example;
      if (exampleTemplates[exampleType]) {
        textarea.value = exampleTemplates[exampleType];
        // Switch to manual tab
        document.querySelector('.data-tab[data-tab="manual"]').click();
        // Show success message
        showValidationMessage('Example loaded successfully!', 'success');
      }
    });
  });

  // Enter key in textarea (Ctrl+Enter to generate)
  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleGenerate();
      }
    });
    
    // Input validation
    textarea.addEventListener('input', () => {
      const value = textarea.value.trim();
      if (value.length > 0 && value.length < 10) {
        showValidationMessage('Please provide more details about your visualization.', 'warning');
      } else if (value.length > 2000) {
        showValidationMessage('Input is too long. Please keep it under 2000 characters.', 'error');
      } else {
        hideValidationMessage();
      }
    });
  }
}

/**
 * Parse chaotic/messy data and convert to structured format
 * SECURITY: Calls backend proxy instead of direct API
 */
async function parseChaoticData(text) {
  try {
    const response = await fetch(BACKEND_PARSE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Parse request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from parse endpoint');
    }

    return data;

  } catch (error) {
    console.error('Data parsing failed:', error);
    throw error;
  }
}

/**
 * Generate visualization from parsed structured data
 */
function generatePromptFromParsedData(parsedData) {
  const { type, title, data, columns, rows } = parsedData;
  
  let prompt = '';
  
  switch (type) {
    case 'bar':
      prompt = `Create a bar chart titled "${title}".\n`;
      if (data.labels && data.values) {
        data.labels.forEach((label, i) => {
          prompt += `${label}: ${data.values[i]}\n`;
        });
      }
      prompt += '\nUse modern colors, animations, and Tailwind styling.';
      break;
      
    case 'line':
      prompt = `Create a line chart titled "${title}".\n`;
      if (data.labels && data.values) {
        data.labels.forEach((label, i) => {
          prompt += `${label}: ${data.values[i]}\n`;
        });
      }
      prompt += '\nUse gradient fills, smooth curves, and professional styling.';
      break;
      
    case 'pie':
      prompt = `Create a pie chart titled "${title}".\n`;
      if (data.labels && data.values) {
        data.labels.forEach((label, i) => {
          prompt += `${label}: ${data.values[i]}\n`;
        });
      }
      prompt += '\nUse vibrant colors and percentage labels.';
      break;
      
    case 'table':
      prompt = `Create a table titled "${title}".\n`;
      if (columns && rows) {
        prompt += `Columns: ${columns.join(', ')}\n\n`;
        rows.forEach(row => {
          prompt += row.join(' | ') + '\n';
        });
      }
      prompt += '\nUse Tailwind styling with striped rows and hover effects.';
      break;
      
    case 'dashboard':
      prompt = `Create a dashboard titled "${title}" with multiple visualizations.\n`;
      prompt += JSON.stringify(data, null, 2);
      prompt += '\nUse Tailwind grid layout with cards and modern styling.';
      break;
      
    default:
      prompt = `Visualize this data: ${JSON.stringify(parsedData)}`;
  }
  
  return prompt;
}

/**
 * Smart generate - detects if data needs parsing
 */
async function smartGenerate(inputText) {
  showExportLoading('Analyzing your data...');
  
  try {
    // Check if input looks like messy/unstructured data
    const needsParsing = detectMessyData(inputText);
    
    if (needsParsing) {
      // Parse the chaotic data
      const parsedData = await parseChaoticData(inputText);
      
      // Generate prompt from structured data
      const structuredPrompt = generatePromptFromParsedData(parsedData);
      
      // Update textarea with structured prompt
      if (textarea) {
        textarea.value = structuredPrompt;
      }
      
      hideExportLoading();
      showValidationMessage('Data analyzed and structured! Review and generate.', 'success');
      
      return structuredPrompt;
    } else {
      hideExportLoading();
      return inputText;
    }
    
  } catch (error) {
    hideExportLoading();
    throw error;
  }
}

/**
 * Detect if data looks messy/unstructured
 */
function detectMessyData(text) {
  // Indicators of messy data:
  // - Multiple numbers without clear labels
  // - Inconsistent separators (commas, tabs, spaces, pipes)
  // - No clear chart type mentioned
  // - Raw data dump
  
  const hasMultipleNumbers = (text.match(/\d+/g) || []).length > 3;
  const hasNoChartKeywords = !/(chart|graph|table|dashboard|visualize)/i.test(text);
  const hasMultipleSeparators = /[,\t|;]/.test(text) && text.split(/\s+/).length > 5;
  const looksLikeRawData = /^\s*[\d\w]+[\s,\t|;]+[\d\w]+/m.test(text);
  
  return hasMultipleNumbers && (hasNoChartKeywords || hasMultipleSeparators || looksLikeRawData);
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
  const prompt = textarea?.value.trim();
  
  if (!prompt) {
    showError('Please enter a description of what you want to visualize.');
    return;
  }

  // Detect chart type from prompt
  currentChartType = detectChartType(prompt);
  
  try {
    await generateVisual(prompt, currentChartType);
  } catch (error) {
    console.error('Generation failed:', error);
    showAIUnavailableBanner();
    showError(`Failed to generate visual: ${error.message}`);
  }
}

/**
 * Show banner when AI service is unavailable
 */
function showAIUnavailableBanner() {
  let banner = document.getElementById('ai-unavailable-banner');
  
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'ai-unavailable-banner';
    banner.className = 'fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-3 text-center z-50 flex items-center justify-center gap-2';
    banner.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <span>AI temporarily unavailable. Please retry later.</span>
      <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-amber-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    document.body.prepend(banner);
  }
  
  // Auto-hide after 10 seconds
  setTimeout(() => banner?.remove(), 10000);
}

/**
 * Detect chart type from user prompt
 */
function detectChartType(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('bar chart') || lowerPrompt.includes('bar graph') || lowerPrompt.includes('column chart')) {
    return 'bar';
  } else if (lowerPrompt.includes('line chart') || lowerPrompt.includes('line graph') || lowerPrompt.includes('trend')) {
    return 'line';
  } else if (lowerPrompt.includes('pie chart') || lowerPrompt.includes('doughnut') || lowerPrompt.includes('donut')) {
    return 'pie';
  } else if (lowerPrompt.includes('scatter') || lowerPrompt.includes('correlation') || lowerPrompt.includes('bubble')) {
    return 'scatter';
  } else if (lowerPrompt.includes('mixed') || lowerPrompt.includes('combo') || lowerPrompt.includes('combination') || (lowerPrompt.includes('bar') && lowerPrompt.includes('line'))) {
    return 'mixed';
  } else if (lowerPrompt.includes('table') || lowerPrompt.includes('data table')) {
    return 'table';
  } else if (lowerPrompt.includes('dashboard')) {
    return 'dashboard';
  }
  
  return 'custom';
}

/**
 * Generate visual using DeepSeek API
 * @param {string} prompt - User's description
 * @param {string} chartType - Type of chart to generate
 */
async function generateVisual(prompt, chartType) {
  showLoading(true);
  try {
    const fullPrompt = buildPrompt(prompt, chartType);
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt, chartType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Generation request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.html || data.content;

    if (!generatedContent) {
      throw new Error('No content received from API');
    }

    renderVisualization(generatedContent, chartType);

  } catch (error) {
    showError(`Failed to generate visual: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

/**
 * Build full prompt using template
 */
function buildPrompt(userPrompt, chartType) {
  const template = chartPrompts[chartType] || chartPrompts.custom;
  return template.replace('{data}', userPrompt);
}

/**
 * Extract HTML from markdown code blocks or plain text
 */
function extractHTML(content) {
  // Try to extract from ```html code blocks
  const htmlBlockMatch = content.match(/```html\n([\s\S]*?)\n```/);
  if (htmlBlockMatch) {
    return htmlBlockMatch[1];
  }
  
  // Try to extract from ``` code blocks
  const codeBlockMatch = content.match(/```\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }
  
  // If it looks like HTML already, return as-is
  if (content.includes('<!DOCTYPE') || content.includes('<html') || content.includes('<div')) {
    return content;
  }
  
  return content;
}

/**
 * Validate that returned content contains real HTML visual elements
 */
function isValidVisualHTML(html) {
  if (!html || typeof html !== 'string') return false;
  const hasTag = /<\s*(div|section|svg|table|canvas)\b/i.test(html);
  const hasVisual = /<\s*(svg|table|canvas)\b/i.test(html);
  const looksLikePlainText = !hasTag || html.trim().length < 40;
  return hasTag && hasVisual && !looksLikePlainText;
}

/**
 * Display local HTML (non-iframe) — used for fallbacks
 * SECURITY: Sanitizes HTML before rendering
 */
function displayLocalHTML(html) {
  if (!previewContainer) return;
  // SECURITY: Sanitize HTML to prevent XSS
  const sanitizedHTML = HTMLSanitizer.sanitizeHTML(html);
  previewContainer.innerHTML = sanitizedHTML;
}

/**
 * Build a local fallback visualization as HTML string
 */
function buildFallbackFromInput(promptText, type) {
  const series = parseSeriesSimple(promptText);
  const containerStart = '<div class="bg-white rounded-xl border shadow-sm p-6">';
  const containerEnd = '</div>';
  switch (type) {
    case 'line':
      return containerStart + buildLineSVG(series) + containerEnd;
    case 'pie':
      return containerStart + buildPieSVG(series) + containerEnd;
    case 'table':
      return containerStart + buildTableHTML(series) + containerEnd;
    case 'dashboard':
      return containerStart +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">' +
        '<div class="rounded-xl border p-4"><div class="text-slate-500 text-xs mb-1">Revenue</div><div class="text-xl font-semibold">$125K</div></div>' +
        '<div class="rounded-xl border p-4"><div class="text-slate-500 text-xs mb-1">Customers</div><div class="text-xl font-semibold">2.4K</div></div>' +
        '<div class="md:col-span-2 rounded-xl border p-4">' + buildLineSVG(series) + '</div>' +
        '</div>' +
      containerEnd;
    default:
      return containerStart + buildBarSVG(series) + containerEnd;
  }
}

function parseSeriesSimple(text) {
  const cleaned = (text||'').replace(/\n/g,' ').trim();
  const parts = cleaned.split(/[,;]+/).map(s=>s.trim()).filter(Boolean);
  const res = [];
  for (const p of parts){
    const m = p.match(/([A-Za-zА-Яа-я]+)\s*[:\-]?\s*\$?([\d,.]+)\s*%?\s*K?/);
    if (m){
      const label = m[1];
      let v = parseFloat(m[2].replace(/,/g,''));
      if (/K/i.test(p)) v *= 1000;
      res.push({label, value:v});
    }
  }
  // No fallback data - require valid input
  return res;
}

function buildBarSVG(series, {w=720,h=380,pad=36}={}) {
  const max = Math.max(...series.map(s=>s.value))||1;
  const cw = w - pad*2; const ch = h - pad*2;
  const bw = cw / series.length * 0.7; const gap = cw / series.length * 0.3;
  let x = pad;
  const grad = `<defs><linearGradient id="gbar2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.15"/></linearGradient></defs>`;
  let bars = '';
  series.forEach((s)=>{
    const bh = Math.max(2, (s.value/max)*ch);
    bars += `<g transform="translate(${x},${pad})"><rect rx="8" width="${bw}" height="${bh}" y="${ch-bh}" fill="url(#gbar2)"></rect><text x="${bw/2}" y="${ch+16}" text-anchor="middle" fill="#64748b" font-size="12">${s.label}</text></g>`;
    x += bw + gap;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Bar chart">${grad}${bars}</svg>`;
}

function buildLineSVG(series, {w=720,h=380,pad=36}={}) {
  const max = Math.max(...series.map(s=>s.value))||1;
  const cw=w-pad*2, ch=h-pad*2, step=cw/Math.max(1,series.length-1);
  const pts = series.map((s,i)=>`${pad+i*step},${pad+(1-s.value/max)*ch}`).join(' ');
  const gradId='lgrad2';
  const grad = `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/></linearGradient></defs>`;
  const area = `${pad},${h-pad} ${pts} ${pad+cw},${h-pad}`;
  const circles = series.map((s,i)=>{
    const x = pad + i*step; const y = pad + (1 - s.value/max)*ch;
    return `<circle cx="${x}" cy="${y}" r="3" fill="#3B82F6"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Line chart">${grad}<polyline points="${pts}" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/><polygon points="${area}" fill="url(#${gradId})"/>${circles}</svg>`;
}

function buildPieSVG(series,{w=380,h=380}={}) {
  const cx=w/2, cy=h/2, r=Math.min(w,h)/3; const total=series.reduce((a,b)=>a+b.value,0)||1; let a=0;
  const colors=["#3B82F6","#8B5CF6","#06D6A0","#60A5FA","#A78BFA"]; let paths='';
  series.forEach((s,i)=>{ const f=s.value/total; const a2=a+f*Math.PI*2; const x1=cx+r*Math.cos(a), y1=cy+r*Math.sin(a); const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2); const large=f>0.5?1:0; const d=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`; paths+=`<path d="${d}" fill="${colors[i%colors.length]}" opacity="0.9"></path>`; a=a2; });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Pie chart">${paths}</svg>`;
}

function buildTableHTML(series) {
  // Build a simple table from parsed pairs (label/value)
  return `
  <div class="overflow-x-auto">
    <table class="table-auto w-full text-sm">
      <thead class="bg-slate-50">
        <tr>
          <th class="text-left p-3 font-semibold text-slate-700">Name</th>
          <th class="text-left p-3 font-semibold text-slate-700">Value</th>
        </tr>
      </thead>
      <tbody>
        ${series.map((s,i)=>`<tr class="${i%2? 'even:bg-slate-50':''}"><td class="p-3">${s.label}</td><td class="p-3">${s.value}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/**
 * Display generated HTML in preview container
 * SECURITY: Sanitizes HTML before rendering in iframe
 */
function renderVisualization(content, type) {
  if (!previewContainer) return;

  previewContainer.innerHTML = ''; // Clear previous content

  try {
    // Try parsing as JSON (for Chart.js configs)
    const chartConfig = JSON.parse(content);

    if (type === 'dashboard' && chartConfig.layout && chartConfig.charts) {
      // Handle dashboard case
      const sanitizedLayout = HTMLSanitizer.sanitizeHTML(chartConfig.layout);
      previewContainer.innerHTML = sanitizedLayout;
      chartConfig.charts.forEach(chart => {
        const canvas = previewContainer.querySelector(`#${chart.canvasId}`);
        if (canvas) {
          new Chart(canvas.getContext('2d'), chart.config);
        }
      });
    } else {
      // Handle single chart case
      const canvas = document.createElement('canvas');
      previewContainer.appendChild(canvas);
      new Chart(canvas.getContext('2d'), chartConfig);
    }
  } catch (e) {
    // If not JSON, assume it's an HTML table
    const sanitizedHTML = HTMLSanitizer.sanitizeHTML(content);
    previewContainer.innerHTML = sanitizedHTML;
  }
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
  if (!loadingIndicator) return;
  
  if (show) {
    loadingIndicator.classList.remove('hidden');
    loadingIndicator.classList.add('flex');
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    loadingIndicator.classList.add('hidden');
    loadingIndicator.classList.remove('flex');
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

/**
 * Show error message in preview
 */
function showError(message) {
  if (!previewContainer) return;
  
  previewContainer.innerHTML = `
    <div class="text-center p-6">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <div class="text-sm text-red-600 font-medium">${message}</div>
    </div>
  `;
}

/**
 * Handle download button click
 */
async function handleDownload() {
  if (!generatedHTML) {
    showError('Nothing to download. Generate a visual first.');
    return;
  }
  
  try {
    switch (selectedFormat) {
      case 'PNG':
        await downloadAsPNG();
        break;
      case 'PDF':
        await downloadAsPDF();
        break;
      case 'CSV':
        downloadAsCSV();
        break;
      case 'SVG':
        downloadAsSVG();
        break;
      default:
        downloadAsHTML();
    }
  } catch (error) {
    console.error('Download failed:', error);
    showError(`Download failed: ${error.message}`);
  }
}

/**
 * Download as HTML file
 */
function downloadAsHTML() {
  const blob = new Blob([generatedHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vizom-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download as PNG using html2canvas
 */
async function downloadAsPNG() {
  if (typeof html2canvas === 'undefined') {
    showError('PNG export requires html2canvas library. Please refresh the page.');
    return;
  }

  if (!generatedHTML) {
    showError('Nothing to export. Generate a visual first.');
    return;
  }

  try {
    // Show loading state
    showExportLoading('Generating PNG...');

    // Get preview element (iframe or local)
    const iframe = previewContainer.querySelector('iframe');
    let element;
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      element = iframeDoc.body;
    } else {
      element = previewContainer;
    }

    // Capture with html2canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vizom-chart-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      
      hideExportLoading();
      showExportSuccess('PNG downloaded successfully!');
    }, 'image/png');

  } catch (error) {
    console.error('PNG export failed:', error);
    hideExportLoading();
    showError(`PNG export failed: ${error.message}`);
  }
}

/**
 * Download as PDF using jsPDF
 */
async function downloadAsPDF() {
  if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
    showError('PDF export requires jsPDF library. Please refresh the page.');
    return;
  }

  if (!generatedHTML) {
    showError('Nothing to export. Generate a visual first.');
    return;
  }

  try {
    // Show loading state
    showExportLoading('Generating PDF...');

    // Get preview element (iframe or local)
    const iframe = previewContainer.querySelector('iframe');
    let element;
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      element = iframeDoc.body;
    } else {
      element = previewContainer;
    }

    // First capture as canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download PDF
    pdf.save(`vizom-chart-${Date.now()}.pdf`);

    hideExportLoading();
    showExportSuccess('PDF downloaded successfully!');

  } catch (error) {
    console.error('PDF export failed:', error);
    hideExportLoading();
    showError(`PDF export failed: ${error.message}`);
  }
}

/**
 * Download as CSV (extract data from tables)
 */
function downloadAsCSV() {
  showError('CSV export is only available for table visualizations.');
  // TODO: Implement CSV extraction from table HTML
}

/**
 * Download as SVG
 */
function downloadAsSVG() {
  showError('SVG export is only available for certain chart types.');
  // TODO: Implement SVG extraction
}

/**
 * Handle file selection from input
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
}

/**
 * Handle file upload (drag-drop or select)
 */
function handleFileUpload(file) {
  // Validate file type
  if (!file.name.endsWith('.csv')) {
    showValidationMessage('Please upload a CSV file.', 'error');
    return;
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    showValidationMessage('File size exceeds 5MB limit.', 'error');
    return;
  }

  // Read file
  const reader = new FileReader();
  reader.onload = (e) => {
    const csvContent = e.target.result;
    parseCSV(csvContent, file.name);
  };
  reader.onerror = () => {
    showValidationMessage('Error reading file. Please try again.', 'error');
  };
  reader.readAsText(file);
}

/**
 * Parse CSV content and populate textarea
 */
function parseCSV(csvContent, fileName) {
  try {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Show file info
    const fileInfo = document.getElementById('file-info');
    if (fileInfo) {
      fileInfo.classList.remove('hidden');
      fileInfo.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div>
            <div class="font-medium">${fileName}</div>
            <div class="text-xs">${lines.length} rows, ${headers.length} columns</div>
          </div>
        </div>
      `;
    }

    // Convert CSV to readable format for prompt
    let promptText = `Create a visualization from this data:\n\n`;
    promptText += `Headers: ${headers.join(', ')}\n\n`;
    
    // Add first few rows as example
    const maxRows = Math.min(10, lines.length);
    for (let i = 1; i < maxRows; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      promptText += values.join(' | ') + '\n';
    }
    
    if (lines.length > maxRows) {
      promptText += `\n... and ${lines.length - maxRows} more rows`;
    }

    // Populate textarea
    if (textarea) {
      textarea.value = promptText;
    }

    showValidationMessage('CSV file loaded successfully!', 'success');
  } catch (error) {
    showValidationMessage('Error parsing CSV file. Please check the format.', 'error');
  }
}

/**
 * Show validation message with different types
 */
function showValidationMessage(message, type = 'info') {
  const validationMsg = document.getElementById('validation-message');
  if (!validationMsg) return;

  validationMsg.classList.remove('hidden');
  
  // Reset classes
  validationMsg.className = 'mt-2 p-3 rounded-lg border';
  
  // Apply type-specific styles
  switch (type) {
    case 'success':
      validationMsg.classList.add('bg-green-50', 'border-green-200', 'text-green-800');
      validationMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">${message}</span>
        </div>
      `;
      break;
    case 'error':
      validationMsg.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
      validationMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">${message}</span>
        </div>
      `;
      break;
    case 'warning':
      validationMsg.classList.add('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
      validationMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span class="text-sm font-medium">${message}</span>
        </div>
      `;
      break;
    default:
      validationMsg.classList.add('bg-blue-50', 'border-blue-200', 'text-blue-800');
      validationMsg.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">${message}</span>
        </div>
      `;
  }

  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      hideValidationMessage();
    }, 3000);
  }
}

/**
 * Hide validation message
 */
function hideValidationMessage() {
  const validationMsg = document.getElementById('validation-message');
  if (validationMsg) {
    validationMsg.classList.add('hidden');
  }
}

/**
 * Show export loading overlay
 */
function showExportLoading(message = 'Exporting...') {
  let overlay = document.getElementById('export-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'export-overlay';
    overlay.className = 'fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4">
        <div class="flex flex-col items-center gap-4">
          <svg class="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div class="text-center">
            <div id="export-message" class="text-lg font-semibold text-slate-900">${message}</div>
            <div class="text-sm text-slate-500 mt-1">Please wait...</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
    overlay.classList.remove('hidden');
    const messageEl = overlay.querySelector('#export-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  }
}

/**
 * Hide export loading overlay
 */
function hideExportLoading() {
  const overlay = document.getElementById('export-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * Show export success message
 */
function showExportSuccess(message) {
  // Create temporary success toast
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up';
  toast.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span class="font-medium">${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateVisual,
    chartPrompts,
    displayGeneratedHTML
  };
}
