import { sanitize } from '../utils/sanitizer.js';
import { supabase } from '../supabase-client.js';

// AI Service with caching and smart parsing
class AIService {
  constructor() {
    this.promptCache = new Map();
    this.maxCacheSize = 100;
  }

  async generateWithCache(prompt, chartType) {
    const cacheKey = `${chartType}-${this.hashPrompt(prompt)}`;
    
    if (this.promptCache.has(cacheKey)) {
      console.log('📋 Using cached result for:', cacheKey.substring(0, 50) + '...');
      return this.promptCache.get(cacheKey);
    }
    
    const result = await this.callAIService(prompt, chartType);
    this.setCache(cacheKey, result);
    return result;
  }

  hashPrompt(prompt) {
    // Simple hash for cache key
    return prompt.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString();
  }

  setCache(key, value) {
    if (this.promptCache.size >= this.maxCacheSize) {
      const firstKey = this.promptCache.keys().next().value;
      this.promptCache.delete(firstKey);
    }
    this.promptCache.set(key, value);
  }

  async callAIService(prompt, chartType) {
    // Simulate API call - replace with actual AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: this.smartParse(prompt, chartType),
          chartType,
          timestamp: Date.now()
        });
      }, 800);
    });
  }

  smartParse(inputText, chartType = 'bar') {
    const text = (inputText || '').trim();
    
    // Auto-detect format
    if (this.isCSV(text)) {
      return this.parseCSV(text);
    } else if (this.isJSON(text)) {
      return this.parseJSON(text);
    } else {
      return this.parsePlainText(text, chartType);
    }
  }

  isCSV(text) {
    return text.includes(',') && (text.includes('\n') || text.split(',').length > 2);
  }

  isJSON(text) {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  }

  parseCSV(text) {
    const lines = text.trim().split('\n');
    const hasHeader = lines[0].toLowerCase().includes('label') || lines[0].toLowerCase().includes('name');
    const dataLines = hasHeader ? lines.slice(1) : lines;
    
    return dataLines.map(line => {
      const [label, value] = line.split(',').map(s => s.trim());
      return {
        label: label || 'Item',
        value: parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
      };
    }).filter(item => !isNaN(item.value));
  }

  parseJSON(text) {
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        return data.map(item => ({
          label: item.label || item.name || item.x || 'Item',
          value: parseFloat(item.value || item.y || item.amount || 0)
        })).filter(item => !isNaN(item.value));
      }
    } catch (e) {
      console.error('JSON parsing error:', e);
      return this.parsePlainText(text);
    }
  }

  parsePlainText(text, chartType) {
    // Enhanced parsing with multiple patterns
    const patterns = [
      // Pattern: "Label: $12K" or "Label - 12,000"
      /([A-Za-zА-Яа-я\s]+?)(?:[:\-]?\s*\$?)([\d,.]+)\s*(K|M|%)?/gi,
      // Pattern: "Label 12K" (space separated)
      /([A-Za-zА-Яа-я\s]+?)\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*(K|M|%)?/gi,
      // Pattern: "Label=12K"
      /([A-Za-zА-Яа-я\s]+?)\s*=\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(K|M|%)?/gi
    ];

    let matches = [];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const label = match[1].trim();
        let value = parseFloat(match[2].replace(/,/g, ''));
        const unit = match[3]?.toUpperCase();
        
        if (unit === 'K') value *= 1000;
        if (unit === 'M') value *= 1000000;
        if (unit === '%') value = value / 100;
        
        if (!isNaN(value) && label) {
          matches.push({ label, value });
        }
      }
      
      if (matches.length > 0) break; // Use first successful pattern
    }

    // Fallback examples if no matches
    if (matches.length === 0) {
      const examples = {
        bar: [
          { label: 'Jan', value: 12000 },
          { label: 'Feb', value: 15000 },
          { label: 'Mar', value: 18000 },
          { label: 'Apr', value: 20000 }
        ],
        line: [
          { label: 'Jan', value: 1200 },
          { label: 'Feb', value: 1500 },
          { label: 'Mar', value: 1800 },
          { label: 'Apr', value: 2100 },
          { label: 'May', value: 2400 }
        ],
        pie: [
          { label: 'Segment A', value: 45 },
          { label: 'Segment B', value: 30 },
          { label: 'Segment C', value: 25 }
        ],
        table: [
          { label: 'Product A', value: 4500 },
          { label: 'Product B', value: 3600 },
          { label: 'Product C', value: 6000 }
        ]
      };
      matches = examples[chartType] || examples.bar;
    }

    return matches;
  }

  clearCache() {
    this.promptCache.clear();
    console.log('🗑️ Cache cleared');
  }

  getCacheSize() {
    return this.promptCache.size;
  }
}

