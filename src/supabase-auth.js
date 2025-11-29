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
    this.isModalOpen = false;
    this.modalHideTimer = null;
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
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

  handleEscapeKey(event) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.hideAuthModal();
    }
  }

  async signInWithGoogle() {
    try {
      // Store current page for redirect after auth
      const currentPath = window.location.pathname;
      sessionStorage.setItem('vizom_post_login_redirect', currentPath);
      
      console.log('[AuthService] Starting Google sign-in...');
      console.log('[AuthService] Redirect URL:', `${window.location.origin}/auth-callback.html`);
      
      // Show loading state on button
      if (this.googleSigninBtn) {
        this.googleSigninBtn.disabled = true;
        this.googleSigninBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Connecting...';
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback.html`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('[AuthService] Google sign-in error:', error);
        
        // Reset button
        if (this.googleSigninBtn) {
          this.googleSigninBtn.disabled = false;
          this.googleSigninBtn.innerHTML = '<i class="fab fa-google mr-2"></i> Continue with Google';
        }
        
        // Show error
        alert('Google sign-in failed: ' + error.message);
        if (window.uiFeedback?.showToast) {
          window.uiFeedback.showToast('Google sign-in failed. Please try again.', 'error');
        }
      } else {
        console.log('[AuthService] OAuth initiated, redirecting to Google...');
      }
    } catch (err) {
      console.error('[AuthService] Unexpected error:', err);
      
      // Reset button
      if (this.googleSigninBtn) {
        this.googleSigninBtn.disabled = false;
        this.googleSigninBtn.innerHTML = '<i class="fab fa-google mr-2"></i> Continue with Google';
      }
      
      alert('An error occurred: ' + err.message);
      if (window.uiFeedback?.showToast) {
        window.uiFeedback.showToast('An error occurred. Please try again.', 'error');
      }
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
      console.log('[AuthService] Checking auth state...');
      
      // First try to get session (includes token refresh)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[AuthService] Session error:', sessionError);
      }
      
      if (session?.user) {
        console.log('[AuthService] Found session for:', session.user.email);
        this.updateAuthUI(session.user);
        return;
      }
      
      // Fallback to getUser
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        console.log('[AuthService] Found user:', user.email);
        this.updateAuthUI(user);
      } else {
        console.log('[AuthService] No user found');
        this.updateAuthUI(null);
      }
    } catch (err) {
      console.error('[AuthService] Error checking auth state:', err);
      this.updateAuthUI(null);
    }
  }

  updateAuthUI(user) {
    const isSignedIn = !!user;
    const userData = user ? {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar: user.user_metadata?.avatar_url || null
    } : null;

    // Store user data in localStorage
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('[AuthService] User signed in:', userData.email);
    } else {
      localStorage.removeItem('user');
      console.log('[AuthService] User signed out');
    }

    // Update UnifiedHeader if available
    if (window.unifiedHeader) {
      if (isSignedIn) {
        window.unifiedHeader.setUserInfo(userData);
        window.unifiedHeader.isUserLoggedIn = true;
      } else {
        window.unifiedHeader.isUserLoggedIn = false;
      }
      window.unifiedHeader.updateAuthUI();
    }

    // Update static HTML auth buttons (index.html, generator.html, etc.)
    this.updateStaticAuthButtons(isSignedIn, userData);

    // Update mobile auth buttons
    this.updateMobileAuthButtons(isSignedIn);

    // Dispatch auth state change event for other components
    document.dispatchEvent(new CustomEvent('auth:stateChanged', {
      detail: { isSignedIn, user: userData }
    }));

    // Hide auth modal if open
    if (isSignedIn) {
      this.hideAuthModal();
    }
  }

  updateStaticAuthButtons(isSignedIn, userData) {
    // Get all possible auth button selectors
    const signInBtns = document.querySelectorAll('#auth-signin, #sign-in-btn, [data-auth="signin"]');
    const getStartedBtns = document.querySelectorAll('[data-action="get-started"], #get-started-btn, #auth-getstarted');
    const signOutBtns = document.querySelectorAll('#sign-out-btn, [data-auth="signout"]');
    const authSections = document.querySelectorAll('#auth-section, .auth-section');
    const userDropdowns = document.querySelectorAll('#user-dropdown, .user-dropdown');

    if (isSignedIn) {
      // Hide sign in buttons
      signInBtns.forEach(btn => btn.classList.add('hidden'));
      getStartedBtns.forEach(btn => btn.classList.add('hidden'));
      authSections.forEach(section => section.classList.add('hidden'));
      
      // Show user dropdown and sign out
      userDropdowns.forEach(dropdown => dropdown.classList.remove('hidden'));
      signOutBtns.forEach(btn => btn.classList.remove('hidden'));

      // Update user info display
      if (userData) {
        const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        document.querySelectorAll('#user-initials').forEach(el => el.textContent = initials);
        document.querySelectorAll('#user-name').forEach(el => el.textContent = userData.name);
        document.querySelectorAll('#user-email').forEach(el => el.textContent = userData.email);
        
        // Update avatar if available
        if (userData.avatar) {
          document.querySelectorAll('#user-avatar-img').forEach(img => {
            img.src = userData.avatar;
            img.classList.remove('hidden');
          });
        }
      }
    } else {
      // Show sign in buttons
      signInBtns.forEach(btn => btn.classList.remove('hidden'));
      getStartedBtns.forEach(btn => btn.classList.remove('hidden'));
      authSections.forEach(section => section.classList.remove('hidden'));
      
      // Hide user dropdown and sign out
      userDropdowns.forEach(dropdown => dropdown.classList.add('hidden'));
      signOutBtns.forEach(btn => btn.classList.add('hidden'));
    }
  }

  updateMobileAuthButtons(isSignedIn) {
    const mobileSignIn = document.querySelectorAll('#auth-signin-mobile, #mobile-sign-in-btn');
    const mobileGetStarted = document.querySelectorAll('#mobile-get-started-btn');
    const mobileAuthSection = document.querySelectorAll('#mobile-auth-buttons, .mobile-auth-buttons');
    const mobileUserSection = document.querySelectorAll('#mobile-user-section, .mobile-user-section');

    mobileSignIn.forEach(btn => {
      if (isSignedIn) {
        btn.textContent = 'Sign Out';
        btn.onclick = (e) => {
          e.preventDefault();
          this.signOut();
        };
      } else {
        btn.textContent = 'Sign In';
        btn.onclick = (e) => {
          e.preventDefault();
          this.showAuthModal();
        };
      }
    });

    mobileGetStarted.forEach(btn => {
      btn.classList.toggle('hidden', isSignedIn);
    });

    mobileAuthSection.forEach(section => {
      section.classList.toggle('hidden', isSignedIn);
    });

    mobileUserSection.forEach(section => {
      section.classList.toggle('hidden', !isSignedIn);
    });
  }

  showAuthModal() {
    ensureAuthModal()
      .then(() => {
        this.cacheModalElements();
        if (!this.authModal) return;
        const modalBody = this.authModal.querySelector('[data-modal-body]');
        if (this.modalHideTimer) {
          clearTimeout(this.modalHideTimer);
          this.modalHideTimer = null;
        }
        this.authModal.classList.remove('hidden');
        this.authModal.dataset.state = 'open';
        this.authModal.setAttribute('aria-hidden', 'false');
        modalBody?.setAttribute('data-state', 'open');
        document.body.style.overflow = 'hidden';
        this.isModalOpen = true;
        document.addEventListener('keydown', this.handleEscapeKey);
      })
      .catch((error) => {
        console.error('[AuthService] Unable to show auth modal', error);
      });
  }

  hideAuthModal() {
    if (!this.authModal) return;
    const modalBody = this.authModal.querySelector('[data-modal-body]');
    modalBody?.setAttribute('data-state', 'closed');
    this.authModal.dataset.state = 'closed';
    this.authModal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', this.handleEscapeKey);
    document.body.style.overflow = '';
    this.isModalOpen = false;
    if (this.modalHideTimer) {
      clearTimeout(this.modalHideTimer);
    }
    this.modalHideTimer = setTimeout(() => {
      this.authModal?.classList.add('hidden');
      this.modalHideTimer = null;
    }, 220);
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
let authServiceInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!supabase) {
    console.warn('[AuthService] Supabase client unavailable; authentication disabled.');
    return;
  }
  authServiceInstance = new AuthService();
  window.authService = authServiceInstance;
});

// Export for module usage
export { AuthService };
export const getAuthService = () => authServiceInstance;
