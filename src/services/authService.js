import { supabase } from '../lib/supabaseClient.js';

class AuthService {
  async signInWithGoogle() {
    const redirectTo = `${window.location.origin}/auth-callback.html`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
    if (error) throw error;
  }

  async handleAuthCallback() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user || null;
    if (!user) return null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return { user, profile };
  }
}

export const authService = new AuthService();
