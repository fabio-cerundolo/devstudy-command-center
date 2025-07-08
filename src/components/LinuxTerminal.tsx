
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Terminal as TerminalIcon } from 'lucide-react';
import { TerminalOutput } from '../types/StudyTask';

export const LinuxTerminal: React.FC = () => {
  const [outputs, setOutputs] = useState<TerminalOutput[]>([
    {
      command: 'welcome',
      result: 'Benvenuto nel Terminale Linux di Studio! Scrivi "help" per vedere i comandi disponibili.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentDistro, setCurrentDistro] = useState('ubuntu');
  const terminalRef = useRef<HTMLDivElement>(null);

  const commonCommands: Record<string, string> = {
    'help': `Comandi disponibili:
• distro-info - Mostra informazioni sulla distro corrente
• switch-distro [nome] - Cambia distro (ubuntu, arch, debian, fedora)
• package-manager - Mostra comandi del package manager
• practice - Genera un esercizio casuale
• history - Mostra cronologia comandi
• clear - Pulisce il terminale
• whoami - Mostra informazioni utente`,
    
    'distro-info': () => {
      const distros: Record<string, any> = {
        ubuntu: { name: 'Ubuntu 22.04 LTS', pkg: 'apt', init: 'systemd', family: 'Debian' },
        arch: { name: 'Arch Linux', pkg: 'pacman', init: 'systemd', family: 'Arch' },
        debian: { name: 'Debian 12', pkg: 'apt', init: 'systemd', family: 'Debian' },
        fedora: { name: 'Fedora 39', pkg: 'dnf', init: 'systemd', family: 'Red Hat' }
      };
      const info = distros[currentDistro];
      return `Distro: ${info.name}
Package Manager: ${info.pkg}
Init System: ${info.init}
Famiglia: ${info.family}`;
    },

    'package-manager': () => {
      const commands: Record<string, string[]> = {
        ubuntu: [
          'sudo apt update - Aggiorna lista pacchetti',
          'sudo apt upgrade - Aggiorna pacchetti installati',
          'sudo apt install [package] - Installa pacchetto',
          'sudo apt remove [package] - Rimuove pacchetto',
          'apt search [term] - Cerca pacchetti'
        ],
        arch: [
          'sudo pacman -Syu - Aggiorna sistema',
          'sudo pacman -S [package] - Installa pacchetto',
          'sudo pacman -R [package] - Rimuove pacchetto',
          'pacman -Ss [term] - Cerca pacchetti',
          'yay -S [package] - Installa da AUR'
        ],
        debian: [
          'sudo apt update - Aggiorna lista pacchetti',
          'sudo apt upgrade - Aggiorna pacchetti',
          'sudo apt install [package] - Installa pacchetto',
          'apt-cache search [term] - Cerca pacchetti'
        ],
        fedora: [
          'sudo dnf update - Aggiorna sistema',
          'sudo dnf install [package] - Installa pacchetto',
          'sudo dnf remove [package] - Rimuove pacchetto',
          'dnf search [term] - Cerca pacchetti'
        ]
      };
      return `Comandi ${currentDistro}:\n${commands[currentDistro].join('\n')}`;
    },

    'practice': () => {
      const exercises = [
        'Prova a navigare nelle directory con "cd", "ls" e "pwd"',
        'Cerca informazioni su un processo con "ps aux | grep [nome]"',
        'Monitora l\'uso della CPU con "top" o "htop"',
        'Controlla lo spazio disco con "df -h"',
        'Visualizza i file di log con "tail -f /var/log/syslog"',
        'Gestisci i servizi con "systemctl status [service]"',
        'Crea e modifica file con "nano" o "vim"',
        'Cambia permessi file con "chmod" e "chown"'
      ];
      return exercises[Math.floor(Math.random() * exercises.length)];
    },

    'history': () => {
      return outputs.slice(-10).map((output, index) => 
        `${index + 1}  ${output.command}`
      ).join('\n');
    },

    'clear': 'CLEAR',

    'whoami': 'studente-linux'
  };

  const executeCommand = () => {
    if (!currentCommand.trim()) return;

    const cmd = currentCommand.toLowerCase().trim();
    let result = '';

    if (cmd === 'clear') {
      setOutputs([]);
      setCurrentCommand('');
      return;
    }

    if (cmd.startsWith('switch-distro ')) {
      const newDistro = cmd.split(' ')[1];
      if (['ubuntu', 'arch', 'debian', 'fedora'].includes(newDistro)) {
        setCurrentDistro(newDistro);
        result = `Distro cambiata a ${newDistro}. Scrivi "distro-info" per dettagli.`;
      } else {
        result = 'Distro non supportata. Disponibili: ubuntu, arch, debian, fedora';
      }
    } else if (typeof commonCommands[cmd] === 'function') {
      result = (commonCommands[cmd] as Function)();
    } else if (commonCommands[cmd]) {
      result = commonCommands[cmd];
    } else {
      result = `Comando non riconosciuto: ${cmd}. Scrivi "help" per assistenza.`;
    }

    const newOutput: TerminalOutput = {
      command: currentCommand,
      result,
      timestamp: new Date()
    };

    setOutputs(prev => [...prev, newOutput]);
    setCurrentCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  const getDistroColor = () => {
    const colors: Record<string, string> = {
      ubuntu: 'text-ubuntu-orange',
      arch: 'text-arch-blue',
      debian: 'text-red-500',
      fedora: 'text-blue-600'
    };
    return colors[currentDistro] || 'text-green-400';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-5 h-5" />
            Terminale Linux - Ambiente di Studio
          </div>
          <Badge variant="outline" className={getDistroColor()}>
            {currentDistro}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-900 text-green-400 rounded-b-lg">
          {/* Header del terminale */}
          <div className="flex items-center px-4 py-2 bg-gray-800 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="ml-4 text-gray-300 text-sm">Terminal Linux</span>
          </div>

          {/* Output del terminale */}
          <div
            ref={terminalRef}
            className="p-4 h-64 overflow-auto font-mono text-sm space-y-2"
          >
            {outputs.map((output, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center">
                  <span className={`${getDistroColor()} font-bold`}>
                    studente@{currentDistro}:~$
                  </span>
                  <span className="ml-2 text-white">{output.command}</span>
                </div>
                <div className="text-gray-300 whitespace-pre-line pl-4">
                  {output.result}
                </div>
              </div>
            ))}

            {/* Input corrente */}
            <div className="flex items-center">
              <span className={`${getDistroColor()} font-bold`}>
                studente@{currentDistro}:~$
              </span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="ml-2 bg-transparent border-none text-white focus:outline-none focus:ring-0 p-0"
                placeholder="Inserisci comando..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
