import { supabase } from '../../../src/supabase-client.js';

export class ProjectManager {
   constructor(chartGenerator) {
      this.chartGenerator = chartGenerator;
      this.LOCAL_STORAGE_KEY = 'vizom:generator-projects';
      this.authPromptShown = { save: false, load: false };
      this.bindProjectActions();
   }

   async getCurrentUser() {
      try {
         const { data: { user } = {} } = await supabase.auth.getUser();
         if (user) {
            this.clearAuthNotice();
            return user;
         }
      } catch (error) {
         console.warn('[Auth] Auth check failed, using local fallback', error);
      }
      return null;
   }

   bindProjectActions() {
      const saveBtn = document.getElementById('save-project');
      const loadBtn = document.getElementById('load-projects');
      const saveModal = document.getElementById('save-project-modal');
      const projectsModal = document.getElementById('projects-modal');

      if (saveBtn) {
         saveBtn.addEventListener('click', () => {
            if (!this.chartGenerator?.lastChartPayload) {
               this.showToast('Generate a chart before saving the project', 'warning');
               this.chartGenerator?.highlightPromptInput();
               return;
            }
            const titleInput = document.getElementById('project-title');
            if (titleInput) {
               titleInput.value = `Project ${new Date().toLocaleString()}`;
               titleInput.focus();
               titleInput.select();
            }
            this.openModal(saveModal);
         });
      }

      if (loadBtn) {
         loadBtn.addEventListener('click', () => {
            this.renderProjectsList();
            this.openModal(projectsModal);
         });
      }

      document.getElementById('confirm-save-project')?.addEventListener('click', () => this.handleProjectSave());
      document.getElementById('cancel-save-project')?.addEventListener('click', () => this.closeModal(saveModal));
      document.getElementById('close-save-modal')?.addEventListener('click', () => this.closeModal(saveModal));
      document.getElementById('close-projects-modal')?.addEventListener('click', () => this.closeModal(projectsModal));

      saveModal?.addEventListener('click', (event) => {
         if (event.target === saveModal) {
            this.closeModal(saveModal);
         }
      });

      projectsModal?.addEventListener('click', (event) => {
         if (event.target === projectsModal) {
            this.closeModal(projectsModal);
         }
      });
   }

   openModal(modal) {
      if (!modal) return;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
   }

   closeModal(modal) {
      if (!modal) return;
      modal.classList.add('hidden');
      document.body.style.overflow = '';
   }

   getLocalProjects() {
      if (typeof window === 'undefined' || !window.localStorage) {
         return [];
      }
      try {
         const stored = window.localStorage.getItem(this.LOCAL_STORAGE_KEY);
         return stored ? JSON.parse(stored) : [];
      } catch (error) {
         console.warn('[Storage] Failed to read local projects', error);
         return [];
      }
   }

