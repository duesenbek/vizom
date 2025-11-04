import { authService } from '../services/authService.js';

function createEl(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
}

async function renderAuthUI() {
  try {
    const mountTargets = [
      document.querySelector('header .max-w-7xl .flex.items-center.gap-4'),
      document.querySelector('header .max-w-7xl .flex.items-center'),
      document.querySelector('header .max-w-7xl'),
      document.querySelector('header')
    ];
    const mount = mountTargets.find(Boolean);
    if (!mount) return;

    const slot = createEl('div', { id: 'auth-slot', class: 'flex items-center gap-2' });

    const auth = await authService.getCurrentUser();
    if (!auth) {
      const btn = createEl('button', { class: 'btn btn-secondary', id: 'google-signin', text: 'Sign in' });
      btn.addEventListener('click', async () => {
        sessionStorage.setItem('vizom_post_login_redirect', location.pathname + location.search + location.hash);
        try { await authService.signInWithGoogle(); } catch (e) { console.error(e); alert('Sign-in failed'); }
      });
      slot.appendChild(btn);
    } else {
      const name = auth.profile?.display_name || auth.user?.email || 'Account';
      const hello = createEl('span', { class: 'text-sm text-slate-600', text: `Hello, ${name}` });
      const outBtn = createEl('button', { class: 'btn btn-ghost', id: 'signout', text: 'Sign out' });
      outBtn.addEventListener('click', async () => {
        try { await authService.signOut(); location.reload(); } catch (e) { console.error(e); }
      });
      slot.appendChild(hello);
      slot.appendChild(outBtn);
    }

    mount.appendChild(slot);
  } catch (e) {
    console.error('[auth-ui] render failed', e);
  }
}

document.addEventListener('DOMContentLoaded', renderAuthUI);
