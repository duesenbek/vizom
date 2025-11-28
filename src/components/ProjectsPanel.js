/**
 * Projects Panel Component
 * Shows user's saved chart projects with CRUD actions
 */

import { projectsService } from '../services/projectsService.js';
import { supabase } from '../supabase-client.js';

class ProjectsPanel {
  constructor() {
    this.isOpen = false;
    this.projects = [];
    this.currentProjectId = null;
    this.onProjectLoad = null; // Callback when project is loaded
  }

  /**
   * Initialize the panel
   * @param {Function} onProjectLoad - Callback(project) when user loads a project
   */
  init(onProjectLoad) {
    this.onProjectLoad = onProjectLoad;
    this.createPanelHTML();
    this.bindEvents();
  }

  createPanelHTML() {
    // Check if panel already exists
    if (document.getElementById('projects-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'projects-panel';
    panel.className = 'fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-50 flex flex-col';
    panel.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-slate-200">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">My Projects</h2>
          <p class="text-xs text-slate-500" id="projects-count">Loading...</p>
        </div>
        <button id="close-projects-panel" class="p-2 hover:bg-slate-100 rounded-lg transition">
          <i class="fas fa-times text-slate-500"></i>
        </button>
      </div>

      <!-- Projects List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3" id="projects-list">
        <div class="text-center py-8 text-slate-500">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>Loading projects...</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 border-t border-slate-200 space-y-2">
        <button id="save-current-project" class="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <i class="fas fa-save"></i>
          <span>Save Current Chart</span>
        </button>
        <p class="text-xs text-center text-slate-500" id="projects-limit-info"></p>
      </div>
    `;

    document.body.appendChild(panel);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'projects-panel-overlay';
    overlay.className = 'fixed inset-0 bg-black/30 opacity-0 pointer-events-none transition-opacity duration-300 z-40';
    document.body.appendChild(overlay);
  }

  bindEvents() {
    // Close button
    document.getElementById('close-projects-panel')?.addEventListener('click', () => this.close());
    
    // Overlay click
    document.getElementById('projects-panel-overlay')?.addEventListener('click', () => this.close());
    
    // Save current project
    document.getElementById('save-current-project')?.addEventListener('click', () => this.showSaveDialog());
    
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  async open() {
    const panel = document.getElementById('projects-panel');
    const overlay = document.getElementById('projects-panel-overlay');
    
    if (panel) {
      panel.classList.remove('translate-x-full');
      this.isOpen = true;
    }
    if (overlay) {
      overlay.classList.remove('opacity-0', 'pointer-events-none');
    }
    
    await this.loadProjects();
  }

  close() {
    const panel = document.getElementById('projects-panel');
    const overlay = document.getElementById('projects-panel-overlay');
    
    if (panel) {
      panel.classList.add('translate-x-full');
      this.isOpen = false;
    }
    if (overlay) {
      overlay.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  async loadProjects() {
    const listEl = document.getElementById('projects-list');
    const countEl = document.getElementById('projects-count');
    const limitEl = document.getElementById('projects-limit-info');
    
    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      if (listEl) {
        listEl.innerHTML = `
          <div class="text-center py-8">
            <i class="fas fa-lock text-4xl text-slate-300 mb-3"></i>
            <p class="text-slate-600 font-medium">Sign in to save projects</p>
            <p class="text-sm text-slate-500 mt-1">Your charts will be saved to your account</p>
            <button onclick="document.dispatchEvent(new Event('auth:signIn'))" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Sign In
            </button>
          </div>
        `;
      }
      return;
    }
    
    this.projects = await projectsService.getProjects();
    const canCreate = await projectsService.canCreateProject();
    
    // Update count
    if (countEl) {
      countEl.textContent = `${this.projects.length} project${this.projects.length !== 1 ? 's' : ''}`;
    }
    
    // Update limit info
    if (limitEl) {
      if (projectsService.isPro()) {
        limitEl.innerHTML = '<i class="fas fa-crown text-amber-500"></i> Pro: Unlimited projects';
      } else if (canCreate.allowed) {
        limitEl.textContent = `Free: ${canCreate.remaining} of 3 slots remaining`;
      } else {
        limitEl.innerHTML = `<span class="text-amber-600"><i class="fas fa-exclamation-triangle"></i> Limit reached. <a href="pricing.html" class="underline">Upgrade to Pro</a></span>`;
      }
    }
    
    // Render projects
    if (listEl) {
      if (this.projects.length === 0) {
        listEl.innerHTML = `
          <div class="text-center py-8">
            <i class="fas fa-folder-open text-4xl text-slate-300 mb-3"></i>
            <p class="text-slate-600 font-medium">No projects yet</p>
            <p class="text-sm text-slate-500 mt-1">Create a chart and save it here</p>
          </div>
        `;
      } else {
        listEl.innerHTML = this.projects.map(p => this.renderProjectCard(p)).join('');
        this.bindProjectActions();
      }
    }
  }

  renderProjectCard(project) {
    const content = project.content ? JSON.parse(project.content) : {};
    const chartType = content.chartType || 'bar';
    const updatedAt = new Date(project.updated_at).toLocaleDateString();
    
    const chartIcons = {
      bar: 'fa-chart-bar',
      line: 'fa-chart-line',
      pie: 'fa-chart-pie',
      doughnut: 'fa-chart-pie',
      scatter: 'fa-braille',
      radar: 'fa-spider',
      area: 'fa-chart-area'
    };
    
    return `
      <div class="project-card group bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition cursor-pointer" data-project-id="${project.id}">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="fas ${chartIcons[chartType] || 'fa-chart-bar'} text-blue-600"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-slate-900 truncate">${this.escapeHtml(project.title)}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${chartType} • ${updatedAt}</p>
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition flex gap-1">
            <button class="project-action p-1.5 hover:bg-white rounded" data-action="duplicate" data-id="${project.id}" title="Duplicate">
              <i class="fas fa-copy text-slate-400 text-sm"></i>
            </button>
            <button class="project-action p-1.5 hover:bg-white rounded" data-action="delete" data-id="${project.id}" title="Delete">
              <i class="fas fa-trash text-red-400 text-sm"></i>
            </button>
          </div>
        </div>
        ${project.description ? `<p class="text-xs text-slate-500 mt-2 line-clamp-2">${this.escapeHtml(project.description)}</p>` : ''}
      </div>
    `;
  }

  bindProjectActions() {
    // Load project on card click
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-action')) return;
        const projectId = card.dataset.projectId;
        this.loadProject(projectId);
      });
    });
    
    // Action buttons
    document.querySelectorAll('.project-action').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        
        if (action === 'delete') {
          if (confirm('Delete this project?')) {
            await projectsService.deleteProject(id);
            await this.loadProjects();
          }
        } else if (action === 'duplicate') {
          await projectsService.duplicateProject(id);
          await this.loadProjects();
        }
      });
    });
  }

  async loadProject(projectId) {
    const project = await projectsService.getProject(projectId);
    if (!project) return;
    
    this.currentProjectId = projectId;
    
    if (this.onProjectLoad) {
      const content = project.content ? JSON.parse(project.content) : {};
      this.onProjectLoad({
        id: project.id,
        title: project.title,
        ...content
      });
    }
    
    this.close();
  }

  showSaveDialog() {
    const title = prompt('Project name:', 'My Chart');
    if (!title) return;
    
    this.saveCurrentChart(title);
  }

  async saveCurrentChart(title, description = '') {
    // Get current chart data from generator
    const promptInput = document.getElementById('prompt-input');
    const prompt = promptInput?.value || '';
    
    // Get selected chart type
    const selectedOption = document.querySelector('.chart-option.selected, .chart-option[aria-pressed="true"]');
    const chartType = selectedOption?.dataset?.type || 'bar';
    
    // Get chart config if available
    const chartConfig = window.lastChartConfig || {};
    const chartData = window.lastChartData || {};
    
    const result = await projectsService.createProject({
      title,
      description,
      prompt,
      chartType,
      chartConfig,
      chartData
    });
    
    if (result.success) {
      this.currentProjectId = result.project.id;
      await this.loadProjects();
      alert('Project saved!');
    } else {
      alert(result.error);
    }
  }

  async updateCurrentProject() {
    if (!this.currentProjectId) {
      this.showSaveDialog();
      return;
    }
    
    const promptInput = document.getElementById('prompt-input');
    const selectedOption = document.querySelector('.chart-option.selected, .chart-option[aria-pressed="true"]');
    
    await projectsService.updateProject(this.currentProjectId, {
      prompt: promptInput?.value || '',
      chartType: selectedOption?.dataset?.type || 'bar',
      chartConfig: window.lastChartConfig || {},
      chartData: window.lastChartData || {}
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export singleton
export const projectsPanel = new ProjectsPanel();
export default projectsPanel;
