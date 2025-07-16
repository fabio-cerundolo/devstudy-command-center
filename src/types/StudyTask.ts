
export interface LinuxDistro {
  name: string;
  packageManager: string;
  initSystem: string;
  logo: string;
}

export interface ProgrammingTopic {
  language: string;
  framework?: string;
  concepts: string[];
  color: string;
}

export interface DataAnalysisTopic {
  name: string;
  category: 'language' | 'library' | 'tool' | 'ai-framework';
  technologies: string[];
  aiIntegration: string[];
  color: string;
}

export interface StudyTask {
  id: string;
  title: string;
  type: 'linux' | 'programming' | 'data-analysis';
  topic: LinuxDistro | ProgrammingTopic | DataAnalysisTopic;
  duration: number;
  completed: boolean;
  resources: string[];
  createdAt: Date;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
}

export interface TodoProject {
  id: string;
  name: string;
  description: string;
  items: TodoItem[];
  studyType?: 'linux' | 'programming' | 'data-analysis';
  relatedTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TerminalOutput {
  command: string;
  result: string;
  timestamp: Date;
}
