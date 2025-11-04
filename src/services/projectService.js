import { supabase } from '../lib/supabaseClient.js';

class ProjectService {
  async createProject(projectData) {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) throw new Error('Not authenticated');

    const payload = {
      user_id: user.id,
      title: projectData.title || 'Untitled',
      description: projectData.description || null,
      content: projectData.content || null,
      is_public: !!projectData.is_public,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async saveProject(projectId, htmlContent) {
    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .update({ content: htmlContent })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async exportProject(projectId, format = 'html') {
    // Placeholder: You can upload exports to Storage 'exports' bucket
    // Example approach:
    // 1) Fetch project content
    // 2) Convert to selected format (HTML/CSS/JS bundle, or PDF via server/worker)
    // 3) Upload to Storage and return signed URL
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    if (error) throw error;
    if (!project) throw new Error('Project not found');

    // For now, return raw content as a blob URL idea for client-side download.
    return { format, content: project.content };
  }

  async listMyProjects() {
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

export const projectService = new ProjectService();
