const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';
const buttonBase = `inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-sm font-medium transition-all disabled:opacity-50 ${focusRing}`;

export const tokenRegistry = {
  'button.primary': `${buttonBase} bg-brand-primary text-brand-inverse shadow-sm hover:bg-brand-primary-dark`,
  'button.primary.block': `${buttonBase} w-full bg-brand-primary text-brand-inverse shadow-sm hover:bg-brand-primary-dark`,
  'button.secondary': `${buttonBase} text-brand-secondary hover:bg-brand-hover`,
  'button.secondary.block': `${buttonBase} w-full bg-brand-surface text-brand-primary hover:bg-brand-hover`,
  'button.icon': `inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-secondary transition-all hover:bg-brand-hover ${focusRing}`,
  'button.google': `w-full inline-flex items-center justify-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm font-medium text-brand-primary transition hover:bg-brand-hover focus:ring-2 focus:ring-brand`,
  'surface.footer': 'brand-surface-footer',
  'footer.container': 'mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8',
  'footer.grid': 'grid grid-cols-1 gap-8 lg:grid-cols-4',
  'footer.brandRow': 'flex items-center gap-2.5',
  'footer.brandText': 'text-xl font-bold brand-text-inverse',
  'footer.sectionTitle': 'text-sm font-semibold uppercase tracking-wide brand-text-inverse',
  'footer.link': 'text-sm brand-footer-link',
  'footer.bottomBar': 'mt-10 border-t brand-footer-bottom-bar pt-8 text-center',
  'footer.meta': 'text-sm brand-footer-meta',
  'overlay.modal': 'fixed inset-0 z-50 brand-overlay flex items-center justify-center p-4',
  'panel.modalAuth': 'brand-modal-panel rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 transition-all duration-200 ease-out translate-y-2 opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100',
  'button.modalClose': 'brand-button-muted transition',
  'text.modalTitle': 'text-xl font-semibold brand-text-primary',
  'text.modalDescription': 'text-sm brand-text-secondary',
  'tooltip.base': 'pointer-events-none select-none rounded-xl brand-tooltip px-3 py-1 text-xs font-medium shadow-lg ring-1 ring-brand-tooltip',
};

export const getTokenClasses = (tokenKey) => tokenRegistry[tokenKey] || '';
