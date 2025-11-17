class ComingSoonModal {
  constructor(options = {}) {
    this.options = {
      headline: 'Coming Soon',
      defaultMessage: 'We are putting the final touches on this experience. Check back soon!',
      ...options
    };

    this.modal = null;
    this.featureEl = null;
    this.messageEl = null;
    this.closeButtons = [];
    this.isOpen = false;
    this.boundTriggerHandler = this.handleTriggerClick.bind(this);
    this.boundEscapeHandler = this.handleEscape.bind(this);

    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup(), { once: true });
    } else {
      this.setup();
    }
  }

  setup() {
    this.buildModal();
    document.addEventListener('click', this.boundTriggerHandler);
    window.comingSoonModal = this;
  }

  buildModal() {
    if (this.modal) return;

    const existing = document.getElementById('coming-soon-modal');
    if (existing) {
      this.modal = existing;
    } else {
      const overlay = document.createElement('div');
      overlay.id = 'coming-soon-modal';
      overlay.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-slate-900/70 px-4 backdrop-blur-sm';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.innerHTML = `
        <div class="coming-soon-modal-card relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <button type="button" class="absolute right-6 top-6 text-slate-400 transition hover:text-slate-600" data-coming-soon-close aria-label="Close modal">
            <i class="fas fa-times"></i>
          </button>
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
            <i class="fas fa-rocket"></i>
          </div>
          <h2 class="text-2xl font-semibold text-slate-900" data-coming-soon-title>${this.options.headline}</h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-500" data-coming-soon-copy>${this.options.defaultMessage}</p>
          <div class="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500" data-coming-soon-feature>
            Next up: <span class="font-semibold text-slate-800">New drop</span>
          </div>
          <button type="button" class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" data-coming-soon-close>
            Close
          </button>
        </div>
      `;
      this.modal = overlay;
      document.body.appendChild(overlay);
    }

    this.messageEl = this.modal.querySelector('[data-coming-soon-copy]');
    this.featureEl = this.modal.querySelector('[data-coming-soon-feature] span');
    this.closeButtons = Array.from(this.modal.querySelectorAll('[data-coming-soon-close]'));

    this.closeButtons.forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });
  }

  handleTriggerClick(event) {
    const trigger = event.target.closest('[data-coming-soon]');
    if (!trigger) return;

    event.preventDefault();
    const feature = trigger.getAttribute('data-coming-soon')?.trim();
    const message = trigger.getAttribute('data-coming-soon-message')?.trim();
    this.open({ feature, message });
  }

  open({ feature, message } = {}) {
    if (!this.modal) return;

    const featureLabel = feature || 'This section';
    const copy = message || `We're finishing ${featureLabel.toLowerCase()}. You'll see it live very soon.`;

    if (this.messageEl) {
      this.messageEl.textContent = copy;
    }

    if (this.featureEl) {
      this.featureEl.textContent = featureLabel;
    }

    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    this.isOpen = true;
    document.addEventListener('keydown', this.boundEscapeHandler);
  }

  close() {
    if (!this.modal || !this.isOpen) return;
    this.modal.classList.add('hidden');
    this.modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    this.isOpen = false;
    document.removeEventListener('keydown', this.boundEscapeHandler);
  }

  handleEscape(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}

export { ComingSoonModal };
export default ComingSoonModal;
