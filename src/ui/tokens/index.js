const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
const buttonBase = `inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-sm font-medium transition-all disabled:opacity-50 ${focusRing}`;

export const tokenRegistry = {
  'button.primary': `${buttonBase} bg-blue-600 text-white shadow-sm hover:bg-blue-700`,
  'button.primary.block': `${buttonBase} w-full bg-blue-600 text-white shadow-sm hover:bg-blue-700`,
  'button.secondary': `${buttonBase} text-slate-600 hover:bg-slate-100`,
  'button.secondary.block': `${buttonBase} w-full bg-slate-100 text-slate-700 hover:bg-slate-200`,
  'button.icon': `inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all hover:bg-slate-100 ${focusRing}`,
  'button.google': `w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:ring-2 focus:ring-blue-500`,
  'surface.footer': 'bg-slate-900 text-slate-300',
  'footer.container': 'mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8',
  'footer.grid': 'grid grid-cols-1 gap-8 lg:grid-cols-4',
  'footer.brandRow': 'flex items-center gap-2.5',
  'footer.brandText': 'text-xl font-bold text-white',
  'footer.sectionTitle': 'text-sm font-semibold uppercase tracking-wide text-white',
  'footer.link': 'text-sm text-slate-400 transition-colors hover:text-white',
  'footer.bottomBar': 'mt-10 border-t border-slate-800 pt-8 text-center',
  'footer.meta': 'text-sm text-slate-400',
  'overlay.modal': 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4',
  'panel.modalAuth': 'bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 transition-all duration-200 ease-out translate-y-2 opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100',
  'button.modalClose': 'text-slate-400 hover:text-slate-600 transition',
  'text.modalTitle': 'text-xl font-semibold text-slate-900',
  'text.modalDescription': 'text-sm text-slate-500',
  'tooltip.base': 'pointer-events-none select-none rounded-xl bg-slate-900 px-3 py-1 text-xs font-medium text-slate-50 shadow-lg ring-1 ring-slate-950/5',
};

export const getTokenClasses = (tokenKey) => tokenRegistry[tokenKey] || '';
