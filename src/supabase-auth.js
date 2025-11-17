import { supabase } from './supabase-client.js';
import { ensureAuthModal } from './components/auth-modal-loader.js';

class AuthService {
  constructor() {
    this.authModal = null;
    this.authBtn = null;
    this.authText = null;
    this.mobileAuthBtn = null;
    this.googleSigninBtn = null;
    this.closeAuthModalBtn = null;
    this.headerSignInBtn = null;
    this.headerGetStartedBtn = null;
    this.headerSignOutBtn = null;
    this.mobileSignInBtn = null;
    this.mobileGetStartedBtn = null;
    this.signInTriggerNodes = [];
    this.readyPromise = this.init();
  }

  async init() {
    try {
      await ensureAuthModal();
    } catch (error) {
      console.error('[AuthService] Failed to inject auth modal', error);
    }

    this.cacheModalElements();
    this.cacheTriggerButtons();
    this.setupEventListeners();
    await this.checkAuthState();

    supabase.auth.onAuthStateChange((event, session) => {
      this.updateAuthUI(session?.user || null);
    });
  }

  cacheModalElements() {
    this.authModal = document.getElementById('auth-modal');
    this.googleSigninBtn = document.getElementById('google-signin');
    this.closeAuthModalBtn = document.getElementById('close-auth-modal');
  }

  cacheTriggerButtons() {
    this.headerSignInBtn = document.getElementById('sign-in-btn') || document.getElementById('auth-signin');
    this.headerGetStartedBtn = document.getElementById('get-started-btn') || document.getElementById('auth-getstarted');
    this.headerSignOutBtn = document.getElementById('sign-out-btn');
    this.mobileSignInBtn = document.getElementById('mobile-sign-in-btn') || document.getElementById('auth-signin-mobile');
    this.mobileGetStartedBtn = document.getElementById('mobile-get-started-btn');
    this.signInTriggerNodes = document.querySelectorAll('[data-auth-action="signin"]');
  }

  setupEventListeners() {
    const openHandlers = [
      this.headerSignInBtn,
      this.headerGetStartedBtn,
      this.mobileSignInBtn,
      this.mobileGetStartedBtn,
      ...Array.from(document.querySelectorAll('[data-action="get-started"]')),
      ...Array.from(this.signInTriggerNodes || [])
    ].filter(Boolean);

    [...new Set(openHandlers)].forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.showAuthModal();
      });
    });

    if (this.headerSignOutBtn) {
      this.headerSignOutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.signOut();
      });
    }

    if (this.googleSigninBtn) {
      this.googleSigninBtn.addEventListener('click', () => {
        this.signInWithGoogle();
      });
    }

    if (this.closeAuthModalBtn) {
      this.closeAuthModalBtn.addEventListener('click', () => {
        this.hideAuthModal();
      });
    }

    if (this.authModal) {
      this.authModal.addEventListener('click', (e) => {
        if (e.target === this.authModal) {
          this.hideAuthModal();
        }
      });
    }

    document.addEventListener('auth:signIn', () => this.showAuthModal());
    document.addEventListener('auth:getStarted', () => this.showAuthModal());
    document.addEventListener('auth:signOut', () => this.signOut());
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        alert('Ошибка входа через Google. Попробуйте еще раз.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Произошла ошибка. Попробуйте еще раз.');
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      this.updateAuthUI(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }

  async checkAuthState() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error) {
        this.updateAuthUI(user);
      }
    } catch (err) {
      console.error('Error checking auth state:', err);
    }
  }

  updateAuthUI(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        avatar: user.user_metadata?.avatar_url || null
      }));
    } else {
      localStorage.removeItem('user');
    }

    if (window.unifiedHeader) {
      if (user) {
        window.unifiedHeader.setUserInfo({
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
          avatar: user.user_metadata?.avatar_url || null
        });
        window.unifiedHeader.isUserLoggedIn = true;
      } else {
        window.unifiedHeader.signOut();
        window.unifiedHeader.isUserLoggedIn = false;
      }
      window.unifiedHeader.updateAuthUI();
    }

    if (this.headerSignInBtn && this.headerGetStartedBtn) {
      if (user) {
        this.headerSignInBtn.classList.add('hidden');
        this.headerGetStartedBtn.classList.add('hidden');
      } else {
        this.headerSignInBtn.classList.remove('hidden');
        this.headerGetStartedBtn.classList.remove('hidden');
      }
    }

    if (this.headerSignOutBtn) {
      this.headerSignOutBtn.classList.toggle('hidden', !user);
    }

    if (this.mobileSignInBtn && this.mobileGetStartedBtn) {
      const isAuth = !!user;
      this.mobileSignInBtn.textContent = isAuth ? 'Sign Out' : 'Sign In';
      this.mobileGetStartedBtn.classList.toggle('hidden', isAuth);
      if (isAuth) {
        this.mobileSignInBtn.onclick = (event) => {
          event.preventDefault();
          this.signOut();
        };
      } else {
        this.mobileSignInBtn.onclick = (event) => {
          event.preventDefault();
          this.showAuthModal();
        };
      }
    }
  }

  showAuthModal() {
    ensureAuthModal()
      .then(() => {
        this.cacheModalElements();
        if (this.authModal) {
          this.authModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      })
      .catch((error) => {
        console.error('[AuthService] Unable to show auth modal', error);
      });
  }

  hideAuthModal() {
    if (this.authModal) {
      this.authModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  getCurrentUser() {
    return supabase.auth.getUser();
  }

  async isAuthenticated() {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }
}

// Initialize auth service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthService();
});

export { AuthService };
