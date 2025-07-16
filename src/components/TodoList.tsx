import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { TodoProject, TodoItem } from '../types/StudyTask';
import { todoService } from '../services/TodoService';
import { CheckSquare, Square, Plus, FileText, Upload, Trash2, Tag, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const TodoList = () => {
  const [projects, setProjects] = useState<TodoProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<TodoProject | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectType, setNewProjectType] = useState<'linux' | 'programming' | 'data-analysis' | ''>('');
  const [newTodoText, setNewTodoText] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const loadedProjects = todoService.getProjects();
    setProjects(loadedProjects);
    if (loadedProjects.length > 0 && !selectedProject) {
      setSelectedProject(loadedProjects[0]);
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject = todoService.createProject({
      name: newProjectName,
      description: newProjectDescription,
      items: [],
      studyType: newProjectType || undefined
    });
    
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectType('');
    setIsNewProjectDialogOpen(false);
    loadProjects();
    setSelectedProject(newProject);
    
    toast({
      title: "Progetto creato",
      description: `Il progetto "${newProject.name}" è stato creato con successo.`
    });
  };

  const handleImportMarkdown = () => {
    if (!markdownContent.trim() || !newProjectName.trim()) return;
    
    const newProject = todoService.importFromMarkdown(
      newProjectName,
      markdownContent,
      newProjectType || undefined
    );
    
    // Aggiungi i task dal markdown
    const lines = markdownContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const todoMatch = trimmed.match(/^[-*+]\s*\[([ x])\]\s*(.+)$/i);
      if (todoMatch) {
        const [, checkMark, text] = todoMatch;
        const completed = checkMark.toLowerCase() === 'x';
        
        todoService.addTodoItem(newProject.id, {
          text: text.replace(/!!!|!!|HIGH|URGENT|MEDIUM/gi, '').replace(/#\w+/g, '').trim(),
          completed,
          priority: text.includes('!!!') ? 'high' : text.includes('!!') ? 'medium' : 'low',
          tags: (text.match(/#\w+/g) || []).map(tag => tag.slice(1))
        });
      }
    }
    
    setMarkdownContent('');
    setNewProjectName('');
    setNewProjectType('');
    setIsImportDialogOpen(false);
    loadProjects();
    setSelectedProject(newProject);
    
    toast({
      title: "Import completato",
      description: `Il progetto "${newProject.name}" è stato importato dal markdown.`
    });
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim() || !selectedProject) return;
    
    todoService.addTodoItem(selectedProject.id, {
      text: newTodoText,
      completed: false,
      priority: 'medium',
      tags: []
    });
    
    setNewTodoText('');
    loadProjects();
    // Aggiorna il progetto selezionato
    const updatedProject = todoService.getProjects().find(p => p.id === selectedProject.id);
    if (updatedProject) setSelectedProject(updatedProject);
  };

  const handleToggleTodo = (itemId: string) => {
    if (!selectedProject) return;
    
    todoService.toggleTodoItem(selectedProject.id, itemId);
    loadProjects();
    // Aggiorna il progetto selezionato
    const updatedProject = todoService.getProjects().find(p => p.id === selectedProject.id);
    if (updatedProject) setSelectedProject(updatedProject);
  };

  const handleDeleteProject = (projectId: string) => {
    todoService.deleteProject(projectId);
    loadProjects();
    if (selectedProject?.id === projectId) {
      const remainingProjects = todoService.getProjects();
      setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
    }
    
    toast({
      title: "Progetto eliminato",
      description: "Il progetto è stato eliminato con successo."
    });
  };

  const getProjectTypeColor = (type?: string) => {
    switch (type) {
      case 'linux': return 'bg-ubuntu-orange text-white';
      case 'programming': return 'bg-js-yellow text-black';
      case 'data-analysis': return 'bg-purple-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            TodoList Progetti
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import MD
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importa da Markdown</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome progetto"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                  <Select value={newProjectType} onValueChange={(value) => setNewProjectType(value as typeof newProjectType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo di studio (opzionale)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linux">🐧 Linux</SelectItem>
                      <SelectItem value="programming">💻 Programmazione</SelectItem>
                      <SelectItem value="data-analysis">🤖 Data Analysis & AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Incolla il contenuto markdown qui...&#10;Esempio:&#10;- [ ] Task da fare&#10;- [x] Task completato&#10;- [ ] Task importante !!!"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    rows={8}
                  />
                  <Button onClick={handleImportMarkdown} className="w-full">
                    Importa Progetto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuovo Progetto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuovo Progetto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome progetto"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Descrizione (opzionale)"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                  <Select value={newProjectType} onValueChange={(value) => setNewProjectType(value as typeof newProjectType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo di studio (opzionale)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linux">🐧 Linux</SelectItem>
                      <SelectItem value="programming">💻 Programmazione</SelectItem>
                      <SelectItem value="data-analysis">🤖 Data Analysis & AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateProject} className="w-full">
                    Crea Progetto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista Progetti */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">PROGETTI</h3>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nessun progetto</p>
                <p className="text-xs">Crea un progetto o importa da markdown</p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject?.id === project.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {project.studyType && (
                          <Badge className={getProjectTypeColor(project.studyType)}>
                            {project.studyType}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {project.items.filter(i => i.completed).length}/{project.items.length}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dettagli Progetto e Todo */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  )}
                </div>

                {/* Aggiungi nuovo todo */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Aggiungi un nuovo task..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  />
                  <Button onClick={handleAddTodo}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Lista Todo */}
                <div className="space-y-2">
                  {selectedProject.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nessun task in questo progetto</p>
                    </div>
                  ) : (
                    selectedProject.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          item.completed ? 'opacity-60 bg-muted/30' : 'bg-background'
                        }`}
                      >
                        <button onClick={() => handleToggleTodo(item.id)}>
                          {item.completed ? (
                            <CheckSquare className="w-5 h-5 text-green-500" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <p className={`${item.completed ? 'line-through' : ''}`}>
                            {item.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => todoService.deleteTodoItem(selectedProject.id, item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Seleziona un progetto per vedere i task</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};