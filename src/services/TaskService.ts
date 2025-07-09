
import { StudyTask, LinuxDistro, ProgrammingTopic, DataAnalysisTopic } from '../types/StudyTask';

class TaskService {
  private STORAGE_KEY = 'dev_study_tasks';
  
  // Predefiniti per velocizzare la creazione
  linuxDistros: LinuxDistro[] = [
    { name: 'Ubuntu', packageManager: 'APT', initSystem: 'systemd', logo: '🐧' },
    { name: 'Arch Linux', packageManager: 'pacman', initSystem: 'systemd', logo: '⚡' },
    { name: 'Fedora', packageManager: 'dnf', initSystem: 'systemd', logo: '🎩' },
    { name: 'Debian', packageManager: 'APT', initSystem: 'systemd', logo: '🌀' },
    { name: 'CentOS', packageManager: 'yum', initSystem: 'systemd', logo: '🏢' },
    { name: 'openSUSE', packageManager: 'zypper', initSystem: 'systemd', logo: '🦎' }
  ];
  
  programmingTopics: ProgrammingTopic[] = [
    { language: 'Python', framework: 'Django', concepts: ['OOP', 'Web Framework', 'REST API'], color: '#3776AB' },
    { language: 'JavaScript', framework: 'React', concepts: ['Components', 'Hooks', 'State Management'], color: '#F7DF1E' },
    { language: 'TypeScript', framework: 'Angular', concepts: ['Types', 'Decorators', 'RxJS'], color: '#3178C6' },
    { language: 'Rust', concepts: ['Ownership', 'Borrowing', 'Memory Safety'], color: '#CE422B' },
    { language: 'Go', concepts: ['Concurrency', 'Goroutines', 'Channels'], color: '#00ADD8' },
    { language: 'Java', framework: 'Spring', concepts: ['JVM', 'Dependency Injection', 'Enterprise'], color: '#ED8B00' }
  ];

  dataAnalysisTopics: DataAnalysisTopic[] = [
    { 
      name: 'Python per Data Science', 
      category: 'language', 
      technologies: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'], 
      aiIntegration: ['Scikit-learn', 'TensorFlow', 'PyTorch'], 
      color: '#3776AB' 
    },
    { 
      name: 'R Statistical Computing', 
      category: 'language', 
      technologies: ['ggplot2', 'dplyr', 'tidyr', 'Shiny'], 
      aiIntegration: ['caret', 'randomForest', 'nnet'], 
      color: '#276DC3' 
    },
    { 
      name: 'SQL & Database Analysis', 
      category: 'tool', 
      technologies: ['PostgreSQL', 'MySQL', 'BigQuery', 'Snowflake'], 
      aiIntegration: ['SQL AI assistants', 'Automated query optimization'], 
      color: '#336791' 
    },
    { 
      name: 'Machine Learning Frameworks', 
      category: 'ai-framework', 
      technologies: ['Jupyter', 'Google Colab', 'MLflow'], 
      aiIntegration: ['Scikit-learn', 'TensorFlow', 'Keras', 'XGBoost'], 
      color: '#FF6F00' 
    },
    { 
      name: 'Business Intelligence Tools', 
      category: 'tool', 
      technologies: ['Tableau', 'Power BI', 'Looker', 'Excel'], 
      aiIntegration: ['AI-powered insights', 'Automated reporting'], 
      color: '#E97627' 
    },
    { 
      name: 'Deep Learning & AI', 
      category: 'ai-framework', 
      technologies: ['Neural Networks', 'CNN', 'RNN', 'Transformers'], 
      aiIntegration: ['OpenAI API', 'Hugging Face', 'LangChain'], 
      color: '#FF4081' 
    }
  ];

  getTasks(): StudyTask[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    const tasks = JSON.parse(data);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  saveTasks(tasks: StudyTask[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  addTask(task: Omit<StudyTask, 'id' | 'createdAt'>): StudyTask {
    const newTask: StudyTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const tasks = this.getTasks();
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  toggleTask(id: string): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      this.saveTasks(tasks);
    }
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  getStats() {
    const tasks = this.getTasks();
    
    const linuxTasks = tasks.filter(t => t.type === 'linux');
    const programmingTasks = tasks.filter(t => t.type === 'programming');
    const dataAnalysisTasks = tasks.filter(t => t.type === 'data-analysis');
    
    const linuxTime = linuxTasks.reduce((acc, task) => acc + task.duration, 0);
    const programmingTime = programmingTasks.reduce((acc, task) => acc + task.duration, 0);
    const dataAnalysisTime = dataAnalysisTasks.reduce((acc, task) => acc + task.duration, 0);
    
    const studiedDistros = [...new Set(linuxTasks.map(t => (t.topic as LinuxDistro).name))];
    const studiedLanguages = [...new Set(programmingTasks.map(t => (t.topic as ProgrammingTopic).language))];
    const studiedDataTopics = [...new Set(dataAnalysisTasks.map(t => (t.topic as DataAnalysisTopic).name))];
    
    return {
      linuxTime,
      programmingTime,
      dataAnalysisTime,
      linuxTasksCount: linuxTasks.length,
      programmingTasksCount: programmingTasks.length,
      dataAnalysisTasksCount: dataAnalysisTasks.length,
      studiedDistros,
      studiedLanguages,
      studiedDataTopics,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length
    };
  }
}

export const taskService = new TaskService();
