
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

export interface StudyTask {
  id: string;
  title: string;
  type: 'linux' | 'programming';
  topic: LinuxDistro | ProgrammingTopic;
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
