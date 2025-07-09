
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Code2, Terminal, CheckCircle, BookOpen, BarChart3 } from 'lucide-react';

interface StudyStatsProps {
  stats: {
    linuxTime: number;
    programmingTime: number;
    dataAnalysisTime: number;
    linuxTasksCount: number;
    programmingTasksCount: number;
    dataAnalysisTasksCount: number;
    studiedDistros: string[];
    studiedLanguages: string[];
    studiedDataTopics: string[];
    totalTasks: number;
    completedTasks: number;
  };
}

export const StudyStats: React.FC<StudyStatsProps> = ({ stats }) => {
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const totalTime = stats.linuxTime + stats.programmingTime + stats.dataAnalysisTime;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Tempo Linux */}
      <Card className="border-l-4 border-l-ubuntu-orange">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Terminal className="w-4 h-4 text-ubuntu-orange" />
            Tempo Linux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ubuntu-orange">
            {formatTime(stats.linuxTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.linuxTasksCount} sessioni
          </p>
        </CardContent>
      </Card>

      {/* Tempo Programmazione */}
      <Card className="border-l-4 border-l-js-yellow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Code2 className="w-4 h-4 text-js-yellow" />
            Programmazione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: '#F7DF1E' }}>
            {formatTime(stats.programmingTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.programmingTasksCount} sessioni
          </p>
        </CardContent>
      </Card>

      {/* Tempo Totale */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            Tempo Totale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {formatTime(totalTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.totalTasks} sessioni totali
          </p>
        </CardContent>
      </Card>

      {/* Tempo Data Analysis */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            Data Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {formatTime(stats.dataAnalysisTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.dataAnalysisTasksCount} sessioni
          </p>
        </CardContent>
      </Card>

      {/* Tasso di Completamento */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Completamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {completionRate}%
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.completedTasks}/{stats.totalTasks} completate
          </p>
        </CardContent>
      </Card>

      {/* Distro Studiate */}
      {stats.studiedDistros.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Terminal className="w-4 h-4" />
              Distro Linux Studiate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.studiedDistros.map((distro, index) => (
                <Badge key={index} className="bg-arch-blue text-white">
                  {distro}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linguaggi Studiati */}
      {stats.studiedLanguages.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Code2 className="w-4 h-4" />
              Linguaggi Praticati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.studiedLanguages.map((language, index) => (
                <Badge key={index} className="bg-python-blue text-white">
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Argomenti Data Analysis */}
      {stats.studiedDataTopics.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              Argomenti Data Analysis & AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.studiedDataTopics.map((topic, index) => (
                <Badge key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