   saveLocalProjects(projects) {
      if (typeof window === 'undefined' || !window.localStorage) {
         return;
      }
      try {
         window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(projects));
      } catch (error) {
         console.warn('[Storage] Failed to persist local projects', error);
      }
   }

   saveProjectLocally(projectData) {
      const projects = this.getLocalProjects();
      const localProject = {
         ...projectData,
         id: projectData?.id || `local-${Date.now()}`,
         storage: 'local',
         created_at: projectData?.created_at || new Date().toISOString(),
         updated_at: new Date().toISOString()
      };
      projects.unshift(localProject);
      this.saveLocalProjects(projects);
      console.info('[Offline] Project saved locally.');
      return localProject;
   }

   async handleProjectSave() {
      const titleInput = document.getElementById('project-title');
      const title = titleInput?.value?.trim();
      if (!title) {
         this.showToast('Enter project title', 'warning');
         return;
      }

      const payload = this.chartGenerator?.lastChartPayload;
      if (!payload) {
         this.showToast('Nothing to save yet. Generate a chart first.', 'warning');
         return;
      }

      const container = document.getElementById('chart-container');
      const htmlOutput = container?.innerHTML || '';

      const baseProject = {
         title: title,
         chart_data: payload.config?.data || null,
         html_output: htmlOutput,
         chart_type: payload.chartType,
         created_at: new Date().toISOString()
      };

      try {
         const user = await this.getCurrentUser();
         if (!user) {
            this.showAuthPrompt('save');
            this.saveProjectLocally(baseProject);
         } else {
            const projectData = { ...baseProject, user_id: user.id };
            const { data, error } = await supabase
               .from('projects')
               .insert([projectData])
               .select();
            if (error) {
               throw error;
            }
            console.log('[Project] Saved:', data[0]);
         }
         this.closeModal(document.getElementById('save-project-modal'));
         this.showToast('Project saved successfully!', 'success');
      } catch (error) {
         console.error('[Project] Failed to save:', error);
         this.showToast('Error saving project: ' + (error.message || 'Unknown error'), 'error');
      }
   }

   async renderProjectsList() {
      const projects = await this.loadProjects();
      const projectsList = document.getElementById('projects-list');
      const noProjects = document.getElementById('no-projects');

      if (!projectsList || !noProjects) return;

      if (!projects.length) {
         projectsList.classList.add('hidden');
         noProjects.classList.remove('hidden');
         return;
      }

      projectsList.classList.remove('hidden');
      noProjects.classList.add('hidden');

      projectsList.innerHTML = projects.map(project => `
         <div class="border border-slate-200 rounded-lg p-4 hover:border-blue-400 transition">
           <div class="flex items-start justify-between">
             <div class="flex-1">
               <h4 class="font-semibold text-slate-900">${project.title}</h4>
               <p class="text-sm text-slate-500 mt-1">
                 ${project.chart_type?.charAt(0).toUpperCase() + project.chart_type?.slice(1)} 7
                 ${new Date(project.created_at).toLocaleDateString()}
               </p>
             </div>
             <div class="flex gap-2">
               <button class="load-project-btn text-blue-600 hover:text-blue-700 text-sm" data-project-id="${project.id}">
                 <i class="fas fa-download"></i> Load
               </button>
               <button class="delete-project-btn text-red-600 hover:text-red-700 text-sm" data-project-id="${project.id}">
                 <i class="fas fa-trash"></i>
               </button>
             </div>
           </div>
         </div>
      `).join('');

      projectsList.querySelectorAll('.load-project-btn').forEach(btn => {
         btn.addEventListener('click', () => {
            const projectId = btn.dataset.projectId;
            const project = projects.find(p => p.id === projectId);
            if (project) {
               this.loadProject(project);
            }
         });
      });

      projectsList.querySelectorAll('.delete-project-btn').forEach(btn => {
         btn.addEventListener('click', async () => {
            const projectId = btn.dataset.projectId;
            if (!confirm('Delete this project?')) return;
            try {
               await this.deleteProject(projectId);
               await this.renderProjectsList();
            } catch (error) {
               this.showToast('Error deleting project: ' + (error.message || 'Unknown error'), 'error');
            }
         });
      });
   }

   async loadProjects() {
      try {
         const user = await this.getCurrentUser();
         if (!user) {
            this.showAuthPrompt('load');
            return this.getLocalProjects();
         }

         this.clearAuthNotice('load');

         const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
         if (error) {
            throw error;
         }
         return projects || [];
      } catch (error) {
         console.error('[Project] Failed to load:', error);
         return [];
      }
   }

   async deleteProject(projectId) {
      try {
         const user = await this.getCurrentUser();
         if (!user) {
            const projects = this.getLocalProjects();
            const filtered = projects.filter(project => project.id !== projectId);
            this.saveLocalProjects(filtered);
            return true;
         }

         const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .eq('user_id', user.id);
         if (error) {
            throw error;
         }
         return true;
      } catch (error) {
         console.error('[Project] Failed to delete:', error);
         throw error;
      }
   }

   loadProject(project) {
      try {
         const payload = project.chart_data;
         if (!payload) return;
         const config = {
            type: project.chart_type || 'bar',
            data: payload
         };
         this.chartGenerator.currentChartType = config.type;
         this.chartGenerator.lastChartPayload = { prompt: '', chartType: config.type, config };
         this.chartGenerator.selectChartType(config.type);
         this.chartGenerator.renderChart(config);
         this.closeModal(document.getElementById('projects-modal'));
         this.showToast('Project loaded!', 'success');
      } catch (error) {
         console.error('Error loading project:', error);
         this.showToast('Error loading project', 'error');
      }
   }

   showAuthPrompt(action = 'save') {
      if (this.authPromptShown[action]) {
         this.renderInlineAuthNotice(action);
         return;
      }

      const authModal = document.getElementById('auth-modal');
      const description = authModal?.querySelector('[data-i18n="auth.description"]');
      const message = action === 'load'
         ? 'Sign in to load your saved dashboards from the cloud. We will show local drafts meanwhile.'
         : 'Sign in to sync your projects across devices. We will keep a local copy until you log in.';

      if (description) {
         description.textContent = message;
      }

      if (authModal && authModal.classList.contains('hidden')) {
         authModal.classList.remove('hidden');
         document.body.style.overflow = 'hidden';
      }

      this.renderInlineAuthNotice(action);
      this.authPromptShown[action] = true;
   }

   clearAuthNotice(action) {
      const container = this.getAuthNoticeContainer(action);
      const banner = container?.querySelector('[data-auth-banner="true"]');
      if (banner) {
         banner.remove();
      }
   }

   renderInlineAuthNotice(action) {
      const container = this.getAuthNoticeContainer(action);
      if (!container) return;

      let banner = container.querySelector('[data-auth-banner="true"]');
      const copy = action === 'load'
         ? 'Login required to sync cloud projects. Showing local drafts stored in this browser.'
         : 'Login required to sync saves with Supabase. We will store this project locally for now.';

      if (!banner) {
         banner = document.createElement('div');
         banner.dataset.authBanner = 'true';
         banner.className = 'mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 flex items-center gap-2';
         banner.innerHTML = '<i class="fas fa-lock text-amber-500"></i><span></span>';
         container.prepend(banner);
      }

      const textNode = banner.querySelector('span');
      if (textNode) {
         textNode.textContent = copy;
      }
   }

   getAuthNoticeContainer(action) {
      if (action === 'load') {
         return document.querySelector('#projects-modal .p-6') || document.getElementById('projects-modal');
      }
      return document.querySelector('#save-project-modal .space-y-4') || document.getElementById('save-project-modal');
   }

   showToast(message, type = 'info') {
      if (window.uiFeedback?.showToast) {
         window.uiFeedback.showToast(message, type);
      } else {
         console[type === 'error' ? 'error' : 'warn']('[toast]', message);
      }
   }
}

