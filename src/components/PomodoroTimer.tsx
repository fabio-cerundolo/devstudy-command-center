
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finito
      setIsActive(false);
      if (isBreak) {
        // Fine pausa, torna al lavoro
        setIsBreak(false);
        setMinutes(25);
        setTotalMinutes(25);
      } else {
        // Fine lavoro, inizia pausa
        setIsBreak(true);
        setMinutes(5);
        setTotalMinutes(5);
      }
      setSeconds(0);
      
      // Notifica (se supportata)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(isBreak ? 'Pausa finita! Torna al lavoro.' : 'Tempo scaduto! Prenditi una pausa.');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // Richiedi permesso notifiche
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setMinutes(5);
      setTotalMinutes(5);
    } else {
      setMinutes(25);
      setTotalMinutes(25);
    }
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    if (isBreak) {
      setMinutes(25);
      setTotalMinutes(25);
    } else {
      setMinutes(5);
      setTotalMinutes(5);
    }
    setSeconds(0);
  };

  const progress = ((totalMinutes * 60 - minutes * 60 - seconds) / (totalMinutes * 60)) * 100;

  return (
    <Card className={`${isBreak ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-red-500'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isBreak ? <Coffee className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          Timer Pomodoro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${isBreak ? 'text-orange-500' : 'text-red-500'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isBreak ? 'Pausa' : 'Sessione di Studio'}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="flex justify-center space-x-2">
          <Button onClick={toggleTimer} variant={isActive ? 'destructive' : 'default'}>
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pausa' : 'Avvia'}
          </Button>
          
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <Button onClick={switchMode} variant="outline">
            {isBreak ? 'Lavoro' : 'Pausa'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Lavoro: 25 min • Pausa: 5 min</p>
        </div>
      </CardContent>
    </Card>
  );
};