// Project Manager for Supabase integration
class ProjectManager {
  constructor() {
    this.currentProject = null;
  }

  async saveProject(title, chartData, htmlOutput, chartType) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const projectData = {
        title: title || `Проект ${new Date().toLocaleDateString()}`,
        chart_data: chartData,
        html_output: htmlOutput,
        chart_type: chartType,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error('Error saving project:', error);
        throw error;
      }

      console.log('✅ Project saved:', data[0]);
      return data[0];
    } catch (error) {
      console.error('❌ Failed to save project:', error);
      throw error;
    }
  }

  async loadProjects() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        throw error;
      }

      return projects || [];
    } catch (error) {
      console.error('❌ Failed to load projects:', error);
      return [];
    }
  }

  async deleteProject(projectId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      console.log('✅ Project deleted:', projectId);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete project:', error);
      throw error;
    }
  }

  async updateProject(projectId, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('❌ Failed to update project:', error);
      throw error;
    }
  }
}

// Quick templates
const QUICK_TEMPLATES = {
  sales: {
    name: 'Продажи',
    icon: 'fa-chart-line',
    prompt: 'Monthly sales: Jan $12K, Feb $15K, Mar $18K, Apr $20K, May $22K',
    type: 'bar'
  },
  traffic: {
    name: 'Трафик',
    icon: 'fa-users',
    prompt: 'Website visitors: Jan 1,200, Feb 1,500, Mar 1,800, Apr 2,100, May 2,400',
    type: 'line'
  },
  market: {
    name: 'Рынок',
    icon: 'fa-chart-pie',
    prompt: 'Market share: Company A 45%, Company B 30%, Company C 25%',
    type: 'pie'
  },
  revenue: {
    name: 'Выручка',
    icon: 'fa-dollar-sign',
    prompt: 'Q1: $125K, Q2: $145K, Q3: $168K, Q4: $192K',
    type: 'bar'
  },
  users: {
    name: 'Пользователи',
    icon: 'fa-user-plus',
    prompt: 'New users: Week 1 450, Week 2 520, Week 3 480, Week 4 610',
    type: 'line'
  },
  conversion: {
    name: 'Конверсия',
    icon: 'fa-funnel-dollar',
    prompt: 'Conversion funnel: Visitors 10,000, Leads 1,200, Trials 450, Customers 180',
    type: 'bar'
  }
};

