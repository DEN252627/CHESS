import React, { useState } from 'react';
import { GameSettings } from './App';
import { PlayerColor } from './types';
import TimeControlSelector, { timeControls, TimeControl } from './components/TimeControlSelector';

interface GameSetupProps {
  onGameStart: (settings: GameSettings) => void;
}

// Define difficulty labels
const difficultyLabels: { [key: number]: string } = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
  const [gameMode, setGameMode] = useState<'pvp' | 'pve'>('pve');
  const [playerColor, setPlayerColor] = useState<PlayerColor>(PlayerColor.WHITE);
  const [botDifficulty, setBotDifficulty] = useState(2); // Default to Medium
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl>(timeControls[4]); // 5 | 3 default

  const handleStart = () => {
    onGameStart({
      gameMode,
      playerColor,
      botDifficulty,
      timeControl: selectedTimeControl,
    });
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
      <h1 className="text-4xl font-bold text-center text-amber-300 mb-8 tracking-widest">CHESS</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Game Mode</label>
        <div className="flex bg-slate-700 rounded-md p-1">
          <button
            onClick={() => setGameMode('pve')}
            className={`w-1/2 py-2 rounded ${gameMode === 'pve' ? 'bg-amber-600' : 'hover:bg-slate-600'} transition-colors`}
          >
            vs AI
          </button>
          <button
            onClick={() => setGameMode('pvp')}
            className={`w-1/2 py-2 rounded ${gameMode === 'pvp' ? 'bg-amber-600' : 'hover:bg-slate-600'} transition-colors`}
          >
            vs Player
          </button>
        </div>
      </div>

      {gameMode === 'pve' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Color</label>
            <div className="flex bg-slate-700 rounded-md p-1">
              <button
                onClick={() => setPlayerColor(PlayerColor.WHITE)}
                className={`w-1/2 py-2 rounded ${playerColor === PlayerColor.WHITE ? 'bg-amber-600' : 'hover:bg-slate-600'} transition-colors`}
              >
                White
              </button>
              <button
                onClick={() => setPlayerColor(PlayerColor.BLACK)}
                className={`w-1/2 py-2 rounded ${playerColor === PlayerColor.BLACK ? 'bg-amber-600' : 'hover:bg-slate-600'} transition-colors`}
              >
                Black
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">AI Level</label>
            <div className="flex bg-slate-700 rounded-md p-1">
                {Object.entries(difficultyLabels).map(([level, label]) => (
                    <button
                        key={level}
                        onClick={() => setBotDifficulty(parseInt(level))}
                        className={`w-1/3 py-2 rounded text-sm ${botDifficulty === parseInt(level) ? 'bg-amber-600' : 'hover:bg-slate-600'} transition-colors`}
                    >
                        {label}
                    </button>
                ))}
            </div>
          </div>
        </>
      )}

      <div className="mb-8">
        <TimeControlSelector selected={selectedTimeControl} onSelect={setSelectedTimeControl} />
      </div>

      <button
        onClick={handleStart}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
      >
        Start Game
      </button>
    </div>
  );
};

export default GameSetup;