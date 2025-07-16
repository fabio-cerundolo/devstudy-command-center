
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

export interface TerminalOutput {
  command: string;
  result: string;
  timestamp: Date;
}
