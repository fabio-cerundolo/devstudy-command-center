import { TodoProject, TodoItem } from '../types/StudyTask';

class TodoService {
  private STORAGE_KEY = 'dev_study_todos';

  getProjects(): TodoProject[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    const projects = JSON.parse(data);
    return projects.map((project: any) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      items: project.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        dueDate: item.dueDate ? new Date(item.dueDate) : undefined
      }))
    }));
  }

  saveProjects(projects: TodoProject[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  createProject(project: Omit<TodoProject, 'id' | 'createdAt' | 'updatedAt'>): TodoProject {
    const newProject: TodoProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const projects = this.getProjects();
    projects.unshift(newProject);
    this.saveProjects(projects);
    
    return newProject;
  }

  updateProject(id: string, updates: Partial<TodoProject>): void {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.saveProjects(projects);
    }
  }

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  }

  addTodoItem(projectId: string, item: Omit<TodoItem, 'id' | 'createdAt'>): void {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      const newItem: TodoItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      projects[projectIndex].items.push(newItem);
      projects[projectIndex].updatedAt = new Date();
      this.saveProjects(projects);
    }
  }

  toggleTodoItem(projectId: string, itemId: string): void {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      const itemIndex = projects[projectIndex].items.findIndex(i => i.id === itemId);
      if (itemIndex !== -1) {
        projects[projectIndex].items[itemIndex].completed = !projects[projectIndex].items[itemIndex].completed;
        projects[projectIndex].updatedAt = new Date();
        this.saveProjects(projects);
      }
    }
  }

  deleteTodoItem(projectId: string, itemId: string): void {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      projects[projectIndex].items = projects[projectIndex].items.filter(i => i.id !== itemId);
      projects[projectIndex].updatedAt = new Date();
      this.saveProjects(projects);
    }
  }

  // Funzione per importare da markdown
  importFromMarkdown(projectName: string, markdownContent: string, studyType?: 'linux' | 'programming' | 'data-analysis'): TodoProject {
    const lines = markdownContent.split('\n');
    const items: Omit<TodoItem, 'id' | 'createdAt'>[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Riconosce liste markdown: - [ ] task o - [x] task
      const todoMatch = trimmed.match(/^[-*+]\s*\[([ x])\]\s*(.+)$/i);
      if (todoMatch) {
        const [, checkMark, text] = todoMatch;
        const completed = checkMark.toLowerCase() === 'x';
        
        // Estrae priorità e tag dal testo
        const priority = this.extractPriority(text);
        const tags = this.extractTags(text);
        const cleanText = this.cleanText(text);
        
        items.push({
          text: cleanText,
          completed,
          priority,
          tags
        });
      }
    }

    return this.createProject({
      name: projectName,
      description: `Progetto importato da markdown - ${items.length} task`,
      items: [],
      studyType
    });
  }

  private extractPriority(text: string): 'low' | 'medium' | 'high' {
    if (text.includes('!!!') || text.includes('HIGH') || text.includes('URGENT')) return 'high';
    if (text.includes('!!') || text.includes('MEDIUM')) return 'medium';
    return 'low';
  }

  private extractTags(text: string): string[] {
    const tagMatches = text.match(/#\w+/g);
    return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
  }

  private cleanText(text: string): string {
    return text
      .replace(/!!!|!!|HIGH|URGENT|MEDIUM/gi, '')
      .replace(/#\w+/g, '')
      .trim();
  }

  getStats() {
    const projects = this.getProjects();
    const totalItems = projects.reduce((acc, project) => acc + project.items.length, 0);
    const completedItems = projects.reduce((acc, project) => 
      acc + project.items.filter(item => item.completed).length, 0);
    
    const projectsByType = {
      linux: projects.filter(p => p.studyType === 'linux').length,
      programming: projects.filter(p => p.studyType === 'programming').length,
      'data-analysis': projects.filter(p => p.studyType === 'data-analysis').length,
      general: projects.filter(p => !p.studyType).length
    };

    return {
      totalProjects: projects.length,
      totalItems,
      completedItems,
      projectsByType,
      completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  }
}

export const todoService = new TodoService();