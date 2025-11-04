import { supabase } from '../lib/supabaseClient.js';

class UserService {
  async createUserProfile(userData = {}) {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) throw new Error('Not authenticated');

    const profile = {
      id: user.id,
      email: user.email,
      display_name: userData.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
      photo_url: userData.photo_url || user.user_metadata?.avatar_url || null,
    };

    const { error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
    if (error) throw error;

    const { error: setErr } = await supabase.from('user_settings').upsert({ user_id: user.id }, { onConflict: 'user_id' });
    if (setErr) throw setErr;

    return { id: user.id };
  }

  async updateUserPreferences(settings) {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) throw new Error('Not authenticated');
    const payload = { user_id: user.id, ...settings };
    const { error } = await supabase.from('user_settings').upsert(payload, { onConflict: 'user_id' });
    if (error) throw error;
    return true;
  }

  async getUserProjects() {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

export const userService = new UserService();
