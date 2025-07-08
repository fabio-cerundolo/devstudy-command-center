
import React, { useState, useEffect } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { StudyStats } from '../components/StudyStats';
import { LinuxTerminal } from '../components/LinuxTerminal';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { taskService } from '../services/TaskService';
import { StudyTask } from '../types/StudyTask';
import { Card, CardContent } from '../components/ui/card';
import { Code, Terminal, BookOpen } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [stats, setStats] = useState(taskService.getStats());

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = taskService.getTasks();
    setTasks(loadedTasks);
    setStats(taskService.getStats());
  };

  const handleTaskAdded = (newTask: StudyTask) => {
    loadTasks();
  };

  const handleToggleTask = (id: string) => {
    taskService.toggleTask(id);
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    taskService.deleteTask(id);
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-ubuntu-orange" />
            <h1 className="text-4xl font-bold">
              <span className="text-ubuntu-orange">Dev</span>
              <span className="text-gray-800">Study</span>
              <span className="text-arch-blue">Tracker</span>
            </h1>
            <Code className="w-8 h-8 text-js-yellow" />
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Organizza il tuo studio di programmazione e Linux
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Sessioni strutturate</span>
            </div>
            <div className="flex items-center gap-1">
              <Terminal className="w-4 h-4" />
              <span>Terminale interattivo</span>
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span>Focus su DevOps</span>
            </div>
          </div>
        </header>

        {/* Task Form */}
        <TaskForm onTaskAdded={handleTaskAdded} />

        {/* Stats */}
        <StudyStats stats={stats} />

        {/* Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PomodoroTimer />
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Suggerimenti di Studio
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-ubuntu-light-orange rounded-lg">
                  <strong className="text-ubuntu-orange">Linux:</strong> Inizia con i comandi base, 
                  poi esplora package manager e servizi systemd.
                </div>
                <div className="p-3 bg-js-light-yellow rounded-lg">
                  <strong className="text-gray-900">Programmazione:</strong> Alterna teoria e pratica, 
                  costruisci progetti per consolidare i concetti.
                </div>
                <div className="p-3 bg-arch-light-blue rounded-lg">
                  <strong className="text-arch-blue">DevOps:</strong> Combina conoscenze Linux 
                  con scripting per automazione e deployment.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Linux Terminal */}
        <LinuxTerminal />

        {/* Task List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">Sessioni di Studio</h2>
            {tasks.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({tasks.filter(t => !t.completed).length} attive, {tasks.filter(t => t.completed).length} completate)
              </span>
            )}
          </div>
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Creato per sviluppatori che vogliono eccellere in Linux e programmazione
            <Terminal className="w-4 h-4" />
            <Code className="w-4 h-4" />
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
