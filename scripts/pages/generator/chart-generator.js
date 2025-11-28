import { supabase } from '../../../src/supabase-client.js';
import { trackEvent } from '../../../src/tracking/analytics.stub.js';
import { AIRecommendations } from '../../../src/components/AIRecommendations.js';
import { progressLoading } from '../../../src/components/ProgressLoadingManager.js';
import { simpleParse } from '../../../src/utils/simple-parser.js';

const noop = () => {};

export class ChartGenerator {
   constructor() {
      this.currentChart = null;
      this.currentChartType = 'bar';
      this.currentLibrary = 'auto';
      this.profileSubscription = 'anon';
      this.isPro = false;
      this.lastChartPayload = null;

      this.ensureDependencies();
      this.aiRecommendations = new AIRecommendations(this);
      this.setupProjectActions();
   }

   ensureDependencies() {
      if (!window.chartTypes) {
         window.chartTypes = {
            generateSampleData(type) {
               const labels = ['A', 'B', 'C', 'D'];
               const data = [12, 19, 3, 5];
               return {
                  labels,
                  datasets: [{
                     label: 'Series',
                     data
                  }]
               };
            }
         };
      }

      this.chartTypes = window.chartTypes;
   }

   async initializeSubscription() {
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) {
            this.profileSubscription = 'anon';
            this.isPro = false;
            return;
         }
         const { data, error } = await supabase
            .from('profiles')
            .select('subscription')
            .eq('id', user.id)
            .single();
         if (!error && data?.subscription) {
            this.profileSubscription = data.subscription;
            this.isPro = String(data.subscription).toLowerCase() === 'pro';
         } else {
            this.profileSubscription = 'free';
            this.isPro = false;
         }
      } catch (e) {
         this.profileSubscription = 'anon';
         this.isPro = false;
      }
   }

   selectChartType(type) {
      if (!type) return;
      this.currentChartType = type;
      const options = document.querySelectorAll('.chart-option');
      options.forEach(option => {
         const isActive = option.dataset.type === type;
         option.setAttribute('aria-pressed', String(isActive));
         option.classList.toggle('selected', isActive);
         option.classList.toggle('border-slate-200', !isActive);
      });
      try { trackEvent('chart_type_selected', { chartType: type }); } catch {}
   }

   async generateChart() {
      console.log('[ChartGenerator] generateChart called');
      const promptInput = document.getElementById('prompt-input');
      const prompt = promptInput?.value?.trim() || '';
      console.log('[ChartGenerator] prompt:', prompt);

      if (!prompt) {
         console.log('[ChartGenerator] No prompt, highlighting input');
         this.highlightPromptInput();
         return;
      }

      this.clearError();

      try {
         console.log('[ChartGenerator] Parsing prompt...');
         const parsed = simpleParse(prompt);
         console.log('[ChartGenerator] Parsed result:', parsed);
         if (!parsed?.labels?.length || !parsed?.data?.length) {
            throw new Error('Could not parse data from your prompt.');
         }

         const chartConfig = {
            type: this.currentChartType,
            data: {
               labels: parsed.labels,
               datasets: [{
                  label: 'Series',
                  data: parsed.data
               }]
            },
            options: {
               responsive: true,
               maintainAspectRatio: false
            }
         };

         this.renderChart(chartConfig);
         this.lastChartPayload = { prompt, chartType: this.currentChartType, config: chartConfig };
      } catch (error) {
         this.handleError(error);
      }
   }

   renderChart(config) {
      const container = document.getElementById('chart-container');
      if (!container) return;

      container.innerHTML = '';

      if (!config || !config.type) {
         const div = document.createElement('div');
         div.className = 'text-slate-600';
         div.textContent = 'No chart configuration returned.';
         container.appendChild(div);
         return;
      }

      const canvas = document.createElement('canvas');
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
         const div = document.createElement('div');
         div.className = 'text-slate-600';
         div.textContent = 'Canvas is not supported in this environment.';
         container.innerHTML = '';
         container.appendChild(div);
         return;
      }

      const ChartRef = (typeof Chart !== 'undefined') ? Chart : (typeof window !== 'undefined' ? window.Chart : undefined);
      if (!ChartRef) {
         const div = document.createElement('div');
         div.className = 'text-slate-600';
         div.textContent = 'Chart library is still loading. Please wait a moment and try again.';
         container.innerHTML = '';
         container.appendChild(div);
         return;
      }

      if (this.currentChart && this.currentChart.destroy) {
         try { this.currentChart.destroy(); } catch {}
      }

      this.currentChart = new ChartRef(ctx, config);
   }

   refreshPreview() {
      if (this.lastChartPayload?.config) {
         this.renderChart(this.lastChartPayload.config);
      }
   }

   toggleFullscreen() {
      const container = document.getElementById('chart-container');
      if (!container) return;
      if (!document.fullscreenElement) {
         container.requestFullscreen().catch(noop);
      } else {
         document.exitFullscreen().catch(noop);
      }
   }

   clearError() {
      const errorEl = document.getElementById('generation-error');
      if (errorEl) {
         errorEl.textContent = '';
         errorEl.classList.add('hidden');
      }
   }

   handleError(error) {
      const errorEl = document.getElementById('generation-error');
      if (errorEl) {
         errorEl.textContent = error?.message || 'Failed to generate chart.';
         errorEl.classList.remove('hidden');
      }
   }

   highlightPromptInput() {
      const promptInput = document.getElementById('prompt-input');
      if (!promptInput) return;
      promptInput.classList.add('prompt-error-shake');
      setTimeout(() => promptInput.classList.remove('prompt-error-shake'), 400);
      promptInput.focus();
   }

   openModal(modal) {
      if (modal) modal.classList.remove('hidden');
   }

   closeModal(modal) {
      if (modal) modal.classList.add('hidden');
   }

   setupProjectActions() {
      const setup = () => {
         const saveBtn = document.getElementById('save-project');
         const loadBtn = document.getElementById('load-projects');
         const saveModal = document.getElementById('save-project-modal');
         const projectsModal = document.getElementById('projects-modal');

         if (saveBtn) {
            saveBtn.addEventListener('click', () => {
               if (!this.lastChartPayload) {
                  this.highlightPromptInput();
                  return;
               }
               this.openModal(saveModal);
            });
         }

         if (loadBtn) {
            loadBtn.addEventListener('click', () => {
               this.openModal(projectsModal);
            });
         }

         document.getElementById('close-save-modal')?.addEventListener('click', () => this.closeModal(saveModal));
         document.getElementById('close-projects-modal')?.addEventListener('click', () => this.closeModal(projectsModal));

         saveModal?.addEventListener('click', (e) => {
            if (e.target === saveModal) this.closeModal(saveModal);
         });

         projectsModal?.addEventListener('click', (e) => {
            if (e.target === projectsModal) this.closeModal(projectsModal);
         });
      };

      // Run setup now if DOM is ready, otherwise wait for DOMContentLoaded
      if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', setup);
      } else {
         setup();
      }
   }
}

