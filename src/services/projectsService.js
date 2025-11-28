/**
 * Projects Service - Manages user chart projects
 * Free users: max 3 projects
 * Pro users: unlimited projects
 */

import { supabase } from '../supabase-client.js';

const FREE_PROJECT_LIMIT = 3;

class ProjectsService {
  constructor() {
    this.currentUser = null;
    this.userPlan = 'free';
    this.projects = [];
    this.init();
  }

  async init() {
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      if (this.currentUser) {
        this.loadUserPlan();
      }
    });

    // Check current session
    const { data: { session } } = await supabase.auth.getSession();
    this.currentUser = session?.user || null;
    if (this.currentUser) {
      await this.loadUserPlan();
    }
  }

  async loadUserPlan() {
    if (!this.currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', this.currentUser.id)
        .single();
      
      if (!error && data) {
        this.userPlan = data.plan || 'free';
      }
    } catch (e) {
      console.error('[ProjectsService] Failed to load user plan:', e);
    }
  }

  isPro() {
    return this.userPlan === 'pro';
  }

  async canCreateProject() {
    if (!this.currentUser) return { allowed: false, reason: 'not_authenticated' };
    if (this.isPro()) return { allowed: true };
    
    const count = await this.getProjectCount();
    if (count >= FREE_PROJECT_LIMIT) {
      return { 
        allowed: false, 
        reason: 'limit_reached',
        limit: FREE_PROJECT_LIMIT,
        current: count
      };
    }
    return { allowed: true, remaining: FREE_PROJECT_LIMIT - count };
  }

  async getProjectCount() {
    if (!this.currentUser) return 0;
    
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.currentUser.id);
    
    return error ? 0 : count;
  }

  /**
   * Get all projects for current user
   */
  async getProjects() {
    if (!this.currentUser) return [];
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('[ProjectsService] Failed to load projects:', error);
      return [];
    }
    
    this.projects = data || [];
    return this.projects;
  }

  /**
   * Get single project by ID
   */
  async getProject(projectId) {
    if (!this.currentUser) return null;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', this.currentUser.id)
      .single();
    
    if (error) {
      console.error('[ProjectsService] Failed to load project:', error);
      return null;
    }
    
    return data;
  }

  /**
   * Create new project
   * @param {Object} project - { title, description, chartConfig, chartData, chartType }
   */
  async createProject(project) {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Check limit for free users
    const canCreate = await this.canCreateProject();
    if (!canCreate.allowed) {
      return { 
        success: false, 
        error: canCreate.reason === 'limit_reached' 
          ? `Free plan limit reached (${FREE_PROJECT_LIMIT} projects). Upgrade to Pro for unlimited projects.`
          : 'Cannot create project'
      };
    }
    
    const content = JSON.stringify({
      chartConfig: project.chartConfig || {},
      chartData: project.chartData || {},
      chartType: project.chartType || 'bar',
      prompt: project.prompt || ''
    });
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: this.currentUser.id,
        title: project.title || 'Untitled Chart',
        description: project.description || '',
        content: content,
        is_public: project.isPublic || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('[ProjectsService] Failed to create project:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, project: data };
  }

  /**
   * Update existing project
   */
  async updateProject(projectId, updates) {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const updateData = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
    
    if (updates.chartConfig || updates.chartData || updates.chartType || updates.prompt) {
      // Get existing content first
      const existing = await this.getProject(projectId);
      const existingContent = existing?.content ? JSON.parse(existing.content) : {};
      
      updateData.content = JSON.stringify({
        ...existingContent,
        chartConfig: updates.chartConfig || existingContent.chartConfig,
        chartData: updates.chartData || existingContent.chartData,
        chartType: updates.chartType || existingContent.chartType,
        prompt: updates.prompt || existingContent.prompt
      });
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', this.currentUser.id)
      .select()
      .single();
    
    if (error) {
      console.error('[ProjectsService] Failed to update project:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, project: data };
  }

  /**
   * Delete project
   */
  async deleteProject(projectId) {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', this.currentUser.id);
    
    if (error) {
      console.error('[ProjectsService] Failed to delete project:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  }

  /**
   * Duplicate project
   */
  async duplicateProject(projectId) {
    const original = await this.getProject(projectId);
    if (!original) {
      return { success: false, error: 'Project not found' };
    }
    
    return this.createProject({
      title: `${original.title} (Copy)`,
      description: original.description,
      ...JSON.parse(original.content || '{}')
    });
  }
}

// Export singleton
export const projectsService = new ProjectsService();
export default projectsService;
