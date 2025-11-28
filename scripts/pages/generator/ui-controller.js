export class UIController {
   constructor(chartGenerator) {
      this.chartGenerator = chartGenerator;
      this.bindCoreUI();
      this.setupQuickPrompts();
      this.setupQuickActions();
      this.chartGenerator.selectChartType(this.chartGenerator.currentChartType);
   }

   bindCoreUI() {
      const generateBtn = document.getElementById('generate-chart');
      console.log('[UIController] bindCoreUI called, generateBtn:', generateBtn);
      if (generateBtn) {
         generateBtn.addEventListener('click', () => {
            console.log('[UIController] Generate button clicked');
            this.chartGenerator.generateChart();
         });
      } else {
         console.error('[UIController] Generate button #generate-chart not found!');
      }

      document.querySelectorAll('.chart-option').forEach(option => {
         const type = option.dataset.type;
         option.addEventListener('click', () => {
            this.chartGenerator.selectChartType(type);
         });
      });

      const refreshBtn = document.getElementById('refresh-preview');
      if (refreshBtn) {
         refreshBtn.addEventListener('click', () => this.chartGenerator.refreshPreview());
      }

      const fullscreenBtn = document.getElementById('fullscreen-preview');
      if (fullscreenBtn) {
         fullscreenBtn.addEventListener('click', () => this.chartGenerator.toggleFullscreen());
      }
   }

   setupQuickPrompts() {
      const promptInput = document.getElementById('prompt-input');
      document.querySelectorAll('#quick-prompts [data-prompt]').forEach(btn => {
         btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt || '';
            if (promptInput) {
               promptInput.value = prompt;
               promptInput.classList.remove('invalid', 'prompt-error-shake');
               promptInput.dispatchEvent(new Event('input'));
               promptInput.focus();
            }

            if (btn.dataset.type) {
               this.chartGenerator.selectChartType(btn.dataset.type);
            }

            this.chartGenerator.generateChart();
         });
      });
   }

   setupQuickActions() {
      document.querySelectorAll('[data-action]').forEach(btn => {
         btn.addEventListener('click', () => {
            const prompt = btn.dataset.prompt;
            if (prompt) {
               const promptInput = document.getElementById('prompt-input');
               if (promptInput) {
                  promptInput.value = prompt;
               }
            }

            if (btn.dataset.type) {
               this.chartGenerator.selectChartType(btn.dataset.type);
            }

            this.chartGenerator.generateChart();
         });
      });
   }
}

