import React from 'react';
import { PlayerColor, Piece } from './types';
import TimerDisplay from './components/TimerDisplay';
import CapturedPieces from './components/CapturedPieces';
import { pieceValues } from './chess-logic';

interface PlayerInfoProps {
  color: PlayerColor;
  timer: number;
  capturedPieces: Piece[];
  isActive: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ color, timer, capturedPieces, isActive }) => {
  const advantage = capturedPieces.reduce((sum, p) => sum + pieceValues[p.type], 0);

  return (
    <div className="w-full flex justify-between items-center p-2">
      <div className="flex items-center gap-3">
         <div className={`w-4 h-4 rounded-full ${color === PlayerColor.WHITE ? 'bg-white' : 'bg-slate-900 border-2 border-slate-400'}`}></div>
         <span className="font-bold text-lg text-white">{color === PlayerColor.WHITE ? 'White' : 'Black'}</span>
         <CapturedPieces pieces={capturedPieces} advantage={advantage} />
      </div>
      <TimerDisplay timeInMillis={timer} isActive={isActive} />
    </div>
  );
};

export default PlayerInfo;