import { supabase } from '../lib/supabaseClient.js';

class RealtimeService {
  subscribeToProjects(userId, callback) {
    const channel = supabase
      .channel(`projects:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${userId}` },
        (payload) => callback?.(payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // initial state fetch is up to consumer
        }
      });
    return () => { supabase.removeChannel(channel); };
  }

  subscribeToCollaboration(projectId, callback) {
    // Example realtime channel for collaboration (extend to presence)
    const channel = supabase
      .channel(`projects:collab:${projectId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
        (payload) => callback?.(payload)
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }
}

export const realtimeService = new RealtimeService();
