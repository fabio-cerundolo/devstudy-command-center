
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { taskService } from '../services/TaskService';
import { StudyTask, LinuxDistro, ProgrammingTopic } from '../types/StudyTask';
import { Code2, Terminal } from 'lucide-react';

interface TaskFormProps {
  onTaskAdded: (task: StudyTask) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [taskType, setTaskType] = useState<'linux' | 'programming'>('linux');
  const [title, setTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<LinuxDistro | ProgrammingTopic | null>(null);
  const [duration, setDuration] = useState(30);
  const [resources, setResources] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedTopic) return;

    const newTask = taskService.addTask({
      title,
      type: taskType,
      topic: selectedTopic,
      duration,
      completed: false,
      resources: resources.split(',').map(r => r.trim()).filter(r => r)
    });

    onTaskAdded(newTask);
    
    // Reset form
    setTitle('');
    setSelectedTopic(null);
    setDuration(30);
    setResources('');
  };

  const topics = taskType === 'linux' ? taskService.linuxDistros : taskService.programmingTopics;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {taskType === 'linux' ? <Terminal className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
          Nuova Sessione di Studio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo di Studio */}
          <div>
            <Label>Tipo di Studio</Label>
            <div className="flex space-x-2 mt-2">
              <Button
                type="button"
                variant={taskType === 'linux' ? 'default' : 'outline'}
                onClick={() => {
                  setTaskType('linux');
                  setSelectedTopic(null);
                }}
                className={taskType === 'linux' ? 'bg-ubuntu-orange hover:bg-ubuntu-orange/90' : ''}
              >
                🐧 Linux Distro
              </Button>
              <Button
                type="button"
                variant={taskType === 'programming' ? 'default' : 'outline'}
                onClick={() => {
                  setTaskType('programming');
                  setSelectedTopic(null);
                }}
                className={taskType === 'programming' ? 'bg-js-yellow text-gray-900 hover:bg-js-yellow/90' : ''}
              >
                {} Programmazione
              </Button>
            </div>
          </div>

          {/* Titolo */}
          <div>
            <Label htmlFor="title">Titolo della Sessione</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Studiare i comandi base di Ubuntu"
              required
            />
          </div>

          {/* Argomento */}
          <div>
            <Label>Argomento</Label>
            <Select
              value={selectedTopic ? (selectedTopic as any).name || (selectedTopic as any).language : ''}
              onValueChange={(value) => {
                const topic = topics.find(t => (t as any).name === value || (t as any).language === value);
                setSelectedTopic(topic || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un argomento" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic, index) => (
                  <SelectItem
                    key={index}
                    value={(topic as any).name || (topic as any).language}
                  >
                    {(topic as any).name || (topic as any).language}
                    {taskType === 'programming' && (topic as ProgrammingTopic).framework && 
                      ` (${(topic as ProgrammingTopic).framework})`
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dettagli Argomento */}
          {selectedTopic && (
            <Card className="bg-muted">
              <CardContent className="pt-4">
                {taskType === 'linux' ? (
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {(selectedTopic as LinuxDistro).logo} {(selectedTopic as LinuxDistro).name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Package Manager: {(selectedTopic as LinuxDistro).packageManager}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Init System: {(selectedTopic as LinuxDistro).initSystem}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold" style={{ color: (selectedTopic as ProgrammingTopic).color }}>
                      {(selectedTopic as ProgrammingTopic).language}
                    </h4>
                    {(selectedTopic as ProgrammingTopic).framework && (
                      <p className="text-sm text-muted-foreground">
                        Framework: {(selectedTopic as ProgrammingTopic).framework}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(selectedTopic as ProgrammingTopic).concepts.map((concept, index) => (
                        <span
                          key={index}
                          className="bg-background px-2 py-1 rounded text-xs"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Durata */}
            <div>
              <Label htmlFor="duration">Durata (minuti)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={480}
              />
            </div>

            {/* Risorse */}
            <div>
              <Label htmlFor="resources">Risorse (separate da virgola)</Label>
              <Input
                id="resources"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="https://wiki.archlinux.org/..."
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!title || !selectedTopic}
          >
            Aggiungi Sessione
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