// Initialize services
const aiService = new AIService();
const projectManager = new ProjectManager();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Add quick templates to UI
  addQuickTemplates();

  // Initialize project management
  initProjectManagement();

  // Settings accordion toggle
  document.querySelectorAll('.settings-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('svg');
      if (target.classList.contains('hidden')) {
        target.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
      } else {
        target.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Update breadcrumb when chart type is selected
  document.querySelectorAll('.chart-type-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      const breadcrumb = document.getElementById('breadcrumb-chart-type');
      if (breadcrumb) {
        breadcrumb.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      }
    });
  });

  // Live Preview (SVG) — non-invasive, works before AI generation
  (function(){
    const preview = document.getElementById('preview');
    const loading = document.getElementById('loading');
    const input = document.getElementById('prompt-input');
    const toggleExample = document.getElementById('toggle-example');
    const toggleUser = document.getElementById('toggle-user');
    const cards = Array.from(document.querySelectorAll('.chart-type-card'));
    let useExample = true;
    let selectedType = 'bar';
    let currentChartData = null;

    function hasIframe(){
      return !!preview?.querySelector('iframe');
    }

    function setToggle(active){
      useExample = active === 'example';
      if (toggleExample && toggleUser){
        if (useExample){
          toggleExample.classList.add('bg-slate-900','text-white');
          toggleUser.classList.remove('bg-slate-900','text-white');
          toggleUser.classList.add('text-slate-600');
        } else {
          toggleUser.classList.add('bg-slate-900','text-white');
          toggleExample.classList.remove('bg-slate-900','text-white');
          toggleExample.classList.add('text-slate-600');
        }
      }
    }

    // Enhanced parsing using AI service
    function parseSeries(text){
      return aiService.smartParse(text, selectedType);
    }

    // Generate with caching
    async function generateWithAI(prompt, chartType) {
      loading?.classList.remove('hidden');
      
      try {
        const result = await aiService.generateWithCache(prompt, chartType);
        
        if (result.success) {
          currentChartData = result.data;
          renderChart(result.data, chartType);
          console.log(`✅ Generated ${chartType} chart (cache size: ${aiService.getCacheSize()})`);
        }
      } catch (error) {
        console.error('❌ Generation failed:', error);
        alert('Ошибка генерации. Попробуйте еще раз.');
      } finally {
        loading?.classList.add('hidden');
      }
    }

    function renderChart(data, type) {
      if (!preview) return;
      
      const chartHTML = {
        bar: barChartSVG(data),
        line: lineChartSVG(data),
        pie: pieChartSVG(data),
        table: tableHTML(data)
      };
      
      preview.innerHTML = chartHTML[type] || chartHTML.bar;
    }

    // Project management functions
    function initProjectManagement() {
      // Save project button
      const saveBtn = document.getElementById('save-project');
      const loadBtn = document.getElementById('load-projects');
      const saveModal = document.getElementById('save-project-modal');
      const projectsModal = document.getElementById('projects-modal');
      
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          if (!currentChartData) {
            alert('Сначала сгенерируйте диаграмму');
            return;
          }
          showSaveProjectModal();
        });
      }

      if (loadBtn) {
        loadBtn.addEventListener('click', () => {
          showProjectsModal();
        });
      }

      // Modal close buttons
      document.getElementById('close-save-modal')?.addEventListener('click', hideSaveProjectModal);
      document.getElementById('close-projects-modal')?.addEventListener('click', hideProjectsModal);
      document.getElementById('cancel-save-project')?.addEventListener('click', hideSaveProjectModal);
      
      // Confirm save
      document.getElementById('confirm-save-project')?.addEventListener('click', async () => {
        const title = document.getElementById('project-title')?.value;
        if (!title) {
          alert('Введите название проекта');
          return;
        }

        try {
          const htmlOutput = preview?.innerHTML || '';
          await projectManager.saveProject(title, currentChartData, htmlOutput, selectedType);
          hideSaveProjectModal();
          alert('Проект успешно сохранен!');
        } catch (error) {
          alert('Ошибка сохранения проекта: ' + error.message);
        }
      });

      // Close modals on outside click
      saveModal?.addEventListener('click', (e) => {
        if (e.target === saveModal) hideSaveProjectModal();
      });
      
      projectsModal?.addEventListener('click', (e) => {
        if (e.target === projectsModal) hideProjectsModal();
      });
    }

    function showSaveProjectModal() {
      const modal = document.getElementById('save-project-modal');
      const titleInput = document.getElementById('project-title');
      if (titleInput) {
        titleInput.value = `Проект ${new Date().toLocaleDateString()}`;
        titleInput.focus();
        titleInput.select();
      }
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function hideSaveProjectModal() {
      const modal = document.getElementById('save-project-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    async function showProjectsModal() {
      const modal = document.getElementById('projects-modal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        await loadProjectsList();
      }
    }

    function hideProjectsModal() {
      const modal = document.getElementById('projects-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    async function loadProjectsList() {
      try {
        const projects = await projectManager.loadProjects();
        const projectsList = document.getElementById('projects-list');
        const noProjects = document.getElementById('no-projects');

        if (projects.length === 0) {
          projectsList.classList.add('hidden');
          noProjects.classList.remove('hidden');
        } else {
          projectsList.classList.remove('hidden');
          noProjects.classList.add('hidden');
          
          projectsList.innerHTML = projects.map(project => `
            <div class="border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-semibold text-slate-900">${project.title}</h4>
                  <p class="text-sm text-slate-500 mt-1">
                    ${project.chart_type?.charAt(0).toUpperCase() + project.chart_type?.slice(1)} • 
                    ${new Date(project.created_at).toLocaleDateString()}
                  </p>
                  <p class="text-xs text-slate-400 mt-2">
                    ${project.chart_data?.length || 0} точек данных
                  </p>
                </div>
                <div class="flex gap-2">
                  <button class="load-project-btn text-blue-600 hover:text-blue-700 text-sm" data-project-id="${project.id}">
                    <i class="fas fa-download"></i> Загрузить
                  </button>
                  <button class="delete-project-btn text-red-600 hover:text-red-700 text-sm" data-project-id="${project.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('');

          // Add event listeners
          projectsList.querySelectorAll('.load-project-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const projectId = btn.dataset.projectId;
              const project = projects.find(p => p.id === projectId);
              if (project) {
                loadProject(project);
              }
            });
          });

          projectsList.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const projectId = btn.dataset.projectId;
              if (confirm('Удалить этот проект?')) {
                try {
                  await projectManager.deleteProject(projectId);
                  await loadProjectsList(); // Refresh list
                } catch (error) {
                  alert('Ошибка удаления проекта: ' + error.message);
                }
              }
            });
          });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        alert('Ошибка загрузки проектов');
      }
    }

    function loadProject(project) {
      try {
        currentChartData = project.chart_data;
        selectedType = project.chart_type || 'bar';
        
        // Update input
        if (input) {
          input.value = project.chart_data?.map(item => 
            `${item.label}: ${item.value}`
          ).join(', ') || '';
        }

        // Update chart type selection
        const chartCard = document.querySelector(`[data-type="${selectedType}"]`);
        if (chartCard) {
          chartCard.click();
        }

        // Render chart
        renderChart(project.chart_data, selectedType);
        
        hideProjectsModal();
        alert('Проект загружен!');
      } catch (error) {
        console.error('Error loading project:', error);
        alert('Ошибка загрузки проекта');
      }
    }

    // SVG renderers
    function barChartSVG(series, {w=720,h=380,pad=36}={}){
      const max = Math.max(...series.map(s=>s.value))||1;
      const cw = w - pad*2; const ch = h - pad*2;
      const bw = cw / series.length * 0.7; const gap = cw / series.length * 0.3;
      let x = pad;
      const grad = `<defs><linearGradient id="gbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.15"/></linearGradient></defs>`;
      let bars = '';
      series.forEach((s)=>{
        const bh = Math.max(2, (s.value/max)*ch);
        bars += `<g transform="translate(${x},${pad})"><rect rx="8" width="${bw}" height="0" y="${ch}" fill="url(#gbar)"><title>${s.label}: ${s.value}</title><animate attributeName="height" from="0" to="${bh}" dur="0.45s" fill="freeze"/><animate attributeName="y" from="${ch}" to="${ch-bh}" dur="0.45s" fill="freeze"/></rect><text x="${bw/2}" y="${ch+16}" text-anchor="middle" fill="#64748b" font-size="12">${s.label}</text></g>`;
        x += bw + gap;
      });
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Bar chart">${grad}${bars}</svg>`;
    }
    
    function lineChartSVG(series, {w=720,h=380,pad=36}={}){
      const max = Math.max(...series.map(s=>s.value))||1;
      const cw=w-pad*2, ch=h-pad*2, step=cw/Math.max(1,series.length-1);
      const pts = series.map((s,i)=>`${pad+i*step},${pad+(1-s.value/max)*ch}`).join(' ');
      const gradId='lgrad';
      const grad = `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/></linearGradient></defs>`;
      const area = `${pad},${h-pad} ${pts} ${pad+cw},${h-pad}`;
      const circles = series.map((s,i)=>{
        const x = pad + i*step; const y = pad + (1 - s.value/max)*ch;
        return `<circle cx="${x}" cy="${y}" r="3" fill="#3B82F6"><title>${s.label}: ${s.value}</title></circle>`;
      }).join('');
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Line chart">${grad}<polyline points="${pts}" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0,9999" to="9999,0" dur="0.6s" fill="freeze"/></polyline><polygon points="${area}" fill="url(#${gradId})"/>${circles}</svg>`;
    }
    
    function pieChartSVG(series,{w=380,h=380}={}){
      const cx=w/2, cy=h/2, r=Math.min(w,h)/3; const total=series.reduce((a,b)=>a+b.value,0)||1; let a=0;
      const colors=["#3B82F6","#8B5CF6","#06D6A0","#60A5FA","#A78BFA"]; let paths='';
      series.forEach((s,i)=>{ const f=s.value/total; const a2=a+f*Math.PI*2; const x1=cx+r*Math.cos(a), y1=cy+r*Math.sin(a); const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2); const large=f>0.5?1:0; const d=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`; paths+=`<path d="${d}" fill="${colors[i%colors.length]}" opacity="0"><animate attributeName="opacity" from="0" to="0.9" dur="0.4s" fill="freeze"/></path>`; a=a2; });
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Pie chart">${paths}</svg>`;
    }
    
    function tableHTML(data){
      if (!data || !data.length) {
        return `<div style="padding:12px;font-family:Inter,system-ui,sans-serif;color:#0f172a">No data available</div>`;
      }
      
      const headers = Object.keys(data[0]) || ['Label', 'Value'];
      const rows = data.map(item => 
        `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:14px">
          <div>${item.label || ''}</div>
          <div>${item.value || ''}</div>
        </div>`
      ).join('');
      
      return `<div style="padding:12px;font-family:Inter,system-ui,sans-serif;color:#0f172a">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:14px;font-weight:600;margin-bottom:8px">
          <div>${headers[0]}</div>
          <div>${headers[1]}</div>
        </div>
        ${rows}
      </div>`;
    }

    function exampleTextByType(type){
      // Use quick templates as examples
      const template = Object.values(QUICK_TEMPLATES).find(t => t.type === type);
      return template ? template.prompt : QUICK_TEMPLATES.sales.prompt;
    }

    // Add quick templates to UI
    function addQuickTemplates() {
      const container = document.querySelector('#data-panel .bg-white');
      if (!container) return;
      
      const templatesHTML = `
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Быстрые шаблоны</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            ${Object.entries(QUICK_TEMPLATES).map(([key, template]) => `
              <button class="quick-template-btn flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-sm"
                       data-template="${key}">
                <i class="fas ${template.icon} text-blue-600"></i>
                <span>${template.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
      // Insert after the first h2 in the container
      const firstH2 = container.querySelector('h2');
      if (firstH2) {
        firstH2.insertAdjacentHTML('afterend', templatesHTML);
        
        // Add event listeners for quick templates
        container.querySelectorAll('.quick-template-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const templateKey = btn.dataset.template;
            const template = QUICK_TEMPLATES[templateKey];
            
            if (template && input) {
              input.value = template.prompt;
              
              // Select the chart type
              const chartCard = document.querySelector(`[data-type="${template.type}"]`);
              if (chartCard) {
                chartCard.click();
              }
              
              // Generate preview
              generateWithAI(template.prompt, template.type);
            }
          });
        });
      }
    }

    // Initialize project management
    initProjectManagement();
    // Initialize quick templates
    addQuickTemplates();
  })();
});
