
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { StudyTask, LinuxDistro, ProgrammingTopic } from '../types/StudyTask';
import { CheckCircle, Circle, Clock, ExternalLink, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nessuna sessione di studio ancora. Crea la tua prima sessione!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`transition-all ${
            task.type === 'linux'
              ? 'border-l-4 border-l-ubuntu-orange bg-ubuntu-light-orange/20'
              : 'border-l-4 border-l-js-yellow bg-js-light-yellow/20'
          } ${task.completed ? 'opacity-60' : ''}`}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className={
                      task.type === 'linux'
                        ? 'bg-ubuntu-orange text-white'
                        : 'bg-js-yellow text-gray-900'
                    }
                  >
                    {task.type === 'linux'
                      ? `🐧 ${(task.topic as LinuxDistro).name}`
                      : `{} ${(task.topic as ProgrammingTopic).language}`
                    }
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.duration} minuti
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleTask(task.id)}
                  className={task.completed ? '' : 'text-green-600 hover:text-green-700'}
                >
                  {task.completed ? <Circle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  {task.completed ? 'Riprendi' : 'Completa'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Dettagli */}
            <div className="border-t pt-3 space-y-3">
              {task.type === 'linux' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Package Manager:</span>{' '}
                    <code className="bg-muted px-1 rounded">
                      {(task.topic as LinuxDistro).packageManager}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold">Init System:</span>{' '}
                    <code className="bg-muted px-1 rounded">
                      {(task.topic as LinuxDistro).initSystem}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(task.topic as ProgrammingTopic).framework && (
                    <div className="text-sm">
                      <span className="font-semibold">Framework:</span>{' '}
                      <Badge variant="outline">
                        {(task.topic as ProgrammingTopic).framework}
                      </Badge>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-semibold">Concetti:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(task.topic as ProgrammingTopic).concepts.map((concept, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {task.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Risorse:</h4>
                  <div className="space-y-1">
                    {task.resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-3 h-3" />
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {resource}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Creato il {task.createdAt.toLocaleDateString()} alle {task.createdAt.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
